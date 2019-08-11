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
  CodeSnippet,
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
import {
  Login20,
  Search16,
  View20,
  Edit20,
  Add20,
  Send20,
  TrashCan20,
  Flash20,
  TextMiningApplier20,
} from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import { DataTable } from 'carbon-components-react';
import copy from 'clipboard-copy';

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} = DataTable;

class AttackDashboard extends Component {
  state = {
    templates: null,
    analyze_reqs: null,
    selected_template: null,
    selected_req: null,
    rawRows: null,
    req_data: null,
    res_data: null,
    tname: null,
  };

  componentDidMount() {
    this.getTemplates();
    this.getAnalyzed();
  }

  getAnalyzed() {
    this.props.axiosStore.instance
      .get('/rest/v1/analyzeds/')
      .then(response => {
        if (response.data.hasOwnProperty('analyzed_traffics')) {
          let analyze_reqs = [];
          _.map(response.data.analyzed_traffics, function(item, index) {
            // decode the url
            const raw_url = item.req_url;
            let req_url,
              real_url = '';
            try {
              real_url = atob(raw_url);
            } catch (err) {
              real_url = false;
            }
            if (real_url) {
              req_url = real_url;
            } else {
              req_url = raw_url;
            }

            analyze_reqs.push({
              label:
                item.id.toString() +
                ' - ' +
                item.req_method +
                ' - ' +
                item.req_host +
                req_url,
              value: item.id.toString(),
            });
          });
          console.log(analyze_reqs);
          this.setState({ analyze_reqs: analyze_reqs });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

  getTemplates() {
    this.props.axiosStore.instance
      .get('/rest/v1/detail/template/?name=full')
      .then(response => {
        if (response.data.hasOwnProperty('template')) {
          let templates = [];
          _.map(_.uniq(response.data.template), function(item, index) {
            templates.push({ label: item.name, value: item.name });
          });
          console.log(templates);

          this.setState({ templates: templates });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

  getBeautify(id) {
    this.props.axiosStore.instance
      .get(`rest/v1/beautify/req/${id}/?source=analyzed`)
      .then(response => {
        if (response.data.hasOwnProperty('req_content')) {
          // console.log(response.data);
          this.setState({ req_data: response.data.req_content });
          this.setState({ res_data: response.data.res_content });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

  handleTemplateSelect(data) {
    if (data) {
      const selected_template = data.selectedItem.value;
      this.setState({ selected_template: selected_template });
    }
  }

  handleAnalyzedSelect(data) {
    if (data) {
      const selected_req = data.selectedItem.value;
      this.setState({ selected_req: selected_req });
      this.getBeautify(selected_req);
    }
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

  handleAttack(start_type) {
    const req_id = this.state.selected_req;
    let url = `/action/get/marked`;
    const template_name = this.state.selected_template;
    if (req_id && template_name) {
      let json_body = JSON.stringify({
        analyzed_id: req_id,
        attack_template_name: template_name,
      });
      console.log(json_body);

      if (start_type === 'attack'){
        url = `/action/start/attack`;
      }

      this.props.axiosStore.instance
        .post(`${url}`, json_body)
        .then(response => {
          const status_code = response.data.status_code;
          if (status_code === 200) {
            this.setState({ submitted: true });
            console.log('Success');
          }
        })
        .catch(error => this.setState({ error: true }));

      this.setState({ isSubmit: true });
    }
  }

  openURL = () => this.setState({ isOpenURL: true });
  closeURL = () => this.setState({ isOpenURL: false });

  render() {
    const detail_data = this.state.detail_data;
    const templates = this.state.templates;
    const analyze_reqs = this.state.analyze_reqs;
    const selected_req = this.state.selected_req;
    const rawRows = this.state.rawRows;
    const pid = this.state.pid;
    const req_data = this.state.req_data;
    const res_data = this.state.res_data;
    let content = (
      <CodeSnippet light={false} kind="secondary" type="multi">
        {`You may wanna pick a request`}
      </CodeSnippet>
    );
    let edit_button = null;

    if (selected_req) {
      edit_button = (
        <Button
          as="a"
          renderIcon={Edit20}
          href={`/#/analyzed/${selected_req}/detail`}
          size={'small'}
          kind="ghost">
          Edit Request
        </Button>
      );
    }

    const additionalProps = {
      className: 'some-class',
      onSubmit: e => {
        e.preventDefault();
        const name = this.refs.name.value;
        const level = this.state.level;
        this.handleAdd(name, level);
      },
    };

    let real_req_data = 'You may wanna select the request';
    let real_res_data = 'You may wanna select the request';

    if (req_data) {
      real_req_data = req_data;
    }
    if (res_data) {
      real_res_data = res_data;
    }
    const props = {
      req: () => ({
        light: false,
        onClick: () => copy(real_req_data),
        feedback: 'Copied to Clipboard',
      }),
      res: () => ({
        light: false,
        onClick: () => copy(real_res_data),
        feedback: 'Copied to Clipboard',
      }),
    };
    const reqProps = props.req();
    const resProps = props.res();

    if (req_data) {
      content = (
        <Tabs
          className="some-class"
          selected={0}
          // onClick={anonymous}
          // onKeyDown={anonymous}
          // onSelectionChange={anonymous}
          tabContentClassName="tab-content">
          <Tab
            disabled={false}
            //   onClick={anonymous}
            //   onKeyDown={anonymous}
            label="Response">
            <CodeSnippet
              {...reqProps}
              light={false}
              kind="secondary"
              type="multi">
              {`${req_data}`}
            </CodeSnippet>
          </Tab>
          <Tab
            disabled={false}
            //   onClick={anonymous}
            //   onKeyDown={anonymous}
            label="Response">
            <CodeSnippet
              {...resProps}
              light={false}
              kind="secondary"
              type="multi">
              {`${res_data}`}
            </CodeSnippet>
          </Tab>
        </Tabs>
      );
    }

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

                <div className="bx--col-md-4 bx--col-lg-10">
                  <ComboBox
                    items={analyze_reqs}
                    titleText="Analyzed Request"
                    placeholder="Select Analyzed Request"
                    id="analyzed-select"
                    invalid={false}
                    name="analyze_req"
                    ref="analyze_req"
                    onChange={data => this.handleAnalyzedSelect(data)}
                  />
                </div>

                <div className="bx--col-md-4 bx--col-lg-6">
                  <ComboBox
                    titleText="Templates"
                    items={templates}
                    invalid={false}
                    id="template-select"
                    placeholder="Select Template"
                    name="template"
                    ref="template"
                    onChange={data => this.handleTemplateSelect(data)}
                  />
                </div>

                <div className="bx--col-md-4 bx--col-lg-16">
                  <br />
                  {content}
                </div>

                <div className="bx--col-md-4 bx--col-lg-16">
                  <br />
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      marginRight: '5px',
                    }}>
                    {edit_button}
                    <Button
                      renderIcon={TextMiningApplier20}
                      value=""
                      size={'small'}
                      onClick={() => this.handleAttack('inject')}
                      kind="tertiary">
                      Only Inject
                    </Button>
                    <Button
                      renderIcon={Flash20}
                      value=""
                      size={'small'}
                      onClick={() => this.handleAttack('attack')}
                      kind="secondary">
                      Start Attack
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject('sessStore', 'axiosStore')(observer(AttackDashboard));
