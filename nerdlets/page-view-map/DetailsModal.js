import React from "react";
import { Grid, GridItem, Stack, StackItem, LineChart, NrqlQuery, Spinner, ChartGroup } from 'nr1';
import PropTypes from "prop-types";


export default class DetailsModal extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number.isRequired,
        launcherUrlState: PropTypes.object.isRequired,
        nerdletUrlState: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    //In the timepicker, user can either choose some timerange from the past or last min/hr/days.
    //Depending on what user chooses, timepicker returns either begin time and end time or duration.
    //Because of this, we can't have one nrql request for all options and we need one for "last" min/hr/days and one
    //for time range in the past.
    createNrqlQuery = (attribute) => {
        const timeRange = this.props.timeRange;

        if (timeRange.duration !== null) {
            return `SELECT average(${attribute}) FROM PageView WHERE regionCode = '${this.props.openedFacet.name[0]}' AND countryCode = '${this.props.openedFacet.name[1]}' SINCE ${timeRange.duration/1000/60} minutes AGO limit 1000 TIMESERIES`
        } else {
            let beginTimeISO = new Date(timeRange.begin_time).toISOString();
            let endTimeISO = new Date(timeRange.end_time).toISOString();

            return `SELECT average(${attribute}) FROM PageView WHERE regionCode = '${this.props.openedFacet.name[0]}' AND countryCode = '${this.props.openedFacet.name[1]}' SINCE '${beginTimeISO}' UNTIL '${endTimeISO}'`;
        }
    };

    render() {
        const pageViewCount = this.props.openedFacet.results[0].count;
        const averageDuration = this.props.openedFacet.results[1].average.toFixed(2);
        const accountId = Number(this.props.accountId);

        return <Grid className="details-panel">
            <GridItem columnStart={1} columnEnd={12}>
            <Stack directionType={Stack.DIRECTION_TYPE.HORIZONTAL}
                   alignmentType={Stack.ALIGNMENT_TYPE.CENTER}
                   distributionType={Stack.DISTRIBUTION_TYPE.FILL_EVENLY}>
                <StackItem style={{height: this.props.height * 0.2}}>
                    <div className="pageviews-count">
                        {pageViewCount} Pageviews
                    </div>
                </StackItem>
                <StackItem style={{height: this.props.height * 0.2}}>
                    <div className="avg-duration">
                        {averageDuration} Avg Duration
                    </div>
                </StackItem>
            </Stack>
            </GridItem>
            <GridItem columnStart={1} columnEnd={12}>
                <LineChart
                    style={{height: this.props.height * 0.3, width: '100%'}}
                    accountId={accountId}
                    query={this.createNrqlQuery('duration')}
                    className="chart"
                />
            </GridItem>
            <GridItem columnStart={1} columnEnd={6}>
                <LineChart
                    style={{height: this.props.height * 0.3, width: '100%'}}
                    accountId={accountId}
                    query={this.createNrqlQuery('domProcessingDuration')}
                    className="chart"
                />
            </GridItem>
            <GridItem columnStart={7} columnEnd={12}>
                {/*<LineChart*/}
                    {/*style={{height: this.props.height * 0.3, width: '100%'}}*/}
                    {/*accountId={accountId}*/}
                    {/*query={nrqlQuery}*/}
                    {/*className="chart"*/}
                {/*/>*/}
            </GridItem>
        </Grid>
    }
}
