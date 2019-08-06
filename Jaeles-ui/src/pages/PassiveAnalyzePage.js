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
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
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
  Carbon24,
  Login20,
  TrashCan20,
} from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import NewPayloadForm from '../containers/Forms/NewPayloadForm';
import { Link, Redirect } from 'react-router-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} = DataTable;

class PassiveAnalyzePage extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };
  state = {
    error: false,
    isSubmitted: false,
    rawRows: null,
    detail_id: null,
    req_data: null,
    res_data: null,
    isOpenAdd: false,
    isOpenEdit: false,
    current_id: '0',
  };

  componentDidMount() {
    this.props.axiosStore.instance
      .get('/rest/v1/passives/')
      .then(response => {
        if (response.data.hasOwnProperty('passives')) {
          // console.log(response.data);
          this.setState({ rawRows: response.data.passives });
          this.setState({ tamperRow: response.data.passives });
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

  openAdd = () => this.setState({ isOpenAdd: true });
  closeAdd = () => this.setState({ isOpenAdd: false });

  openEdit = () => this.setState({ isOpenEdit: true });
  closeEdit = () => this.setState({ isOpenEdit: false });

  close = () => this.setState({ isOpen: false });

  render() {
    const error = this.state.error;
    const isLogged = this.state.isLogged;
    const isOpenAdd = this.state.isOpenAdd;
    const current_id = this.state.current_id;

    const rawRows = this.state.rawRows;
    // detail part
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
        key: 'detail',
        header: 'Detail',
      },
      {
        key: 'passive_id',
        header: 'Passive ID',
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
        key: 'passive_type',
        header: 'Passive Type',
      },
    ];

    // parsing content to rows
    if (rawRows) {
      let realRows = [];
      _.map(rawRows, function(item) {
        let row = {
          id: item.id.toString(),
          detail: (
            <a href={`/#/passives/${item.id.toString()}/detail`}>
              <Button
                kind="secondary"
                // hasIconOnly
                renderIcon={Edit20}
                size="small">
                Detail
              </Button>
            </a>
          ),
          passive_id: item.passive_id,
          analyze_string: item.analyze_string,
          analyze_type: item.analyze_type,
          component: item.component,
          passive_type: item.passive_type,
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

    return (
      <div className="bx--grid bx--grid--full-width landing-page">
        <div className="bx--row landing-page__r2">
          <div className="bx--col bx--no-gutter">
            <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
              <div className="bx--row landing-page__tab-content">
                <div className="bx--col-md-4 bx--col-lg-16">
                  <h1 className="landing-page__heading">
                    Passives Analyze Summary
                    <Breadcrumb className="some-class" noTrailingSlash={false}>
                      <BreadcrumbItem>
                        <a href="/#">Passives Analyze Summary</a>
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
                              href="/#/passives/new"
                              small
                              renderIcon={Add24}
                              kind="secondary">
                              Add Passives
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject('sessStore', 'axiosStore')(observer(PassiveAnalyzePage));
