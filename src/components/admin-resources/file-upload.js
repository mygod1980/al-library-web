/**
 * Created by eugenia on 15.01.17.
 */
import _ from "lodash";
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {Field, reduxForm, formValueSelector} from "redux-form";
import {Card, CardTitle} from "material-ui/Card";
import AutoComplete from "material-ui/AutoComplete";
import FlatButton from "material-ui/FlatButton";
import {red800} from "material-ui/styles/colors";
import Dropzone from "react-dropzone";
import {GET_LIST, CREATE} from "admin-on-rest";
import sendRequest from "../../util/rest-client";
import {notify} from "../../reducers/wrapper/actions";
import {config} from "../../config";
const fileReader = new FileReader();

class FileUploadForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      publications: [],
      publication: {},
      publicationError: '',
      fileError: '',
      dataSource: [],
      file: null,
      isLoading: false
    };
  }

  componentWillMount() {
    // preload publications since we have no q-search
    return sendRequest(GET_LIST, 'publications', {noCount: true})
      .then(({data: publications}) => {
        const {id} = this.props.params;
        const dataSource = _.map(publications, (publication) => {
          return this.getTitle(publication);
        });
        let publication;

        if (id) {
          publication = _.find(publications, {id});
        }

        const newState = {
          publications,
          dataSource
        };

        if (publication) {
          newState.publication = publication;
        }
        return this.setState(newState);

      })
      .catch((err) => {
        console.error(err);
        return this.props.dispatch(notify({
          type: config.notificationTypes.error,
          text: err && err.message
        }));
      });
  }

  getTitle = (publication) => {

    if (_.isEmpty(publication)) {
      return '';
    }

    return publication.title;
  };
  // FIXME: use input with AutoComplete

  /*setid = (input) => {
   return (value) => {
   console.log(value);
   return input.onChange(value.id);
   };
   };*/

  setFile = (input) => {
    return (acceptedFiles, rejectedFiles) => {
      this.setState({fileError: ''});
      if (rejectedFiles.length > 0) {
        this.setState({fileError: 'Failed to upload file'});
        console.warn('Failed to accept ', rejectedFiles);
      }

      console.debug(acceptedFiles);

      fileReader.readAsArrayBuffer(acceptedFiles[0]);

      return input.onChange(acceptedFiles[0]);
    };
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.publication.id) {
      return this.setState({publicationError: 'Виберіть книгу!!'});
    }

    if (!this.props.file) {
      return this.setState({fileError: 'Додайте файл'});
    }

    if (!this.state.file) {
      return this.setState({fileError: 'Не вдалсь прикріпити файл. Спробуйтеще раз'})
    }

    const data = new FormData();
    data.append('file', this.props.file);
    const params = {
      isForm: true,
      data
    };

    this.setState({isLoading: true});
    return sendRequest(CREATE,
      `publications/${this.state.publication.id}/file?type=${encodeURIComponent(this.props.file.type)}`, params)
      .then((res) => {
        console.debug(res);
        this.setState({isLoading: false});
        this.props.dispatch(notify({
          type: config.notificationTypes.success,
          text: 'Файл завантажено до хмарного сховища'
        }));
      })
      .catch((err) => {
        this.setState({isLoading: false});
        console.error(err);
        this.props.dispatch(notify({
          type: config.notificationTypes.error,
          text: 'Під час завантаження сталася помилка. Спробуйте ще раз'
        }));
      });
  };

  render() {
    const {reset} = this.props;
    const {isLoading, publication} = this.state;
    let title = 'Завантаження файлу книги';

    fileReader.onload = (event) => {
      return this.setState({
        isLoading: false,
        file: event.target.result
      });
    };

    fileReader.onprogress = (event) => {
      console.log('loading', event);
      return this.setState({
        isLoading: false
      });
    };

    fileReader.onerror = (error) => {
      console.error(error);
      this.setState({
        isLoading: false,
        fileError: 'Uploading failed. Try again'
      });
      this.props.dispatch(notify({
        type: config.notificationTypes.error,
        text: 'Під час завантаження сталася помилка. Спробуйте ще раз'
      }));
    };

    return (
      <Card style={{margin: '2em'}}>
        <CardTitle title={title}/>
        <div style={{padding: '0 1em'}}>
          <form onSubmit={this.handleSubmit}>
            <div>
              <Field name="id" component={(id) =>
                <AutoComplete floatingLabelText={publication &&
                publication.id ?
                  "Книга" :
                  "Натисніть тут, щоб вибрати книгу"}
                              errorText={this.state.publicationError || ''}
                              onNewRequest={(title) => {
                                const publication = _.find(this.state.publications, {title});
                                this.setState({publication, publicationError: ''});
                              }}
                              openOnFocus={true}
                              filter={value => true}
                              fullWidth={true}
                              searchText={this.getTitle(this.state.publication) || ''}
                              dataSource={this.state.dataSource}
                />
              }/>
            </div>
            <div>
              <Field name="file" component={(file) => {
                return (
                  <div>
                    <Dropzone accept='application/pdf'
                              multiple={false}
                              onDrop={this.setFile(file.input)}>
                      <div className="text-center">
                        { !this.state.fileError ?
                          ((file.input.value && file.input.value.name) ||
                          'Перетягніть файл сюди або клацніть, щоб вибрати') :
                          <span style={{color: red800}}>{this.state.fileError}</span>
                        }
                      </div>
                    </Dropzone>
                  </div>
                );
              }
              }/>
            </div>
            <div style={{padding: '1em 0'}}>
              <FlatButton primary={true} type="submit" disabled={isLoading}>
                {!isLoading ? 'Надіслати' : 'Запит обробляється'}
              </FlatButton>
              <FlatButton secondary={true} type="button"
                          disabled={isLoading}
                          onClick={() => {
                            this.setState({
                              publication: {},
                              publicationError: '',
                              fileError: ''
                            });
                            reset();
                          }}>Очистити</FlatButton>
            </div>
          </form>
        </div>
      </Card>
    )
  }
}

const selector = formValueSelector('FileUpload');
export const FileUpload = connect(
  state => {
    const {id, file} = selector(state, 'id', 'file');
    return {
      id,
      file
    };
  }
)(reduxForm({
  form: 'FileUpload'
})(withRouter(FileUploadForm)));

