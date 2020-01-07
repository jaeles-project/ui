import React, { Component } from 'react';
import {
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderMenu,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderPanel,
  Switcher,
  SwitcherDivider,
  SwitcherItem,
  SwitcherItemLink,
  SkipToContent,
} from 'carbon-components-react/lib/components/UIShell';
import Search20 from "@carbon/icons-react/lib/search/20";
import Notification20 from "@carbon/icons-react/lib/notification/20";
import AppSwitcher20 from "@carbon/icons-react/lib/app-switcher/20";
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
} from 'carbon-components-react';

import { inject, observer } from "mobx-react";

class RepoPage extends Component {

  state = {
    isExpanded: false,
  }

  // openSwither
  openSwither = () => this.setState({ isExpanded: !this.state.isExpanded });
  handleClick() {
    console.log(this.props);
    console.log(this.props.sessStore);
    console.log(this.props.sessStore.conSample());
    console.log(this.props.sessStore.sample)
    // console.log('sam');
  }


  render() {

    return (
      <div className="bx--grid bx--grid--full-width landing-page">
        <div className="bx--row landing-page__banner">
          <div className="bx--col-lg-16">
            <Breadcrumb noTrailingSlash aria-label="Page navigation">
              <BreadcrumbItem>
                <a href="/">Getting started</a>
              </BreadcrumbItem>
            </Breadcrumb>
            <h1 className="landing-page__heading">
              Design &amp; build with Carbon
          </h1>
          </div>
        </div>
        <div className="bx--row landing-page__r2">
          <Button onClick={() => this.handleClick()} >Learn more</Button>

        </div>
        
      </div>
      )

  }

}

export default inject('sessStore')(observer(RepoPage));