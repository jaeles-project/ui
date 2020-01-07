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
  Settings20,
} from '@carbon/icons-react';
import { inject, observer } from 'mobx-react';
import { InfoSection, InfoCard } from '../components/Info';
import CountUpCard from '../components/Info/CountUpCard';
import SignatureChart from '../containers/Charts/PayloadChart';
import ActiveAnalyzeChart from '../containers/Charts/ActiveAnalyzeChart';
import PassiveAnalyzeChart from '../containers/Charts/PassiveAnalyzeChart';
import HttpChart from '../containers/Charts/HttpChart';
import SummaryCard from '../containers/Charts/SummaryCard';
import Card from '../components/Info/Card';
import VulnChart from '../containers/Charts/VulnChart';

class SummaryPage extends Component {
  state = {
    isLogged: this.props.sessStore.isLogged,
    error: false,
    isSubmitted: false,
  };

  componentDidMount() {
    // console.log(this.props.axiosStore.url);
  }

  render() {
    const error = this.state.error;

    return (
      <div className="bx--grid bx--grid--full-width landing-page">
        <div className="bx--row landing-page__r2">
          <div className="bx--col bx--no-gutter">
            <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
              <div className="bx--row landing-page__tab-content">
                <div className="bx--col-md-8 bx--col-lg-8">
                  <VulnChart />
                </div>
                <div className="bx--col-md-8 bx--col-lg-8">
                  <SignatureChart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject('sessStore', 'axiosStore')(observer(SummaryPage));
