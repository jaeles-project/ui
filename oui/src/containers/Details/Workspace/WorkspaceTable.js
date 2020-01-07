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
  Tag,
} from 'carbon-components-react';
import { DataTable } from 'carbon-components-react';

import {
  Edit20,
  Search16,
  TrashCan20,
  Add24,
  Launch20,
  FolderDetails20
} from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import copy from 'clipboard-copy';
import _ from 'lodash';
import RiskTag from '../../../components/Vuln/RiskTag';

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} = DataTable;

class WorkspacesTable extends Component {
  state = {
    error: false,
    isSubmitted: false,
    isOpenURL: false,
    detail_data: null,
    req_data: null,
    res_data: null,
    isOpenEdit: false,
    rawRows: null,
    rawWorkspaces: null,
    rawStorages: null,
  };

  componentDidMount() {
    this.getData();
    this.getRawView();
  }

  getData() {
    let url = `/api/workspaces`;

    this.props.axiosStore.instance
      .get(`${url}`)
      .then(response => {
        if (response.data.hasOwnProperty('content')) {
          this.setState({ rawRows: response.data.content });
          this.setState({
            tamperRow: response.data.content,
          });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }
  getRawView() {
    let url = `/api/raw`;
    this.props.axiosStore.instance
      .get(`${url}`)
      .then(response => {
        if (response.data.hasOwnProperty('content')) {
          this.setState({
            rawStorages: response.data.content.storages,
          });
          this.setState({
            rawWorkspaces: response.data.content.workspaces,
          });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

  // yeah I implement  this so it may not so good
  searchChangedHandler = event => {
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

  render() {
    let payload_table = (
      <h1 className="landing-page__heading">Nothing to show</h1>
    );

    const rawRows = this.state.rawRows;
    const rawWorkspaces = this.props.axiosStore.url + this.state.rawWorkspaces;

    let rows = [
      {
        id: 'a',
        foo: 'AA11 a',
        bar: 'AA11 a',
        baz: 'AA11 a',
      },
    ];

    let headers = [
      {
        key: 'Target',
        header: 'Target',
      },
      {
        key: 'Details',
        header: 'Details',
      },

      {
        key: 'Flow',
        header: 'Flow Name',
      },

      {
        key: 'RawResult',
        header: 'RawResult',
      },
    ];
    // parsing content to rows
    if (rawRows) {
      let realRows = [];
      _.map(rawRows, function(item) {
        let row = {
          id: item.id.toString(),
          Target: item.Target,
          Details: (
            <div>
              <Button
                href={`/#/reports/${item.Workspace}/`}
                renderIcon={Launch20}
                small
                // target="_blank"
                kind="secondary">
                Reports
              </Button>
              <Button
                href={`/#/summary/${item.Workspace}/`}
                renderIcon={Launch20}
                small
                // target="_blank"
                kind="tertiary">
                Summary
              </Button>
            </div>
          ),
          RawResult: (
            <CodeSnippet onClick={() => copy(item.RawResult)} type="single">
              {item.RawResult}
            </CodeSnippet>
          ),
          Flow: (
            <Tag className="some-class" type="green">
              {item.Flow}
            </Tag>
          ),
        };
        realRows.push(row);
      });
      rows = realRows;
    }
    payload_table = (
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
        }) => (
          <TableContainer>
            <TableToolbar kind="secondary">
              {/* make sure to apply getBatchActionProps so that the bar renders */}

              <TableToolbarContent>
                <TableToolbarSearch
                  onChange={data => this.searchChangedHandler(data)}
                />

                <Button
                  // onClick={() => this.openAdd()}
                  href="/#/task/new"
                  small
                  renderIcon={Add24}
                  kind="primary">
                  New Scan
                </Button>

                <Button
                  // onClick={() => this.openAdd()}
                  href={`${rawWorkspaces}`}
                  small
                  renderIcon={FolderDetails20}
                  kind="secondary">
                  Raw View
                </Button>
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
    return payload_table;
  }
}

export default inject('sessStore', 'axiosStore')(observer(WorkspacesTable));
