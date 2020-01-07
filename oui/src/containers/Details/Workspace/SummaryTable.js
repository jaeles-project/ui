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
import WorkspaceTag from './WorkspaceTag';
import copy from 'clipboard-copy';
import _ from 'lodash';

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} = DataTable;

class SummaryTable extends Component {
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
    const wsname = this.props.wsname;
    this.getContent(wsname);
  }

  getContent(workspace) {
    let url = `/api/summary/${workspace}/`;
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
    let data_table = (
      <p align="center" className="landing-page__heading">Nothing to show</p>
    );

    const rawRows = this.state.rawRows;
    let rows = [];

    let headers = [
      {
        key: 'open',
        header: 'Open',
      },
      {
        key: 'domain',
        header: 'Domain',
      },
      {
        key: 'ip',
        header: 'IP',
      },
      {
        key: 'techs',
        header: 'Technology',
      },
      {
        key: 'ports',
        header: 'Ports',
      },
    ];

    if (rawRows) {
      let realRows = [];
      console.log(rawRows)
      _.map(rawRows, function(item, index) {
        let row = {
          id: index.toString(),
          open: (
            <a href={`//${item.domain}`} target="_blank">
              <Launch20 />
            </a>
          ),
          domain: item.domain,
          ip: item.ip,
          techs: <WorkspaceTag data={item.techs} color={'cyan'} />,
          ports: <WorkspaceTag data={item.ports} color={'green'} />,
        };
        realRows.push(row);
      });
      rows = realRows;
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
        {data_table}
      </div>
    );
  }
}

export default inject('sessStore', 'axiosStore')(observer(SummaryTable));
