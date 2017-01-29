/**
 *
 * Created by eugenia on 20.09.16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import Check from 'material-ui/svg-icons/navigation/check';
import Cancel from 'material-ui/svg-icons/navigation/cancel';
import {CREATE} from 'admin-on-rest';
import {Edit, Filter, Create, SimpleForm, SimpleShowLayout} from 'admin-on-rest/lib/mui';
import {TextInput} from 'admin-on-rest/lib/mui/input';
import {TextField} from 'admin-on-rest/lib/mui/field';
import {Datagrid, List} from 'admin-on-rest/lib/mui/list';
import DateField from '../ui/fields/date-field';
import DeleteButton from '../ui/buttons/delete-button';
import ShowButton from '../ui/buttons/show-button';
import ListButton from '../ui/buttons/list-button';
import ObjectField from '../ui/fields/object-field';
import LocalizedField from '../ui/fields/localized-field';
import ObjectInput from '../ui/inputs/object-input';
import {config} from '../../config';
import sendRequest from '../../util/rest-client';
import {notify} from '../../reducers/wrapper/actions';

const RequestFilter = (props) => {
  return (
    <Filter {...props}>
      <TextInput label="Розмір сторінки" type="number" source="perPage" alwaysOn name="perPage"/>
      <TextInput label="Пошук" source="q" alwaysOn name="q"/>
    </Filter>
  );
};

const mapStateToProps = (state) => {
  const {user} = state.wrapper;
  return {user, isAdmin: user && user.role === config.roles.ADMIN};
};

const RequestActions = connect(mapStateToProps)(({resource, filter, displayedFilters, filterValues, basePath, showFilter, refresh, isAdmin}) => (
  <CardActions style={{float: 'right', zIndex: 99999}}>
  </CardActions>
));

const RequestList = connect(mapStateToProps)((props) => {
  return (<div>
    <List title="Запити" {...props}
          filter={<RequestFilter/>} actions={<RequestActions/>}>
      <Datagrid selectable={false}>
        <TextField label="id" source="id"/>
        <TextField label="Тип" source="type"/>
        <TextField label="Email" source="username"/>
        <TextField label="Статус" source="status"/>
        <ObjectField label="Додатково" source="extra"/>
        <DateField label="Створений" source="createdAt"/>
        <DateField label="Оновлений" source="updatedAt"/>
        <ShowButton label="Деталі"/>
      </Datagrid>
    </List>
  </div>)
});

const RequestEditActions = connect(mapStateToProps)(({basePath, data = {}, refresh, isAdmin, dispatch}) => {

  function changeStatus(action) {
    return (e) => {
      return sendRequest(CREATE, `requests/${data.id}/${action}`)
        .then(() => {
          return refresh(e);
        })
        .catch((err) => {
          console.debug(`Failed to ${action} the request`);
          console.error(err);

          return dispatch(notify({
            type: config.notificationTypes.error,
            text: err && err.message
          }));
        });
    }
  }


  return (
    <CardActions style={{float: 'right', zIndex: 99}}>
      {isAdmin && <ListButton basePath={basePath} record={data}/>}
      {isAdmin && <DeleteButton basePath={basePath} record={data}/>}
      <FlatButton primary label="Оновити" onClick={refresh} icon={<NavigationRefresh />}/>
      {data.status === config.request.statuses.PENDING && isAdmin &&
      <FlatButton primary label="Прийняти" onClick={changeStatus('approve')} icon={<Check />}/>
      }

      {data.status === config.request.statuses.PENDING && isAdmin &&
      <FlatButton primary label="Відхилити" onClick={changeStatus('reject')} icon={<Cancel />}/>
      }

    </CardActions>
  )
});

const RequestShowForm = (props) => {
  return (
    <Edit title='Деталі' {...props} actions={<RequestEditActions/>} resource="requests">
      <SimpleShowLayout>
        <TextField label="ID" source="id"/>
        <TextField label="Тип" source="type"/>
        <TextField label="Email" source="username"/>
        <TextField label="Статус" source="status"/>
        <ObjectField label="Додатково" source="extra" addLabel/>
      </SimpleShowLayout>
    </Edit>);
};

const mapShowStateToProps = (state) => {
  const isAdmin = state.wrapper.user && state.wrapper.user.role === config.roles.ADMIN;

  return {
    hasDelete: isAdmin
  };
};

const RequestShow = connect(mapShowStateToProps)(RequestShowForm);

const RequestCreateForm = (props) => {
  const validator = (values) => {
    const errors = {};
    const requiredFields = ['type', 'username', 'extra'];

    requiredFields.map((field) => {
      if (!values[field]) {
        errors[field] = `Значення ${field} є обов'язковим`;
      }

      return errors;
    });

    return errors;
  };

  const sourceConfig = [];
  const isRegistration = props.defaultValue.type === config.request.types.REGISTRATION;

  if (isRegistration) {
    sourceConfig.push({source: 'firstName', label: "Ім'я"});
    sourceConfig.push({source: 'lastName', label: 'Прізвище'});
  } else /* type === DOWNLOAD_LINK */ {
    sourceConfig.push({source: 'publicationId', label: 'Ідентифікатор книги'});
  }

  return (
    <Create {...props} hasList={props.isAdmin}>
      <SimpleForm defaultValue={props.defaultValue} validation={validator}>
        <TextInput label="Тип" source="type" elStyle={{display: 'none'}}/>
        <TextInput label="Вкажіть Ваш email" source="username"/>
        {isRegistration ? <ObjectInput addField label="Додатково" source="extra" sourceConfig={sourceConfig}/> :
          <span/>}
      </SimpleForm>
    </Create>);
};

