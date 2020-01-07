import React from 'react';

import { Button } from 'carbon-components-react';
import { Add24, ArrowRight24 } from '@carbon/icons-react';
import CountUp from 'react-countup';


const CountUpCard = props => {

  return (
    <div
      className="landing-page"
      style={
        {
          // backgroundColor: "#171717",
          // color: "#fff",
          // paddingTop: "3px"
        }
      }>
      <div className="info-card">
        <h1 align="center" className="info-card__heading">
          {props.title}
        </h1>

        <h1 align="center" className="landing-page__heading">
          <CountUp end={props.end} duration={3} />
        </h1>
      </div>
    </div>
  );
};

export default CountUpCard;
