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
  FolderDetails20,
} from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import copy from 'clipboard-copy';
import _ from 'lodash';
import RiskTag from '../../../components/Vuln/RiskTag';
import ReportButton from './ReportButton'

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} = DataTable;

class ReportsTable extends Component {
  state = {
    error: false,
    isSubmitted: false,
    isOpenURL: false,
    detail_data: null,
    req_data: null,
    base_url: null,
    wsname: null,
    isOpenEdit: false,
    rawRows: null,
    rawWorkspaces: null,
    rawStorages: null,
  };

  componentDidMount() {
    const base_url = this.props.axiosStore.instance.defaults.baseURL;
    this.setState({ base_url: base_url });

    const wsname = this.props.wsname;
    this.setState({ wsname: wsname });
    this.getData(wsname);
  }

  getData(wsname) {
    let url = `/api/reports/${wsname}/`;
    this.props.axiosStore.instance
      .get(`${url}`)
      .then(response => {
        if (response.data.hasOwnProperty('content')) {
          const raw_reports = response.data.content;
          // const raw_workspaces = response.data.workspaces;
          let reports = [];
          _.map(raw_reports, function(value, key) {
            reports.push({ module: key, reports: value });
          });

          this.setState({ rawRows: reports });
          this.setState({ tamperRow: reports });
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
    let report_table = (
      <h1 className="landing-page__heading">Nothing to show</h1>
    );
    
    const rawRows = this.state.rawRows;
const base_url = this.state.base_url;

    let rows = [
      {
        id: 'a',
        foo: 'AA11 a',
      },
    ];

    let headers = [
      {
        key: 'Module',
        header: 'Module',
      },
      {
        key: 'Detail',
        header: 'Detail',
      },
    ];

    // parsing content to rows
    if (rawRows) {
      let realRows = [];
      _.map(rawRows, function(item, index) {
        let row = {
          id: index.toString(),
          Module: item.module,
          Detail: (<ReportButton reports={item.reports} base_url={base_url} />),
        };
        realRows.push(row);
      });
      rows = realRows;
    }

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

    report_table = (
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
    return report_table;
  }
}

export default inject('sessStore', 'axiosStore')(observer(ReportsTable));
