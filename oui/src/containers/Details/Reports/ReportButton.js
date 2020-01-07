import React from 'react';

import { Tag, Button } from 'carbon-components-react';
import { Add24, ArrowRight24, Launch20 } from '@carbon/icons-react';
import _ from 'lodash';

const ReportButton = props => {
  const reports = props.reports;
  const base_url = props.base_url;

  const content = _.map(reports, function(report) {
    var name = report.split('/').pop();

    if (report.endsWith('.html')) {
      return (
        <Button
          target="_blank"
          href={`${base_url}${report}`}
          renderIcon={Launch20}
          small
          target="_blank"
          kind="tertiary">
          {name}
        </Button>
      );
    } else {
      return (
        <Button
          target="_blank"
          href={`${base_url}${report}`}
          renderIcon={Launch20}
          small
          target="_blank"
          kind="secondary">
          {name}
        </Button>
      );
    }
  });

  return content;
};

export default ReportButton;
