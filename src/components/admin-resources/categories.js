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
import ListButton from '../ui/buttons/list-button';
import ShowButton from '../ui/buttons/show-button';
import {config} from "../../config";

const CategoryFilter = (props) => {
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

const CategoryActions = connect(mapStateToProps)(({
  resource,
  filter,
  displayedFilters,
  filterValues,
  basePath,
  showFilter,
  refresh,
  isAdmin
}) => (
  <CardActions style={{float: 'right', zIndex: 99999}}>
    {filter && React.cloneElement(filter, {resource, showFilter, displayedFilters, filterValues, context: 'button'}) }
    {isAdmin && <CreateButton basePath={basePath}/>}
    <FlatButton primary label="Оновити" onClick={refresh} icon={<NavigationRefresh />}/>
  </CardActions>
));

const CategoryList = connect(mapStateToProps)((props) => {
  return (<div>
    <List title="Категорії" {...props}
          filter={<CategoryFilter/>} actions={<CategoryActions/>}>
      <Datagrid selectable={false}>
        <TextField label="id" source="id"/>
        <TextField label="Назва" source="name"/>
        <TextField label="Опис" source="description"/>
        <DateField label="Створена" source="createdAt"/>
        <DateField label="Оновлена" source="updatedAt"/>
        { props.isAdmin ? <EditButton label="Редагувати"/> : <ShowButton label="Деталі"/>}
      </Datagrid>
    </List>
  </div>)
});

const CategoryEditActions = connect(mapStateToProps)(({basePath, data, refresh, isAdmin}) => (
  <CardActions style={{float: 'right', zIndex: 9999}}>
    <ListButton basePath={basePath} record={data}/>
    {isAdmin && <DeleteButton basePath={basePath} record={data}/>}
    <FlatButton primary label="Оновити" onClick={refresh} icon={<NavigationRefresh />}/>
  </CardActions>
));

const CategoryEditForm = (props) => {
  const validator = {required: true};
  return (
    <Edit title='Редагування' {...props} actions={<CategoryEditActions/>}>
      <SimpleForm>
        <DisabledInput label="ID" source="id"/>
        <TextInput label="Назва" source="name" validation={validator}/>
        <LongTextInput label="Опис" source="description"/>
      </SimpleForm>
    </Edit>);
};

const CategoryShowForm = (props) => {
  return (
    <Edit title='Деталі' {...props} actions={<CategoryEditActions/>}>
      <SimpleShowLayout>
        <TextField label="ID" source="id"/>
        <TextField label="Назва" source="name"/>
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

const CategoryShow = connect(mapShowStateToProps)(CategoryShowForm);
const CategoryCreateForm = (props) => {
  const validator = (values) => {
    const errors = {};
    const required = ['name'];

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
        <TextInput label="Назва" source="name"/>
        <LongTextInput label="Опис" source="description"/>
      </SimpleForm>
    </Create>);
};

const CategoryEdit = connect()(CategoryEditForm);
const CategoryCreate = connect()(CategoryCreateForm);

export {CategoryList, CategoryEdit, CategoryCreate, CategoryShow};


