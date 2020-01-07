import React, { Component } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
} from 'carbon-components-react';
import Globe32 from '@carbon/icons-react/lib/globe/32';
import PersonFavorite32 from '@carbon/icons-react/lib/person--favorite/32';
import Application32 from '@carbon/icons-react/lib/application/32';
import {
  Form,
  FormGroup,
  Checkbox,
  NumberInput,
  SelectItem,
  Toggle,
  RadioButtonGroup,
  RadioButton,
  Select,
  Search,
  TextInput,
  TextArea,
  ForwardRef,
  ToastNotification,
  InlineNotification,
  ComposedModal,
  ModalFooter,
  NotificationActionButton,
  Loading,
  CodeSnippet,
} from 'carbon-components-react';

import { Edit20, Search16, TrashCan20 } from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import copy from 'clipboard-copy';
// import LandingPage from '../content/LandingPage/LandingPage';
// import URLForm from '../containers/Forms/URLForm';

class ConfigDetail extends Component {
  state = {
    error: false,
    isSubmitted: false,
    isOpenURL: false,
    detail_data: null,
    req_data: null,
    res_data: null,
    isOpenEdit: false,
  };

  componentDidMount() {
    console.log(this.props.match.params.cid);
    const id = this.props.match.params.cid;
    this.setState({ cid: id });
    this.getContent(id);
    // this.getBeautify(id);
    // console.log(this.props.axiosStore.url);
  }

  getContent(id) {
    this.props.axiosStore.instance
      .get(`rest/v1/config/${id}/`)
      .then(response => {
        this.setState({ detail_data: response.data });
      })
      .catch(error => this.setState({ error: true }));
  }

  handleDelete = () => {
    const id = this.state.cid;
    this.props.axiosStore.instance
      .delete(`/rest/v1/config/${id}/`)
      .then(response => {
        if (response.data.status_code === 204) {
          this.setState({ submitted: true });
          console.log('Success');
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
    this.setState({ detail_data: null });
    this.setState({ isSubmit: true });
  };

  openURL = () => this.setState({ isOpenURL: true });
  closeURL = () => this.setState({ isOpenURL: false });
  openEditable = () => this.setState({ isOpenEdit: !this.state.isOpenEdit });
  closeEditable = () => this.setState({ isOpenEdit: false });

  handleChange(json_body) {
    let body = JSON.stringify(json_body);
    console.log(body);
    const id = this.state.cid;
    this.props.axiosStore.instance
      .patch(`/rest/v1/config/${id}/`, json_body)
      .then(response => {
        if (response.data.hasOwnProperty('id')) {
          const status_code = response.data.hasOwnProperty('id');
          if (status_code === 200) {
            this.setState({ submitted: true });
            console.log('Success');
          }
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));

    this.setState({ isSubmit: true });
  }

  render() {
    const cid = this.state.cid;
    let content = <h1 className="landing-page__heading">Nothing to show</h1>;

    const detail_id = this.state.detail_id;
    const detail_data = this.state.detail_data;
    const isOpenEdit = this.state.isOpenEdit;

    if (detail_data) {
      const additionalProps = {
        className: 'some-class',
        onSubmit: e => {
          e.preventDefault();

          let json_body = {
            name: this.refs.name.value,
            value: this.refs.value.value,
            desc: this.refs.desc.value,
            note: this.refs.note.value,
          };
          this.handleChange(json_body);
        },
      };

      content = (
        <Tabs
          className="some-class"
          selected={0}
          onSelectionChange={() => this.openEditable()}
          tabContentClassName="tab-content">
          <Tab disabled={false} label="Editable">
            <div className="some-content">
              <Form {...additionalProps}>
                <FormGroup className="some-class" legendText="ID">
                  <TextInput
                    type="text"
                    name="req_id"
                    value={detail_data.id.toString()}
                    ref="req_id"
                  />
                </FormGroup>

                <FormGroup className="some-class" legendText="Name">
                  <TextInput
                    type="text"
                    name="name"
                    defaultValue={detail_data.name}
                    ref="name"
                  />
                </FormGroup>

                <FormGroup className="some-class" legendText="Value">
                  <TextInput
                    type="text"
                    name="value"
                    defaultValue={detail_data.value}
                    ref="value"
                  />
                </FormGroup>

                <FormGroup
                  className="some-class"
                  legendText="Description">
                  <TextInput
                    type="text"
                    name="desc"
                    defaultValue={detail_data.desc}
                    ref="desc"
                  />
                </FormGroup>

                <FormGroup className="some-class" legendText="Note">
                  <TextInput
                    type="text"
                    name="note"
                    defaultValue={detail_data.note}
                    ref="note"
                  />
                </FormGroup>

                <br />

                <Button
                  renderIcon={Edit20}
                  value=""
                  //   onClick={() => this.submitHandler()}
                  type="submit"
                  kind="tertiary">
                  Change
                </Button>

                <Button
                  renderIcon={TrashCan20}
                  value=""
                  onClick={() => this.handleDelete()}
                  kind="danger">
                  Delete
                </Button>
              </Form>
            </div>
          </Tab>
        </Tabs>
      );
    }

    return (
      <div className="bx--grid bx--grid--full-width landing-page">
        <div className="bx--row landing-page__r2">
          <div className="bx--col bx--no-gutter">
            <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
              <div className="bx--row landing-page__tab-content">
                <div className="bx--col-md-4 bx--col-lg-16">
                  <h1 className="landing-page__heading">
                    <Breadcrumb className="some-class" noTrailingSlash={false}>
                      <BreadcrumbItem>
                        <a href="/#/config">Configuration</a>
                      </BreadcrumbItem>
                      <BreadcrumbItem isCurrentPage>
                        <a href="/#/config">Detail </a>
                      </BreadcrumbItem>
                      <BreadcrumbItem isCurrentPage>
                        <a href={`/#/config/${cid}/detail`}>{cid}</a>
                      </BreadcrumbItem>
                    </Breadcrumb>
                  </h1>
                  <hr />
                </div>

                <div className="bx--col-md-4 bx--col-lg-16">{content}</div>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject('sessStore', 'axiosStore')(observer(ConfigDetail));
