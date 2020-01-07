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
} from 'carbon-components-react';
import { DataTable } from 'carbon-components-react';

import { Edit20, Search16, TrashCan20, Add24 } from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
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

class ActiveTable extends Component {
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
    const pid = this.props.pid;
    let url = `/rest/v1/actives/`;
    if (pid) {
        url = `/rest/v1/actives/?pid=${pid}`;
    }

    this.props.axiosStore.instance
      .get(`${url}`)
      .then(response => {
        if (response.data.hasOwnProperty('actives')) {
          // console.log(response.data);
          this.setState({ rawRows: response.data.actives });
          this.setState({ tamperRow: response.data.actives });
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
    let active_table = (
      <h1 className="landing-page__heading">Nothing to show</h1>
    );

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
        key: 'payload_id',
        header: 'Payload ID',
      },
      {
        key: 'analyze_string',
        header: 'Analyze String',
      },
      {
        key: 'analyze_type',
        header: 'Analyze Type',
      },
      {
        key: 'component',
        header: 'Analyze Component',
      },
      {
        key: 'payload_type',
        header: 'Payload Type',
      },
    ];

    // parsing content to rows
    if (rawRows) {
      let realRows = [];
      _.map(rawRows, function(item) {
        let row = {
          id: item.id.toString(),
          detail: (
            <a href={`/#/actives/${item.id.toString()}/detail`}>
              <Button
                kind="secondary"
                // hasIconOnly
                renderIcon={Edit20}
                size="small">
                Detail
              </Button>
            </a>
          ),
          payload_id: item.payload_id,
          analyze_string: item.analyze_string,
          analyze_type: item.analyze_type,
          component: item.component,
          payload_type: item.payload_type,
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

    active_table = (
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
                  // onClick={() => this.openAdd()}
                  href="/#/payload/new"
                  small
                  renderIcon={Add24}
                  kind="secondary">
                  Add Payloads
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
    return active_table;
  }
}

export default inject('sessStore', 'axiosStore')(observer(ActiveTable));
