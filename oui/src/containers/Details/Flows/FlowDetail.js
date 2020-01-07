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
import { Link, Redirect } from 'react-router-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';


const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} = DataTable;

class FlowDetail extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };
  state = {
    error: false,
    isSubmitted: false,
    rawRows: null,
    detail_id: null,
    content: null,
    fname: null,
    isOpenAdd: false,
    isOpenEdit: false,
    current_id: '0',
  };

  componentDidMount() {
    const fname = this.props.match.params.fname;
    this.setState({ fname: fname });
    this.getData(fname);
  }

  getData(fname) {
    let url = `/api/flow/${fname}/`;

    this.props.axiosStore.instance
      .get(`${url}`)
      .then(response => {
        if (response.data.hasOwnProperty('content')) {
          this.setState({ content: response.data.content });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

  openAdd = () => this.setState({ isOpenAdd: true });
  closeAdd = () => this.setState({ isOpenAdd: false });

  openEdit = () => this.setState({ isOpenEdit: true });
  closeEdit = () => this.setState({ isOpenEdit: false });

  close = () => this.setState({ isOpen: false });

  render() {
    let data = <h1 className="landing-page__heading">Nothing to show</h1>;
    const error = this.state.error;
    const isLogged = this.state.isLogged;
    const fname = this.state.fname;
    let content = this.state.content;
    if (content != null) {
      data = (
        <SyntaxHighlighter language="yaml" style={vs2015}>
          {content}
        </SyntaxHighlighter>
      );
    }

    return (
      <div className="bx--grid bx--grid--full-width landing-page">
        <div className="bx--row landing-page__r2">
          <div className="bx--col bx--no-gutter">
            <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
              <div className="bx--row landing-page__tab-content">
                <div className="bx--col-md-4 bx--col-lg-16">
                  <h1 className="landing-page__heading">Flows</h1>

                  <Breadcrumb className="some-class" noTrailingSlash={false}>
                    <BreadcrumbItem>
                      <a href="/#/flows">Flows</a>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                      <a href={`/#/reports/"${fname}`}> {fname} </a>
                    </BreadcrumbItem>
                  </Breadcrumb>
                  <hr />
                </div>
                <div className="bx--col-md-4 bx--col-lg-16">{data}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject('sessStore', 'axiosStore')(observer(FlowDetail));
