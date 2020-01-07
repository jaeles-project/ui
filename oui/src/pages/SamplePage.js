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
  Edit20,
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

  selectRow = row => {
    if (row.length === 1) {
      const detail_id = row[0].id;
      console.log(detail_id);
      this.setState({ detail_id: detail_id });
      this.getBeautify(detail_id);
    }
  };

  getBeautify(id) {
    this.props.axiosStore.instance
      .get(`rest/v1/beautify/req/${id}/`)
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

  render() {
    const error = this.state.error;
    const isLogged = this.state.isLogged;
    const rawRows = this.state.rawRows;
    const req_data = this.state.req_data;
    const res_data = this.state.res_data;
    const detail_id = this.state.detail_id;

    let real_req_data = 'You may wanna select the request';
    let real_res_data = 'You may wanna select the request';

    if (req_data) {
      real_req_data = req_data;
    }
    if (res_data) {
      real_res_data = res_data;
    }

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
          id: item.id,
          method: <Tag type="cyan">{item.req_method}</Tag>,
          host: <Tag type="green">{item.req_host}</Tag>,
          url: <Tag type="magenta">{item.req_url}</Tag>,
          status: <Tag type="purple">{item.res_status_code}</Tag>,
          length: <Tag type="purple">{item.res_length}</Tag>,
          time: <Tag type="purple">{item.res_time}</Tag>,
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
                  <h1 className="landing-page__heading">HTTP History</h1>
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
                      // batchActionClick,
                      selectedRows,
                    }) => (
                      <TableContainer>
                        <TableToolbar kind="secondary">
                          {/* make sure to apply getBatchActionProps so that the bar renders */}
                          <TableBatchActions {...getBatchActionProps()}>
                            {/* inside of you batch actinos, you can include selectedRows */}
                            <TableBatchAction
                              kind="secondary"
                              renderIcon={Login20}
                              onClick={() => this.selectRow(selectedRows)}>
                              Beautify
                            </TableBatchAction>

                            <TableBatchAction
                              kind="tertiary"
                              renderIcon={Login20}
                              onClick={() => console.log(selectedRows)}>
                              Edit
                            </TableBatchAction>

                            <TableBatchAction
                              kind="danger"
                              onClick={() => console.log('selectedRows')}>
                              Delete
                            </TableBatchAction>
                          </TableBatchActions>

                          <TableToolbarContent>
                            <TableToolbarSearch
                              onChange={data => this.searchChangedHandler(data)}
                            />

                            <Button
                              onClick={() => console.log('Filter')}
                              small
                              renderIcon={Add24}
                              kind="secondary">
                              Add new
                            </Button>

                            <Button
                              onClick={() => console.log('Add new row')}
                              small
                              renderIcon={Add24}
                              kind="primary">
                              Add new
                            </Button>
                          </TableToolbarContent>
                        </TableToolbar>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableSelectAll {...getSelectionProps()} />
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
                                <TableSelectRow
                                  {...getSelectionProps({ row })}
                                />
                                {row.cells.map(cell => (
                                  <TableCell key={cell.id}>
                                    {cell.value}
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

                <div className="bx--col-md-4 bx--col-lg-16">
                  <br />
                  <hr />
                  <br />
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
                      label="Request">
                      <div className="some-content">
                        <CodeSnippet
                          light={false}
                          kind="secondary"
                          type="multi"
                          feedback="Copied">
                          {`${real_req_data}`}
                        </CodeSnippet>
                      </div>
                    </Tab>
                    <Tab
                      disabled={false}
                      //   onClick={anonymous}
                      //   onKeyDown={anonymous}
                      label="Response">
                      <div className="some-content">
                        <CodeSnippet
                          light={false}
                          kind="secondary"
                          type="multi"
                          feedback="Copied">
                          {`${real_res_data}`}
                        </CodeSnippet>
                      </div>
                    </Tab>
                  </Tabs>
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
