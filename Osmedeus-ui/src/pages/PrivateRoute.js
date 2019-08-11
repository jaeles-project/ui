import React, { Component } from 'react';
import { Content } from 'carbon-components-react/lib/components/UIShell';
import { Route, Switch, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import LoginPage from './LoginPage';

class PrivateRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isAuthenticated: false,
    };
  }

  componentDidMount() {
    this.setState({
      isAuthenticated: this.props.sessStore.isLogged,
    });
    console.log(this.props.axiosStore.url);
    const jwt = window.localStorage.getItem('jwt');
    if (jwt) {
      this.props.axiosStore.setJWT(jwt);
      this.props.sessStore.setisLogged();
      console.log(this.props.sessStore.isLogged);
      this.setState({
        isAuthenticated: this.props.sessStore.isLogged,
      });
    }
  }

  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          this.state.isAuthenticated ? (
            <Component {...props} />
          ) : this.state.loading ? (
            <LoginPage />
            ) : (
            <Redirect
              to={{ pathname: '/login', state: { from: this.props.location } }}
            />
          )
        }
      />
    );
  }
}

export default inject('sessStore', 'axiosStore')(observer(PrivateRoute));
