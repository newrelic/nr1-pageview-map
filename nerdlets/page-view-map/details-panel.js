// Copyright 2019 New Relic Corporation. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Stack, StackItem, HistogramChart, ChartGroup, Button } from 'nr1';
import PropTypes from 'prop-types';
import numeral from 'numeral';

export default class DetailsPanel extends React.Component {
  /* eslint-disable react/no-unused-prop-types */
  static propTypes = {
    nrqlFactory: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    appId: PropTypes.number.isRequired,
    accountId: PropTypes.number.isRequired,
    openedFacet: PropTypes.object.isRequired,
    platformUrlState: PropTypes.object.isRequired,
    togglePageViewDetails: PropTypes.func.isRequired
  };
  /* eslint-enable */

  constructor(props) {
    super(props);
  }

  render() {
    const { accountId, nrqlFactory, openedFacet } = this.props;
    const pageViewCount = openedFacet.x;
    return (
      <ChartGroup>
        <Stack
          directionType={Stack.DIRECTION_TYPE.VERTICAL}
          horizontalType={Stack.HORIZONTAL_TYPE.TRAILING}
          className="details-panel"
        >
          <StackItem className="details-panel-headers">
            <h3 className="details-panel-header">
              {openedFacet.facet[0] ? `${openedFacet.facet[0]}, ` : ''}
              {openedFacet.facet[1]}
            </h3>
            <span className="details-panel-subheader">
              {numeral(pageViewCount).format('0,0')} Pageviews
            </span>
            <Button
              size="small"
              type={Button.TYPE.PLAIN}
              onClick={() => {
                this.props.togglePageViewDetails(null);
              }}
              className="close-button"
              iconType={Button.ICON_TYPE.INTERFACE__SIGN__TIMES__V_ALTERNATE}
            />
          </StackItem>
          <StackItem className="chart-stack-item">
            <h5 className="chart-header">{nrqlFactory.getQueryTitle1()}</h5>
            <HistogramChart
              className="chartSection"
              accountIds={[accountId]}
              query={nrqlFactory.getQuery1(this.props)}
            />
          </StackItem>
          <StackItem className="chart-stack-item">
            <h5 className="chart-header">{nrqlFactory.getQueryTitle2()}</h5>
            <HistogramChart
              className="chartSection"
              accountIds={[accountId]}
              query={nrqlFactory.getQuery2(this.props)}
            />
          </StackItem>
          <StackItem className="chart-stack-item">
            <h5 className="chart-header">{nrqlFactory.getQueryTitle3()}</h5>
            <HistogramChart
              className="chartSection"
              accountIds={[accountId]}
              query={nrqlFactory.getQuery3(this.props)}
            />
          </StackItem>
        </Stack>
      </ChartGroup>
    );
  }
}
