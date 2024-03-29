/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { EMPTY_STRING } from './input';
import { ROOT_URL } from './openmrs';

export const REPORTS_UUID_LIST = 'cflui.reportsForDataVisualizationConfiguration.uuid.list';
export const REPORTS_CONFIGURATION = 'cflui.reportsDataVisualizationConfiguration';
export const REPORT_CHARTS_URL = `${ROOT_URL}owa/cflcharts/index.html#/`;
export const CONFIGURE_METADATA_URL = `${ROOT_URL}adminui/metadata/configureMetadata.page`;
export const HOME_PAGE_URL = `${ROOT_URL}cfl/home.page`;
export const CONFIGURATION_URL_HASH = '/configuration';
export const VISUALIZATION_URL_HASH = '/visualization';
export const REPORT_CHARTS = 'Report Charts';
export const CHART_TITLE_KEY = 'title';
export const CHART_TYPE_KEY = 'chartType';
export const CHART_X_AXIS_KEY = 'xAxis';
export const CHART_Y_AXIS_KEY = 'yAxis';
export const CHART_LEGEND_KEY = 'legend';
export const CHART_DESCRIPTION_KEY = 'description';
export const CHART_MARGIN_TOP_KEY = 'marginTop';
export const CHART_MARGIN_BOTTOM_KEY = 'marginBottom';
export const CHART_MARGIN_RIGHT_KEY = 'marginRight';
export const CHART_MARGIN_LEFT_KEY = 'marginLeft';
export const CHART_COLORS_KEY = 'colors';
export const LINE_CHART = 'Line Chart';
export const BAR_CHART = 'Bar Chart';
export const CHART_TYPE_OPTIONS = [
  { label: BAR_CHART, value: BAR_CHART },
  { label: LINE_CHART, value: LINE_CHART }
];
export const FILTER_BY_KEY = 'filterBy';
export const SELECT_ROLES_KEY = 'roles';
export const SHOW_TABLE_UNDER_GRAPH = 'showTableUnderGraph';
export const CHART_Y_AXIS_TYPE_KEY = 'yAxisNumbersType';
export const Y_AXIS_INTEGER_NUMBERS_KEY = 'Integer numbers type';
export const Y_AXIS_DECIMAL_NUMBERS_KEY = 'Decimal numbers type';
export const Y_AXIS_PERCENTAGE_NUMBERS_KEY = 'Percentage numbers type';
export const CHART_Y_AXIS_TYPE_OPTIONS = [
  { label: Y_AXIS_INTEGER_NUMBERS_KEY, value: Y_AXIS_INTEGER_NUMBERS_KEY },
  { label: Y_AXIS_DECIMAL_NUMBERS_KEY, value: Y_AXIS_DECIMAL_NUMBERS_KEY },
  { label: Y_AXIS_PERCENTAGE_NUMBERS_KEY, value: Y_AXIS_PERCENTAGE_NUMBERS_KEY }
];
export const FILTERS_KEY = 'configFilters';

export const DEFAULT_REPORT_CONFIGURATION = {
  uuid: EMPTY_STRING,
  name: EMPTY_STRING,
  [CHART_TITLE_KEY]: EMPTY_STRING,
  [CHART_TYPE_KEY]: EMPTY_STRING,
  [CHART_X_AXIS_KEY]: EMPTY_STRING,
  [CHART_Y_AXIS_KEY]: EMPTY_STRING,
  [CHART_LEGEND_KEY]: EMPTY_STRING,
  [CHART_DESCRIPTION_KEY]: EMPTY_STRING,
  [CHART_MARGIN_TOP_KEY]: 50,
  [CHART_MARGIN_BOTTOM_KEY]: 100,
  [CHART_MARGIN_RIGHT_KEY]: 30,
  [CHART_MARGIN_LEFT_KEY]: 60,
  [CHART_COLORS_KEY]: '#ea5545, #f46a9b, #ef9b20, #edbf33, #ede15b, #bdcf32, #87bc45, #27aeef, #b33dc6',
  [FILTER_BY_KEY]: EMPTY_STRING,
  [SELECT_ROLES_KEY]: EMPTY_STRING,
  [SHOW_TABLE_UNDER_GRAPH]: false,
  [CHART_Y_AXIS_TYPE_KEY]: Y_AXIS_INTEGER_NUMBERS_KEY,
  [FILTERS_KEY]: [{ name: '', label: '' }]
};
