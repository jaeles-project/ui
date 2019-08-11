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
  TableToolbarSearch,
  TableToolbarContent,
  TableBatchActions,
  TableBatchAction,
  TableSelectAll,
  TableToolbarAction,
  TableSelectRow,
  TableToolbar,
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
import { DataTable } from 'carbon-components-react';

import { Edit20, Search16, TrashCan20, Add24 } from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import copy from 'clipboard-copy';
import _ from 'lodash';
import PayloadTable from '../Payload/PayloadTable';
import ActiveTable from '../ActiveAnalyze/ActiveTable';


class VulnDetail extends Component {
  state = {
    error: false,
    isSubmitted: false,
    isOpenURL: false,
    detail_data: null,
    req_data: null,
    res_data: null,
    isOpenEdit: false,
    rawRows: null,
  };

  componentDidMount() {
    const id = this.props.match.params.vid;
    this.setState({ vid: id });
    this.getContent(id);
  }

  getContent(id) {
    this.props.axiosStore.instance
      .get(`rest/v1/vuln/${id}/`)
      .then(response => {
        this.setState({ detail_data: response.data });
        const detail_data = this.state.detail_data;
        this.getBeautify(detail_data);
      })
      .catch(error => this.setState({ error: true }));
    // get other detail record
  }


  getBeautify(detail_data) {
    let url = '';
    if (detail_data.req_queue_id !== '') {
      url = `rest/v1/beautify/req/${detail_data.req_queue_id}/?source=queue`;
    } else if (detail_data.analyzed_traffic_id !== '') {
      url = `rest/v1/beautify/req/${
        detail_data.analyzed_traffic_id
      }/?source=analyze`;
    } else if (detail_data.traffic_id !== '') {
      url = `rest/v1/beautify/req/${detail_data.traffic_id}/?source=traffic`;
    }

    console.log(url);
    this.props.axiosStore.instance
      .get(`${url}`)
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
    const id = this.state.vid;
    this.props.axiosStore.instance
      .delete(`/rest/v1/vuln/${id}/`)
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
    const vid = this.state.vid;
    let content = <h1 className="landing-page__heading">Nothing to show</h1>;
    let detail_form = (
      <h1 className="landing-page__heading">Nothing to show</h1>
    );
    let payload_table,
      active_analyze = (
        <h1 className="landing-page__heading">Nothing to show</h1>
      );

    const req_data = this.state.req_data;
    const res_data = this.state.res_data;
    const detail_id = this.state.detail_id;
    const detail_data = this.state.detail_data;
    const isOpenEdit = this.state.isOpenEdit;
    const rawRows = this.state.rawRows;

    if (detail_data) {
      payload_table = <PayloadTable pid={detail_data.payload_id} />;
    }

    if (detail_data) {
      active_analyze = <ActiveTable pid={detail_data.payload_id} />;
    }

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

    if (detail_data) {
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
      detail_form = (
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

            <FormGroup className="some-class" legendText="vuln_type">
              <TextInput
                type="text"
                name="vuln_type"
                defaultValue={detail_data.vuln_type}
                ref="vuln_type"
              />
            </FormGroup>

            <FormGroup className="some-class" legendText="vuln_desc">
              <TextInput
                type="text"
                name="vuln_desc"
                defaultValue={detail_data.vuln_desc}
                ref="vuln_desc"
              />
            </FormGroup>

            <FormGroup className="some-class" legendText="risk">
              <TextInput
                type="text"
                name="risk"
                defaultValue={detail_data.risk}
                ref="risk"
              />
            </FormGroup>

            <FormGroup className="some-class" legendText="confidence">
              <TextInput
                type="text"
                name="confidence"
                defaultValue={detail_data.confidence}
                ref="confidence"
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
      );
    }

    if (req_data && detail_data) {
      content = (
        <Tabs
          className="some-class"
          selected={0}
          onSelectionChange={() => this.openEditable()}
          tabContentClassName="tab-content">
          {/* <Tab disabled={false} label="Editable" /> */}

          <Tab disabled={false} label="Request">
            <CodeSnippet
              {...reqProps}
              light={false}
              kind="secondary"
              type="multi">
              {`${real_req_data}`}
            </CodeSnippet>
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
                    <Breadcrumb
                      className="some-class"
                      noTrailingSlash={false}>
                      <BreadcrumbItem>
                        <a href="/#/vulnerability">Vulnerability Summary</a>
                      </BreadcrumbItem>
                      <BreadcrumbItem isCurrentPage>
                        <a href="/#/vulnerability">Detail </a>
                      </BreadcrumbItem>
                      <BreadcrumbItem isCurrentPage>
                        <a href={`/#/vulnerability/${vid}/detail`}>{vid}</a>
                      </BreadcrumbItem>
                    </Breadcrumb>
                  </h1>
                  <hr />
                </div>

                <div className="bx--col-md-4 bx--col-lg-8">
                  {detail_form}
                </div>
                <div className="bx--col-md-4 bx--col-lg-8">
                  {payload_table}
                  <br />
                  <hr />
                  {active_analyze}
                </div>

                <div className="bx--col-md-4 bx--col-lg-16">
                  <br />
                  <hr />
                  {content}
                </div>
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

export default inject('sessStore', 'axiosStore')(observer(VulnDetail));
