/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {createHashHistory} from 'history';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {ROOT_URL} from '../../shared/constants/openmrs';
import {
  CONFIGURATION_URL_HASH,
  VISUALIZATION_URL_HASH
} from '../../shared/constants/data-visualization-configuration';

const Breadcrumb = () => {
  const {location: {pathname}} = createHashHistory();

  const renderDelimiter = () => (
    <span className="breadcrumb-link-item breadcrumb-delimiter">
      <FontAwesomeIcon size="sm" icon={['fas', 'chevron-right']}/>
    </span>
  );

  const renderHomeCrumb = () => (
    <>
      <a href={ROOT_URL} className="breadcrumb-link-item home-crumb"/>
      {renderDelimiter()}
    </>
  );

  const renderCrumbs = () => {
    switch (pathname) {
      case CONFIGURATION_URL_HASH:
        return (
          <span className="breadcrumb-last-item">
            <FormattedMessage id="cflcharts.configuration"/>
          </span>
        );
      case VISUALIZATION_URL_HASH:
        return (
          <span className="breadcrumb-last-item">
            <FormattedMessage id="cflcharts.visualization"/>
          </span>
        );
      default:
        return (
          <span className="breadcrumb-last-item">
            <FormattedMessage id="cflcharts.title"/>
          </span>
        );
    }
  };

  return (
    <div id="breadcrumbs" className="breadcrumb">
      {renderHomeCrumb()}
      {renderCrumbs()}
    </div>
  );
};

export default Breadcrumb;
