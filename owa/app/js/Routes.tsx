/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react'
import LandingPage from './components/LandingPage';
import Customize from './components/customize/customize'
import DataVisualization from './components/data-visualization/DataVisialization';
import DataVisualizationConfiguration from './components/data-visualization-configuration/DataVisualizationConfiguration';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Header } from '@openmrs/react-components';

const Routes = () => (
  <>
    <Customize />
    <Header />
    <div className="body-wrapper">
      <Router>
        <Switch>
          <Route exact path="/configuration" component={DataVisualizationConfiguration} />
          <Route exact path="/visualization" component={DataVisualization} />
          <Route path="/" component={LandingPage} />
        </Switch>
      </Router>
    </div>
  </>
);

export default Routes;