import React from 'react';

import { Tag, Button } from 'carbon-components-react';
import { Add24, ArrowRight24, Launch20 } from '@carbon/icons-react';
import _ from 'lodash';

const LogsButton = props => {
  const output_path = props.output_path;
  const std_path = props.std_path;
  const base_url = props.base_url;


  let std, out = null;  
  if (output_path != "") {
    out = (
      <Button
        href={`${base_url}/api/stdout/get/?std=${output_path}`}
        // href={`${base_url}/../static/${output_path}`}
        renderIcon={Launch20}
        small
        target="_blank"
        kind="tertiary">
        Output
      </Button>
    );
  }
    if (std_path != "") {
      std = (
        <Button
          href={`${base_url}/api/stdout/get/?std=${std_path}`}
          renderIcon={Launch20}
          small
          target="_blank"
          kind="secondary">
          Std Path
        </Button>
      );
    }

  const content = (
    <div>
      {out}
      {std}
    </div>
  );

  return content;
};

export default LogsButton;
