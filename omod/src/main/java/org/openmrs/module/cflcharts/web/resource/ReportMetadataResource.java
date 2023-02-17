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
import org.openmrs.module.cflcharts.report.ReportMetadata;
import org.openmrs.module.reporting.dataset.DataSet;
import org.openmrs.module.reporting.evaluation.EvaluationContext;
import org.openmrs.module.reporting.report.ReportData;
import org.openmrs.module.webservices.rest.web.RestConstants;
import org.openmrs.module.webservices.rest.web.annotation.PropertyGetter;
import org.openmrs.module.webservices.rest.web.annotation.Resource;
import org.openmrs.module.webservices.rest.web.representation.DefaultRepresentation;
import org.openmrs.module.webservices.rest.web.representation.Representation;
import org.openmrs.module.webservices.rest.web.resource.impl.DelegatingResourceDescription;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * The Resource works similar to Report REST EvaluatedReportDefinitionResource, but it doesn't return any data, just
 * metadata, e.g.: what columns are included in a related SQL DataSet.
 */
@Resource(name = RestConstants.VERSION_1 + "/cflcharts/reportmetadata", supportedClass = ReportMetadata.class,
    supportedOpenmrsVersions = {"1.8.*", "1.9.*, 1.10.*, 1.11.*", "1.12.*", "2.0.*", "2.1.*", "2.2.*", "2.3.*", "2.4.*"})
public class ReportMetadataResource extends LocationBasedEvaluatedResource<ReportMetadata> {

  @Override
  public DelegatingResourceDescription getRepresentationDescription(Representation representation) {
    DelegatingResourceDescription description = null;

    if (representation instanceof DefaultRepresentation) {
      description = new DelegatingResourceDescription();
      description.addProperty("uuid");
      description.addProperty("dataSets");
      description.addProperty("context");
      description.addProperty("definition");
      description.addSelfLink();
    }

    return description;
  }

  @PropertyGetter("dataSets")
  public List<DataSet> getDataSets(ReportMetadata delegate) {
    return new ArrayList<>(delegate.getDataSets().values());
  }

  @Override
  protected EvaluationContext newEvaluationContext() {
    final EvaluationContext evaluationContext = new EvaluationContext();
    evaluationContext.setLimit(1);
    return evaluationContext;
  }

  @Override
  protected Object getResourceRepresentation(Representation representation, Set<Location> currentLocations,
                                             ReportData reportData) {
    return asRepresentation(new ReportMetadata(reportData), representation);
  }
}
