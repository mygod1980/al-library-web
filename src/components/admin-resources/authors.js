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

const AuthorFilter = (props) => {
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

const AuthorActions = connect(mapStateToProps)(({resource, filter, displayedFilters, filterValues, basePath, showFilter, refresh, isAdmin}) => (
  <CardActions style={{float: 'right', zIndex: 99999}}>
    {filter && React.cloneElement(filter, {resource, showFilter, displayedFilters, filterValues, context: 'button'}) }
    {isAdmin && <CreateButton basePath={basePath}/>}
    <FlatButton primary label="Оновити" onClick={refresh} icon={<NavigationRefresh />}/>
  </CardActions>
));

const AuthorList = connect(mapStateToProps)((props) => {
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
        {props.isAdmin ? <EditButton label="Редагувати"/> : <ShowButton label="Деталі"/>}
      </Datagrid>
    </List>
  </div>)
});

const AuthorEditActions = connect(mapStateToProps)(({ basePath, data, refresh, isAdmin }) => (
  <CardActions style={{float: 'right', zIndex: 9999}}>
    <ListButton basePath={basePath} record={data} />
    {isAdmin && <DeleteButton basePath={basePath} record={data} />}
    <FlatButton primary label="Оновити" onClick={refresh} icon={<NavigationRefresh />} />
  </CardActions>
));

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

const AuthorShowForm = (props) => {
  return (
    <Edit title='Деталі' {...props} actions={<AuthorEditActions/>}>
      <SimpleShowLayout>
        <TextField label="ID" source="id"/>
        <TextField label="Ім'я" source="firstName"/>
        <TextField label="По батькові" source="secondName"/>
        <TextField label="Прізвище" source="lastName"/>
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

const AuthorShow = connect(mapShowStateToProps)(AuthorShowForm);

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

export {AuthorList, AuthorEdit, AuthorCreate, AuthorShow};


