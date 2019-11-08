// Copyright 2019 New Relic Corporation. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Map, CircleMarker, TileLayer } from 'react-leaflet';
import {
  Spinner,
  Grid,
  GridItem,
  PlatformStateContext,
  NerdletStateContext,
  NerdGraphQuery,
  HeadingText
} from 'nr1';
import { mapData, entityQuery } from './util';
import DetailsPanel from './DetailsPanel';

export default class PageViewMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      detailsOpen: false,
      openedFacet: null,
      mapCenter: [10.5731, -7.5898]
    };

    this.togglePageViewDetails = this.togglePageViewDetails.bind(this);
  }

  getMarkerColor(measure, apdexTarget) {
    if (measure <= apdexTarget) {
      return '#11A600';
    } else if (measure >= apdexTarget && measure <= apdexTarget * 4) {
      return '#FFD966';
    } else {
      return '#BF0016';
    }
  }

  togglePageViewDetails = (facet, detailsOpen, center) => {
    if (facet) {
      this.setState({
        detailsOpen: true,
        openedFacet: facet,
        mapCenter: center
      });
    } else {
      //debugger;
      this.setState({
        detailsOpen: false,
        openedFacet: null,
        mapCenter: null
      });
    }
  };

  render() {
    const { detailsOpen, mapCenter, openedFacet } = this.state;
    return (
      <PlatformStateContext.Consumer>
        {launcherUrlState => (
          <NerdletStateContext.Consumer>
            {nerdletUrlState => (
              <NerdGraphQuery query={entityQuery(nerdletUrlState.entityGuid)}>
                {({ loading, error, data }) => {
                  if (loading) {
                    return <Spinner fillContainer />;
                  }

                  if (error) {
                    return (
                      <React.Fragment>
                        <HeadingText>An error ocurred</HeadingText>
                        <p>{error.message}</p>
                      </React.Fragment>
                    );
                  }

                  console.debug(data);
                  const {
                    accountId,
                    servingApmApplicationId
                  } = data.actor.entity;
                  const { apdexTarget } = data.actor.entity.settings;
                  //return "Hello";
                  return (
                    <NerdGraphQuery
                      query={mapData(
                        accountId,
                        servingApmApplicationId,
                        launcherUrlState
                      )}
                    >
                      {({ loading, error, data }) => {
                        if (loading) {
                          return <Spinner fillContainer />;
                        }

                        if (error) {
                          return (
                            <React.Fragment>
                              <HeadingText>An error ocurred</HeadingText>
                              <p>{error.message}</p>
                            </React.Fragment>
                          );
                        }

                        console.debug(data);
                        const { results } = data.actor.account.mapBoundaries;
                        const mapData = data.actor.account.mapData.results;

                        const latMax = results[0].latMax + 0.5;
                        const lngMax = results[0].lngMax + 0.5;
                        const latMin = results[0].latMin - 0.5;
                        const lngMin = results[0].lngMin - 0.5;

                        const deriveredCenter = [
                          (latMax - latMin) / 2,
                          (lngMax - lngMin) / 2
                        ];

                        return (
                          <Grid
                            spacingType={[
                              Grid.SPACING_TYPE.NONE,
                              Grid.SPACING_TYPE.NONE
                            ]}
                          >
                            <GridItem columnSpan={detailsOpen ? 8 : 12}>
                              <Map
                                className="containerMap"
                                style={{ height: '99vh' }}
                                center={mapCenter ? mapCenter : deriveredCenter}
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
                                {mapData.map((pt, i) => {
                                  const center = [pt.lat, pt.lng];
                                  return (
                                    <CircleMarker
                                      key={`circle-${i}`}
                                      center={center}
                                      color={this.getMarkerColor(pt.y, 1.7)}
                                      radius={Math.log(pt.x) * 3}
                                      onClick={() => {
                                        this.togglePageViewDetails(pt, center);
                                      }}
                                    ></CircleMarker>
                                  );
                                })}
                              </Map>
                            </GridItem>
                            {openedFacet && (
                              <GridItem columnSpan={4}>
                                <DetailsPanel
                                  appId={servingApmApplicationId}
                                  accountId={accountId}
                                  openedFacet={openedFacet}
                                  launcherUrlState={launcherUrlState}
                                  togglePageViewDetails={
                                    this.togglePageViewDetails
                                  }
                                />
                              </GridItem>
                            )}
                          </Grid>
                        );
                      }}
                    </NerdGraphQuery>
                  );
                }}
              </NerdGraphQuery>
            )}
          </NerdletStateContext.Consumer>
        )}
      </PlatformStateContext.Consumer>
    );
  }
}
