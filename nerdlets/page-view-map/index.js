import React from 'react';
import PropTypes from 'prop-types';
import {Map, CircleMarker, TileLayer} from 'react-leaflet'
import { Spinner, Grid, GridItem, NrqlQuery } from 'nr1';
import DetailsModal from './DetailsModal';
import { decodeEntityId } from './utils';

export default class PageViewMap extends React.Component {
    static propTypes = {
        height: PropTypes.number.isRequired,
        launcherUrlState: PropTypes.object.isRequired,
        nerdletUrlState: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            accountId: decodeEntityId(this.props.nerdletUrlState.entityId)[0],
            detailsOpen: false,
            mapGridEndColumn: 12,
            openedFacet: null,
        }
    }

    togglePageViewDetails = (facet, detailsOpen) => {
        this.setState({
            detailsOpen: detailsOpen,
            mapGridEndColumn: detailsOpen ? 7 : 12,
            openedFacet: facet,
        });
    };

    createSinceForMapDataQuery = () => {
        const timeRange = this.props.launcherUrlState.timeRange;

        if (timeRange.duration !== null) {
            return `SINCE ${timeRange.duration/1000/60} minutes AGO limit 1000`
        } else {
            let beginTimeISO = new Date(timeRange.begin_time).toISOString();
            let endTimeISO = new Date(timeRange.end_time).toISOString();

            return `SINCE '${beginTimeISO}' UNTIL '${endTimeISO}'`;
        }
    };

    render() {
        const nrqlQueryForMapData = `SELECT count(*) as x, average(duration) as y, sum(asnLatitude)/count(*) as lat, sum(asnLongitude)/count(*) as lng FROM PageView facet regionCode, countryCode ${this.createSinceForMapDataQuery()}`;

        return <Grid>
            <GridItem columnStart={1} columnEnd={this.state.mapGridEndColumn}>

                <NrqlQuery
                    formatType={NrqlQuery.FORMAT_TYPE.RAW}
                    accountId={Number(this.state.accountId)}
                    query={nrqlQueryForMapData}>
                    {results => {
                        if (results.loading) {
                            return <Spinner className="centered" />
                        } else {
                            return <Map
                                className="containerMap"
                                style={{height: '90vh'}}
                                center={[0,0]}
                                zoom={2}
                                zoomControl={true}
                                ref={(ref) => {
                                    this.mapRef = ref
                                }}>
                                <TileLayer
                                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {results.data.facets.map((facet, i) => {
                                    const pt = facet.results;
                                    return <CircleMarker
                                        key={`circle-${i}`}
                                        center={[pt[2].result, pt[3].result]}
                                        color={'green'}
                                        radius={Math.log(pt[0].count)*3}
                                        onClick={() => {this.togglePageViewDetails(facet, true);}}>
                                    </CircleMarker>
                                })}
                            </Map>
                        }
                    }}
                </NrqlQuery>
            </GridItem>
            {this.state.detailsOpen &&
                <GridItem columnStart={8} columnEnd={12}>
                    <DetailsModal height={this.props.height}
                                  accountId={this.state.accountId}
                                  timeRange={this.props.launcherUrlState.timeRange}
                                  openedFacet={this.state.openedFacet}
                                  togglePageViewDetails={() => this.togglePageViewDetails(this.state.openedFacet, false)}/>
                </GridItem>
            }
        </Grid>
    }
}
