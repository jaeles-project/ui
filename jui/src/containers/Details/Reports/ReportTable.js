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
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  ComboBox,
} from 'carbon-components-react';
import { DataTable } from 'carbon-components-react';

import {
  Edit20,
  Search16,
  TrashCan20,
  Add24,
  Launch20,
} from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import copy from 'clipboard-copy';
import _ from 'lodash';
import ReportButton from './ReportButton';

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} = DataTable;

class ReportTable extends Component {
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
    const base_url = this.props.axiosStore.instance.defaults.baseURL;
    this.setState({ base_url: base_url });
    const pid = this.props.pid;
    this.getWorkspaces();
  }

  getWorkspaces() {
    let url = `/api/workspaces/`;
    this.props.axiosStore.instance
      .get(`${url}`)
      .then(response => {
        if (response.data.hasOwnProperty('workspaces')) {
          const raw_workspaces = response.data.workspaces;
          let workspaces = [];
          _.map(_.uniq(raw_workspaces), function(item, index) {
            workspaces.push({ label: item, value: item });
          });
          this.setState({ workspaces: workspaces });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

  getContent(workspace) {
    if (!workspace) {
      this.setState({ content: false });
    }

    let url = `/api/reports/real/?workspace=${workspace}&grouped=true`;
    this.props.axiosStore.instance
      .get(`${url}`)
      .then(response => {
        if (response.data.hasOwnProperty('reports')) {
          this.setState({ content: true });
          // const data = rawRows: response.data.reports;

          this.setState({ rawRows: response.data.reports });
          this.setState({
            tamperRow: response.data.reports,
          });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

  parse_report(data){
    
  }

  // yeah I implement  this so it may not so good
  searchChangedHandler = event => {
    console.log(event.target.value);
    if (event.target.value === '' || event.target.value === null) {
      this.setState({ rawRows: this.state.tamperRow });
    } else if (event.target.value) {
      const grep = _.lowerCase(event.target.value);
      let tamperRow = [];

      _.map(this.state.tamperRow, function(item) {
        _.map(item, function(element) {
          if (_.isArray(element)) {
            let temp_string = _.join(element, ' ');

            if (_.includes(_.lowerCase(temp_string), grep)) {
              tamperRow.push(item);
            }
          } else {
            if (_.includes(_.lowerCase(element), grep)) {
              tamperRow.push(item);
            }
          }
        });
      });

      this.setState({ rawRows: _.uniq(tamperRow) });
    } else {
      this.setState({ rawRows: this.state.rawRows });
    }
  };

  WorkspaceSelect(data) {
    if (data) {
      const workspace = data;
      this.setState({ workspace: workspace });
      this.getContent(workspace);
    } else {
      this.setState({ workspace: null });
      this.getContent(null);
    }
  }

  render() {
    let data_table = (
      <p align="center" className="landing-page__heading">
        You may wanna pick a workspace
      </p>
    );

    const base_url = this.state.base_url;
    const res_data = this.state.res_data;
    const detail_id = this.state.detail_id;
    const detail_data = this.state.detail_data;
    const isOpenEdit = this.state.isOpenEdit;
    const rawRows = this.state.rawRows;
    const workspaces = this.state.workspaces;
    let ws_select = null;
    let rows = [];

    let headers = [
      {
        key: 'module',
        header: 'Module',
      },
      {
        key: 'result',
        header: 'Results',
      },
    ];

    if (rawRows) {
      let realRows = [];
      _.map(rawRows, function(item, index) {
        let row = {
          id: index.toString(),
          module: item.module,
          result: ( <ReportButton reports={item.reports} base_url={base_url} />),
        };
        if (!_.isEmpty(item.reports)){
          realRows.push(row);
        } 
      });
      rows = realRows;
    }

    if (workspaces) {
      ws_select = (
        <div>
          <div className="bx--row">
            <div className="bx--col-md-8 bx--col-lg-16">
              <ComboBox
                items={workspaces}
                invalid={false}
                id="risk-select"
                placeholder="Select Workspace"
                name="template"
                ref="template"
                onInputChange={data => this.WorkspaceSelect(data)}
              />
            </div>
          </div>
          <br />
        </div>
      );
    }

    if (rawRows) {
      data_table = (
        <DataTable
          useZebraStyles={false}
          isSortable
          rows={rows}
          headers={headers}
          render={({
            rows,
            headers,
            getHeaderProps,
            getSelectionProps,
            onInputChange,
            onChange,
            onClick,
            expandRow,
            // batchActionClick,
            // selectedRows,
          }) => (
            <TableContainer>
              <TableToolbar kind="secondary">
                {/* make sure to apply getBatchActionProps so that the bar renders */}

                <TableToolbarContent>
                  <TableToolbarSearch
                    onChange={data => this.searchChangedHandler(data)}
                  />
                </TableToolbarContent>
              </TableToolbar>
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map(header => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <TableRow key={row.id}>
                      {row.cells.map(cell => (
                        <TableCell key={cell.id}>
                          <strong>{cell.value}</strong>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        />
      );
    }

    return (
      <div>
        {ws_select}
        {data_table}
      </div>
    );
  }
}

export default inject('sessStore', 'axiosStore')(observer(ReportTable));
