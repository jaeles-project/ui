import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { Doughnut } from 'react-chartjs-2';

const options = {
  title: {
    display: true,
    text: 'Vulnerability Summary',
  },
  responsive: true,
  legend: {
    position: 'bottom',
    labels: {
      fontColor: '#8eacbb',
      // fontColor: `${() => themed({ light: '#36ae', dark: '#DFE151' })}`,
      boxWidth: 20,
      padding: 20,
    },
  },
};

class VulnChart extends Component {
 

  state = {
    real_data: null,
  };

  componentDidMount() {
    const content = this.props;
    this.props.axiosStore.instance
      .get('/rest/v1/stat/vuln/')
      .then(response => {
        if (response.data.hasOwnProperty('summary')) {
          console.log(response.data);
          this.setState({ real_data: response.data.summary });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

  render() {
    let chart = null;
    const real_data = this.state.real_data;
    if (real_data) {
    //   console.log(real_data);
      const data = {
        datasets: [
          {
            borderWidth: 0,
            data: real_data['values'],
            backgroundColor: [
              '#0091EA',
              '#6200EA',
              '#76FF03',
              '#FFD600',
              '#F44336',
              '#A30000',
            ],
            hoverBackgroundColor: [
              '#0091EA',
              '#6200EA',
              '#76FF03',
              '#FFD600',
              '#F44336',
              '#A30000',
            ],
          },
        ],
        labels: real_data['vuln_type'],
      };
      console.log(data);
      chart = (
        <Doughnut
          title="Vulnerability Summary"
          data={data}
          options={options}
        />
      );
    }
    return <div>{chart}</div>;
  }
}

export default inject('sessStore', 'axiosStore')(observer(VulnChart));
