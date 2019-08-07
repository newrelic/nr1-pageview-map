import React from "react";
import { Modal, Stack, StackItem, LineChart } from 'nr1';

const mockDataForCharts = '{"total":{"results":[{"average":1.9178638041843292}],"beginTimeSeconds":1564242496,"endTimeSeconds":1565106496,"inspectedCount":7313},"timeSeries":[{"results":[{"average":0}],"beginTimeSeconds":1564242496,"endTimeSeconds":1564328896,"inspectedCount":0},{"results":[{"average":0}],"beginTimeSeconds":1564328896,"endTimeSeconds":1564415296,"inspectedCount":0},{"results":[{"average":0}],"beginTimeSeconds":1564415296,"endTimeSeconds":1564501696,"inspectedCount":0},{"results":[{"average":0}],"beginTimeSeconds":1564501696,"endTimeSeconds":1564588096,"inspectedCount":0},{"results":[{"average":1.9836271186440677}],"beginTimeSeconds":1564588096,"endTimeSeconds":1564674496,"inspectedCount":118},{"results":[{"average":1.925195274496179}],"beginTimeSeconds":1564674496,"endTimeSeconds":1564760896,"inspectedCount":1439},{"results":[{"average":1.91573106323836}],"beginTimeSeconds":1564760896,"endTimeSeconds":1564847296,"inspectedCount":1439},{"results":[{"average":1.8978631944444442}],"beginTimeSeconds":1564847296,"endTimeSeconds":1564933696,"inspectedCount":1440},{"results":[{"average":1.9173326388888872}],"beginTimeSeconds":1564933696,"endTimeSeconds":1565020096,"inspectedCount":1440},{"results":[{"average":1.9278322894919973}],"beginTimeSeconds":1565020096,"endTimeSeconds":1565106496,"inspectedCount":1437}],"metadata":{"eventTypes":["PageView"],"eventType":"PageView","openEnded":true,"beginTime":"2019-07-27T15:48:16Z","endTime":"2019-08-06T15:48:16Z","beginTimeMillis":1564242496129,"endTimeMillis":1565106496129,"rawSince":"10 DAYS AGO","rawUntil":"NOW","rawCompareWith":"","bucketSizeMillis":86400000,"guid":"a1919692-d3ec-2517-7413-b170e27e08d2","routerGuid":"c975b4d2-0f9e-9964-493e-ad5d986a4fc2","messages":[],"timeSeries":{"messages":[],"contents":[{"function":"average","attribute":"duration","simple":true}]}}}'

export default class DetailsModal extends React.Component {
    constructor(props) {
        super(props);

        //Any data here for development
        this.state = {
            pageViews: 30,
            averageDuration: 1.60,
        }
    }

    render() {
        // Linecharts data shows charts across time, so below is a simple nrql to extract some of that data for development purposes.
        // It also accepts data in "data" attribute, but documentation doesn't show in what way. If we don't want to make more
        // nrql requests, than it probably will be better to have this data provided from map.
        const randomNrql = `SELECT average(duration) FROM PageView SINCE 10 DAYS AGO limit 1000 TIMESERIES`;

        return <Modal hidden={this.props.hidden} onClose={this.props.onClose}>
            <Stack directionType={Stack.DIRECTION_TYPE.HORIZONTAL}>
                <StackItem>
                    <div className="pageviews-count">
                        {this.state.pageViews}
                    </div>
                </StackItem>
                <StackItem>
                    <div className="avg-duration">
                        {this.state.averageDuration}
                    </div>
                </StackItem>
            </Stack>
            <Stack>
                <StackItem>
                    <div className="duration-linechart">
                        <LineChart accountId={this.props.accountId} query={randomNrql} />
                    </div>
                </StackItem>
            </Stack>
            <Stack directionType={Stack.DIRECTION_TYPE.HORIZONTAL}>
                <StackItem>
                    <div className="pageload-speed-linechart">
                        <LineChart query={randomNrql}>
                        </LineChart>
                    </div>
                </StackItem>
                <StackItem>
                    <div className="pageview-errors-linechart">
                        <LineChart query={randomNrql}>
                        </LineChart>
                    </div>
                </StackItem>
            </Stack>
        </Modal>
    }
}
