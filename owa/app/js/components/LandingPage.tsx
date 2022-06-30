/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React from 'react';
import Tile from './Tile';
import { FormattedMessage } from 'react-intl';
import { Col, Row } from 'react-bootstrap';

const LandingPage = () => (
  <>
    <Row>
      <Col md={12} xs={12}>
        <FormattedMessage id="reportCharts.title" tagName="h2"/>
      </Col>
    </Row>
    <div className="panel-body">
      <Tile name="Visualization" href="#/visualization" icon={['fas', 'chart-bar']} />
      <Tile name="Configuration" href="#/configuration" icon={['fas', 'cog']} />
    </div>
  </>
);

export default LandingPage;
