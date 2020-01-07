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
  ComboBox,
} from 'carbon-components-react';
import { DataTable } from 'carbon-components-react';

import {
  Edit20,
  View20,
  TrashCan20,
  Add24,
  FilterEdit20,
} from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import copy from 'clipboard-copy';
import _ from 'lodash';
import RiskTag from '../../../components/Vuln/RiskTag'

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} = DataTable;

class VulnTable extends Component {
  state = {
    error: false,
    isSubmitted: false,
    isOpenFilter: false,
    detail_data: null,
    req_data: null,
    res_data: null,
    isOpenEdit: false,
    rawRows: null,
    source: null,
    risk: null,
    rows: [],
  };

  componentDidMount() {
    this.getVuln(null, null);
  }

  getVuln(source, risk) {
    // const source = this.state.source;
    // const risk = this.state.risk;
    let url = `/rest/v1/vulns/`;
    if (source && risk) {
      url = `/rest/v1/vulns/?source=${source}&risk=${risk}`;
    } else if (source) {
      url = `/rest/v1/vulns/?source=${source}`;
    } else if (risk) {
      url = `/rest/v1/vulns/?risk=${risk}`;
    }
    console.log(url);
    this.props.axiosStore.instance
      .get(`${url}`)
      .then(response => {
        if (response.data.hasOwnProperty('vulns')) {
          // console.log(response.data);
          this.setState({ rawRows: response.data.vulns });
          this.setState({ tamperRow: response.data.vulns });
          this.parseData(response.data.vulns);
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

  openFilter = () => this.setState({ isOpenFilter: !this.state.isOpenFilter });
  handleSourceSelect(data) {
    if (data) {
      const source = data;
      this.setState({ source: source });
      const risk = this.state.risk;
      this.getVuln(source, risk);
    }
    else {
        this.setState({ source: null });
        const risk = this.state.risk;
        this.getVuln(null, risk);
    }
  }
  handleRiskSelect(data) {
    if (data) {
      const risk = data;
      this.setState({ risk: risk });
      const source = this.state.source;
      this.getVuln(source, risk);
    }
    else {
        this.setState({ risk: null });
        const source = this.state.source;
        this.getVuln(source, null);
    }
  }

  parseData(rawRows) {
    // const rawRows = this.state.rawRows;
    let rows = [];

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
    this.setState({ rows: rows });
  }

  render() {
    let vuln_table = <h1 className="landing-page__heading">Nothing to show</h1>;
    const isOpenFilter = this.state.isOpenFilter;
    const req_data = this.state.req_data;
    const res_data = this.state.res_data;
    const detail_id = this.state.detail_id;
    const detail_data = this.state.detail_data;
    const isOpenEdit = this.state.isOpenEdit;
    const rows = this.state.rows;

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
    // hardcode filter for now
    const sources = [
      { label: 'Both', value: 'Both' },
      { label: 'Active', value: 'Active', selected: true },
      { label: 'Passive', value: 'Passive' },
    ];

    const risks = [
      { label: 'Critical', value: 'Critical' },
      { label: 'High', value: 'High' },
      { label: 'Medium', value: 'Medium' },
      { label: 'Low', value: 'Low' },
      { label: 'Potential', value: 'Potential' },
    ];
    let filter = null;

    if (isOpenFilter) {
      filter = (
        <div>
          <div className="bx--row">
            <div className="bx--col-md-8 bx--col-lg-8">
              <ComboBox
                titleText="Filter by Risk"
                items={risks}
                invalid={false}
                id="risk-select"
                placeholder="Select Template"
                name="template"
                ref="template"
                onInputChange={data => this.handleRiskSelect(data)}
              />
            </div>
            <div className="bx--col-md-8 bx--col-lg-8">
              <ComboBox
                titleText="Filter by source"
                items={sources}
                invalid={false}
                id="template-select"
                placeholder="Select Template"
                name="template"
                ref="template"
                onInputChange={data => this.handleSourceSelect(data)}
              />
            </div>
          </div>
          <br />
        </div>
      );
    }

    vuln_table = (
      <div>
        {filter}

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
                  <TableToolbarSearch onChange={onInputChange} />

                  <Button
                    onClick={() => this.openFilter()}
                    small
                    renderIcon={FilterEdit20}
                    kind="secondary">
                    Filter
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
      </div>
    );
    return vuln_table;
  }
}

export default inject('sessStore', 'axiosStore')(observer(VulnTable));
