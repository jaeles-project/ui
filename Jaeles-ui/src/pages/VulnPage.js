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
  Carbon20,
} from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import VulnChart from '../containers/Charts/VulnChart';
import RiskTag from '../components/Vuln/RiskTag'

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} = DataTable;

class VulnPage extends Component {
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
    this.props.axiosStore.instance
      .get('/rest/v1/vulns/')
      .then(response => {
        if (response.data.hasOwnProperty('vulns')) {
          // console.log(response.data);
          this.setState({ rawRows: response.data.vulns });
          this.setState({ tamperRow: response.data.vulns });
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
        key: 'vuln_type',
        header: 'Vuln Type',
      },
      {
        key: 'vuln_desc',
        header: 'Vuln Description',
      },
      {
        key: 'risk',
        header: 'Risk',
      },
      {
        key: 'confidence',
        header: 'Confidence',
      },
      {
        key: 'source',
        header: 'Source',
      },
    ];

    // parsing content to rows
    if (rawRows) {
      let realRows = [];
      _.map(rawRows, function(item) {
        let row = {
          id: item.id.toString(),
          detail: (
            <a href={`/#/vulnerability/${item.id.toString()}/detail`}>
              <Button
                kind="secondary"
                // hasIconOnly
                renderIcon={View20}
                size="small">
                Detail
              </Button>
            </a>
          ),
          vuln_type: item.vuln_type,
          vuln_desc: item.vuln_desc,
          risk: <RiskTag risk={item.risk} />,
          confidence: item.confidence,
          source: <Tag type="green">{item.source}</Tag>,
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
                    Vulnerability
                    <Breadcrumb
                      className="some-class"
                      noTrailingSlash={false}>
                      <BreadcrumbItem>
                        <a href="/#/dashboard">Dashboard</a>
                      </BreadcrumbItem>
                      <BreadcrumbItem isCurrentPage>
                        <a href="/#">Vulnerability</a>
                      </BreadcrumbItem>
                    </Breadcrumb>
                  </h1>
                  <hr />
                </div>
                <div className="bx--col-md-4 bx--col-lg-6">
                  <VulnChart />
                </div>
                <div className="bx--col-md-4 bx--col-lg-10">
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
                              href="/#/vulnerability/default"
                              renderIcon={Settings20}
                              kind="secondary">
                              Filter by
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

export default inject('sessStore', 'axiosStore')(observer(VulnPage));
