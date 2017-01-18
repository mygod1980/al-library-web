/**
 * Created by eugenia on 20.09.16.
 */
import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import {CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import {Edit, Filter, Create, SimpleForm, SimpleShowLayout} from 'admin-on-rest/lib/mui';
import {TextInput, DisabledInput, LongTextInput} from 'admin-on-rest/lib/mui/input';
import {TextField} from 'admin-on-rest/lib/mui/field';
import {Datagrid, List} from 'admin-on-rest/lib/mui/list';
import DateField from '../ui/fields/date-field';
import CreateButton from '../ui/buttons/create-button';
import EditButton from '../ui/buttons/edit-button';
import DeleteButton from '../ui/buttons/delete-button';
import ShowButton from '../ui/buttons/show-button';
import ListButton from '../ui/buttons/list-button';
import {config} from '../../config';

const RequestFilter = (props) => {
  return (
    <Filter {...props}>
      <TextInput label="Розмір сторінки" type="number" source="perPage" alwaysOn name="perPage"/>
      <TextInput label="Пошук" source="q" alwaysOn name="q"/>
    </Filter>
  )
};

const mapStateToProps = (state) => {
  const {user} = state.wrapper;
  return {user, isAdmin: user && user.role === config.roles.ADMIN};
};

const RequestActions = connect(mapStateToProps)(({resource, filter, displayedFilters, filterValues, basePath, showFilter, refresh, isAdmin}) => (
  <CardActions style={{float: 'right', zIndex: 99999}}>
    {filter && React.cloneElement(filter, {resource, showFilter, displayedFilters, filterValues, context: 'button'}) }
    {isAdmin && <CreateButton basePath={basePath}/>}
    <FlatButton primary label="Оновити" onClick={refresh} icon={<NavigationRefresh />}/>
  </CardActions>
));

const RequestList = connect(mapStateToProps)((props) => {
  return (<div>
    <List title="Автори" {...props}
          filter={<RequestFilter/>} actions={<RequestActions/>}>
      <Datagrid selectable={false}>
        <TextField label="id" source="id"/>
        <TextField label="Тип" source="type"/>
        <TextField label="Email" source="username"/>
        <TextField label="Прізвище" source="status"/>
        <TextField label="Опис" source="description"/>
        <DateField label="Створений" source="createdAt"/>
        <DateField label="Оновлений" source="updatedAt"/>
        <ShowButton label="Деталі"/>
      </Datagrid>
    </List>
  </div>)
});

const RequestEditActions = connect(mapStateToProps)(({basePath, data, refresh, isAdmin}) => (
  <CardActions style={{float: 'right', zIndex: 9999}}>
    <ListButton basePath={basePath} record={data}/>
    {isAdmin && <DeleteButton basePath={basePath} record={data}/>}
    <FlatButton primary label="Оновити" onClick={refresh} icon={<NavigationRefresh />}/>
  </CardActions>
));

const RequestEditForm = (props) => {
  const validator = {required: true};
  return (
    <Edit title='Редагування' {...props} actions={<RequestEditActions/>}>
      <SimpleForm>
        <DisabledInput label="ID" source="id"/>
        <TextInput label="Тип" source="type" validation={validator}/>
        <TextInput label="Email" source="username" validation={validator}/>
        <TextInput label="Прізвище" source="status" validation={validator}/>
        <LongTextInput label="Опис" source="description"/>
      </SimpleForm>
    </Edit>);
};

const RequestShowForm = (props) => {
  return (
    <Edit title='Деталі' {...props} actions={<RequestEditActions/>}>
      <SimpleShowLayout>
        <TextField label="ID" source="id"/>
        <TextField label="Тип" source="type"/>
        <TextField label="Email" source="username"/>
        <TextField label="Прізвище" source="status"/>
        <TextField label="Опис" source="description"/>
      </SimpleShowLayout>
    </Edit>);
};

const mapShowStateToProps = (state, props) => {
  const isAdmin = state.wrapper.user.role === config.roles.ADMIN;

  return {
    hasDelete: isAdmin,
    hasEdit: isAdmin
  };
};

const RequestShow = connect(mapShowStateToProps)(RequestShowForm);

const RequestCreateForm = (props) => {
  const validator = (values) => {
    const errors = {};
    if (!values.type) {
      errors.type = 'Зазначте тип';
    }

    return errors;
  };


  return (
    <Create {...props} hasDelete={!props.isMe}>
      <SimpleForm defaultValue={props.defaultValue} validation={validator}>
        <TextInput label="Тип" source="type"/>
        <TextInput label="Email" source="username"/>
        <TextInput label="Прізвище" source="status"/>
        <LongTextInput label="Опис" source="description"/>
      </SimpleForm>
    </Create>);
};

const RequestEdit = connect()(RequestEditForm);

const mapCreateStateToProps = (state, props) => {
  if (!props.location.type) {
    console.warn('No type in query');
  }

  const type = props.location.query.type || config.request.types.REGISTRATION;

  let title = 'Запит на ';
  const publication = props.location.query.publication;

  if (type === config.request.types.REGISTRATION) {
    title += 'реєстрацію';
  } else /* if type === DOWNLOAD_LINK */ {
    title += 'доступ до книги';
  }

  return {title, publication};
};
const RequestCreate = connect(mapCreateStateToProps)(RequestCreateForm);

export {RequestList, RequestEdit, RequestCreate, RequestShow};


