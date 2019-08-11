import React from 'react';

import { Tag, Button } from 'carbon-components-react';
import { Add24, ArrowRight24, Launch20 } from '@carbon/icons-react';
import _ from 'lodash';

const ReportButton = props => {
  const reports = props.reports;
  const base_url = props.base_url;

  const content = _.map(reports, function (report) {
      if (report.type === 'html') {
          return (
            <Button
              href={`${base_url}/../wscdn/${report.path}`}
              renderIcon={Launch20}
              small
              kind="tertiary">
              Output
            </Button>
          )
      }
      else {
          return (
            <Button
              href={`${base_url}/../stdout/${report.path}`}
              renderIcon={Launch20}
              small
              kind="secondary">
              Std Output
            </Button>
          );
      }
  })

  return content;
};

export default ReportButton;
