/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { Y_AXIS_INTEGER_NUMBERS_KEY, Y_AXIS_PERCENTAGE_NUMBERS_KEY } from '../../shared/constants/data-visualization-configuration';

interface IYScale {
  chartRef: SVGSVGElement | null;
  yScale: d3.ScaleLinear<number, number, never>;
  chartWidth: number;
  marginLeft: number;
  yAxisNumbersType: string;
}

const YScale = ({ chartRef, yScale, chartWidth, marginLeft, yAxisNumbersType }: IYScale) => {
  useEffect(() => {
    if (chartWidth && chartRef) {
      const yScaleAxis = d3.axisLeft(yScale);

      if (yAxisNumbersType === Y_AXIS_INTEGER_NUMBERS_KEY) {
        yScaleAxis.tickValues(yScale.ticks().filter(tick => Number.isInteger(tick)));
      } else if (yAxisNumbersType === Y_AXIS_PERCENTAGE_NUMBERS_KEY) {
        yScale.domain([0,100]);
        yScaleAxis.tickFormat((tick: number) => `${tick}%`);
      }

      d3.select(chartRef)
        .select('.yScale')
        .attr('transform', `translate(${marginLeft},0)`)
        //@ts-ignore
        .call(yScaleAxis)
        .call(g => g.selectAll('.tick .grid-line').remove())
        .call(g =>
          g
            .selectAll('.tick line')
            .clone()
            .attr('class', 'grid-line')
            .attr('x2', chartWidth - marginLeft)
            .attr('stroke-opacity', 0.1)
        );
    }
  }, [chartRef, chartWidth, marginLeft, yScale, yAxisNumbersType]);

  return <g className="yScale" />;
};

export default YScale;
