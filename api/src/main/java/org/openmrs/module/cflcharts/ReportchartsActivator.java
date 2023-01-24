/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

package org.openmrs.module.cflcharts;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.GlobalProperty;
import org.openmrs.api.context.Context;
import org.openmrs.module.BaseModuleActivator;

/**
 * This class contains the logic that is run every time this module is either started or shutdown
 */
public class ReportchartsActivator extends BaseModuleActivator {

  private static final Log LOGGER = LogFactory.getLog(ReportchartsActivator.class);

  @Override
  public void started() {
    createGlobalSettingIfNotExists(
        ChartsConstants.REPORTS_FOR_DATA_VISUALIZATION_CONFIGURATION_PROPERTY_NAME,
        ChartsConstants.REPORTS_FOR_DATA_VISUALIZATION_CONFIGURATION_PROPERTY_DEFAULT_VALUE,
        ChartsConstants.REPORTS_FOR_DATA_VISUALIZATION_CONFIGURATION_PROPERTY_DESC);

    LOGGER.info("Started CfL Charts");
  }

  @Override
  public void stopped() {
    LOGGER.info("Stopped CfL Charts");
  }

  private void createGlobalSettingIfNotExists(String key, String value, String description) {
    final String existingSetting = Context.getAdministrationService().getGlobalProperty(key);
    if (StringUtils.isBlank(existingSetting)) {
      GlobalProperty gp = new GlobalProperty(key, value, description);
      Context.getAdministrationService().saveGlobalProperty(gp);
    }
  }
}
