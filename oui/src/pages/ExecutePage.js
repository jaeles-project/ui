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
  Dropdown,
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
import TaskTable from '../containers/Details/Task/TaskTable';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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
    isOpenModal: false,
    isSubmited: false,
    filepath: null,
    cmd: 'osmedeus -f general -t example.com',
    target: 'example.com',
    selectedFlow: 'general',
    mpassword: null,
    flows: [],
    now: true,
    seconds: 0,
    minutes: 0,
    hours: 0,
  };

  componentDidMount() {
    this.getFlows();
    this.updateCmd();
  }
  componentWillUnmount() {
    this.updateCmd();
  }

  getFlows() {
    let url = `/api/flows`;
    this.props.axiosStore.instance
      .get(`${url}`)
      .then(response => {
        if (response.data.hasOwnProperty('content')) {
          const raw_flows = response.data.content;
          let flows = [];
          _.map(raw_flows, function(value, key) {
            flows.push({ id: value.name, text: value.name });
          });
          this.setState({ flows: flows });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

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
    const now = this.state.now;
    const hours = this.state.hours;
    const minutes = this.state.minutes;
    const seconds = this.state.seconds;
    // add master password later
    const mpassword = "";
    // const mpassword = this.props.axiosStore.mpassword;

    let json_body = {};
    if (now === true) {
      json_body = {
        command: cmd,
        password: mpassword,
      };
    } else {
      json_body = {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        command: cmd,
        password: mpassword,
      };
    }
    console.log(json_body);


    this.props.axiosStore.instance
      .post(`/api/task/new`, json_body)
      .then(response => {
        if (response.data.hasOwnProperty('content')) {
          this.setState({ isSubmited: true });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));

  };

  updateCmd(selectedFlow, target) {
    if (selectedFlow === null || !selectedFlow) {
      selectedFlow = this.state.selectedFlow;
    } else {
      this.setState({ selectedFlow: selectedFlow });
    }
    if (target === null || !target) {
      target = this.state.target;
    } else {
      this.setState({ target: target });
    }
    const cmd = `osmedeus scan -f ${selectedFlow} -t ${target}`;
    this.setState({ cmd: cmd });
    console.log(cmd);
  }

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

  hoursChange = (event: any) => {
    this.setState({
      hours: parseInt(event.target.value),
    });
  };

  minutesChange = (event: any) => {
    this.setState({
      minutes: parseInt(event.target.value),
    });
  };

  secondsChange = (event: any) => {
    this.setState({
      seconds: parseInt(event.target.value),
    });
  };

  targetChange = (event: any) => {
    this.updateCmd(null, event.target.value);
  };

  flowChange = (event: any) => {
    this.updateCmd(event.selectedItem.text, null);
  };

  toggleNow = () => {
    this.setState({ now: !this.state.now });
  };

  // modal part

  passChange = (event: any) => {
     this.setState({
       mpassword: event.target.value,
     });
  };
  loginHandle() {

  }
  openAdd = () => this.setState({ isOpenAdd: true });
  closeModal = () => this.setState({ isOpenModal: false });

  openEdit = () => this.setState({ isOpenEdit: true });
  closeEdit = () => this.setState({ isOpenEdit: false });

  render() {
    const error = this.state.error;
    const flows = this.state.flows;
    const target = this.state.target;
    const now = this.state.now;
    const mpassword = this.state.mpassword;

    const filepath = this.state.filepath;
    const isSubmited = this.state.isSubmited;
    const cmd = this.state.cmd;

    const help_content = `
[*] Visit this page for complete usage: https://j3ssie.github.io/Osmedeus/

Basic Usage
===========
osmedeus scan -f <flow_name> -t <your_target>
osmedeus scan -T <flow_name> <list_of_targets>
`;

    let noti = null;
    if (filepath) {
      noti = (
        <InlineNotification
          kind="success"
          lowContrast={false}
          title={`Your data is saved on: ${filepath}`}
        />
      );
    }
    if (isSubmited) {
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
                  <h1 className="landing-page__heading">Task Info</h1>
                  <hr />
                </div>
                <div className="bx--col-md-4 bx--col-lg-16">{noti}</div>
                <div className="bx--col-md-4 bx--col-lg-16">
                  <Tabs
                    className="some-class"
                    selected={0}
                    tabContentClassName="tab-content">
                    <Tab disabled={false} label="Help Message">
                      <SyntaxHighlighter
                        wrapLines={true}
                        language="bash"
                        style={vs2015}>
                        {help_content}
                      </SyntaxHighlighter>
                    </Tab>
                    <Tab
                      disabled={false}
                      //   onClick={anonymous}
                      //   onKeyDown={anonymous}
                      label="Tasks List">
                      <TaskTable />
                    </Tab>
                  </Tabs>

                  <br />
                </div>

                <div className="bx--col-md-4 bx--col-lg-16">
                  <h1 className="landing-page__heading">New Task</h1>
                  <hr />
                </div>

                <div className="bx--col-lg-16">
                  <div className="bx--row">
                    <div className="bx--col-lg-4">
                      <TextInput
                        className="some-class"
                        defaultValue={'1'}
                        disabled={now}
                        labelText="Hours"
                        onChange={data => this.hoursChange(data)}
                        placeholder="Placeholder text"
                        type="text"
                      />
                    </div>
                    <div className="bx--col-lg-4">
                      <TextInput
                        className="some-class"
                        defaultValue={'0'}
                        disabled={now}
                        // invalidText="A valid value is required"
                        labelText="Minutes"
                        onChange={data => this.minutesChange(data)}
                        placeholder="Placeholder text"
                        type="text"
                      />
                    </div>
                    <div className="bx--col-lg-4">
                      <TextInput
                        className="some-class"
                        defaultValue={'0'}
                        disabled={now}
                        // invalidText="A valid value is required"
                        labelText="Seconds"
                        onChange={data => this.secondsChange(data)}
                        // onClick={function noRefCheck() {}}
                        placeholder="Placeholder text"
                        type="text"
                      />
                    </div>
                  </div>

                  <br />

                  <div className="bx--row">
                    <div className="bx--col-md-4">
                      <Dropdown
                        id="select-flow"
                        items={flows}
                        itemToString={item => (item ? item.text : '')}
                        titleText="Select Flow"
                        label="general"
                        onChange={item => this.flowChange(item)}
                      />
                    </div>
                    <div className="bx--col-md-3">
                      <TextInput
                        className="some-class"
                        defaultValue={target}
                        disabled={false}
                        id="target-name"
                        labelText="Target"
                        onChange={data => this.targetChange(data)}
                        type="text"
                      />
                    </div>
                  </div>
                  <br />

                  <div className="bx--row">
                    <div className="bx--col-lg-10">
                      <TextInput
                        className="some-class"
                        defaultValue={cmd}
                        disabled={false}
                        id="input-cmd"
                        labelText="Raw Command"
                        onChange={data => this.cmdChange(data)}
                        type="text"
                      />
                    </div>
                    <div className="bx--col-lg-2">
                      <Toggle
                        defaultToggled
                        id="toggle-1"
                        labelA="Off"
                        labelB="On"
                        labelText="Execute Immediately"
                        onChange={() => this.toggleNow()}
                        // onToggle={function noRefCheck() {}}
                      />
                      <br />
                    </div>
                  </div>

                  <div className="bx--row">
                    <div className="bx--col-lg-10">
                      <Button
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
        </div>
      </div>
    );
  }
}

export default inject('sessStore', 'axiosStore')(observer(ExecutePage));
