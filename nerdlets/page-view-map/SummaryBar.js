import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Stack,
  StackItem,
  SparklineChart,
  BillboardChart,
  HeadingText,
} from 'nr1';

export default class SummaryBar extends Component {
  static propTypes = {
    accountId: PropTypes.any.isRequired,
    nrqlSince:  PropTypes.string.isRequired,
  };

  render() {
    return (
      <Stack
        alignmentType={Stack.ALIGNMENT_TYPE.FILL}
        directionType={Stack.DIRECTION_TYPE.HORIZONTAL}
        gapType={Stack.GAP_TYPE.TIGHT}
      >
        <StackItem className="inline">
            <HeadingText>Overall</HeadingText>
        </StackItem>
        <StackItem className="inline">
          <BillboardChart
            className="microchart"
            accountId={this.props.accountId}
            query={`FROM PageView SELECT count(*) as 'Page Views' ${this.props.nrqlSince}`}
          />
          <SparklineChart
            className="microchart"
            accountId={this.props.accountId}
            query={`FROM PageView SELECT count(*) TIMESERIES ${this.props.nrqlSince}`}
          />
        </StackItem>
        <StackItem className="inline">
          <BillboardChart
            className="microchart"
            accountId={this.props.accountId}
            query={`FROM PageView SELECT average(duration) as 'Performance' ${this.props.nrqlSince}`}
          />
          <SparklineChart
            className="microchart"
            accountId={this.props.accountId}
            query={`FROM PageView SELECT average(duration) TIMESERIES ${this.props.nrqlSince}`}
          />
        </StackItem>
        <StackItem className="inline">
          <BillboardChart
            className="microchart"
            accountId={this.props.accountId}
            query={`FROM PageView SELECT average(networkDuration) as 'Network Avg.' ${this.props.nrqlSince}`}
          />
          <SparklineChart
            className="microchart"
            accountId={this.props.accountId}
            query={`FROM PageView SELECT average(networkDuration) TIMESERIES ${this.props.nrqlSince}`}
          />
        </StackItem>
        <StackItem className="inline" grow={true}>
          <BillboardChart
            className="microchart"
            accountId={this.props.accountId}
            query={`FROM PageView SELECT average(backendDuration) as 'Backend Avg.' ${this.props.nrqlSince}`}
          />
          <SparklineChart
            className="microchart"
            accountId={this.props.accountId}
            query={`FROM PageView SELECT average(backendDuration) TIMESERIES ${this.props.nrqlSince}`}
          />
        </StackItem>
      </Stack>
    );
  }
}
