// Copyright 2019 New Relic Corporation. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Stack, StackItem, LineChart, BillboardChart, ChartGroup, HeadingText, Button, Icon, BlockText } from 'nr1';
import PropTypes from 'prop-types';
import { createSinceQueryFragment } from './util';

export default class DetailsPanel extends React.Component {
  static propTypes = {
    appId: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    accountId: PropTypes.number.isRequired,
    openedFacet: PropTypes.object.isRequired,
    launcherUrlState: PropTypes.object.isRequired,
    togglePageViewDetails: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { accountId, appId, openedFacet, launcherUrlState } = this.props;
    const pageViewCount = openedFacet.x;
    return (
      <ChartGroup>
        <div style={{height: '99vh', overflow: 'scroll'}}>
        <Stack directionType={Stack.DIRECTION_TYPE.VERTICAL} horizontalType={Stack.HORIZONTAL_TYPE.TRAILING}>
          <StackItem style={{ padding: '5px 0', cursor: 'pointer' }}>
            <Button
              size="small"
              type={Button.TYPE.PLAIN}
              onClick={() => {this.props.togglePageViewDetails(null)}}
              className="close-button"
              iconType={Button.ICON_TYPE.INTERFACE__SIGN__TIMES__V_ALTERNATE}/>
          </StackItem>
          <StackItem className="detailSection">
            <HeadingText type={HeadingText.TYPE.HEADING_2}>{openedFacet.facet[0] ? `${openedFacet.facet[0]}, ` : ''}{openedFacet.facet[1]}</HeadingText>
            <BlockText>{pageViewCount} Pageviews</BlockText>
          </StackItem>
          <StackItem>
            <HeadingText type={HeadingText.TYPE.HEADING_4}>Overall Duration</HeadingText>
            <LineChart
                className="chartSection"
                accountId={accountId}
                query={`SELECT average(duration) FROM PageView WHERE appId = ${appId} ${openedFacet.facet[0] ? ` WHERE regionCode = '${openedFacet.facet[0]}' ` : ''} ${openedFacet.facet[1] ? ` WHERE countryCode = '${openedFacet.facet[1]}' ` : ''} ${createSinceQueryFragment(launcherUrlState)} TIMESERIES`}
              />
          </StackItem>
          <StackItem>
            <HeadingText type={HeadingText.TYPE.HEADING_4}>DOM Processing</HeadingText>
            <LineChart
                className="chartSection"
                accountId={accountId}
                query={`SELECT average(domProcessingDuration) FROM PageView WHERE appId = ${appId} ${openedFacet.facet[0] ? ` WHERE regionCode = '${openedFacet.facet[0]}' ` : ''} ${openedFacet.facet[1] ? ` WHERE countryCode = '${openedFacet.facet[1]}' ` : ''} ${createSinceQueryFragment(launcherUrlState)} TIMESERIES `}
              />
          </StackItem>
          <StackItem>
            <HeadingText type={HeadingText.TYPE.HEADING_4}>Overall JS Errors</HeadingText>
            <BillboardChart
                className="chartSection"
                accountId={accountId}
                query={`SELECT count(*) FROM JavaScriptError WHERE appId = ${appId} ${createSinceQueryFragment(launcherUrlState, true)}`}
              />
          </StackItem>
        </Stack>
        </div>
      </ChartGroup>
    );
  }
}