const mapCreateStateToProps = (state, props) => {
  if (!props.location.query.type) {
    console.warn('No type in query');
  }

  const isAdmin = state.wrapper.user && state.wrapper.user.role === config.roles.ADMIN;

  const type = props.location.query.type || config.request.types.REGISTRATION;

  let title = 'Запит на ';
  const publicationId = props.location.query.publicationId;
  const extra = {};

  if (type === config.request.types.REGISTRATION) {
    title += 'реєстрацію';
  } else /* if type === DOWNLOAD_LINK */ {
    title += 'доступ до книги';
    extra.publicationId = publicationId;
  }

  return {title, publicationId, defaultValue: {type, extra}, isAdmin};
};
const RequestCreate = connect(mapCreateStateToProps)(RequestCreateForm);


const RequestCreated = (props) => {
  const {statuses, types} = config.request;
  const statusesDictionary = {
    [statuses.PENDING]: 'Опрацьовується',
    [statuses.APPROVED]: 'Затверджено адміністрацією',
    [statuses.REJECTED]: 'Відхилено адміністрацією'
  };

  const typesDictionary = {
    [types.REGISTRATION]: 'Реєстрація',
    [types.DOWNLOAD_LINK]: 'Доступ до публікації'
  };
  const Details = (properties) => {
    const {record = {}} = properties;
    let details = record.status === config.request.statuses.PENDING ?
      `Запит проходить модерацію. Сповіщення про результат буде надісано на вказану адресу` :
      record.status === config.request.statuses.APPROVED ?
        `Запит затверджено. Необхідні дані надіслано на вказану адресу` :
        `На жаль, запит відхилено.`;

    return <div>{details}</div>;
  };

  return (<Edit title='Деталі за запитом' {...props} actions={null}>
    <SimpleShowLayout>
      <Details/>
      <TextField label="ID" source="id"/>
      <LocalizedField label="Тип" source="type" dictionary={typesDictionary} addLabel/>
      <TextField label="Email" source="username"/>
      <LocalizedField label="Статус" source="status" dictionary={statusesDictionary} addLabel/>
    </SimpleShowLayout>
  </Edit>);
};
export {RequestList, RequestCreate, RequestCreated, RequestShow};


