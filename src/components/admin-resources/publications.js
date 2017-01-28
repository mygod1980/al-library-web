/**
 * Created by eugenia on 20.09.16.
 */
import _ from 'lodash';
import Cookies from 'js-cookie';
import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {CardActions} from 'material-ui/Card';

import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import CloudDownload from 'material-ui/svg-icons/file/cloud-download';
import CloudUpload from 'material-ui/svg-icons/file/cloud-upload';
import {Edit, EditButton, Filter, Create, SimpleForm, SimpleShowLayout, Datagrid} from 'admin-on-rest/lib/mui';
import {TextInput, DisabledInput, LongTextInput} from 'admin-on-rest/lib/mui/input';
import {TextField} from 'admin-on-rest/lib/mui/field';
import {List} from 'admin-on-rest/lib/mui/list';
import DateField from '../ui/fields/date-field';
import CreateButton from '../ui/buttons/create-button';
import DeleteButton from '../ui/buttons/delete-button';
import ListButton from '../ui/buttons/list-button';
import SubdocumentArrayField from '../ui/fields/subdocument-array-field';
import ReferenceManyInput from '../ui/inputs/reference-many-input';
import {config} from '../../config';
const PublicationFilter = (props) => {
  return (
    <Filter {...props}>
      <TextInput label="Розмір сторінки" type="number" source="perPage" alwaysOn name="perPage"/>
      <TextInput label="Пошук" source="q" alwaysOn name="q"/>
      <ReferenceManyInput alwaysOn
                          style={{marginTop: '-20px', marginLeft: '150px'}}
                          label="Категорії"
                          source="categories"
                          reference="categories"
                          name="categories"
                          dataSourceConfig={{text: 'name', value: '_id'}}/>
    </Filter>
  )
};

const mapStateToProps = (state) => {
  const {user} = state.wrapper;
  return {user, isAdmin: user && user.role === config.roles.ADMIN};
};

const PublicationActions = connect(mapStateToProps)(({
  resource,
  filter,
  displayedFilters,
  filterValues,
  basePath,
  showFilter,
  refresh,
  isAdmin
}) => {
  return (
    <CardActions style={{float: 'right', zIndex: 99999}}>
      {filter && React.cloneElement(filter, {resource, showFilter, displayedFilters, filterValues, context: 'button'}) }
      {isAdmin && <CreateButton basePath={basePath}/>}
      <FlatButton primary label="Оновити" onClick={refresh} icon={<NavigationRefresh />}/>
    </CardActions>
  )
});

const RequestAccess = ({record, ...other}) => {

  const {id} = record;

  const onClick = () => {
    return other.router.replace(`requests/create?type=${config.request.types.DOWNLOAD_LINK}` +
      `&publicationId=${encodeURIComponent(id)}`);
  };

  return (<FlatButton onTouchTap={onClick}
                      label="Отримати"/>);
};

const PublicationList = withRouter(connect(mapStateToProps)((props) => {
  return (<div>
    <List title="Книги" {...props}
          resource={props.resource || 'publications'}
          filter={<PublicationFilter/>} actions={<PublicationActions/>}>
      <Datagrid selectable={false}>
        <TextField label="Назва" source="title"/>
        <TextField label="Анотація" source="description"/>
        <SubdocumentArrayField label="Автори"
                               source="authors"
                               reference="authors"
                               displaySource={['firstName', 'lastName']}/>
        <SubdocumentArrayField label="Категорії"
                               source="categories"
                               reference="categories"
                               displaySource="name"/>
        <TextField label="Дата публікації" source="publishedAt"/>
        <DateField label="Створена" source="createdAt"/>
        {props.isAdmin ? <DateField label="Оновлений" source="updatedAt"/> : <span/>}
        {!props.user ? <RequestAccess label="Отримати" {...props}/> : <span/>}
        {props.isAdmin ? <EditButton label="Редагування"/> : <span/>}
      </Datagrid>
    </List>
  </div>)
}));

