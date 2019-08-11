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

import { Login20, Search16, Settings20 } from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import LandingPage from '../content/LandingPage/LandingPage';
import URLForm from '../containers/Forms/URLForm';

class RedirectPage extends Component {
  state = {
    isLogged: this.props.sessStore.isLogged,
    error: false,
    isSubmitted: false,
    isOpenURL: false,
  };

  componentDidMount() {
    console.log(this.props.axiosStore.url);

  }


  openURL = () => this.setState({ isOpenURL: true });
  closeURL = () => this.setState({ isOpenURL: false });

  render() {
    
    return (
      <p align="center">
        <Loading withOverlay={false} className="some-class" />
        <h1>Authenticate processing</h1>
      </p>
    );
      
    }
  
}

export default inject('sessStore', 'axiosStore')(observer(RedirectPage));
