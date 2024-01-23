/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { UIFilter } from "app/js/shared/models/data-visualization";
import { DATE_FORMAT } from "./constant";
import moment from 'moment';

export const getDefaultFilters = (configFilters, report) => {
  const filterFieldsToSet = [] as any;
  configFilters.forEach(filter => {
    const filterName = filter.name;
    const allValues = [...new Set(report.map(data => data[filterName]))];
    const filterDataObject = {
      name: filterName,
      value: allValues.sort()
    } as UIFilter;

    const areDateValues = allValues.every(value => isDateValue(value));
    if (areDateValues) {
      filterDataObject.startDate = '';
      filterDataObject.endDate = '';
    }

    filterFieldsToSet.push(filterDataObject);
  });

  return filterFieldsToSet;
}

export const sortInNaturalOrder = (a, b) => {
  if (typeof a.value === 'string' && typeof b.value === 'string') {
    return a.value.localeCompare(b.value);
  } else {
    return a.value - b.value;
  }
}

export const convertDateToString = date => {
  let stringDate = '';
  if (date) {
    stringDate = date.format(DATE_FORMAT);
  }

  return stringDate;
}

const isDateValue = (value) => {
  return moment(value, DATE_FORMAT, true).isValid();
}
