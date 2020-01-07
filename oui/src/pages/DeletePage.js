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
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListInput,
  StructuredListCell,
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

class DeletePage extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };
  state = {
    error: false,
    isSubmitted: false,
    rawRows: null,
    detail_id: null,
    workspaces: [],
    tasks: [],
    isOpenAdd: false,
    isOpenModal: false,
    isSubmited: false,
    filepath: null,
    cmd: 'osmedeus scan -h',
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
    this.getWorkspaces();
    this.getTasks();
  }

  getWorkspaces() {
    let url = `/api/workspaces`;
    this.props.axiosStore.instance
      .get(`${url}`)
      .then(response => {
        if (response.data.hasOwnProperty('content')) {
          const raw_ws = response.data.content;
          let workspaces = [];
          _.map(raw_ws, function(value, key) {
            workspaces.push({
              id: value.id,
              text: `${value.id} - ${value.Workspace}`,
            });
          });
          this.setState({ workspaces: workspaces });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

  getTasks() {
    let url = `/api/tasks`;
    this.props.axiosStore.instance
      .get(`${url}`)
      .then(response => {
        if (response.data.hasOwnProperty('content')) {
          const raw_task = response.data.content;
          let tasks = [];
          _.map(raw_task, function(value, key) {
            tasks.push({
              id: value.id,
              text: `${value.id} - ${value.Command}`,
            });
          });
          this.setState({ tasks: tasks });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

  // modal part

  idChange = (event: any) => {
    console.log(event)
    this.setState({ deleteID: event.selectedItem.id});
  };

  deleteByID = e => {
    const id = this.state.deleteID;
    let url = `/api/delete/${e}/${id}/`;
    console.log(url);
    this.props.axiosStore.instance
      .delete(url)
      .then(response => {
        if (response.data.hasOwnProperty('content')) {
          this.setState({ isSubmited: true });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  };
  
  deleteByTable = e => {
    let url = `/api/clear/${e}/`;
    console.log(url);
    this.props.axiosStore.instance
      .delete(url)
      .then(response => {
        if (response.data.hasOwnProperty('content')) {
          this.setState({ isSubmited: true });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

  openAdd = () => this.setState({ isOpenAdd: true });
  closeModal = () => this.setState({ isOpenModal: false });

  openEdit = () => this.setState({ isOpenEdit: true });
  closeEdit = () => this.setState({ isOpenEdit: false });

  render() {
    const error = this.state.error;
    const filepath = this.state.filepath;
    const isSubmited = this.state.isSubmited;
    const workspaces = this.state.workspaces;
    const tasks = this.state.tasks;

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
      if (error === true) {
        noti = (
          <InlineNotification
            kind="error"
            lowContrast={false}
            title={`Something went wrong.`}
          />
        );
      } else {
        noti = (
          <InlineNotification
            kind="success"
            lowContrast={false}
            title={`Command is submitted.`}
          />
        );
      }
    }

    return (
      <div className="bx--grid bx--grid--full-width landing-page">
        <div className="bx--row landing-page__r2">
          <div className="bx--col bx--no-gutter">
            <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
              <div className="bx--row landing-page__tab-content">
                <div className="bx--col-md-4 bx--col-lg-16">
                  <h1 className="landing-page__heading">Delete </h1>
                  <hr />
                </div>
                <div className="bx--col-md-4 bx--col-lg-16">{noti}</div>
                <div className="bx--col-md-4 bx--col-lg-16">
                  <Tabs
                    className="some-class"
                    selected={0}
                    tabContentClassName="tab-content">
                    <Tab disabled={false} label="Delete by ID">
                      <StructuredListWrapper>
                        <StructuredListHead>
                          <StructuredListRow head>
                            <StructuredListCell head>Table</StructuredListCell>
                            <StructuredListCell head>ID</StructuredListCell>
                            <StructuredListCell head>Action</StructuredListCell>
                          </StructuredListRow>
                        </StructuredListHead>
                        <StructuredListBody>
                          <StructuredListRow>
                            <StructuredListCell noWrap>
                              <h4>Workspaces</h4>
                            </StructuredListCell>
                            <StructuredListCell>
                              <Dropdown
                                id="select-flow"
                                items={workspaces}
                                itemToString={item => (item ? item.text : '')}
                                // titleText="Select Flow"
                                label="Select Workspace to Delete"
                                onChange={data => this.idChange(data)}
                              />
                            </StructuredListCell>
                            <StructuredListCell>
                              <Button
                                className="some-class"
                                disabled={false}
                                hasIconOnly
                                iconDescription="Delete"
                                kind="danger"
                                onClick={() => this.deleteByID('scan')}
                                renderIcon={TrashCan20}
                                size="default"
                                tabIndex={0}
                                tooltipAlignment="center"
                                tooltipPosition="bottom"
                                type="button"
                              />
                            </StructuredListCell>
                          </StructuredListRow>

                          {/*  */}

                          <StructuredListRow>
                            <StructuredListCell noWrap>
                              <h4>Workspaces</h4>
                            </StructuredListCell>
                            <StructuredListCell>
                              <Dropdown
                                id="select-flow"
                                items={workspaces}
                                itemToString={item => (item ? item.text : '')}
                                // titleText="Select Flow"
                                label="Select Workspace to Delete"
                                onChange={data => this.idChange(data)}
                              />
                            </StructuredListCell>
                            <StructuredListCell>
                              <Button
                                className="some-class"
                                disabled={false}
                                hasIconOnly
                                iconDescription="Delete"
                                kind="danger"
                                onClick={() => this.deleteByID('task')}
                                renderIcon={TrashCan20}
                                size="default"
                                tabIndex={0}
                                tooltipAlignment="center"
                                tooltipPosition="bottom"
                                type="button"
                              />
                            </StructuredListCell>
                          </StructuredListRow>
                        </StructuredListBody>
                      </StructuredListWrapper>
                    </Tab>

                    <Tab disabled={false} label="Delete Entire Table">
                      <StructuredListWrapper>
                        <StructuredListHead>
                          <StructuredListRow head>
                            <StructuredListCell head>Table</StructuredListCell>
                            <StructuredListCell head>Action</StructuredListCell>
                          </StructuredListRow>
                        </StructuredListHead>
                        <StructuredListBody>
                          <StructuredListRow>
                            <StructuredListCell noWrap>
                              <h4>Workspaces</h4>
                            </StructuredListCell>
                            <StructuredListCell>
                              <Button
                                className="some-class"
                                disabled={false}
                                hasIconOnly
                                iconDescription="Delete"
                                kind="danger"
                                onClick={() => this.deleteByTable('scan')}
                                renderIcon={TrashCan20}
                                size="default"
                                tabIndex={0}
                                tooltipAlignment="center"
                                tooltipPosition="bottom"
                                type="button"
                              />
                            </StructuredListCell>
                          </StructuredListRow>

                          <StructuredListRow>
                            <StructuredListCell noWrap>
                              <h4>Task</h4>
                            </StructuredListCell>
                            <StructuredListCell>
                              <Button
                                className="some-class"
                                disabled={false}
                                hasIconOnly
                                iconDescription="Delete"
                                kind="danger"
                                onClick={() => this.deleteByTable('task')}
                                renderIcon={TrashCan20}
                                size="default"
                                tabIndex={0}
                                tooltipAlignment="center"
                                tooltipPosition="bottom"
                                type="button"
                              />
                            </StructuredListCell>
                          </StructuredListRow>
                        </StructuredListBody>
                      </StructuredListWrapper>
                    </Tab>
                  </Tabs>

                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject('sessStore', 'axiosStore')(observer(DeletePage));
