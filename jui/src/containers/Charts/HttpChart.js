import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { Bar } from 'react-chartjs-2';


const options = {
  title: {
    display: true,
    text: 'HTTP Summary',
  },
  responsive: true,
  legend: {
    position: 'bottom',
    labels: {
      fontColor: '#8eacbb',
      boxWidth: 20,
      padding: 20,
    },
  },
  tooltips: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};


class HttpChart extends Component {
  state = {
    real_data: null,
  };

  componentDidMount() {
    const content = this.props;
    this.props.axiosStore.instance
      .get('/rest/v1/http/stat/total/')
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
      console.log(real_data);
      const data = {
        labels: real_data['req_count'],
        datasets: [
          {
            label: 'Number of Request',
            backgroundColor: '#C39BD3',
            borderColor: '#6C3483',
            borderWidth: 2,
            minHeight: 0,
            hoverBackgroundColor: '#6C3483',
            hoverBorderColor: '#C39BD3',
            data: real_data['values'],
          },
        ],
      };

      console.log(data);
      chart = (
        <Bar
          title="HTTP Summary"
          data={data}
          width={100}
          height={50}
          options={options}
        />
      );
    }

    return <div>{chart}</div>;
  }
}
export default inject('sessStore', 'axiosStore')(observer(HttpChart));
