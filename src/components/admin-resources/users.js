/**
 * Created by eugenia on 20.09.16.
 */
import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import {Edit, EditButton, Filter, Create, SimpleForm} from 'admin-on-rest/lib/mui';
import {TextInput, DisabledInput, SelectInput} from 'admin-on-rest/lib/mui/input';
import {EmailField, TextField} from 'admin-on-rest/lib/mui/field';
import {Datagrid, List} from 'admin-on-rest/lib/mui/list';
import DateField from '../ui/fields/date-field';
import {config} from '../../config';
const rolesChoices = [];
 _.forOwn(config.roles, (role, key) => {
  return rolesChoices.push({id: role, name: key});
});

const UserFilter = (props) => {
  return (
    <Filter {...props}>
      <TextInput label="Розмір сторінки" type="number" source="perPage" alwaysOn name="perPage"/>
      <TextInput label="Пошук" source="q" alwaysOn name="q"/>
    </Filter>
  )};

const UserList = (props) => {
  return (<div>
    <List title="Користувачі" {...props}
          filter={<UserFilter/>}>
      <Datagrid selectable={false}>
        <TextField label="id" source="id"/>
        <TextField label="Ім'я" source="firstName"/>
        <TextField label="Прізвище" source="lastName"/>
        <EmailField label="email" source="username"/>
        <TextField label="Тип" source="role"/>
        <DateField label="Створений" source="created_at"/>
        <DateField label="Оновлений" source="updated_at"/>
        <EditButton label="Редагувати"/>
      </Datagrid>
    </List>
  </div>)
};

const UserEditForm = (props) => {
  const validator = {required: true};
  return (
    <Edit title='Редагування' {...props} hasDelete={!props.isMe}>
      <SimpleForm>
        <DisabledInput label="ID" source="id"/>
        <TextInput label="Ім'я" source="firstName" validator={validator}/>
        <TextInput label="Прізвище" source="lastName" validator={validator}/>
        <TextInput label="Email" type='email' source="username" validator={validator}/>
        <SelectInput label="Тип" source="role" validator={validator} choices={rolesChoices}/>
      </SimpleForm>
    </Edit>);
};

const UserCreateForm = (props) => {
  const validator = (values) => {
    const errors = {};
    const required = ['firstName', 'lastName', 'username', 'password', 'confirmPassword'];

    _.map(required, (value) => {
      if (!values[value]) {
        errors[value] = [`Значення ${value} є обов'язковим!`];
      }
    });

    if (!values.password) {
      errors.password = ['Введіть пароль!'];
    }

    if (values.password !== values.confirmPassword) {
      errors.confirmPassword =  ['Паролі не збігаються'];
    }

    return errors;
  };

  return (
    <Create title='Створення' {...props} hasDelete={!props.isMe}>
      <SimpleForm defaultValue={props.defaultValue}  validation={validator}>
        <TextInput label="Ім'я" source="firstName"/>
        <TextInput label="Прізвище" source="lastName"/>
        <TextInput label="Email" type='email' source="username"/>
        <TextInput label="Пароль" source="password"/>
        <TextInput label="Підтвердіть пароль" type='confirmPassword' source="confirmPassword"/>
        <SelectInput label="Тип" source="role" choices={rolesChoices}/>
      </SimpleForm>
    </Create>);
};

const mapStateToProps = (state, props) => {
  const userToEdit = state.admin.users.data[props.params.id];
  return {
    isMe: state.wrapper.user._id === (userToEdit && userToEdit._id)
  };
};

const mapCreateStateToProps = (state, {location}) => {
  const defaultValue = JSON.parse(location.query.user || "{}");
  return {defaultValue};
};


const UserEdit = connect(mapStateToProps)(UserEditForm);
const UserCreate = connect(mapCreateStateToProps)(UserCreateForm);

export {UserList, UserEdit, UserCreate};


