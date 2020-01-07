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

import { Edit20, Search16, TrashCan20, Add24 } from '@carbon/icons-react';
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

class ScanDetailTable extends Component {

  state = {
    error: false,
    isSubmitted: false,
    isOpenURL: false,
    detail_data: null,
    req_data: null,
    res_data: null,
    sid: null,
    isOpenEdit: false,
    rawRows: null,
  };
  
  componentDidMount() {
    const sid = this.props.sid;
    this.setState({sid: sid});
    this.getData(sid);
  }

  getData(sid) {
    let url = `/api/scan/${sid}/`;
    console.log(url);
    this.props.axiosStore.instance
      .get(`${url}`)
      .then(response => {
        if (response.data.hasOwnProperty('records')) {
          this.setState({ rawRows: response.data.records });
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
    let payload_table = (
      <h1 className="landing-page__heading">Nothing to show</h1>
    );

    const req_data = this.state.req_data;
    const res_data = this.state.res_data;
    const detail_id = this.state.detail_id;
    const detail_data = this.state.detail_data;
    const isOpenEdit = this.state.isOpenEdit;
    const sid = this.state.sid;
    const rawRows = this.state.rawRows;

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
        key: 'ReqMethod',
        header: 'Method',
      },

      {
        key: 'StatusCode',
        header: 'StatusCode',
      },
      {
        key: 'ResTime',
        header: 'ResTime',
      },
      {
        key: 'ResLength',
        header: 'ResLength',
      },
      {
        key: 'Risk',
        header: 'Risk',
      },
      {
        key: 'ReqURL',
        header: 'URL',
      },
    ];
    // parsing content to rows
    if (rawRows) {
      let realRows = [];
      _.map(rawRows, function(item) {
        let row = {
          id: item.id.toString(),
          detail: (
            <a href={`/#/record/${sid}/${item.id.toString()}/`}>
              <Button
                kind="secondary"
                // hasIconOnly
                renderIcon={Edit20}
                size="small">
                Detail
              </Button>
            </a>
          ),
          Risk: <RiskTag risk={item.Risk} />,
          ReqURL: (
            <CodeSnippet
              onClick={() => copy(item.ReqURL)}
              type="single">
              {item.ReqURL}
            </CodeSnippet>
          ),
          RawFile: (
            <CodeSnippet
              onClick={() => copy(item.RawFile)}
              type="single">
              {item.RawFile}
            </CodeSnippet>
          ),
          ReqMethod: item.ReqMethod,
          StatusCode: item.StatusCode,
          ResTime: item.ResTime,
          ResLength: item.ResLength,
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
                  href="/#/scan/new"
                  small
                  renderIcon={Add24}
                  kind="secondary">
                  New Scan
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

export default inject('sessStore', 'axiosStore')(observer(ScanDetailTable));
