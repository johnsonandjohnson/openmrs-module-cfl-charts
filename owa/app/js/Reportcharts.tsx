/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import Routes from './Routes';
import initStore, {history} from './config/redux-store';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';
import {toast} from 'react-toastify';
import {loadIcons} from './config/icon-loader';
import 'react-toastify/dist/ReactToastify.css';
import '@openmrs/style-referenceapplication/lib/referenceapplication.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-3/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/font-awesome.min.css';
import '../css/Inputs.scss';
import '../css/Reportcharts.scss';
import 'babel-polyfill';
import TranslationProvider from "./components/translation/translation-provider";
import Customize from './components/customize/customize';

loadIcons();
toast.configure();
const store = initStore();

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <>
        <Customize />
        <TranslationProvider>
          {Routes()}
        </TranslationProvider>
      </>
    </ConnectedRouter>
  </Provider>
, document.getElementById('app'));
