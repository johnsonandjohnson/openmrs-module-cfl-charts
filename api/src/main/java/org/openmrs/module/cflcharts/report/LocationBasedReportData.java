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

import org.openmrs.Location;
import org.openmrs.module.reporting.report.ReportData;

import java.util.Set;

/**
 * The LocationBasedReportData Class, is a ReportData with a set of locations it was calculated for.
 */
public class LocationBasedReportData extends ReportData {
  private Set<Location> locations;

  public LocationBasedReportData(ReportData reportData, Set<Location> locations) {
    setContext(reportData.getContext());
    setDataSets(reportData.getDataSets());
    setDefinition(reportData.getDefinition());
    this.locations = locations;
  }

  public Set<Location> getLocations() {
    return locations;
  }

  public void setLocations(Set<Location> locations) {
    this.locations = locations;
  }
}