const PublicationEditActions = connect(mapStateToProps)(({basePath, data = {}, refresh, user, isAdmin}) => {
  const accessToken = Cookies.get('access_token');
  const downloadUrl = data.downloadUrl ? `${data.downloadUrl}?access_token=${encodeURIComponent(accessToken)}` : null;
  const linkTitle = data.downloadUrl ? user ? 'Отримати файл' : 'Авторизуйтесь, щоб отримати файл' : 'Файлу немає';

  return (
    <CardActions style={{float: 'right', zIndex: 9}}>

      {
        user && <FlatButton primary
                            label={linkTitle}
                            href={downloadUrl}
                            disabled={!downloadUrl}
                            icon={<CloudDownload />}/>

      }
      {
        isAdmin && <FlatButton primary
                               label={!downloadUrl ? "Додати файл" : "Замінити файл"}
                               href={`#/resources/publications/${data.id}/upload`}
                               icon={<CloudUpload />}/>
      }
      <ListButton basePath={basePath} record={data}/>
      {
        isAdmin && <DeleteButton basePath={basePath} record={data}/>
      }
      <FlatButton primary label="Оновити" onClick={refresh} icon={<NavigationRefresh />}/>
    </CardActions>
  )
});

const PublicationEditForm = (props) => {
  const validator = {required: true};

  return (
    <Edit title='Редагування' {...props} hasDelete={!props.isMe} actions={<PublicationEditActions/>}>
      <SimpleForm>
        <DisabledInput label="ID" source="id"/>
        <TextInput label="Назва" source="title" validator={validator}/>
        <LongTextInput label="Анотація" source="description" validator={validator}/>
        <ReferenceManyInput addField
                            label="Автори"
                            source="authors"
                            reference="authors"
                            dataSourceConfig={{text: 'lastName', value: '_id'}}/>
        <ReferenceManyInput addField
                            label="Категорії"
                            source="categories"
                            reference="categories"
                            dataSourceConfig={{text: 'name', value: '_id'}}/>
        <TextInput label="Дата публікації" type="number" source="publishedAt"/>
      </SimpleForm>
    </Edit>);
};
const PublicationCreateForm = (props) => {
  const validator = (values) => {
    const errors = {};
    const required = ['title', 'description'];

    _.map(required, (value) => {
      if (!values[value]) {
        errors[value] = [`Значення ${value} є обов'язковим!`];
      }
    });

    return errors;
  };

  return (
    <Create title='Створення' {...props}>
      <SimpleForm validation={validator}>
        <TextInput label="Назва" source="title"/>
        <LongTextInput label="Анотація" source="description"/>
        <ReferenceManyInput addField
                            label="Автори"
                            source="authors"
                            reference="authors"
                            dataSourceConfig={{text: 'lastName', value: '_id'}}/>
        <ReferenceManyInput addField
                            label="Категорії"
                            source="categories"
                            reference="categories"
                            dataSourceConfig={{text: 'name', value: '_id'}}/>
        <TextInput label="Дата публікації" type="number" source="publishedAt"/>
      </SimpleForm>
    </Create>);
};
const PublicationShowForm = (props) => {
  return (
    <Edit title='Деталі' {...props} actions={<PublicationEditActions/>}>
      <SimpleShowLayout>
        <TextField label="Назва" source="title"/>
        <TextField label="Анотація" source="description"/>
        <SubdocumentArrayField addLabel
                               label="Автори"
                               source="authors"
                               reference="authors"
                               displaySource={['firstName', 'lastName']}/>
        <SubdocumentArrayField addLabel
                               label="Категорії"
                               source="categories"
                               reference="categories"
                               displaySource='name'/>
        <TextField label="Дата публікації" source="publishedAt"/>
        <DateField addLabel label="Додана до бібліотеки" source="createdAt" format="DD/MM/YYYY hh:mm"/>
      </SimpleShowLayout>
    </Edit>);
};

const PublicationEdit = connect()(PublicationEditForm);
const PublicationCreate = connect()(PublicationCreateForm);
const PublicationShow = connect()(PublicationShowForm);

export {PublicationList, PublicationEdit, PublicationCreate, PublicationShow};


