import React from 'react';
import  _ from 'lodash';
import { Tag } from 'carbon-components-react';
import { Add24, ArrowRight24 } from '@carbon/icons-react';

const WorkspaceTag = props => {
  const colors = [
    'red',
    'magenta',
    'purple',
    'blue',
    'cyan',
    'teal',
    'green',
    // 'cool-gray',
  ];
  const data = props.data;
  let tags = "N/A";
  let content = data;
  // const color = _.random(colors);

  if (data.includes(',')) {
    content = _.split(data, ',');
  }
  else {
    return <Tag type={props.color} >{data}</Tag>;
  }

  if (_.isArray(content)){
    return (<div>
      {_.map(content, function(element) {
        // const color = _.sample(colors).toString();
        // console.log(color)
        return <Tag type={props.color} >{element}</Tag>;
      })}
    </div>)
  }

  return <Tag type={'cool-gray'}>{tags}</Tag>;
};

export default WorkspaceTag;
