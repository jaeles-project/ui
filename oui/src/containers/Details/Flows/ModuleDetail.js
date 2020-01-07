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

class ModuleDetail extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };
  state = {
    error: false,
    isSubmitted: false,
    rawRows: null,
    detail_id: null,
    content: '',
    fname: '',
    mname: '',
    isOpenAdd: false,
    isOpenEdit: false,
    current_id: '0',
  };

  componentDidMount() {
    const fname = this.props.match.params.fname;
    const mname = this.props.match.params.mname;
    this.getData(fname, mname);
    this.setState({ fname: fname });
    this.setState({ mname: mname });
  }

  getData(fname, mname) {
    let url = `/api/module/${fname}/${mname}/`;
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

  render() {
    let data = <h1 className="landing-page__heading">Nothing to show</h1>;
    let bread = null;
    const error = this.state.error;
    const isLogged = this.state.isLogged;
    const mname = this.state.mname;
    const fname = this.state.fname;
    
    if (mname != null) {
      let content = this.state.content;
      data = (
        <SyntaxHighlighter wrapLines={true} language="yaml" style={vs2015}>
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
                  <h1 className="landing-page__heading">Module</h1>

                  <Breadcrumb className="some-class" noTrailingSlash={false}>
                    <BreadcrumbItem>
                      <a href="/#/flows">Flows</a>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <a href={`/#/flow/${fname}`}>{fname}</a>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                      <a href={`/#/module/${fname}/${mname}`}>{mname}</a>
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

export default inject('sessStore', 'axiosStore')(observer(ModuleDetail));
