import React, { Component } from 'react';
import './app.scss';
import { Content } from 'carbon-components-react/lib/components/UIShell';
import TopBar from './components/TopBar';
import { Route, Switch } from 'react-router-dom';
import LandingPage from './content/LandingPage';
import RepoPage from './content/RepoPage';


import { inject, observer } from 'mobx-react';
import PrivateRoute from './pages/PrivateRoute';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TrafficPage from './pages/TrafficPage';
import AnalyzedPage from './pages/AnalyzedPage';
import RequestQueuePage from './pages/RequestQueuePage';
import DataPage from './pages/DataPage';
import ConfigPage from './pages/ConfigPage';
import RedirectPage from './pages/RedirectPage';
import PayloadPage from './pages/PayloadPage';
import ActiveAnalyzePage from './pages/ActiveAnalyzePage';
import PassiveAnalyzePage from './pages/PassiveAnalyzePage';
import TemplatePage from './pages/TemplatePage';
import VulnPage from './pages/VulnPage';
import AttackDashboard from './pages/AttackDashboard';

import ConfigDetail from './containers/Details/Config/ConfigDetail';
import LoadDefault from './containers/Details/Config/LoadDefault';
import PayloadDetail from './containers/Details/Payload/PayloadDetail';
import AddPayload from './containers/Details/Payload/AddPayload';
import AddPassive from './containers/Details/Payload/AddPassive';
import TemplateDetail from './containers/Details/Template/TemplateDetail';

import TrafficDetail from './containers/Details/Traffic/TrafficDetail';
import AnalyzedDetail from './containers/Details/Analyzed/AnalyzedDetail';
import ReqQueueDetail from './containers/Details/ReqQueue/ReqQueueDetail';
import VulnDetail from './containers/Details/Vuln/VulnDetail';


class App extends Component {

  render() {
    return (
      <>
        <TopBar />
        <Content>
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/redirect" component={RedirectPage} />
            {/* stateless page */}
            <PrivateRoute exact path="/" component={LandingPage} />
            <PrivateRoute exact path="/home" component={LandingPage} />
            <PrivateRoute exact path="/repos" component={RepoPage} />

            <PrivateRoute exact path="/data" component={DataPage} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute
              exact
              path="/attack"
              component={AttackDashboard}
            />
            {/* Stateful page */}

            <PrivateRoute
              exact
              path="/vulnerability"
              component={VulnPage}
            />

            <PrivateRoute
              exact
              path="/vulnerability/:vid/detail"
              component={VulnDetail}
            />

            <PrivateRoute
              exact
              path="/actives"
              component={ActiveAnalyzePage}
            />
            <PrivateRoute
              exact
              path="/actives/:aid/detail"
              component={ConfigDetail}
            />

            <PrivateRoute
              exact
              path="/passives"
              component={PassiveAnalyzePage}
            />
            <PrivateRoute
              exact
              path="/passives/new"
              component={AddPassive}
            />
            <PrivateRoute
              exact
              path="/passives/:aid/detail"
              component={ConfigDetail}
            />

            <PrivateRoute exact path="/template" component={TemplatePage} />

            <PrivateRoute
              exact
              path="/template/:tname/detail"
              component={TemplateDetail}
            />

            <PrivateRoute exact path="/config" component={ConfigPage} />
            <PrivateRoute
              exact
              path="/config/:cid/detail"
              component={ConfigDetail}
            />
            <PrivateRoute
              exact
              path="/config/default"
              component={LoadDefault}
            />

            <PrivateRoute
              exact
              path="/reqQueue"
              component={RequestQueuePage}
            />
            <PrivateRoute
              exact
              path="/reqQueue/:rid/detail"
              component={ReqQueueDetail}
            />

            <PrivateRoute exact path="/analyzed" component={AnalyzedPage} />
            <PrivateRoute
              exact
              path="/analyzed/:rid/detail"
              component={AnalyzedDetail}
            />

            <PrivateRoute exact path="/traffic" component={TrafficPage} />
            <PrivateRoute
              exact
              path="/traffic/:rid/detail"
              component={TrafficDetail}
            />

            <PrivateRoute exact path="/payload" component={PayloadPage} />
            <PrivateRoute
              exact
              path="/payload/:pid/detail"
              component={PayloadDetail}
            />
            <PrivateRoute
              exact
              path="/payload/new"
              component={AddPayload}
            />
          </Switch>
        </Content>
      </>
    );
  }
}

export default inject('sessStore', 'axiosStore')(observer(App));
