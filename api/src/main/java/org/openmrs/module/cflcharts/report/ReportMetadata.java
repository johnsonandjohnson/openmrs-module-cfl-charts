/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

package org.openmrs.module.cflcharts.report;

import org.openmrs.module.reporting.dataset.DataSet;
import org.openmrs.module.reporting.evaluation.Evaluated;
import org.openmrs.module.reporting.evaluation.EvaluationContext;
import org.openmrs.module.reporting.report.ReportData;
import org.openmrs.module.reporting.report.definition.ReportDefinition;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * A ReportMetadata Class, is a ReportData but without actual report data, only with metadata.
 */
public class ReportMetadata implements Evaluated<ReportDefinition> {
  private ReportDefinition definition;
  private EvaluationContext context;
  private Map<String, DataSet> dataSets;

  public ReportMetadata(ReportData reportData) {
    this.definition = reportData.getDefinition();
    this.context = reportData.getContext();
    this.dataSets = reportData
        .getDataSets()
        .entrySet()
        .stream()
        .collect(Collectors.toMap(Map.Entry::getKey, entry -> new EmptyDataSet(entry.getValue())));
  }

  @Override
  public ReportDefinition getDefinition() {
    return definition;
  }

  @Override
  public EvaluationContext getContext() {
    return context;
  }

  public Map<String, DataSet> getDataSets() {
    if (this.dataSets == null) {
      this.dataSets = new LinkedHashMap<>();
    }

    return this.dataSets;
  }

  public void setDefinition(ReportDefinition definition) {
    this.definition = definition;
  }

  public void setContext(EvaluationContext context) {
    this.context = context;
  }

  public void setDataSets(Map<String, DataSet> dataSets) {
    this.dataSets = dataSets;
  }
}
