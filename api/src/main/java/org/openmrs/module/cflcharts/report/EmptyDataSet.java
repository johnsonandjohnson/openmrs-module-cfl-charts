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
import org.openmrs.module.reporting.dataset.DataSetMetaData;
import org.openmrs.module.reporting.dataset.DataSetRow;
import org.openmrs.module.reporting.dataset.definition.DataSetDefinition;
import org.openmrs.module.reporting.evaluation.EvaluationContext;

import java.util.Collections;
import java.util.Iterator;

/**
 * The EmptyDataSet Class, is a DataSet with only metadata included.
 */
public class EmptyDataSet implements DataSet {
  private final DataSetMetaData dataSetMetaData;
  private final DataSetDefinition dataSetDefinition;
  private final EvaluationContext evaluationContext;

  public EmptyDataSet(DataSet dataSet) {
    this.dataSetMetaData = dataSet.getMetaData();
    this.dataSetDefinition = dataSet.getDefinition();
    this.evaluationContext = dataSet.getContext();
  }

  @Override
  public Iterator<DataSetRow> iterator() {
    return Collections.emptyIterator();
  }

  @Override
  public DataSetMetaData getMetaData() {
    return dataSetMetaData;
  }

  @Override
  public DataSetDefinition getDefinition() {
    return dataSetDefinition;
  }

  @Override
  public EvaluationContext getContext() {
    return evaluationContext;
  }
}
