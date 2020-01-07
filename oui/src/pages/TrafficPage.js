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
  View20,
  Filter24,
  Settings20,
  Login20,
} from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
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

class TrafficPage extends Component {
  state = {
    isLogged: this.props.sessStore.isLogged,
    error: false,
    isSubmitted: false,
    rawRows: null,
    detail_id: null,
    req_data: null,
    res_data: null,
  };

  componentDidMount() {
    console.log(this.props.axiosStore.url);
    this.props.axiosStore.instance
      .get('/rest/v1/traffics/')
      .then(response => {
        if (response.data.hasOwnProperty('traffics')) {
          // console.log(response.data);
          this.setState({ rawRows: response.data.traffics });
          this.setState({ tamperRow: response.data.traffics });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
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

  render() {
    const error = this.state.error;
    const isLogged = this.state.isLogged;
    const rawRows = this.state.rawRows;
    const req_data = this.state.req_data;
    const res_data = this.state.res_data;
    const detail_id = this.state.detail_id;

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
        key: 'detail',
        header: 'Detail',
      },
      {
        key: 'method',
        header: 'Method',
      },
      {
        key: 'host',
        header: 'Host',
      },
      {
        key: 'url',
        header: 'URL',
      },
      {
        key: 'status',
        header: 'Status',
      },
      {
        key: 'length',
        header: 'Length',
      },
      {
        key: 'time',
        header: 'Time',
      },
    ];

    // parsing content to rows
    if (rawRows) {
      let realRows = [];
      _.map(rawRows, function(item) {
        let row = {
          id: item.id.toString(),
          detail: (
            <a href={`/#/traffic/${item.id.toString()}/detail`}>
              <Button
                kind="secondary"
                // hasIconOnly
                renderIcon={View20}
                size="small"
              >Detail</Button>
            </a>
          ),
          method: item.req_method,
          host: item.req_host,
          url: item.req_url,
          status: item.res_status_code,
          length: item.res_length,
          time: item.res_time,
        };
        realRows.push(row);
      });
      rows = realRows;
    }

    return (
      <div className="bx--grid bx--grid--full-width landing-page">
        <div className="bx--row landing-page__r2">
          <div className="bx--col bx--no-gutter">
            <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
              <div className="bx--row landing-page__tab-content">
                <div className="bx--col-md-4 bx--col-lg-16">
                  <h1 className="landing-page__heading">
                    HTTP History
                    <Breadcrumb
                      className="some-class"
                      noTrailingSlash={false}>
                      <BreadcrumbItem>
                        <a href="/#">HTTP History</a>
                      </BreadcrumbItem>
                    </Breadcrumb>
                  </h1>
                  <hr />
                </div>

                <div className="bx--col-md-4 bx--col-lg-16">
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
                      getBatchActionProps,
                      onInputChange,
                      onChange,
                      onClick,
                      expandRow,
                      customSortRow,
                      // batchActionClick,
                      selectedRows,
                    }) => (
                      <TableContainer>
                        <TableToolbar kind="secondary">
                          {/* make sure to apply getBatchActionProps so that the bar renders */}

                          <TableToolbarContent>
                            <TableToolbarSearch onChange={onInputChange} />

                            <Button
                              small
                              href="/#/traffic/new"
                              renderIcon={Add24}
                              kind="secondary">
                              Add new
                            </Button>
                          </TableToolbarContent>
                        </TableToolbar>
                        <Table>
                          <TableHead>
                            <TableRow>
                              {headers.map(header => (
                                <TableHeader
                                  {...getHeaderProps({ header })}>
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
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject('sessStore', 'axiosStore')(observer(TrafficPage));
