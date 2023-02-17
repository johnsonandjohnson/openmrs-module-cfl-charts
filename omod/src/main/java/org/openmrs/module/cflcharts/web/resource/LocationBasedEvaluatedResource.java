/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

package org.openmrs.module.cflcharts.web.resource;

import org.openmrs.Location;
import org.openmrs.api.APIException;
import org.openmrs.api.LocationService;
import org.openmrs.api.context.Context;
import org.openmrs.api.context.UserContext;
import org.openmrs.module.reporting.definition.DefinitionContext;
import org.openmrs.module.reporting.evaluation.Evaluated;
import org.openmrs.module.reporting.evaluation.EvaluationContext;
import org.openmrs.module.reporting.evaluation.EvaluationException;
import org.openmrs.module.reporting.report.ReportData;
import org.openmrs.module.reporting.report.definition.ReportDefinition;
import org.openmrs.module.reporting.report.definition.service.ReportDefinitionService;
import org.openmrs.module.reportingrest.web.resource.EvaluatedResource;
import org.openmrs.module.webservices.rest.web.RequestContext;
import org.openmrs.module.webservices.rest.web.representation.Representation;
import org.openmrs.module.webservices.rest.web.response.ObjectNotFoundException;
import org.openmrs.module.webservices.rest.web.response.ResponseException;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public abstract class LocationBasedEvaluatedResource<T extends Evaluated> extends EvaluatedResource<T> {
  private static final String LOCATION_IDS_REPORT_PARAMETER = "locationIds";

  @Override
  public Object retrieve(String uuid, RequestContext requestContext) throws ResponseException {
    final ReportDefinitionService reportDefinitionService = DefinitionContext.getReportDefinitionService();
    final ReportDefinition definition = getDefinitionByUniqueId(reportDefinitionService, ReportDefinition.class, uuid);

    if (definition == null) {
      throw new ObjectNotFoundException();
    }

    final Set<Location> currentLocations = getCurrentLocations();
    final EvaluationContext evalContext = getLocationBasedEvaluationContext(currentLocations);

    try {
      final ReportData reportData = (ReportData) evaluate(definition, reportDefinitionService, evalContext);
      return getResourceRepresentation(requestContext.getRepresentation(), currentLocations, reportData);
    } catch (EvaluationException e) {
      throw new APIException("Failed to evaluate report definition", e);
    }
  }

  protected abstract Object getResourceRepresentation(Representation representation, Set<Location> currentLocations,
                                                      ReportData reportData);

  protected EvaluationContext newEvaluationContext() {
    return new EvaluationContext();
  }

  private EvaluationContext getLocationBasedEvaluationContext(Set<Location> currentLocations) {
    final EvaluationContext evalContext = newEvaluationContext();
    evalContext.getParameterValues().put(LOCATION_IDS_REPORT_PARAMETER, currentLocations);
    return evalContext;
  }

  private Set<Location> getCurrentLocations() {
    final UserContext userContext = Context.getUserContext();

    if (!userContext.isAuthenticated()) {
      return Collections.emptySet();
    }

    final LocationService locationService = Context.getLocationService();

    if (userContext.getAuthenticatedUser().isSuperUser()) {
      return new HashSet<>(locationService.getAllLocations());
    }

    return Collections.singleton(userContext.getLocation());
  }
}
