import React, { Component } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
  Tag,
} from 'carbon-components-react';
import Globe32 from '@carbon/icons-react/lib/globe/32';
import PersonFavorite32 from '@carbon/icons-react/lib/person--favorite/32';
import Application32 from '@carbon/icons-react/lib/application/32';
import {
  Form,
  FormGroup,
  ModalWrapper,
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
  NotificationActionButton,
  TableToolbarSearch,
  TableToolbarContent,
  TableBatchActions,
  TableBatchAction,
  TableSelectAll,
  TableToolbarAction,
  TableSelectRow,
  TableToolbar,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
  OverflowMenu,
  ToolbarTitle,
  ToolbarOption,
  ComboBox,
  Checkbox,
  CodeSnippet,
} from 'carbon-components-react';

import { DataTable } from 'carbon-components-react';
import {
  Add24,
  Search16,
  Download20,
  Edit20,
  Filter24,
  Carbon24,
  Login20,
  TrashCan20,
} from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import { Link, Redirect } from 'react-router-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import RiskTag from '../../../components/Vuln/RiskTag';
import copy from 'clipboard-copy';



const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} = DataTable;

class RecordDetail extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };
  state = {
    error: false,
    isSubmitted: false,
    rawRows: null,
    sid: null,
    rid: null,
    record: null,
    req_data: null,
    res_data: null,
    isOpenAdd: false,
    isOpenEdit: false,
    current_id: '0',
  };

  componentDidMount() {
    const rid = this.props.rid;
    this.setState({ rid: rid });
    this.getData(rid);
  }

  getData(rid) {
    let url = `/api/record/${rid}/`;
    this.props.axiosStore.instance
      .get(`${url}`)
      .then(response => {
        if (response.data.hasOwnProperty('record')) {
          this.setState({ record: response.data.record });
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

  render() {
    let record_data = (
      <h1 className="landing-page__heading">Nothing to show</h1>
    );
    const error = this.state.error;
    const isLogged = this.state.isLogged;
    const isOpenAdd = this.state.isOpenAdd;
    const current_id = this.state.current_id;

    // const rawRows = this.state.rawRows;
    // detail part
    const sid = this.state.sid;
    const rid = this.state.rid;
    const record = this.state.record;
    let content = null;

    const req_data = this.state.req_data;
    const res_data = this.state.res_data;

    
    if (record !== null) {
        const props = {
          req: () => ({
            light: false,
            onClick: () =>
              copy(this.get_base64_component(record.ReqRaw)),
            feedback: 'Copied to Clipboard',
          }),
          res: () => ({
            light: false,
            onClick: () =>
              copy(this.get_base64_component(record.ResRaw)),
            feedback: 'Copied to Clipboard',
          }),
        };
        const reqProps = props.req();
        const resProps = props.res();
      console.log(record);
      record_data = (
        <div>
          <Form>
            <div className="bx--row">
              <div className="bx--col-md-4 bx--col-lg-8">
                <h1>
                  Issues:{' '}
                  <Tag className="some-class" type="green">
                    {record.Issues}
                  </Tag>
                </h1>
              </div>
              <div className="bx--col-md-4 bx--col-lg-8">
                <h1>
                  Risk: <RiskTag risk={record.Risk} />
                </h1>
              </div>
            </div>
          </Form>
          <hr />
          <h1>Request</h1>
          <br />

          <CodeSnippet
            {...reqProps}
            light={false}
            kind="secondary"
            type="multi">
            {`${this.get_base64_component(record.ReqRaw)}`}
          </CodeSnippet>
          <hr />
          <br />
          <h1>Response</h1>
          <br />

          <CodeSnippet
            {...resProps}
            light={false}
            kind="secondary"
            type="multi">
            {`${this.get_base64_component(record.ResRaw)}`}
          </CodeSnippet>
        </div>
      );
    }

    return record_data;
  }
}

export default inject('sessStore', 'axiosStore')(observer(RecordDetail));
