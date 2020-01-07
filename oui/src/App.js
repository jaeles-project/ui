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
import WorkspacesPage from './pages/WorkspacesPage';
import LogsPage from './pages/LogsPage';
import ReportsPage from './pages/ReportsPage';
import ExecutePage from './pages/ExecutePage';
import SignaturePage from './pages/SignaturePage';
import ScanPage from './pages/ScanPage';
import ScanDetail from './pages/ScanDetail';
import SummaryPage from './pages/SummaryPage';
import RecordDetail from './pages/RecordDetailPage';

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
import FlowsPage from './pages/FlowsPage';
import DeletePage from './pages/DeletePage';
import FlowDetail from './containers/Details/Flows/FlowDetail';
import ModuleDetail from './containers/Details/Flows/ModuleDetail';


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
            {/* <PrivateRoute exact path="/report" component={ReportsPage} /> */}
            <PrivateRoute exact path="/execute" component={ExecutePage} />
            <PrivateRoute exact path="/workspaces" component={WorkspacesPage} />
            <PrivateRoute exact path="/flows" component={FlowsPage} />
            <PrivateRoute
              exact
              path="/reports/:wsname/"
              component={ReportsPage}
            />
            <PrivateRoute
              exact
              path="/summary/:wsname/"
              component={SummaryPage}
            />
            <PrivateRoute exact path="/flow/:fname/" component={FlowDetail} />
            <PrivateRoute
              exact
              path="/module/:fname/:mname/"
              component={ModuleDetail}
            />

            <PrivateRoute exact path="/delete" component={DeletePage} />

            <PrivateRoute exact path="/signatures" component={SignaturePage} />
            <PrivateRoute exact path="/scans" component={ScanPage} />
            <PrivateRoute exact path="/scan/:sid/" component={ScanDetail} />
            <PrivateRoute
              exact
              path="/record/:sid/:rid/"
              component={RecordDetail}
            />
            {/* <PrivateRoute exact path="/summary" component={SummaryPage} /> */}
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/attack" component={AttackDashboard} />
            {/* Stateful page */}
          </Switch>
        </Content>
      </>
    );
  }
}

export default inject('sessStore', 'axiosStore')(observer(App));
