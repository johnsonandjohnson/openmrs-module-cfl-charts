package org.openmrs.module.cflcharts;

public final class ChartsConstants {

  public static final String REPORTS_FOR_DATA_VISUALIZATION_CONFIGURATION_PROPERTY_NAME =
      "cflui.reportsForDataVisualizationConfiguration.uuid.list";

  public static final String REPORTS_FOR_DATA_VISUALIZATION_CONFIGURATION_PROPERTY_DESC =
      "Array of uuid reports needed for data visualization configuration page. Default value: []";

  public static final String REPORTS_FOR_DATA_VISUALIZATION_CONFIGURATION_PROPERTY_DEFAULT_VALUE = "[]";

  public static final String VIEW_CHARTS_PRIVILEGE_NAME = "View Charts";

  public static final String VIEW_CHARTS_PRIVILEGE_DESCRIPTION = "Able to see charts page";

  public static final String CONFIGURE_CHARTS_PRIVILEGE_NAME = "Configure Charts";

  public static final String CONFIGURE_CHARTS_PRIVILEGE_DESCRIPTION = "Able to configure charts";

  private ChartsConstants() {
    // constants-only class
  }
}
