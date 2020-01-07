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

import { Login20, Search16, Settings20, Send20 } from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
// import LandingPage from '../content/LandingPage/LandingPage';
// import URLForm from '../containers/Forms/URLForm';

class AddPayload extends Component {
  state = {
    override: true,
  };

  componentDidMount() {}

  handleAdd(path, override) {
    override = this.state.override;
    let json_body = JSON.stringify({
      passive_folder: path,
      override: override,
    });
    console.log(json_body);

    this.props.axiosStore.instance
      .post('/action/parsing/passive', json_body)
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

  handleCheck(data) {
    // console.log(data.target.value);
    const override = !this.state.override;

    this.setState({ override: override });
  }

  openURL = () => this.setState({ isOpenURL: true });
  closeURL = () => this.setState({ isOpenURL: false });

  render() {
    const detail_data = this.state.detail_data;
    const pid = this.state.pid;
    let content = <h1 className="landing-page__heading">Nothing to show</h1>;

    const additionalProps = {
      className: 'some-class',
      onSubmit: e => {
        e.preventDefault();
        const path = this.refs.path.value;
        const override = this.refs.override.value;
        console.log(path, override);
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
                    <Breadcrumb className="some-class" noTrailingSlash={false}>
                      <BreadcrumbItem>
                        <a href="/#/passives">Passives Summary</a>
                      </BreadcrumbItem>
                      <BreadcrumbItem isCurrentPage>
                        <a href="/#/payload">New Passive </a>
                      </BreadcrumbItem>
                    </Breadcrumb>
                  </h1>
                  <hr />
                </div>

                <div className="bx--col-md-4 bx--col-lg-7">
                  <Form {...additionalProps}>
                    <FormGroup
                      className="some-class"
                      legendText="Passive Path">
                      <TextInput type="text" name="path" ref="path" />
                    </FormGroup>

                    <FormGroup className="some-class" legendText="Override">
                      <div className="bx--form-item bx--checkbox-wrapper">
                        <input
                          defaultChecked
                          disabled={false}
                          type="checkbox"
                          ref="override"
                          name="override"
                          onChange={data => this.handleCheck(data)}
                          className="bx--checkbox"
                          id="checkbox-label-1"
                        />
                        <label
                          htmlFor="checkbox-label-1"
                          className="bx--checkbox-label some-class"
                          title={null}>
                          <span className="bx--checkbox-label-text">
                            Override
                          </span>
                        </label>
                      </div>
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

export default inject('sessStore', 'axiosStore')(observer(AddPayload));
