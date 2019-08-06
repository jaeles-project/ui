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
  ComboBox,
  SelectItem,
  Toggle,
  RadioButtonGroup,
  RadioButton,
  Select,
  Search,
  TextInput,
  TextArea,
  TableToolbarSearch,
  TableToolbarContent,
  TableBatchActions,
  TableBatchAction,
  TableSelectAll,
  TableToolbarAction,
  TableSelectRow,
  TableToolbar,
  ToastNotification,
  InlineNotification,
  ComposedModal,
  ModalFooter,
  NotificationActionButton,
  Loading,
  Tag,
} from 'carbon-components-react';
import _ from 'lodash';
import { Login20, Search16, View20, Send20, TrashCan20 } from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import { DataTable } from 'carbon-components-react';

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} = DataTable;

class AddTemplate extends Component {
  state = {
    payload_types: null,
    payload_type: null,
    rawRows: null,
    tname: null,
  };

  componentDidMount() {
    const tname = this.props.match.params.tname;
    this.setState({ tname: tname });
    this.getContent(tname);
    this.getTypes();
  }

  getContent(tname) {
    const template_name = encodeURI(tname);
    this.props.axiosStore.instance
      .get(`/rest/v1/templates/?tname=${template_name}`)
      .then(response => {
        this.setState({ rawRows: response.data.templates });
      })
      .catch(error => this.setState({ error: true }));
  }

  getTypes() {
    this.props.axiosStore.instance
      .get('/rest/v1/payloads/')
      .then(response => {
        if (response.data.hasOwnProperty('payloads')) {
          // console.log(response.data);
          let raw_payload_types = [];
          let payload_types = [];
          _.map(response.data.payloads, function(item, index) {
            raw_payload_types.push(item.payload_type);
          });

          _.map(_.uniq(raw_payload_types), function(item, index) {
            payload_types.push({ label: item, value: item });
          });

          this.setState({ payload_types: payload_types });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

  handleAdd(tname, level) {
    const payload_type = this.state.payload_type;
    let json_body = JSON.stringify({
      attack_template_name: tname,
      level: level,
      payload_type: payload_type,
    });
    console.log(json_body);

    this.props.axiosStore.instance
      .post('/rest/v1/template/create', json_body)
      .then(response => {
        if (response.data.hasOwnProperty('status')) {
          const status_code = response.data.hasOwnProperty('status');
          if (status_code === 200) {
            // console.log('Success');
            this.setState({ isSubmit: true });
          }
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

  handleSelect(data) {
    const payload_type = data.selectedItem.value;
    this.setState({ payload_type: payload_type });
  }

  handleDelete() {
    const tname = this.state.tname;
    this.props.axiosStore.instance
      .delete(`rest/v1/detail/template/?name=${tname}`)
      .then(response => {
        if (response.data.status_code === 204) {
          this.setState({ submitted: true });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

  openURL = () => this.setState({ isOpenURL: true });
  closeURL = () => this.setState({ isOpenURL: false });

  render() {
    const detail_data = this.state.detail_data;
    const payload_types = this.state.payload_types;
    const rawRows = this.state.rawRows;
    const pid = this.state.pid;
    let content = <h1 className="landing-page__heading">Nothing to show</h1>;

    const additionalProps = {
      className: 'some-class',
      onSubmit: e => {
        e.preventDefault();
        const name = this.refs.name.value;
        const level = this.state.level;
        this.handleAdd(name, level);
      },
    };

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
        key: 'attack_template_name',
        header: 'Template Name',
      },
      {
        key: 'payload_type',
        header: 'Payload Type',
      },
      {
        key: 'level',
        header: 'Level',
      },
    ];

    // parsing content to rows
    if (rawRows) {
      let realRows = [];
      _.map(rawRows, function(item) {
        let row = {
          id: item.id.toString(),
          attack_template_name: item.attack_template_name,
          payload_type: <Tag type="cyan">{item.payload_type}</Tag>,
          level: item.level,
        };
        realRows.push(row);
      });
      rows = realRows;
    }

    content = (
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
                  onClick={() => this.handleDelete()}
                  // href="/#/payload/new"
                  small
                  renderIcon={TrashCan20}
                  kind="danger">
                  Delete
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

    return (
      <div className="bx--grid bx--grid--full-width landing-page">
        <div className="bx--row landing-page__r2">
          <div className="bx--col bx--no-gutter">
            <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
              <div className="bx--row landing-page__tab-content">
                <div className="bx--col-md-4 bx--col-lg-16">
                  <h1 className="landing-page__heading">
                    <Breadcrumb
                      className="some-class"
                      noTrailingSlash={false}>
                      <BreadcrumbItem>
                        <a href="/#/template">Templates Summary</a>
                      </BreadcrumbItem>
                      <BreadcrumbItem isCurrentPage>
                        <a href="/#/template">New Template </a>
                      </BreadcrumbItem>
                    </Breadcrumb>
                  </h1>
                  <hr />
                </div>

                <div className="bx--col-md-4 bx--col-lg-7">
                  <Form {...additionalProps}>
                    <FormGroup
                      className="some-class"
                      legendText="Template Name">
                      <TextInput type="text" name="name" ref="name" />
                    </FormGroup>

                    <FormGroup
                      className="some-class"
                      legendText="Payload Type">
                      <ComboBox
                        items={payload_types}
                        invalid={false}
                        name="payload_type"
                        ref="payload_type"
                        onChange={data => this.handleSelect(data)}
                      />
                    </FormGroup>

                    <FormGroup
                      className="some-class"
                      legendText="Level">
                      <TextInput type="text" name="level" ref="level" />
                    </FormGroup>

                    <Button
                      renderIcon={Send20}
                      value=""
                      //   onClick={() => this.submitHandler()}
                      type="submit"
                      kind="secondary">
                      Submit
                    </Button>
                  </Form>
                </div>
                <div className="bx--col-md-4 bx--offset-lg-1 bx--col-lg-8">
                  {content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject('sessStore', 'axiosStore')(observer(AddTemplate));
