import React from 'react';

import {Button} from 'carbon-components-react';
import { Add24, ArrowRight24 } from '@carbon/icons-react';

// Take in a phrase and separate the third word in an array
function createArrayFromPhrase(phrase) {
  const splitPhrase = phrase.split(' ');
  const thirdWord = splitPhrase.pop();
  return [splitPhrase.join(' '), thirdWord];
}

const InfoSection = props => (
  <section className={`bx--row ${props.className} info-section`}>
    {/* <div className="bx--col-md-8 bx--col-lg-4 bx--col-xlg-3">
      <h3 className="info-section__heading">{props.heading}</h3>
    </div> */}
    {props.children}
  </section>
);

const InfoCard = props => {
  // const splitHeading = createArrayFromPhrase(props.heading);

  return (
    <div className="bx--col-md-4 bx--col-lg-4">
      <div className="info-card">
        <h4 className="info-card__heading">
          <strong>{props.heading}</strong>
        </h4>
        <p className="info-card__body">
          <img
            width="300"
            className="landing-page__illo"
            src={`${process.env.PUBLIC_URL}/tab-illo.png`}
            alt="Carbon illustration"
          />
        </p>
      </div>
      <br />
      <Button
        renderIcon={ArrowRight24}
        //   onClick={() => this.submitHandler()}
        kind="secondary">
        Detail
      </Button>
    </div>
  );
};

export { InfoSection, InfoCard };
