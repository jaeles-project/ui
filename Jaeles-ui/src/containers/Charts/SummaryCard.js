import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import CountUpCard from '../../components/Info/CountUpCard';

class SummaryCard extends Component {


  state = {
    real_data: null,
  };

  componentDidMount() {
    const content = this.props;
    this.props.axiosStore.instance
      .get('/rest/v1/stat/total/')
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
    let cards = null;
    const real_data = this.state.real_data;
    if (real_data) {
      cards = real_data.map(item => (
        <div className="bx--col-md-4 bx--col-lg-5">
            <CountUpCard title={item.title} end={item.total} />
        </div>
      ));
    }

    return cards;
  }
}

export default inject('sessStore', 'axiosStore')(observer(SummaryCard));
