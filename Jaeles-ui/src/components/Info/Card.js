import React from 'react';

import { Button, Tag } from 'carbon-components-react';
import { Add24, ArrowRight24 } from '@carbon/icons-react';


const Card = props => {

  let img_src = `${process.env.PUBLIC_URL}/tab-illo.png`;
  if (props.src) {
    img_src = props.src;
  }


  return (
    <div
      className="bx--col-md-7 bx--col-lg-7"
      style={{
        alignItems: 'center',
        flexWrap: 'wrap',
        marginLeft: '20px',
        marginBottom: '20px',
        backgroundColor: '#F3F3F3',
        border: '1px solid #292929',
        padding: '10px',
        fontSize: '2em',
      }}>
      <p align="center" className="info-card__body">
        <a href={props.link}>
          <img
            width="200"
            className="landing-page__illo"
            src={`${img_src}`}
          />
        </a>
      </p>
      <br />

      <p align="center" className="landing-page__heading">
        {props.title}
      </p>
    </div>
  );
};

export default Card;
