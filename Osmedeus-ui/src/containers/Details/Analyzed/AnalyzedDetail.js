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

class PayloadDetail extends Component {
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
    console.log(this.props.match.params.rid);
    const id = this.props.match.params.rid;
    this.setState({ rid: id });
    this.getContent(id);
    this.getBeautify(id);
    // console.log(this.props.axiosStore.url);
  }

  getContent(id) {
    this.props.axiosStore.instance
      .get(`rest/v1/analyzed/${id}/`)
      .then(response => {
        this.setState({ detail_data: response.data });
      })
      .catch(error => this.setState({ error: true }));
  }

  getBeautify(id) {
    this.props.axiosStore.instance
      .get(`rest/v1/beautify/req/${id}/?source=analyzed`)
      .then(response => {
        if (response.data.hasOwnProperty('req_content')) {
          // console.log(response.data);
          this.setState({ req_data: response.data.req_content });
          this.setState({ res_data: response.data.res_content });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

  get_base64_component = data => {
    const raw_url = data;
    let req_url,
      real_url = '';
    try {
      real_url = atob(raw_url);
    } catch (err) {
      real_url = false;
    }
    if (real_url) {
      req_url = real_url;
    } else {
      req_url = raw_url;
    }
    return req_url;
  };

  just_base64_encode = string_in => {
    const raw_in = string_in;
    let string_out = string_in;

    let isBased = false;
    try {
      isBased = atob(raw_in);
    } catch (err) {
      isBased = false;
    }

    if (isBased) {
      return string_out;
    } else {
      return btoa(string_in);
    }
  };

  openURL = () => this.setState({ isOpenURL: true });
  closeURL = () => this.setState({ isOpenURL: false });
  openEditable = () => this.setState({ isOpenEdit: !this.state.isOpenEdit });
  closeEditable = () => this.setState({ isOpenEdit: false });

  handleDelete = () => {
    const id = this.state.pid;
    this.props.axiosStore.instance
      .delete(`/rest/v1/analyzed/${id}/`)
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

  handleChange(json_body) {
    let body = JSON.stringify(json_body);
    console.log(body);
    const id = this.state.rid;
    this.props.axiosStore.instance
      .patch(`/rest/v1/analyzed/${id}/`, json_body)
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
    const rid = this.state.rid;
    let content = <h1 className="landing-page__heading">Nothing to show</h1>;

    const req_data = this.state.req_data;
    const res_data = this.state.res_data;
    const detail_id = this.state.detail_id;
    const detail_data = this.state.detail_data;
    const isOpenEdit = this.state.isOpenEdit;

    let real_req_data = 'You may wanna select the request';
    let real_res_data = 'You may wanna select the request';

    if (req_data) {
      real_req_data = req_data;
    }
    if (res_data) {
      real_res_data = res_data;
    }

    const props = {
      req: () => ({
        light: false,
        onClick: () => copy(real_req_data),
        feedback: 'Copied to Clipboard',
      }),
      res: () => ({
        light: false,
        onClick: () => copy(real_res_data),
        feedback: 'Copied to Clipboard',
      }),
    };
    const reqProps = props.req();
    const resProps = props.res();

    let res_tab = (
      <div className="bx--col-md-4 bx--col-lg-16">
        <hr />

        <Tabs
          className="some-class"
          selected={0}
          // onClick={anonymous}
          // onKeyDown={anonymous}
          // onSelectionChange={anonymous}
          tabContentClassName="tab-content">
          <Tab
            disabled={false}
            //   onClick={anonymous}
            //   onKeyDown={anonymous}
            label="Response">
            <CodeSnippet
              {...resProps}
              light={false}
              kind="secondary"
              type="multi">
              {`${res_data}`}
            </CodeSnippet>
          </Tab>
        </Tabs>
      </div>
    );
    if (isOpenEdit) {
      res_tab = null;
    }

    if (req_data && detail_data) {
      const additionalProps = {
        className: 'some-class',
        onSubmit: e => {
          e.preventDefault();
          // const path = this.refs.path.value;
          // const override = this.refs.override.value;
          let json_body = {
            // id: this.refs.id,
            req_method: this.refs.req_method.value,
            req_host: this.refs.req_host.value,
            req_scheme: this.refs.req_scheme.value,
            req_port: this.refs.req_port.value,
            req_url: this.just_base64_encode(this.refs.req_url.value),
            req_body: this.just_base64_encode(this.refs.req_body.value),
            req_headers: this.just_base64_encode(this.refs.req_headers.value),
            req_http_version: this.refs.req_http_version.value,
            req_path: this.refs.req_path.value,
          };
          // console.log(json_body)
          this.handleChange(json_body);
        },
      };

      content = (
        <Tabs
          className="some-class"
          selected={0}
          onSelectionChange={() => this.openEditable()}
          tabContentClassName="tab-content">
          <Tab disabled={false} label="Request">
            <CodeSnippet
              {...reqProps}
              light={false}
              kind="secondary"
              type="multi">
              {`${real_req_data}`}
            </CodeSnippet>
          </Tab>
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

                <FormGroup className="some-class" legendText="Request Method">
                  <TextInput
                    type="text"
                    name="req_method"
                    defaultValue={detail_data.req_method}
                    ref="req_method"
                  />
                </FormGroup>

                <FormGroup className="some-class" legendText="Request Host">
                  <TextInput
                    type="text"
                    name="req_host"
                    defaultValue={detail_data.req_host}
                    ref="req_host"
                  />
                </FormGroup>

                <FormGroup className="some-class" legendText="Request URL">
                  <TextInput
                    type="text"
                    name="req_url"
                    defaultValue={this.get_base64_component(
                      detail_data.req_url
                    )}
                    ref="req_url"
                  />
                </FormGroup>

                <FormGroup className="some-class" legendText="Request Headers">
                  <TextArea
                    name="req_headers"
                    ref="req_headers"
                    className="some-class"
                    hideLabel={false}
                    cols={200}
                    rows={5}
                    defaultValue={this.get_base64_component(
                      detail_data.req_headers
                    )}
                  />
                </FormGroup>

                <FormGroup className="some-class" legendText="Request Body">
                  <TextInput
                    type="text"
                    name="req_body"
                    defaultValue={this.get_base64_component(
                      detail_data.req_body
                    )}
                    ref="req_body"
                  />
                </FormGroup>

                <FormGroup className="some-class" legendText="Request Path">
                  <TextInput
                    type="text"
                    name="req_path"
                    defaultValue={detail_data.req_path}
                    ref="req_path"
                  />
                </FormGroup>

                <FormGroup className="some-class" legendText="Request Port">
                  <TextInput
                    type="text"
                    name="req_port"
                    defaultValue={detail_data.req_port}
                    ref="req_port"
                  />
                </FormGroup>

                <FormGroup className="some-class" legendText="Request Scheme">
                  <TextInput
                    type="text"
                    name="req_scheme"
                    defaultValue={detail_data.req_scheme}
                    ref="req_scheme"
                  />
                </FormGroup>

                <FormGroup className="some-class" legendText="HTTP Version">
                  <TextInput
                    type="text"
                    name="req_http_version"
                    defaultValue={detail_data.req_http_version}
                    ref="req_http_version"
                  />
                </FormGroup>

                <br />

                <Button
                  renderIcon={Edit20}
                  value=""
                  //   onClick={() => this.submitHandler()}
                  // type="submit"
                  kind="secondary">
                  Analyze
                </Button>

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
                        <a href="/#/analyzed">Analyzed Request</a>
                      </BreadcrumbItem>
                      <BreadcrumbItem isCurrentPage>
                        <a href="/#/analyzed">Detail </a>
                      </BreadcrumbItem>
                      <BreadcrumbItem isCurrentPage>
                        <a href={`/#/analyzed/${rid}/detail`}>{rid}</a>
                      </BreadcrumbItem>
                    </Breadcrumb>
                  </h1>
                  <hr />
                </div>

                <div className="bx--col-md-4 bx--col-lg-16">{content}</div>
                <br />
                {res_tab}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject('sessStore', 'axiosStore')(observer(PayloadDetail));
