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

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.openmrs.Location;
import org.openmrs.api.APIException;
import org.openmrs.api.context.Context;
import org.openmrs.module.cflcharts.report.LocationBasedReportData;
import org.openmrs.module.cflcharts.report.ReportMetadata;
import org.openmrs.module.reporting.dataset.DataSet;
import org.openmrs.module.reporting.report.ReportData;
import org.openmrs.module.reporting.report.definition.ReportDefinition;
import org.openmrs.module.reporting.report.definition.service.ReportDefinitionService;
import org.openmrs.module.webservices.rest.web.RequestContext;
import org.openmrs.module.webservices.rest.web.RestConstants;
import org.openmrs.module.webservices.rest.web.annotation.PropertyGetter;
import org.openmrs.module.webservices.rest.web.annotation.Resource;
import org.openmrs.module.webservices.rest.web.representation.DefaultRepresentation;
import org.openmrs.module.webservices.rest.web.representation.RefRepresentation;
import org.openmrs.module.webservices.rest.web.representation.Representation;
import org.openmrs.module.webservices.rest.web.resource.api.PageableResult;
import org.openmrs.module.webservices.rest.web.resource.impl.DelegatingResourceDescription;
import org.openmrs.module.webservices.rest.web.resource.impl.NeedsPaging;
import org.openmrs.module.webservices.rest.web.response.ResponseException;

@Resource(name = RestConstants.VERSION_1 + "/cflcharts/reportdata", supportedClass = ReportMetadata.class,
    supportedOpenmrsVersions = {"1.8.*", "1.9.*, 1.10.*, 1.11.*", "1.12.*", "2.0.*", "2.1.*", "2.2.*", "2.3.*", "2.4.*"})
public class LocationBasedEvaluatedReportDefinitionResource extends LocationBasedEvaluatedResource<LocationBasedReportData> {

  @Override
  public DelegatingResourceDescription getRepresentationDescription(Representation rep) {
    DelegatingResourceDescription description = null;

    if (rep instanceof DefaultRepresentation) {
      description = new DelegatingResourceDescription();
      description.addProperty("uuid");
      description.addProperty("dataSets");
      description.addProperty("context");
      description.addProperty("definition");
      description.addProperty("locations");
      description.addSelfLink();
    } else if (rep instanceof RefRepresentation) {
      description = new DelegatingResourceDescription();
      description.addProperty("uuid");
      description.addProperty("dataSets");
      description.addProperty("context");
      description.addProperty("definition");
      description.addSelfLink();
      description.addLink("full", ".?v=" + RestConstants.REPRESENTATION_FULL);
    }

    return description;
  }

  @Override
  protected PageableResult doGetAll(RequestContext context) throws ResponseException {

    List<Object> allResults = new ArrayList<>();
    ReportDefinitionService reportDefinitionService = Context.getService(ReportDefinitionService.class);
    List<ReportDefinition> reportDefinitions = reportDefinitionService.getAllDefinitions(false);

    for (ReportDefinition reportDefinition : reportDefinitions) {
      try {
        Object result = retrieve(reportDefinition.getUuid(), context);
        allResults.add(result);
      } catch (ResponseException e) {
        throw new APIException("Failed to evaluate report definition", e);
      }
    }

    return new NeedsPaging<>(allResults, context);
  }

  @PropertyGetter("dataSets")
  public List<DataSet> getDataSets(ReportData delegate) {
    return new ArrayList<>(delegate.getDataSets().values());
  }

  @Override
  protected Object getResourceRepresentation(Representation representation, Set<Location> currentLocations,
                                             ReportData reportData) {
    final LocationBasedReportData locationBasedReportData = new LocationBasedReportData(reportData, currentLocations);
    return asRepresentation(locationBasedReportData, representation);
  }
}
