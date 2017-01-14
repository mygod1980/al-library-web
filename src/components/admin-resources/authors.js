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
import {TextInput, DisabledInput, LongTextInput} from 'admin-on-rest/lib/mui/input';
import {TextField} from 'admin-on-rest/lib/mui/field';
import {Datagrid, List} from 'admin-on-rest/lib/mui/list';
import DateField from '../ui/fields/date-field';
import CreateButton from '../ui/buttons/create-button';
import EditButton from '../ui/buttons/edit-button';
import DeleteButton from '../ui/buttons/delete-button';
import ListButton from '../ui/buttons/list-button';

const AuthorFilter = (props) => {
  return (
    <Filter {...props}>
      <TextInput label="Розмір сторінки" type="number" source="perPage" alwaysOn name="perPage"/>
      <TextInput label="Пошук" source="q" alwaysOn name="q"/>
    </Filter>
  )
};


const AuthorActions = ({resource, filter, displayedFilters, filterValues, basePath, showFilter, refresh}) => (
  <CardActions style={{float: 'right', zIndex: 99999}}>
    {filter && React.cloneElement(filter, {resource, showFilter, displayedFilters, filterValues, context: 'button'}) }
    <CreateButton basePath={basePath}/>
    <FlatButton primary label="Оновити" onClick={refresh} icon={<NavigationRefresh />}/>
  </CardActions>
);

const AuthorList = (props) => {
  return (<div>
    <List title="Автори" {...props}
          filter={<AuthorFilter/>} actions={<AuthorActions/>}>
      <Datagrid selectable={false}>
        <TextField label="id" source="id"/>
        <TextField label="Ім'я" source="firstName"/>
        <TextField label="По батькові" source="secondName"/>
        <TextField label="Прізвище" source="lastName"/>
        <TextField label="Опис" source="description"/>
        <DateField label="Створений" source="createdAt"/>
        <DateField label="Оновлений" source="updatedAt"/>
        <EditButton label="Редагувати"/>
      </Datagrid>
    </List>
  </div>)
};

const AuthorEditActions = ({ basePath, data, refresh }) => (
  <CardActions style={{float: 'right', zIndex: 9999}}>
    <ListButton basePath={basePath} />
    <DeleteButton basePath={basePath} record={data} />
    <FlatButton primary label="Оновити" onClick={refresh} icon={<NavigationRefresh />} />
  </CardActions>
);

const AuthorEditForm = (props) => {
  const validator = {required: true};
  return (
    <Edit title='Редагування' {...props} actions={<AuthorEditActions/>}>
      <SimpleForm>
        <DisabledInput label="ID" source="id"/>
        <TextInput label="Ім'я" source="firstName" validation={validator}/>
        <TextInput label="По батькові" source="secondName" validation={validator}/>
        <TextInput label="Прізвище" source="lastName" validation={validator}/>
        <LongTextInput label="Опис" source="description"/>
      </SimpleForm>
    </Edit>);
};

const AuthorCreateForm = (props) => {
  const validator = (values) => {
    const errors = {};
    const required = ['firstName', 'lastName'];

    _.map(required, (value) => {
      if (!values[value]) {
        errors[value] = [`Значення ${value} є обов'язковим!`];
      }
    });

    return errors;
  };

  return (
    <Create title='Створення' {...props} hasDelete={!props.isMe}>
      <SimpleForm defaultValue={props.defaultValue} validation={validator}>
        <TextInput label="Ім'я" source="firstName"/>
        <TextInput label="По батькові" source="secondName"/>
        <TextInput label="Прізвище" source="lastName"/>
        <LongTextInput label="Опис" source="description"/>
      </SimpleForm>
    </Create>);
};

const AuthorEdit = connect()(AuthorEditForm);
const AuthorCreate = connect()(AuthorCreateForm);

export {AuthorList, AuthorEdit, AuthorCreate};


