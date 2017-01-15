/**
 * Created by eugenia on 20.09.16.
 */
import _ from 'lodash';
import Cookies from 'js-cookie';
import React from 'react';
import {connect} from 'react-redux';
import {CardActions} from 'material-ui/Card';

import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import ImageEye from 'material-ui/svg-icons/image/remove-red-eye';
import ContentCreate from 'material-ui/svg-icons/content/create';

import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import CloudDownload from 'material-ui/svg-icons/file/cloud-download';
import {Edit, Filter, Create, SimpleForm, SimpleShowLayout} from 'admin-on-rest/lib/mui';
import {TextInput, DisabledInput, LongTextInput} from 'admin-on-rest/lib/mui/input';
import {TextField} from 'admin-on-rest/lib/mui/field';
import {List} from 'admin-on-rest/lib/mui/list';
import DateField from '../ui/fields/date-field';
import CreateButton from '../ui/buttons/create-button';
import DeleteButton from '../ui/buttons/delete-button';
import ListButton from '../ui/buttons/list-button';
import SubdocumentArrayField from '../ui/fields/subdocument-array-field';
import ReferenceManyInput from '../ui/inputs/reference-many-input';
import bookCover from '../../img/book_cover.jpeg';
import {config} from '../../config';
const PublicationFilter = (props) => {
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

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  gridList: {
    display: 'flex',
    minHeight: '350px',
    minWidth: '550px',
    overflowY: 'auto'
  },
  gridTile: {
    margin: '0 10px 10px 10px',
    maxWidth: '300px',
    minHeight: '300px'
  }
};

const PublicationGrid = ({ids, data, basePath, isAdmin}) => {
  const icon = isAdmin ? <ContentCreate color="white"/> : <ImageEye color="white"/>;
  return (
    <div style={styles.root}>
      <GridList
        cellHeight={180}
        style={styles.gridList}
      >
        {ids.map((id) => (
          <GridTile
            key={id}
            style={styles.gridTile}
            title={data[id].title}
            titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
            subtitle={<SubdocumentArrayField style={{color: 'rgba(255, 255, 255, 0.9)'}}
                                             record={data[id]}
                                             source="authors"
                                             reference="authors"
                                             displaySource={['firstName', 'lastName']}/>}
            actionIcon={<IconButton href={isAdmin ?
              `#${basePath}/${encodeURIComponent(id)}` :
              `#${basePath}/${encodeURIComponent(id)}/show`}>{icon}</IconButton>}
          >
            { data[id].imageUrl ?
              <img src={data[id].imageUrl} alt={data[id].title}/> :
              <img src={bookCover} alt={data[id].title}/> }
          </GridTile>
        ))
        }
      </GridList>
    </div>
  );
};

const PublicationList = connect(mapStateToProps)((props) => {
  return (<div>
    <List title="Книги" {...props}
          filter={<PublicationFilter/>} actions={<PublicationActions/>}>
      <PublicationGrid isAdmin={props.isAdmin}/>
    </List>
  </div>)
});

const PublicationEditActions = connect(mapStateToProps)(({basePath, data = {}, refresh, user, isAdmin}) => {
  const accessToken = Cookies.get('access_token');
  const downloadUrl = data.downloadUrl ? `${data.downloadUrl}?access_token=${encodeURIComponent(accessToken)}` : null;
  const linkTitle = data.downloadUrl ? user ? 'Отримати файл' : 'Авторизуйтесь, щоб отримати файл' : 'Файлу немає';

  return (
    <CardActions style={{float: 'right', zIndex: 9}}>
      <FlatButton primary label={linkTitle}
                  href={downloadUrl}
                  disabled={!downloadUrl}
                  icon={<CloudDownload />}/>
      <ListButton basePath={basePath}/>

      {
        isAdmin ?
          <DeleteButton basePath={basePath} record={data}/> :
          <span/>
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


