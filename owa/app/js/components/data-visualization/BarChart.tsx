/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { useEffect, useRef, useState } from "react";
import { injectIntl } from "react-intl";
import * as d3 from "d3";
import useController from "./DataVisualizationController";
import ChartLegend from "./ChartLegend";
import XScale from "./XScale";
import YScale from "./YScale";
import Bars from "./Bars";
import { Button, Spinner } from "reactstrap";
import { FormattedMessage } from "react-intl";
import { HOME_PAGE_URL } from "../../shared/constants/data-visualization-configuration";
import { SelectWithPlaceholder } from "../common/form/withPlaceholder";
import { selectDefaultTheme } from "../../shared/util/form-util";
import { UIFilter, IReportConfiguration, IReportData } from "../../shared/models/data-visualization";
import { IOption } from "../../shared/models/option";
import ChartDescription from "./ChartDescription";
import ChartTitle from "./ChartTitle";
import ExportChartDataButton from "./ExportChartDataButton";
import SummaryChartTable from "./SummaryChartTable";
import { Switch } from "../common/switch/Switch";
import { DateRangePicker } from "react-dates";
import { DATE_FORMAT, MIN_HORIZONTAL_DATE_RANGE_PICKER_WIDTH } from "./constant";
import { getDefaultFilters, isDateFilter, sortInNaturalOrder } from "./CommonChartFunctions";
import _ from "lodash";
import moment from "moment";
import VisualizationInformationMessage from "../common/data-visualization/VisualizationInformationMessage";

interface IBarChart {
  isActive: boolean;
  report: IReportData[] | [];
  config: IReportConfiguration;
}

