import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import FullAside from './FullAside';
import FullFooter from './FullFooter';
import FullHeader from './FullHeader';
import {About} from '../../components/others/About';
import Home from '../../components/others/Home';
import ProjectDetails from '../../components/Projects/ProjectDetails';
import NewProject from '../../components/Projects/NewProject';
import NewTask from '../../components/tasks/NewTask';
import UserProfile from '../../components/users/UserProfile';
import TaskDetails from '../../components/tasks/TaskDetails';
import Conversation from '../../components/conversations/Conversation';
import {Topics} from '../../components/others/Topics';
import {loggingStatus} from '../../lib/authenticationService';
import config from '../../config';

class Full extends Component {

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <FullHeader {...this.props}/>
        </AppHeader>
        <div className="app-body">
          {/*<AppSidebar fixed display="lg">*/}
            {/*<AppSidebarHeader />*/}
            {/*<AppSidebarForm />*/}
            {/*<AppSidebarNav navConfig={navigation} {...this.props} />*/}
            {/*<AppSidebarFooter />*/}
            {/*<AppSidebarMinimizer />*/}
          {/*</AppSidebar>*/}
          <main className="main">
            {/*<AppBreadcrumb appRoutes={routes}/>*/}
            <Container fluid>
              <Switch>
                {routes.map((route, idx) => {
                    return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                        <route.component {...props} />
                      )} />)
                      : (null);
                  },
                )}
                <Route exact path="/" component={Home}/>
                <Route exact path="/about" component={About}/>
                <Route exact path="/projects/:id" component={ProjectDetails}/>
                <Route exact path="/project/new" component={NewProject}/>
                <Route exact path="/:projectId/tasks/new/:parentTaskId" component={NewTask}/>
                <Route exact path="/users/:id" component={UserProfile}/>
                <Route exact path="/tasks/:id" component={TaskDetails}/>
                <Route exact path="/conversation" component={Conversation}/>
                {/*<Redirect from="/" to="/dashboard" />*/}
              </Switch>
            </Container>
          </main>
          <AppAside fixed hidden>
            <FullAside />
          </AppAside>
        </div>
        <AppFooter>
          <FullFooter />
        </AppFooter>
      </div>
    );
  }
}

export default Full;
