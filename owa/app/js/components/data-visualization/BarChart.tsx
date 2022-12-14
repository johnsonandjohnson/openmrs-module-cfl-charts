/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import useController from './DataVisualizationController';
import ChartLegend from './ChartLegend';
import XScale from './XScale';
import YScale from './YScale';
import Bars from './Bars';
import { Button, Spinner } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { REPORT_CHARTS_URL } from '../../shared/constants/data-visualization-configuration';
import { SelectWithPlaceholder } from '../common/form/withPlaceholder';
import { selectDefaultTheme } from '../../shared/util/form-util';
import { IReportConfiguration, IReportData } from '../../shared/models/data-visualization';
import { IOption } from '../../shared/models/option';
import ChartDescription from './ChartDescription';
import ChartTitle from './ChartTitle';
import ExportChartDataButton from './ExportChartDataButton';

interface IBarChart {
  isActive: boolean;
  report: IReportData[] | [];
  config: IReportConfiguration;
}

const BarChart = ({
  isActive,
  report,
  config: { xAxis, yAxis, legend, description, chartType, colors, marginTop, marginBottom, marginLeft, marginRight, title }
}: IBarChart) => {
  const chartRef = useRef<SVGSVGElement>(null);
  const chartRefCurrent = chartRef.current;
  const { formatMessage } = useIntl();

  const [dataToDisplay, setDataToDisplay] = useState<IReportData[]>([]);
  const [legendTypes, setLegendTypes] = useState<string[]>([]);
  const [xAsisTypes, setXAsisTypes] = useState<string[]>([]);
  const [filterByLegend, setFilterByLegend] = useState<string[]>([]);
  const [filterByXAxsis, setFilterByXAxsis] = useState<string[]>([]);
  const [chartWidth, setChartWidth] = useState<number>(0);
  const [chartHeight, setChartHeight] = useState<number>(0);

  useEffect(() => {
    if (report?.length) {
      if (!legendTypes?.length) {
        const types = [...new Set(report.map(data => `${data[legend]}`))] as string[];

        setLegendTypes(types);
        setFilterByLegend(types);
      }

      if (!xAsisTypes?.length) {
        const types = [...new Set(report.map(data => `${data[xAxis]}`))] as string[];

        setXAsisTypes(types);
        setFilterByXAxsis(types);
      }

      if (legendTypes?.length && xAsisTypes.length && !dataToDisplay?.length) {
        setDataToDisplay(report);
      }
    }
  }, [legendTypes, xAsisTypes, report, legend, xAxis, dataToDisplay?.length]);

  useEffect(() => {
    if (dataToDisplay?.length && isActive) {
      const width = parseInt(d3.select('.chart').style('width')) - marginLeft - marginRight;
      const height = parseInt(d3.select('.chart').style('height')) - marginTop - marginBottom;

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
    marginTop
  });

  const { yScale, xScale, xSubgroup, colorsScaleOrdinal, groupedAndSummedDataByXAxis } = controller;

  const options = xAsisTypes.map(xAxisKey => ({ label: `${xAxisKey}`, value: `${xAxisKey}` }));

  const filterData = (filteredXAxis: string[], legends = filterByLegend) => {
    const clonedDataToDisplay = !filteredXAxis.length ? report : report.filter(data => filteredXAxis.includes(`${data[xAxis]}`));
    const filteredDataToDisplay = clonedDataToDisplay.filter(data => legends.includes(`${data[legend]}`));

    setDataToDisplay(filteredDataToDisplay);
  };

  const handleOnChange = (options: IOption[]) => {
    const xAxisTypesFromOptions = options.map(({ value }) => value);

    filterData(xAxisTypesFromOptions, filterByLegend);
    setFilterByXAxsis(xAxisTypesFromOptions);
  };

  const handleLegendClick = (value: string) => {
    let clonedFilterByLegend = [...filterByLegend];

    if (clonedFilterByLegend.includes(value)) {
      clonedFilterByLegend = clonedFilterByLegend.filter(legend => legend !== value);
    } else {
      clonedFilterByLegend.push(value);
    }

    if (!clonedFilterByLegend.length) {
      clonedFilterByLegend = legendTypes;
    }

    filterData(filterByXAxsis, clonedFilterByLegend);
    setFilterByLegend(clonedFilterByLegend);
  };

  return (
    <div className="chart">
      {!xAsisTypes.length && !chartWidth ? (
        <div className="spinner">
          <Spinner />
        </div>
      ) : (
        <>
          <SelectWithPlaceholder
            placeholder={formatMessage({ id: 'cflcharts.chart.xAxis' })}
            showPlaceholder={!!filterByXAxsis.length}
            options={options}
            onChange={handleOnChange}
            defaultValue={options}
            isMulti
            classNamePrefix="default-select"
            theme={selectDefaultTheme}
          />
          <svg width={chartWidth + marginLeft + marginRight} height={chartHeight + marginTop + marginBottom} ref={chartRef}>
            <ChartTitle chartRef={chartRefCurrent} chartWidth={chartWidth} marginTop={marginTop} title={title} />
            <YScale chartRef={chartRefCurrent} yScale={yScale} chartWidth={chartWidth} marginLeft={marginLeft} />
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
          <div className="mt-5 pb-5">
            <div className="d-inline">
              <Button className="cancel" onClick={() => (window.location.href = REPORT_CHARTS_URL)}>
                <FormattedMessage id="common.return" />
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

export default BarChart;
