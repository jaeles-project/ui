import React, { Component } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
} from 'carbon-components-react';
import axios from 'axios';
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
} from 'carbon-components-react';

import { Login20, Search16, Settings20 } from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import LandingPage from '../content/LandingPage/LandingPage'
import URLForm from '../containers/Forms/URLForm';
import RedirectPage from './RedirectPage'

class LoginPage extends Component {
  state = {
    isLogged: this.props.sessStore.isLogged,
    error: false,
    isSubmitted: false,
    isOpenURL: false,
  };

  componentDidMount() {
    const jwt = window.localStorage.getItem('jwt');
    if (jwt) {
      this.props.axiosStore.setJWT(jwt);
      this.props.sessStore.setisLogged();
      console.log(this.props.sessStore.isLogged);
      this.setState({ isLogged: this.props.sessStore.isLogged });
    }
  }

  handleLogin(username, password) {
    let json_body = JSON.stringify({
      username: username,
      password: password,
    });

    let token = '';
    const url = this.props.axiosStore.url + '/auth/login';
    axios.post(url, json_body).then(response => {
        if (response.data.hasOwnProperty('token')) {
          token = response.data.token;
          this.props.axiosStore.setJWT(token);
          this.props.sessStore.setisLogged();

          this.setState({ isLogged: this.props.sessStore.isLogged });
          window.location = '/';
        } else {
          this.setState({ error: true });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  openURL = () => this.setState({ isOpenURL: true });
  closeURL = () => this.setState({ isOpenURL: false });

  render() {
    const additionalProps = {
      className: 'some-class',
      onSubmit: e => {
        e.preventDefault();
        const username = this.refs.username.value;
        const password = this.refs.password.value;
        this.handleLogin(username, password);
      },
    };

    const error = this.state.error;
    const isLogged = this.state.isLogged;
    const isOpenURL = this.state.isOpenURL;

    let noti = (
      <InlineNotification
        kind="info"
        lowContrast={true}
        title="Fill your credentails. "
        subtitle="Default is on ~/.osmedeus/config.yaml"
      />
    );

    if (error) {
      noti = (
        <InlineNotification
          kind="error"
          lowContrast={false}
          title="Incorrect Credentials"
          iconDescription="describes the close button"
        />
      );
    } else if (isLogged) {
      noti = (
        <InlineNotification
          kind="success"
          lowContrast={false}
          title="Login success"
          iconDescription="describes the close button"
        />
      );
    }

    console.log(this.state);
    if (!this.state.isLogged) {
      return (
        <div className="bx--grid bx--grid--full-width landing-page">
          <div className="bx--row landing-page__r2">
            <div className="bx--col bx--no-gutter">
              <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
                <div className="bx--row landing-page__tab-content">
                  <div className="bx--col-md-4 bx--col-lg-7">
                    <ComposedModal
                      open={isOpenURL}
                      handleSubmit={data => console.log(data)}
                      onClose={() => this.closeURL()}
                      danger={true}>
                      <URLForm />

                      <ModalFooter
                        primaryButtonText="Cancel"
                        primaryButtonDisabled={false}
                        onRequestClose={() => this.closeURL()}
                        onRequestSubmit={() => this.closeURL()}
                      />
                    </ComposedModal>

                    <h1 className="landing-page__heading">Login Page </h1>

                    <p className="landing-page__p">
                      Find out how to login &nbsp;
                      <a href="https://j3ssie.github.io/Osmedeus/">
                        here.
                      </a>
                    </p>
                    {noti}

                    <Form {...additionalProps}>
                      <FormGroup
                        className="some-class"
                        legendText="Username">
                        <TextInput
                          type="text"
                          name="username"
                          ref="username"
                          defaultValue="osmedeus"
                        />
                      </FormGroup>

                      <FormGroup
                        className="some-class"
                        legendText="Password">
                        <TextInput
                          type="password"
                          name="password"
                          ref="password"
                        />
                      </FormGroup>

                      <br />

                      <Button
                        renderIcon={Login20}
                        value=""
                        //   onClick={() => this.submitHandler()}
                        type="submit"
                        kind="secondary">
                        Login
                      </Button>

                      <Button
                        renderIcon={Settings20}
                        value=""
                        onClick={() => this.openURL()}
                        kind="tertiary">
                        Remote URL
                      </Button>
                    </Form>
                  </div>
                  <div className="bx--col-md-4 bx--offset-lg-1 bx--col-lg-8">
                    <img
                      className="landing-page__illo"
                      src={`${process.env.PUBLIC_URL}/static/landing.jpg`}
                      alt="Carbon illustration"
                    />
                    <p align="center">
                      Infographic vector created by &nbsp;
                      <a href="https://www.freepik.com/free-photos-vectors/infographic">
                        pikisuperstar - www.freepik.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      if (this.props.children) {
        return this.props.children;
      } else {
        return <RedirectPage />;
      }
    }
  }
}

export default inject('sessStore', 'axiosStore')(observer(LoginPage));
