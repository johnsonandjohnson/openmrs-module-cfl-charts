/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { combineReducers } from 'redux';
import settings from './setttings';
import { reducers as openmrsReducers } from '@openmrs/react-components';
import { reducer as reduxFormReducer } from 'redux-form';
import customizeReducer, {CustomizeState} from '../components/customize/customize.reducer';
import reports from './data-visualization-configuration';
import { IDataVisualizationConfigurationState } from '../shared/models/data-visualization';
import role from './role';
import session from './session';

export interface IRootState {
  readonly openmrs: any;
  readonly settings: any;
  readonly customizeReducer: CustomizeState;
  readonly reports: IDataVisualizationConfigurationState;
  readonly form: any;
  readonly role: any;
  readonly session: any;
}

export default combineReducers<IRootState>({
  settings,
  customizeReducer,
  reports,
  openmrs: openmrsReducers,
  form: reduxFormReducer,
  role,
  session
});
