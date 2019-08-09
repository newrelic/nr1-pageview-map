import React from "react";
import { Grid, GridItem, Stack, StackItem, LineChart, NrqlQuery, Spinner, ChartGroup } from 'nr1';
import {Popup} from "react-leaflet";
import PropTypes from "prop-types";

const mockDataForCharts = '{"total":{"results":[{"average":1.9178638041843292}],"beginTimeSeconds":1564242496,"endTimeSeconds":1565106496,"inspectedCount":7313},"timeSeries":[{"results":[{"average":0}],"beginTimeSeconds":1564242496,"endTimeSeconds":1564328896,"inspectedCount":0},{"results":[{"average":0}],"beginTimeSeconds":1564328896,"endTimeSeconds":1564415296,"inspectedCount":0},{"results":[{"average":0}],"beginTimeSeconds":1564415296,"endTimeSeconds":1564501696,"inspectedCount":0},{"results":[{"average":0}],"beginTimeSeconds":1564501696,"endTimeSeconds":1564588096,"inspectedCount":0},{"results":[{"average":1.9836271186440677}],"beginTimeSeconds":1564588096,"endTimeSeconds":1564674496,"inspectedCount":118},{"results":[{"average":1.925195274496179}],"beginTimeSeconds":1564674496,"endTimeSeconds":1564760896,"inspectedCount":1439},{"results":[{"average":1.91573106323836}],"beginTimeSeconds":1564760896,"endTimeSeconds":1564847296,"inspectedCount":1439},{"results":[{"average":1.8978631944444442}],"beginTimeSeconds":1564847296,"endTimeSeconds":1564933696,"inspectedCount":1440},{"results":[{"average":1.9173326388888872}],"beginTimeSeconds":1564933696,"endTimeSeconds":1565020096,"inspectedCount":1440},{"results":[{"average":1.9278322894919973}],"beginTimeSeconds":1565020096,"endTimeSeconds":1565106496,"inspectedCount":1437}],"metadata":{"eventTypes":["PageView"],"eventType":"PageView","openEnded":true,"beginTime":"2019-07-27T15:48:16Z","endTime":"2019-08-06T15:48:16Z","beginTimeMillis":1564242496129,"endTimeMillis":1565106496129,"rawSince":"10 DAYS AGO","rawUntil":"NOW","rawCompareWith":"","bucketSizeMillis":86400000,"guid":"a1919692-d3ec-2517-7413-b170e27e08d2","routerGuid":"c975b4d2-0f9e-9964-493e-ad5d986a4fc2","messages":[],"timeSeries":{"messages":[],"contents":[{"function":"average","attribute":"duration","simple":true}]}}}'

export default class DetailsModal extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number.isRequired,
        launcherUrlState: PropTypes.object.isRequired,
        nerdletUrlState: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            accountId: props.accountId,
            nrqlData: null,
        };

    }

    render() {
        const nrqlQuery = `SELECT average(duration) FROM PageView SINCE 10 DAYS AGO limit 1000 TIMESERIES`;
        const pageViewCount = this.props.data.results[0].count;
        const averageDuration = this.props.data.results[1].average.toFixed(2);

        return <ChartGroup><Grid className="details-panel">
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
                    accountId={2369165}
                    data={this.props.data}
                    className="chart"
                />
            </GridItem>
            <GridItem columnStart={1} columnEnd={6}>
                {/*<LineChart*/}
                    {/*style={{height: this.props.height * 0.3, width: '100%'}}*/}
                    {/*accountId={2369165}*/}
                    {/*query={nrqlQuery}*/}
                    {/*className="chart"*/}
                {/*/>*/}
            </GridItem>
            <GridItem columnStart={7} columnEnd={12}>
                {/*<LineChart*/}
                    {/*style={{height: this.props.height * 0.3, width: '100%'}}*/}
                    {/*accountId={2369165}*/}
                    {/*query={nrqlQuery}*/}
                    {/*className="chart"*/}
                {/*/>*/}
            </GridItem>
        </Grid>
        </ChartGroup>
    }
}
