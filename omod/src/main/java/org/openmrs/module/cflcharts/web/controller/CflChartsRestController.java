/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

package org.openmrs.module.cflcharts.web.controller;

import org.openmrs.module.webservices.rest.web.RestConstants;
import org.openmrs.module.webservices.rest.web.v1_0.controller.MainResourceController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Namespace for all Resources in this module.
 */
@Controller
@RequestMapping("/rest/" + RestConstants.VERSION_1 + CflChartsRestController.REPORTING_REST_NAMESPACE)
public class CflChartsRestController extends MainResourceController {

  public static final String REPORTING_REST_NAMESPACE = "/cflcharts";

  /**
   * @see org.openmrs.module.webservices.rest.web.v1_0.controller.BaseRestController#getNamespace()
   */
  @Override
  public String getNamespace() {
    return RestConstants.VERSION_1 + REPORTING_REST_NAMESPACE;
  }
}
