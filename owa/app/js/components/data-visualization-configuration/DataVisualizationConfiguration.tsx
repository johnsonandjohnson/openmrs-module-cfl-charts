/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import DataVisualizationConfigurationBlock from './DataVisualizationConfigurationBlock';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button, Spinner } from 'reactstrap';
import { getSettingByQuery, createSetting, updateSetting } from '../../reducers/setttings';
import { getRoles } from '../../reducers/role';
import {
  getReportMetadata,
  addReportConfigurationBlock,
  initialUpdateReportsConfiguration,
  setShowValidationErrors
} from '../../reducers/data-visualization-configuration';
import {
  REPORTS_CONFIGURATION,
  CHART_DESCRIPTION_KEY,
  FILTER_BY_KEY,
  SELECT_ROLES_KEY,
  CONFIGURE_METADATA_URL
} from '../../shared/constants/data-visualization-configuration';
import { IDataVisualizationConfigurationState, IReportList } from '../../shared/models/data-visualization';
import { ISettingsState } from '../../shared/models/settings';
import { omit } from 'lodash';
import { EMPTY_STRING } from '../../shared/constants/input';
import { errorToast, successToast } from '../toast-handler/toast-handler';
import '../../../css/Inputs.scss';

interface IStore {
  settings: ISettingsState;
  reports: IDataVisualizationConfigurationState;
}

const DataVisualizationConfiguration = ({
  reportsConfiguration,
  reportsList,
  loading,
  getAllReports,
  isConfigurationExist,
  settingUuid,
  configurationSetting,
  initialUpdate,
  success,
  getSettingByQuery,
  getReportMetadata,
  addReportConfigurationBlock,
  initialUpdateReportsConfiguration,
  setShowValidationErrors,
  updateSetting,
  createSetting,
  getRoles,
  intl
}: PropsWithIntl<StateProps & DispatchProps>) => {

  useEffect(() => {
    getSettingByQuery(REPORTS_CONFIGURATION);
    getRoles();
  }, [getSettingByQuery]);

  useEffect(() => {
    if (!loading && !getAllReports) {
      getReportMetadata();
    }
  }, [loading, getAllReports, getReportMetadata]);

  useEffect(() => {
    if (configurationSetting.length && !loading && getAllReports && !initialUpdate) {
      initialUpdateReportsConfiguration(configurationSetting);
    }
  }, [configurationSetting, getAllReports, initialUpdate, loading, initialUpdateReportsConfiguration]);

  useEffect(() => {
    success && successToast(intl.formatMessage({ id: 'cflcharts.configurationSavedSuccessfully' }));
  }, [success]);

  const onReturn = () => (window.location.href = CONFIGURE_METADATA_URL);

  const onSave = () => {
    let showValidationErrors = false;

    reportsConfiguration.forEach(report => {
      const omittedOptional = omit(report, [CHART_DESCRIPTION_KEY, FILTER_BY_KEY, SELECT_ROLES_KEY]);

      Object.keys(omittedOptional).forEach(key => {
        if (omittedOptional[key] === EMPTY_STRING) {
          showValidationErrors = true;
        }
      });

      if (report.configFilters?.length > 0) {
        report.configFilters = report.configFilters.filter(filter => !!filter.name && !!filter.label);
      } else {
        report.configFilters = [{ name: EMPTY_STRING, label: EMPTY_STRING }]
      }
    });

    setShowValidationErrors(showValidationErrors);

    if (showValidationErrors) {
      return errorToast(intl.formatMessage({ id: 'cflcharts.configurationNotSaved' }));
    }

    if (isConfigurationExist) {
      const dataToSave = {
        uuid: settingUuid,
        value: JSON.stringify(reportsConfiguration)
      };
      updateSetting(dataToSave);
    } else {
      createSetting(REPORTS_CONFIGURATION, JSON.stringify(reportsConfiguration));
    }
  };

  return (
    <div className="data-visualization-configuration">
      <FormattedMessage id="cflcharts.configuration" tagName="h1" />
      {!getAllReports ? (
        <div className="spinner">
          <Spinner />
        </div>
      ) : (
        <div className="inner-content">
          {reportsConfiguration.map((reportConfig, idx) => {
            const currentReportData = reportsList.find(({ uuid }) => reportConfig.uuid === uuid) as IReportList;
            return (
              <DataVisualizationConfigurationBlock
                key={`${reportConfig?.uuid}-${idx}`}
                reportIdx={idx}
                reportConfig={reportConfig}
                reportData={currentReportData}
              />
            );
          })}
          <div className="d-flex justify-content-end mt-4 mb-2">
            <Button className="btn btn-primary" onClick={addReportConfigurationBlock}>
              <FormattedMessage id="cflcharts.addNewReport" />
            </Button>
          </div>
          <div className="mt-5 pb-5">
            <div className="d-inline">
              <Button className="cancel" onClick={onReturn}>
                <FormattedMessage id="common.return" />
              </Button>
            </div>
            <div className="d-inline pull-right confirm-button-container">
              <Button className="save" onClick={onSave}>
                <FormattedMessage id="common.save" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({
  settings: {
    settings,
    setting,
    loading: settingLoading,
    isSettingExist: { value: isConfigurationExist },
    success
  },
  reports: {
    reportsList,
    loading: reportsLoading,
    reportsConfiguration,
    success: { getAllReports },
    initialUpdate
  }
}: IStore) => ({
  loading: settingLoading || reportsLoading,
  reportsList,
  reportsConfiguration,
  getAllReports,
  settings,
  isConfigurationExist,
  settingUuid: setting?.uuid,
  configurationSetting: setting?.value ? JSON.parse(setting.value) : [],
  initialUpdate,
  success
});

const mapDispatchToProps = {
  getSettingByQuery,
  getReportMetadata,
  addReportConfigurationBlock,
  initialUpdateReportsConfiguration,
  setShowValidationErrors,
  updateSetting,
  createSetting,
  getRoles
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(DataVisualizationConfiguration));
