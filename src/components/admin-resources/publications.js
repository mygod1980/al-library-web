/**
 * Created by eugenia on 20.09.16.
 */
import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import {CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import {Edit, Filter, Create, SimpleForm} from 'admin-on-rest/lib/mui';
import {TextInput, DisabledInput} from 'admin-on-rest/lib/mui/input';
import {TextField} from 'admin-on-rest/lib/mui/field';
import {Datagrid, List} from 'admin-on-rest/lib/mui/list';
import DateField from '../ui/fields/date-field';
import CreateButton from '../ui/buttons/create-button';
import EditButton from '../ui/buttons/edit-button';
import DeleteButton from '../ui/buttons/delete-button';
import ListButton from '../ui/buttons/list-button';
import SubdocumentArrayField from '../ui/fields/subdocument-array-field';
import ReferenceManyInput from '../ui/inputs/reference-many-input';

const PublicationFilter = (props) => {
  return (
    <Filter {...props}>
      <TextInput label="Розмір сторінки" type="number" source="perPage" alwaysOn name="perPage"/>
      <TextInput label="Пошук" source="q" alwaysOn name="q"/>
    </Filter>
  )
};


const PublicationActions = ({resource, filter, displayedFilters, filterValues, basePath, showFilter, refresh}) => (
  <CardActions style={{float: 'right', zIndex: 99999}}>
    {filter && React.cloneElement(filter, {resource, showFilter, displayedFilters, filterValues, context: 'button'}) }
    <CreateButton basePath={basePath}/>
    <FlatButton primary label="Оновити" onClick={refresh} icon={<NavigationRefresh />}/>
  </CardActions>
);

const PublicationList = (props) => {
  return (<div>
    <List title="Книги" {...props}
          filter={<PublicationFilter/>} actions={<PublicationActions/>}>
      <Datagrid selectable={false}>
        <TextField label="id" source="id"/>
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
        <DateField label="Створений" source="createdAt"/>
        <DateField label="Оновлений" source="updatedAt"/>
        <EditButton label="Редагування"/>
      </Datagrid>
    </List>
  </div>)
};

const PublicationEditActions = ({basePath, data, refresh}) => (
  <CardActions style={{float: 'right', zIndex: 9999}}>
    <ListButton basePath={basePath}/>
    <DeleteButton basePath={basePath} record={data}/>
    <FlatButton primary label="Оновити" onClick={refresh} icon={<NavigationRefresh />}/>
  </CardActions>
);

const PublicationEditForm = (props) => {
  const validator = {required: true};
  return (
    <Edit title='Редагування' {...props} hasDelete={!props.isMe} actions={<PublicationEditActions/>}>
      <SimpleForm>
        <DisabledInput label="ID" source="id"/>
        <TextInput label="Назва" source="title" validator={validator}/>
        <TextInput label="Анотація" source="description"/>
        <ReferenceManyInput addField
                            label="Автори"
                            source="authors"
                            reference="authors"
                            dataSourceConfig={{text: 'lastName', id: '_id'}}/>
        <ReferenceManyInput addField
                            label="Authors"
                            source="categories"
                            reference="categories"
                            dataSourceConfig={{text: 'name', id: '_id'}}/>
        <TextInput label="Дата публікації" type="number" source="publishedAt"/>
      </SimpleForm>
    </Edit>);
};

const PublicationCreateForm = (props) => {
  const validator = (values) => {
    const errors = {};
    const required = ['title'];

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
        <TextInput label="Анотація" source="description"/>
        <ReferenceManyInput addField
                            label="Автори"
                            source="authors"
                            reference="authors"
                            dataSourceConfig={{text: 'lastName', id: '_id'}}/>
        <ReferenceManyInput addField
                            label="Категорії"
                            source="categories"
                            reference="categories"
                            dataSourceConfig={{text: 'name', id: '_id'}}/>
        <TextInput label="Дата публікації" type="number" source="publishedAt"/>
      </SimpleForm>
    </Create>);
};


const PublicationEdit = connect()(PublicationEditForm);
const PublicationCreate = connect()(PublicationCreateForm);

export {PublicationList, PublicationEdit, PublicationCreate};


