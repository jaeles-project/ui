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
  CloudUpload20,
  Search16,
  Download20,
  Edit20,
  Filter24,
  Carbon24,
  Login20,
  TrashCan20,
  Code20,
} from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import NewPayloadForm from '../containers/Forms/NewPayloadForm';
import { Link, Redirect } from 'react-router-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import copy from 'clipboard-copy';
import ReportTable from '../containers/Details/Reports/ReportTable';

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} = DataTable;

class ExecutePage extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };
  state = {
    error: false,
    isSubmitted: false,
    rawRows: null,
    detail_id: null,
    req_data: null,
    res_data: null,
    isOpenAdd: false,
    isOpenEdit: false,
    filepath: null,
    cmd: '{your_osmedeus_path}/osmedeus.py -hh',
    current_id: '0',
  };

  componentDidMount() {}

  handleUpload = () => {
    const data = this.state.dataUpload;
    console.log(data);

    const json_body = {
      content: data,
    };

    // really sending commannd
    this.props.axiosStore.instance
      .post('/api/save', json_body)
      .then(response => {
        if (response.data.hasOwnProperty('filepath')) {
          this.setState({ filepath: response.data.filepath });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));

    this.setState({ isUpload: true });
    this.setState({ isOpen: false });
  };

  handleSubmit = () => {
    const cmd = this.state.cmd;
    console.log(cmd);

    const json_body = {
      cmd: cmd,
      workspace: 'None',
    };

    this.props.axiosStore.instance
      .post('/api/cmd/execute/', json_body)
      .then(response => {
        if (!response.data.hasOwnProperty('status')) {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));

    this.setState({ isSubmited: true });
  };

  dataChange = (event: any) => {
    this.setState({
      dataUpload: event.target.value,
    });
  };

  cmdChange = (event: any) => {
    this.setState({
      cmd: event.target.value,
    });
  };

  openAdd = () => this.setState({ isOpenAdd: true });
  closeAdd = () => this.setState({ isOpenAdd: false });

  openEdit = () => this.setState({ isOpenEdit: true });
  closeEdit = () => this.setState({ isOpenEdit: false });

  close = () => this.setState({ isOpen: false });

  render() {
    const error = this.state.error;
    const isLogged = this.state.isLogged;
    const isOpenAdd = this.state.isOpenAdd;
    const current_id = this.state.current_id;

    const rawRows = this.state.rawRows;
    // detail part
    const req_data = this.state.req_data;
    const res_data = this.state.res_data;
    const detail_id = this.state.detail_id;
    const filepath = this.state.filepath;
    const isSubmited = this.state.isSubmited;
    const cmd = this.state.cmd;

    const help_content = `
[*] Visit this page for complete usage: https://j3ssie.github.io/Osmedeus/

Basic Usage
===========
python3 osmedeus.py -t <your_target>
python3 osmedeus.py -T <list_of_targets>
python3 osmedeus.py -m <module> [-i <input>|-I <input_file>] [-t workspace_name]
python3 osmedeus.py --report <mode> -t <workspace> [-m <module>]

Advanced Usage
==============
[*] List all module
python3 osmedeus.py -M

[*] List all report mode
python3 osmedeus.py --report help

[*] Running with specific module
python3 osmedeus.py -t <result_folder> -m <module_name> -i <your_target>

[*] Example command
python3 osmedeus.py -m subdomain -t example.com
python3 osmedeus.py -t example.com --slow "subdomain"
python3 osmedeus.py -t sample2 -m vuln -i hosts.txt
python3 osmedeus.py -t sample2 -m dirb -i /tmp/list_of_hosts.txt
`;

    // modal form part
    const additionalProps = {
      className: 'some-class',
      onSubmit: e => {
        e.preventDefault();
        const path = this.refs.path.value;
        const override = this.refs.override.value;
        // console.log(path, override);
        this.handleAdd(path, override);
      },
    };

    let noti = null;
    if (filepath){
        noti = (
          <InlineNotification
            kind="success"
            lowContrast={false}
            title={`Your data is saved on: ${filepath}`}
          />
        );
    }

    if (isSubmited){
        noti = (
        <InlineNotification
            kind="success"
            lowContrast={false}
            title={`Command is submitted.`}
        />
    );

    }
      return (
        <div className="bx--grid bx--grid--full-width landing-page">
          <div className="bx--row landing-page__r2">
            <div className="bx--col bx--no-gutter">
              <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
                <div className="bx--row landing-page__tab-content">
                  <div className="bx--col-md-4 bx--col-lg-16">
                    <h1 className="landing-page__heading">Execute Page</h1>
                    <hr />
                  </div>
                  <div className="bx--col-md-4 bx--col-lg-16">{noti}</div>
                  <div className="bx--col-md-4 bx--col-lg-16">
                    <Tabs
                      className="some-class"
                      selected={0}
                      tabContentClassName="tab-content">
                      <Tab disabled={false} label="Help">
                        <CodeSnippet
                          onClick={() => copy(help_content)}
                          type="multi">
                          {help_content}
                        </CodeSnippet>
                      </Tab>
                      <Tab
                        disabled={false}
                        //   onClick={anonymous}
                        //   onKeyDown={anonymous}
                        label="Upload Data">
                        <TextArea
                          cols={500}
                          className="some-class"
                          hideLabel={false}
                          onChange={data => this.dataChange(data)}
                          placeholder="Fill your input separated by new line."
                          id="data-textarea"
                        />
                        <br />
                        <Button
                          small
                          renderIcon={CloudUpload20}
                          onClick={() => this.handleUpload()}
                          kind="tertiary">
                          Updload
                        </Button>
                      </Tab>
                    </Tabs>

                    <br />
                  </div>
                  <div className="bx--col-md-4 bx--col-lg-16">
                    <input
                      id="input-cmd"
                      onChange={data => this.cmdChange(data)}
                      type="text"
                      className="bx--text-input some-class"
                      defaultValue={cmd}
                      disabled={false}
                    />
                    <br />
                    <br />
                    <Button
                      small
                      renderIcon={Code20}
                      onClick={() => this.handleSubmit()}
                      kind="secondary">
                      Execute
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
  }
}

export default inject('sessStore', 'axiosStore')(observer(ExecutePage));