const BarChart = ({
  isActive,
  report,
  config: {
    xAxis,
    yAxis,
    legend,
    description,
    chartType,
    colors,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    title,
    showTableUnderGraph,
    yAxisNumbersType,
    configFilters,
  },
  intl,
}: PropsWithIntl<IBarChart>) => {
  const chartRef = useRef<SVGSVGElement>(null);
  const chartRefCurrent = chartRef.current;

  const [dataToDisplay, setDataToDisplay] = useState<IReportData[]>([]);
  const [legendTypes, setLegendTypes] = useState<string[]>([]);
  const [xAxsisTypes, setXAxsisTypes] = useState<string[]>([]);
  const [filterByLegend, setFilterByLegend] = useState<string[]>([]);
  const [filterByXAxsis, setFilterByXAxsis] = useState<string[]>([]);
  const [chartWidth, setChartWidth] = useState<number>(0);
  const [chartHeight, setChartHeight] = useState<number>(0);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [allAvailableFilters, setAllAvailableFilters] = useState<UIFilter[]>([]);
  const [currentlySelectedFilters, setCurrentlySelectedFilters] = useState<UIFilter[]>([]);

  useEffect(() => {
    if (report?.length) {
      if (!legendTypes?.length) {
        const types = [...new Set(report.map((data) => `${data[legend]}`))].sort() as string[];

        setLegendTypes(types);
        setFilterByLegend(types);
      }

      if (!xAxsisTypes?.length) {
        const types = [...new Set(report.map((data) => `${data[xAxis]}`))];
        setXAxsisTypes(types);
      }

      if (legendTypes?.length && xAxsisTypes.length && !dataToDisplay?.length) {
        setCurrentlySelectedFilters(getDefaultFilters(configFilters, report, legend));
        const types = [...new Set(report.map((data) => `${data[legend]}`))].sort() as string[];
        setFilterByLegend(types);
        setDataToDisplay(report);
      }

      if (allAvailableFilters.length == 0) {
        setAllAvailableFilters(getDefaultFilters(configFilters, report, legend));
      }
    }
  }, [legendTypes, xAxsisTypes, report, legend, xAxis, dataToDisplay?.length, configFilters]);

  useEffect(() => {
    if (report?.length) {
      setCurrentlySelectedFilters(getDefaultFilters(configFilters, report, legend));
    }
  }, [report]);

  useEffect(() => {
    if (dataToDisplay?.length && isActive) {
      const width = parseInt(d3.select(".chart").style("width")) - marginLeft - marginRight;
      const height = parseInt(d3.select(".chart").style("height")) - marginTop - marginBottom;

      setChartWidth(width);
      setChartHeight(height);
    }
  }, [dataToDisplay, isActive, marginBottom, marginLeft, marginRight, marginTop]);

  const controller = useController({
    data: dataToDisplay,
    chartWidth,
    chartHeight,
    chartType,
    xAxis,
    yAxis,
    legend,
    legendTypes,
    colors,
    marginLeft,
    marginTop,
  });

  const { yScale, xScale, xSubgroup, colorsScaleOrdinal, groupedAndSummedDataByXAxis, groupedAndSummedDataByLegend } =
    controller;

  const handleOnChange = (options: IOption[], filter) => {
    const currentlySelectedOptions = options.map(({ value }) => value);

    prepareFiltersAndFilterData(currentlySelectedOptions, filter.name);
  };

  const prepareFiltersAndFilterData = (selectedOptions: string[], filterName: string) => {
    const updatedFilters = getUpdatedFilters(selectedOptions, filterName);
    setCurrentlySelectedFilters(updatedFilters);
    filterData(updatedFilters);
  };

  const getUpdatedFilters = (selectedOptions: string[], filterName: string) => {
    const filterValues = !selectedOptions.length
      ? allAvailableFilters.find((availableFilter) => availableFilter.name === filterName)?.value
      : selectedOptions;
    let clonedDataToDisplay = report.filter((data) => filterValues?.includes(data[filterName]));
    let updatedFilters = [...currentlySelectedFilters];

    if (!selectedOptions?.length) {
      updatedFilters = updatedFilters.map((filter) =>
        filter.name === filterName ? { ...filter, value: filterValues } : filter,
      ) as UIFilter[];
    } else {
      updatedFilters.forEach((filter) => {
        if (filter.name === filterName) {
          filter.value = selectedOptions;
        } else {
          if (!isDateFilter(filter)) {
            const filterValues = filter.value;
            const availableValues = [...new Set(clonedDataToDisplay.map((item) => item[filter.name]))];
            const filteredValues = filterValues.filter((value) => availableValues.includes(value));
            filter.value = filteredValues;
          }
        }
      });
    }

    return updatedFilters;
  };

  const filterData = (currentFilters) => {
    let clonedDataToDisplay = _.cloneDeep(report);

    currentFilters.forEach((currentFilter) => {
      clonedDataToDisplay = clonedDataToDisplay.filter((data) =>
        currentFilter.value.includes(data[currentFilter.name]),
      );
    });

    const currentLegendTyes = currentFilters.find((currentFilter) => currentFilter.name === legend)?.value as string[];

    setDataToDisplay(clonedDataToDisplay);
    setFilterByLegend(currentLegendTyes);
  };

  const handleLegendClick = (value: string) => {
    let clonedFilterByLegend = [...filterByLegend];

    if (clonedFilterByLegend.includes(value)) {
      clonedFilterByLegend = clonedFilterByLegend.filter((legend) => legend !== value);
    } else {
      clonedFilterByLegend.push(value);
    }

    prepareFiltersAndFilterData(clonedFilterByLegend, legend);

    if (!clonedFilterByLegend.length) {
      clonedFilterByLegend = legendTypes;
    }

    setFilterByLegend(clonedFilterByLegend.sort());
  };

  const handleShowTableSwitchOnChange = () => {
    setShowTable(() => !showTable);
  };

  const handleDatePickerFocusChange = (focusedInput, filterName) => {
    const updatedFilters = [...currentlySelectedFilters];
    const foundElement = updatedFilters.find((filter) => filter.name === filterName);
    if (foundElement) {
      foundElement.focusedDatePicker = focusedInput;
      setCurrentlySelectedFilters(updatedFilters);
    }
  };

  const handleDatesOnChange = (startDate, endDate, filterName) => {
    const updatedFilters = [...currentlySelectedFilters];
    const foundElement = updatedFilters.find((filter) => filter.name === filterName);
    if (foundElement) {
      foundElement.startDate = startDate;
      foundElement.endDate = endDate;

      const originalStringDates = allAvailableFilters.find((filter) => filter.name === filterName)?.value;
      const originalDatesAsDateObjects = originalStringDates?.map((dateString) => moment(dateString, DATE_FORMAT));

      const filteredDateObjects = originalDatesAsDateObjects?.filter((date) =>
        date.isBetween(
          moment(startDate, DATE_FORMAT).startOf("day"),
          moment(endDate, DATE_FORMAT).endOf("day"),
          null,
          "[]",
        ),
      );
      const filteredDates = filteredDateObjects?.map((date) => date.format(DATE_FORMAT)) as string[];

      foundElement.value = filteredDates;

      prepareFiltersAndFilterData(filteredDates, filterName);
    }
  };

  const renderFilters = () => {
    const filteredConfigFilters = configFilters.filter((filter) => filter.label !== "" || filter.name !== "");
    return (
      <>
        {filteredConfigFilters.map((configFilter) => {
          const filterName = configFilter.name;
          const filterField = currentlySelectedFilters.find((filter) => filter.name === filterName);
          const startDate = filterField?.startDate;
          const endDate = filterField?.endDate;

          if (isDateFilter(filterField)) {
            return (
              <>
                <div className="input-container">
                  <DateRangePicker
                    placeholder={configFilter.label}
                    startDate={startDate}
                    startDatePlaceholderText={configFilter.label}
                    endDate={endDate}
                    endDatePlaceholderText={configFilter.label}
                    onDatesChange={({ startDate, endDate }) => handleDatesOnChange(startDate, endDate, filterName)}
                    focusedInput={filterField?.focusedDatePicker}
                    onFocusChange={(focusedInput) => handleDatePickerFocusChange(focusedInput, filterName)}
                    showClearDates={true}
                    displayFormat={DATE_FORMAT}
                    hideKeyboardShortcutsPanel
                    isOutsideRange={() => false}
                    showDefaultInputIcon
                    orientation={
                      window.screen.availWidth > MIN_HORIZONTAL_DATE_RANGE_PICKER_WIDTH ? "horizontal" : "vertical"
                    }
                    small={window.screen.availWidth < MIN_HORIZONTAL_DATE_RANGE_PICKER_WIDTH}
                    disabled={false}
                    minimumNights={0}
                  />
                  {<span className="placeholder input-placeholder">{configFilter.label || ""}</span>}
                </div>
              </>
            );
          } else {
            const allOptions = allAvailableFilters.find((filter) => filter.name === filterName)?.value || [];
            const sortedAllOptions = allOptions
              .map((filterOption) => ({ label: filterOption, value: filterOption }))
              .sort(sortInNaturalOrder);

            const currentOptions = currentlySelectedFilters.find((filter) => filter.name === filterName)?.value || [];
            const sortedCurrentOptions = currentOptions
              .map((filterOption) => ({ label: filterOption, value: filterOption }))
              .sort(sortInNaturalOrder);

            return (
              sortedAllOptions.length > 0 && (
                <SelectWithPlaceholder
                  name={filterName}
                  placeholder={configFilter.label}
                  showPlaceholder={!!allOptions.length}
                  options={sortedAllOptions}
                  value={sortedCurrentOptions}
                  onChange={handleOnChange}
                  defaultValue={sortedAllOptions}
                  isMulti
                  classNamePrefix="default-select"
                  theme={selectDefaultTheme}
                />
              )
            );
          }
        })}
      </>
    );
  };

  return (
    <div className="chart">
      {!dataToDisplay.length ? (
        <VisualizationInformationMessage message="cflcharts.visualization.noData" />
      ) : (
        <>
          <div className="filters-section">{renderFilters()}</div>
          <svg
            width={chartWidth + marginLeft + marginRight}
            height={chartHeight + marginTop + marginBottom}
            ref={chartRef}
          >
            <ChartTitle
              chartRef={chartRefCurrent}
              chartWidth={chartWidth}
              marginTop={marginTop}
              title={title}
            />
            <YScale
              chartRef={chartRefCurrent}
              yScale={yScale}
              chartWidth={chartWidth}
              marginLeft={marginLeft}
              yAxisNumbersType={yAxisNumbersType}
            />
            <XScale
              chartRef={chartRefCurrent}
              xScale={xScale}
              chartHeight={chartHeight}
              chartType={chartType}
              data={groupedAndSummedDataByXAxis}
            />
            <ChartLegend
              legendTypes={legendTypes}
              filterByLegend={filterByLegend}
              handleLegendClick={handleLegendClick}
              colors={colorsScaleOrdinal}
              chartWidth={chartWidth}
              chartRef={chartRefCurrent}
              marginLeft={marginLeft}
              marginRight={marginRight}
            />
            <Bars
              chartRef={chartRefCurrent}
              dataToDisplay={groupedAndSummedDataByXAxis}
              xScale={xScale}
              yScale={yScale}
              xSubgroup={xSubgroup}
              colors={colorsScaleOrdinal}
              chartHeight={chartWidth}
            />
          </svg>
          {description && <ChartDescription description={description} />}
          <div className="data-visualization-configuration-switch">
            {showTableUnderGraph && (
              <Switch
                id="showTableSwitch"
                formatMessage={intl.formatMessage}
                labelTranslationId={intl.formatMessage({ id: "cflcharts.showResultTable" })}
                checked={showTable}
                checkedTranslationId="common.switch.on"
                uncheckedTranslationId="common.switch.off"
                onChange={handleShowTableSwitchOnChange}
                disabled={false}
              />
            )}
          </div>
          {showTable && (
            <SummaryChartTable
              xAxis={xAxis}
              legendTypes={filterByLegend}
              groupedAndSummedDataByXAxis={groupedAndSummedDataByXAxis}
              groupedAndSummedDataByLegend={groupedAndSummedDataByLegend}
            />
          )}
          <div className="mt-5 pb-5">
            <div className="d-inline">
              <Button
                className="cancel"
                onClick={() => (window.location.href = HOME_PAGE_URL)}
              >
                <FormattedMessage id="common.cancel" />
              </Button>
            </div>
            <ExportChartDataButton
              data={dataToDisplay}
              chartType={chartType}
              filterByLegend={filterByLegend}
              filterByXAxsis={filterByXAxsis}
              legend={legend}
              xAxis={xAxis}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default injectIntl(BarChart);
