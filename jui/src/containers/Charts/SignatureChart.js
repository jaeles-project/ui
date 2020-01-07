import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { Bar } from 'react-chartjs-2';

const options = {
  title: {
    display: true,
    text: 'Payloads Summary',
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

class SignatureChart extends Component {
  state = {
    categories: null,
    real_data: null,
  };

  componentDidMount() {
    const content = this.props;
    this.props.axiosStore.instance
      .get('/api/stats/sign')
      .then(response => {
        if (response.data.hasOwnProperty('data')) {
          this.setState({ categories: response.data.categories });
          this.setState({ real_data: response.data.data });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

  render() {
    let chart = null;
    const real_data = this.state.real_data;
    const categories = this.state.categories;
    if (real_data) {
      console.log(real_data);
      const data = {
        labels: categories,
        datasets: [
          {
            label: 'Number of Payloads',
            backgroundColor: '#D5F5E3',
            borderColor: '#2ECC71',
            borderWidth: 2,
            minHeight: 0,
            hoverBackgroundColor: '#2ECC71',
            hoverBorderColor: '#D5F5E3',
            data: real_data,
          },
        ],
      };

      console.log(data);
      chart = (
        <Bar
          title="Signature Summary"
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

export default inject('sessStore', 'axiosStore')(observer(SignatureChart));
