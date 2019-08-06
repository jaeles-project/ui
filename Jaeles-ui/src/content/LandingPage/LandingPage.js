import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
} from 'carbon-components-react';
import { Api20, Catalog20 } from '@carbon/icons-react';

const LandingPage = () => {
  return (
    <div className="bx--grid bx--grid--full-width landing-page">
      <div className="bx--row landing-page__r2">
        <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
          <div className="bx--row landing-page__tab-content">
            <div className="bx--col-md-4 bx--col-lg-4">
              <h2 className="landing-page__subheading">What is Jaeles?</h2>
              <p className="landing-page__p">
                Jaeles is Web Application Scanner Framework for Expert.
                <br />
                Custom your Injection point and scan exactly request that you
                consider potential but also support automatic scan design by
                you.
              </p>
              <Button href="/#/dashboard" renderIcon={Api20} kind="primary">
                Explore
              </Button>
              <Button
                href="https://jaeles-project.github.io/"
                renderIcon={Catalog20}
                kind="secondary">
                Documentions
              </Button>
            </div>
            <div className="bx--col-md-4 bx--col-lg-12">
              <img
                className="landing-page__illo"
                src={`${process.env.PUBLIC_URL}/jaeles-architechture.png`}
                alt="Carbon illustration"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
