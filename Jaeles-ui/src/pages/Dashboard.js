import React from 'react';
import { Breadcrumb, BreadcrumbItem, Button } from 'carbon-components-react';
import { Api20, ChartBubble20, Flash20 } from '@carbon/icons-react';
import { Link } from 'react-router-dom';
import Card from '../components/Info/Card'

const Dashboard = () => {
  return (
    <div className="bx--grid bx--grid--full-width landing-page">
      <div className="bx--row">
        <h1 className="landing-page__heading">
          Dashboard
          <Breadcrumb className="some-class" noTrailingSlash={false}>
            <BreadcrumbItem>
              <a href="/#/dashboard">Dashboard</a>
            </BreadcrumbItem>
          </Breadcrumb>
          <br />
        </h1>
        {/* <hr /> */}
        <br />
      </div>
      <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
        <div className="bx--row bx--grid--no-gutter bx--grid--full-width">
          <Card
            link={'/#/data'}
            title={'Data Dashboard'}
            src={`${process.env.PUBLIC_URL}/simulation.png`}
          />
          <Card
            link={'/#/vulnerability'}
            title={'Vulnerability'}
            src={`${process.env.PUBLIC_URL}/layers.png`}
          />
          <Card
            link={'/#/attack'}
            title={'Attack Dashboard'}
            src={`${process.env.PUBLIC_URL}/malware.png`}
          />
          <Card
            link={'/#/extension'}
            title={'Extension'}
            src={`${process.env.PUBLIC_URL}/extentions.png`}
          />
        </div>
      </div>
      <div className="bx--row landing-page__r2">
        <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
          <div className="bx--row landing-page__tab-content">
            {/* <div className="bx--col-md-4 bx--col-lg-16"> */}

            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
