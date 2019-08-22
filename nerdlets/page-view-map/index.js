// Copyright 2019 New Relic Corporation. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import PropTypes from 'prop-types';
import { Map, CircleMarker, TileLayer } from 'react-leaflet';
import { Spinner, Grid, GridItem, NrqlQuery } from 'nr1';
import DetailsModal from './DetailsModal';
import { decodeEntityId } from './utils';

export default class PageViewMap extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    launcherUrlState: PropTypes.object.isRequired,
    nerdletUrlState: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      accountId: decodeEntityId(this.props.nerdletUrlState.entityId)[0],
      detailsOpen: false,
      mapGridEndColumn: 12,
      openedFacet: null
    };
  }

  togglePageViewDetails = (facet, detailsOpen) => {
    this.setState({
      detailsOpen: detailsOpen,
      mapGridEndColumn: detailsOpen ? 6 : 12,
      openedFacet: facet
    });
  };

  // Below, HSL is used to get color for markers.
  // HSL stand for hue, saturation and lightness. In this function we only operate on hue.
  // Top hue value is set to 120 which means green, 0 is red.
  getMarkerColor = singlePlaceAverageTime => {
    // Top threshold value in seconds for red color.
    let maxAverageLoad = 5;

    let hue = ((1 - singlePlaceAverageTime / maxAverageLoad) * 120).toString(
      10
    );

    return ['hsl(', hue, ',100%,50%)'].join('');
  };

  createSinceForMapDataQuery = () => {
    const timeRange = this.props.launcherUrlState.timeRange;

    if (timeRange.duration !== null) {
      return `SINCE ${timeRange.duration / 1000 / 60} minutes AGO limit 1000`;
    } else {
      let beginTimeISO = new Date(timeRange.begin_time).toISOString();
      let endTimeISO = new Date(timeRange.end_time).toISOString();

      return `SINCE '${beginTimeISO}' UNTIL '${endTimeISO}'`;
    }
  };

  render() {
    const nrqlQueryForMapData = `SELECT count(*) as x, average(duration) as y, sum(asnLatitude)/count(*) as lat, sum(asnLongitude)/count(*) as lng FROM PageView FACET regionCode, countryCode ${this.createSinceForMapDataQuery()}`;

    return (
      <Grid>
        <GridItem columnStart={1} columnEnd={this.state.mapGridEndColumn}>
          <NrqlQuery
            formatType={NrqlQuery.FORMAT_TYPE.RAW}
            accountId={Number(this.state.accountId)}
            query={`SELECT max(asnLatitude) as latMax, max(asnLongitude) as lngMax, min(asnLatitude) as latMin, min(asnLongitude) as lngMin FROM PageView ${this.createSinceForMapDataQuery()}`}
          >
            {results => {
              if (results.loading) {
                return <Spinner className="centered" />;
              } else {
                let mapBoundaries = results.data.results;

                return (
                  <NrqlQuery
                    formatType={NrqlQuery.FORMAT_TYPE.RAW}
                    accountId={Number(this.state.accountId)}
                    query={nrqlQueryForMapData}
                  >
                    {mapDataResults => {
                      if (mapDataResults.loading) {
                        return <Spinner className="centered" />;
                      } else {
                        let latMax = mapBoundaries[0].max + 0.5;
                        let lngMax = mapBoundaries[1].max + 0.5;
                        let latMin = mapBoundaries[2].min - 0.5;
                        let lngMin = mapBoundaries[3].min - 0.5;

                        let averageLoadTimes = [];

                        for (let singleMarker of mapDataResults.data.facets) {
                          averageLoadTimes.push(
                            singleMarker.results[1].average
                          );
                        }

                        return (
                          <Map
                            className="containerMap"
                            style={{ height: '90vh' }}
                            maxBounds={[[230, 230], [-230, -230]]}
                            bounds={[[latMax, lngMax], [latMin, lngMin]]}
                            zoomControl={true}
                            ref={ref => {
                              this.mapRef = ref;
                            }}
                          >
                            <TileLayer
                              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {mapDataResults.data.facets.map((facet, i) => {
                              const pt = facet.results;

                              return (
                                <CircleMarker
                                  key={`circle-${i}`}
                                  center={[pt[2].result, pt[3].result]}
                                  color={this.getMarkerColor(pt[1].average)}
                                  radius={Math.log(pt[0].count) * 3}
                                  onClick={() => {
                                    this.togglePageViewDetails(facet, true);
                                  }}
                                ></CircleMarker>
                              );
                            })}
                          </Map>
                        );
                      }
                    }}
                  </NrqlQuery>
                );
              }
            }}
          </NrqlQuery>
        </GridItem>
        {this.state.detailsOpen && (
          <GridItem columnStart={7} columnEnd={12}>
            <DetailsModal
              height={this.props.height}
              accountId={Number(this.state.accountId)}
              timeRange={this.props.launcherUrlState.timeRange}
              openedFacet={this.state.openedFacet}
              togglePageViewDetails={() =>
                this.togglePageViewDetails(this.state.openedFacet, false)
              }
            />
          </GridItem>
        )}
      </Grid>
    );
  }
}
