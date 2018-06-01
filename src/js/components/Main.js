import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from 'grommet/components/App';
import Split from 'grommet/components/Split';
import PrintProvider, { NoPrint } from 'react-easy-print';


import NavSidebar from './NavSidebar';
import { navResponsive } from '../actions/nav';

import Login from '../screens/Login';
import Dashboard from '../screens/Dashboard';
import Visitors from '../screens/Tasks';
import Visitor from '../screens/Visitor';
import NewVisitor from '../screens/NewVisitor';
import VisitorOut from '../screens/VisitorOut';
import Map from '../screens/Map';
import Item from '../screens/Item';
import NewItem from '../screens/NewItem';
import Items from '../screens/Items';
import Vehicle from '../screens/Vehicle';
import NewVehicle from '../screens/NewVehicle';
import Vehicles from '../screens/Vehicles';
import LabourDashboard from '../screens/LDashboard';
import Employees from '../screens/Employees';
import Employee from '../screens/Employee';
import NewEmployee from '../screens/NewEmployee';
import Attendance from '../screens/Attendance';
import NotFound from '../screens/NotFound';

class Main extends Component {
  constructor() {
    super();
    this._onResponsive = this._onResponsive.bind(this);
  }

  _onResponsive(responsive) {
    this.props.dispatch(navResponsive(responsive));
  }

  render() {
    const {
      nav: { active: navActive, enabled: navEnabled, responsive }
    } = this.props;
    const includeNav = (navActive && navEnabled);
    let nav;
    if (includeNav) {
      nav = <NavSidebar />;
    }
    const priority = (includeNav && responsive === 'single' ? 'left' : 'right');

    return (
      <App centered={false}>
        <PrintProvider>
          <NoPrint>
            <Router>
              <Split
                priority={priority}
                flex='right'
                onResponsive={this._onResponsive}
              >
                {nav}
                <Switch>
                  <Route exact={true} path='/' component={Login} />
                  <Route path='/attendance' component={Attendance} />
                  <Route path='/dashboard' component={Dashboard} />
                  <Route path='/login' component={Login} />
                  <Route path='/visitor/:id' component={Visitor} />
                  <Route path='/visitors' component={Visitors} />
                  <Route path='/new/visitor' component={NewVisitor} />
                  <Route path='/out/visitor' component={VisitorOut} />
                  <Route path='/employee/:id' component={Employee} />
                  <Route path='/employees' component={Employees} />
                  <Route path='/new/employee' component={NewEmployee} />
                  <Route path='/map' component={Map} />
                  <Route path='/item/:id' component={Item} />
                  <Route path='/new/item' component={NewItem} />
                  <Route path='/items' component={Items} />
                  <Route path='/vehicle/:id' component={Vehicle} />
                  <Route path='/new/vehicle' component={NewVehicle} />
                  <Route path='/vehicles' component={Vehicles} />
                  <Route path='/dash/visitor' component={LabourDashboard} />
                  <Route path='/*' component={NotFound} />
                </Switch>
              </Split>
            </Router>
          </NoPrint>
        </PrintProvider>
      </App>
    );
  }
}

Main.defaultProps = {
  nav: {
    active: true, // start with nav active
    enabled: true, // start with nav disabled
    responsive: 'multiple'
  }
};

Main.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.shape({
    active: PropTypes.bool,
    enabled: PropTypes.bool,
    responsive: PropTypes.string
  })
};

const select = state => ({
  nav: state.nav
});

export default connect(select)(Main);
