import React from 'react';

import { Tag, Button } from 'carbon-components-react';
import { Add24, ArrowRight24, Launch20 } from '@carbon/icons-react';
import _ from 'lodash';

const ReportButton = props => {
  const reports = props.reports;
  const base_url = props.base_url;

  const content = _.map(reports, function (report) {

      if (report.report_type === 'html') {
        return (
          <Button
            target="_blank"
            href={`${base_url}/static/${report.report_path}`}
            renderIcon={Launch20}
            small
            target="_blank"
            kind="tertiary">
            Output
          </Button>
        );
      } else {
        return (
          <Button
            href={`${base_url}/api/stdout/get/?std=${
              report.report_path
            }`}
            renderIcon={Launch20}
            small
            target="_blank"
            kind="secondary">
            Bash Output
          </Button>
        );
      }
  })

  return content;
};

export default ReportButton;
