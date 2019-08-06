import React from 'react';

import { Tag } from 'carbon-components-react';
import { Add24, ArrowRight24 } from '@carbon/icons-react';


const RiskTag = props => {
    const risk = props.risk;

    if (risk === 'Critical'){
        return (<Tag type="magenta">{risk}</Tag>);
    }
    else if (risk === 'High'){
        return ( <Tag type="red">{risk}</Tag>)
    }
    else if (risk === 'Medium'){
        return <Tag type="blue">{risk}</Tag>;
    }
    else if (risk === 'Low'){
        return <Tag type="green">{risk}</Tag>;
    }
    else if (risk === 'Potential'){
        return <Tag type="purple">{risk}</Tag>;
    }
    else {
        return <Tag type="gray">N/A</Tag>;
    }

};

export default RiskTag;
