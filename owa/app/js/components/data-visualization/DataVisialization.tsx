/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { useEffect, useState } from 'react';
import BarChart from './BarChart';
import LineChart from './LineChart';
import cx from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Spinner, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { getSettingByQuery } from '../../reducers/setttings';
import { ISettingsState } from '../../shared/models/settings';
import { getSession } from '../../reducers/session'
import { LINE_CHART, REPORTS_CONFIGURATION } from '../../shared/constants/data-visualization-configuration';
import { IDataVisualizationConfigurationState, IReportConfiguration, IReportData } from '../../shared/models/data-visualization';
import { initialUpdateReportsConfiguration, getReports, getReport } from '../../reducers/data-visualization-configuration';
import VisualizationInformationMessage from '../common/data-visualization/VisualizationInformationMessage';

interface IStore {
  settings: ISettingsState;
  reports: IDataVisualizationConfigurationState;
  session: any;
}

const DataVisualization = ({
  configurationSetting,
  loading,
  initialUpdate,
  reportsConfiguration,
  report,
  errorMessage,
  userRoles,
  reportLoading,
  getReport,
  getSettingByQuery,
  initialUpdateReportsConfiguration,
  getSession
}: StateProps & DispatchProps) => {
  const [activeTab, setActiveTab] = useState('0');
  const [retrievedReports, setRetrievedReports] = useState<any[]>([]);

  const authorizedReportConfigs = configurationSetting.filter(config => !config.roles || config.roles?.split(',')
    .some(chartRoleUuid => userRoles.map(userRole => userRole.uuid)
      .includes(chartRoleUuid)));

  useEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    getSettingByQuery(REPORTS_CONFIGURATION);
  }, [getSettingByQuery]);

  useEffect(() => {
    if (!loading && authorizedReportConfigs.length && !initialUpdate) {
      initialUpdateReportsConfiguration(authorizedReportConfigs);
    }
  }, [loading, authorizedReportConfigs, initialUpdate, initialUpdateReportsConfiguration]);

  useEffect(() => {
    if ((initialUpdate && !report) || report.uuid === '') {  
      const configuredReportsUuidList = reportsConfiguration.map(({ uuid }) => uuid);
      const firstReportUuid = configuredReportsUuidList[0];
      if (firstReportUuid) {
        getReport(firstReportUuid);
      }
    }
  }, [initialUpdate, report, reportsConfiguration, getReport]);

  useEffect(() => {
    if (report) {
      const isReportAlreadyRetrieved = retrievedReports.some(obj => obj.uuid === report.uuid);
      if (!isReportAlreadyRetrieved && report.uuid !== '') {
        setRetrievedReports([...retrievedReports, report]);
      }
    }
  }, [report]);

  const navItems = authorizedReportConfigs.map((config: IReportConfiguration, idx: number) => {
    return (
      <NavItem key={`${config.uuid}-${idx}`}>
        <NavLink 
          className={cx({ active: activeTab === `${idx}` })} 
          onClick={() =>  {
            setActiveTab(`${idx}`)
            const isReportAlreadyRetrieved = retrievedReports.some(obj => obj.uuid === config.uuid);
            if (!isReportAlreadyRetrieved) {
              getReport(config.uuid);
            }
          }}>
          {config.title}
        </NavLink>
      </NavItem>
    );
  });

  const tabPanes = authorizedReportConfigs.map((config: IReportConfiguration, idx: number) => {
    const { uuid, chartType } = config;
    const reportData = retrievedReports?.find(({ uuid: reportUuid }) => reportUuid === uuid)?.reportData as IReportData[];
    let chartComponent;

    switch (chartType) {
      case LINE_CHART:
        chartComponent = <LineChart report={reportData} config={config} chartIdx={idx} isActive={activeTab === `${idx}`} />;
        break;
      default:
        chartComponent = <BarChart report={reportData} config={config} isActive={activeTab === `${idx}`} />;
        break;
    }
    
    return (
      <TabPane key={`${uuid}-${idx}`} tabId={`${idx}`}>
        {chartComponent}
      </TabPane>
    );
  });

  return (
    <div className="data-visualization">
      <FormattedMessage id="cflcharts.visualization" tagName="h1" />
      {errorMessage ? (
        <VisualizationInformationMessage message="cflcharts.visualization.sqlError" />
      ) : loading || reportLoading ? (
        <div className="spinner">
          <Spinner />
        </div>
      ) : retrievedReports?.length === 0 || authorizedReportConfigs.length === 0 ? (
        <VisualizationInformationMessage message="cflcharts.visualization.noPermission" />
      ) : (
        <>
          <Nav tabs>{navItems}</Nav>
          <TabContent activeTab={activeTab}>{tabPanes}</TabContent>
        </>
      )}
    </div>
  );
};

const mapStateToProps = ({
  settings: { setting, loading },
  reports: { 
    initialUpdate, 
    reportsConfiguration, 
    report, 
    errorMessage,
    reportLoading
  },
  session: { userRoles }
}: IStore) => ({
  loading,
  configurationSetting: setting?.value ? JSON.parse(setting.value) : [],
  initialUpdate,
  reportsConfiguration,
  report,
  errorMessage,
  userRoles,
  reportLoading
});

const mapDispatchToProps = {
  getReport,
  getSettingByQuery,
  initialUpdateReportsConfiguration,
  getSession
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DataVisualization);
