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
import axios from 'axios';
import SignatureTable from '../containers/Details/Signatures/SignatureTable';

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} = DataTable;

class SignaturePage extends Component {
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

  componentDidMount() {}

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

    // modal form part
    const additionalProps = {
      className: 'some-class',
      onSubmit: e => {
        e.preventDefault();
        const path = this.refs.path.value;
        const override = this.refs.override.value;
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
                    Signature Summary
                    <Breadcrumb className="some-class" noTrailingSlash={false}>
                      <BreadcrumbItem>
                        <a href="/#">Signature Summary</a>
                      </BreadcrumbItem>
                    </Breadcrumb>
                  </h1>
                  <hr />
                </div>
                <div className="bx--col-md-4 bx--col-lg-16">
                  <SignatureTable pid={null} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject('sessStore', 'axiosStore')(observer(SignaturePage));
