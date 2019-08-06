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
  TextInput,
  TextArea,
  ForwardRef,
  ToastNotification,
  InlineNotification,
  ComposedModal,
  ModalFooter,
  NotificationActionButton,
  Loading,
} from 'carbon-components-react';

import { Edit20, Search16, TrashCan20 } from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
// import LandingPage from '../content/LandingPage/LandingPage';
// import URLForm from '../containers/Forms/URLForm';

class PayloadDetail extends Component {
  state = {
    error: false,
    isSubmitted: false,
    isOpenURL: false,
    detail_data: null,
  };

  componentDidMount() {
    const id = this.props.match.params.pid;
    this.setState({ pid: id });
    this.getContent(id);
    // console.log(this.props.axiosStore.url);
  }

  getContent(id) {
    this.props.axiosStore.instance
      .get(`rest/v1/payload/${id}/`)
      .then(response => {
        this.setState({ detail_data: response.data });
      })
      .catch(error => this.setState({ error: true }));
  }

  openURL = () => this.setState({ isOpenURL: true });
  closeURL = () => this.setState({ isOpenURL: false });

  render() {
    const detail_data = this.state.detail_data;
    const pid = this.state.pid;
    let content = (
      <h1 className="landing-page__heading">Nothing to show</h1>
    );

    if (detail_data){
        content = (
          <Form>
            <FormGroup className="some-class" legendText="ID">
              <TextInput
                type="text"
                name="id"
                value={detail_data.id.toString()}
                ref="id"
              />
            </FormGroup>

            <FormGroup className="some-class" legendText="Payload ID">
              <TextInput
                type="text"
                name="payload_id"
                value={detail_data.payload_id}
                ref="payload_id"
              />
            </FormGroup>

            <FormGroup className="some-class" legendText="Payload Type">
              <TextInput
                type="text"
                name="payload_type"
                value={detail_data.payload_type}
                ref="payload_type"
              />
            </FormGroup>

            <FormGroup className="some-class" legendText="Payload String">
              <TextInput
                type="text"
                name="payload_string"
                value={detail_data.payload_string}
                ref="payload_string"
              />
            </FormGroup>

            <FormGroup className="some-class" legendText="Payload Description">
              <TextInput
                type="text"
                name="payload_desc"
                value={detail_data.payload_desc}
                ref="payload_desc"
              />
            </FormGroup>

            <FormGroup className="some-class" legendText="OS">
              <TextInput
                type="text"
                name="os"
                value={detail_data.os}
                ref="os"
              />
            </FormGroup>

            <FormGroup className="some-class" legendText="Risk">
              <TextInput
                type="text"
                name="risk"
                value={detail_data.risk}
                ref="risk"
              />
            </FormGroup>

            <FormGroup className="some-class" legendText="Technology">
              <TextInput
                type="text"
                name="technology"
                value={detail_data.technology}
                ref="technology"
              />
            </FormGroup>

            <br />

            <Button
              renderIcon={Edit20}
              value=""
              //   onClick={() => this.submitHandler()}
              type="submit"
              kind="secondary">
              Submit
            </Button>

            <Button
              renderIcon={TrashCan20}
              value=""
              onClick={() => this.openURL()}
              kind="danger">
              Delete
            </Button>
          </Form>
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
                        <a href="/#/payload">Payloads Summary</a>
                      </BreadcrumbItem>
                      <BreadcrumbItem isCurrentPage>
                        <a href="/#/payload">Detail </a>
                      </BreadcrumbItem>
                      <BreadcrumbItem isCurrentPage>
                        <a href="/#/payload">{pid}</a>
                      </BreadcrumbItem>
                    </Breadcrumb>
                  </h1>
                  <hr />
                </div>

                <div className="bx--col-md-4 bx--col-lg-7">{content}</div>
                <div className="bx--col-md-4 bx--offset-lg-1 bx--col-lg-8">
                  <img
                    className="landing-page__illo"
                    src={`${process.env.PUBLIC_URL}/tab-illo.png`}
                    alt="Carbon illustration"
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

export default inject('sessStore', 'axiosStore')(observer(PayloadDetail));
