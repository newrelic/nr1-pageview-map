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
  HeadingText,
  BlockText
} from 'nr1';
import { mapData, entityQuery, getMarkerColor } from './util';
import DetailsPanel from './details-panel';

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

  togglePageViewDetails = (facet, center) => {
    if (facet) {
      this.setState({
        detailsOpen: true,
        openedFacet: facet,
        mapCenter: center
      });
    } else {
      // debugger;
      this.setState({
        detailsOpen: false,
        openedFacet: null
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
                      <>
                        <HeadingText>An error ocurred</HeadingText>
                        <p>{error.message}</p>
                      </>
                    );
                  }

                  // console.debug(data);
                  const {
                    accountId,
                    servingApmApplicationId,
                    applicationId
                  } = data.actor.entity;
                  const appId = servingApmApplicationId || applicationId;
                  const { entity } = data.actor;
                  const { apdexTarget } = data.actor.entity.settings || 0.5;
                  // return "Hello";
                  return appId ? (
                    <NerdGraphQuery
                      query={mapData(accountId, appId, launcherUrlState)}
                    >
                      {({ loading, error, data }) => {
                        if (loading) {
                          return <Spinner fillContainer />;
                        }

                        if (error) {
                          return (
                            <>
                              <HeadingText>An error ocurred</HeadingText>
                              <p>{error.message}</p>
                            </>
                          );
                        }

                        // console.debug(data);
                        const { results } = data.actor.account.mapData;
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
                                center={mapCenter}
                                zoom={3}
                                zoomControl
                                ref={ref => {
                                  this.mapRef = ref;
                                }}
                              >
                                <TileLayer
                                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {results.map((pt, i) => {
                                  const center = [pt.lat, pt.lng];
                                  return (
                                    <CircleMarker
                                      key={`circle-${i}`}
                                      center={center}
                                      color={getMarkerColor(pt.y, apdexTarget)}
                                      radius={Math.log(pt.x) * 3}
                                      onClick={() => {
                                        this.togglePageViewDetails(pt, center);
                                      }}
                                    />
                                  );
                                })}
                              </Map>
                            </GridItem>
                            {openedFacet && (
                              <GridItem columnSpan={4}>
                                <DetailsPanel
                                  appId={appId}
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
                  ) : (
                    <div style={{ width: '50%', margin: 'auto' }}>
                      <HeadingText>
                        No location data is available for this app
                      </HeadingText>
                      <BlockText>
                        {entity.name} does not have PageView events with an
                        associated appId.
                      </BlockText>
                    </div>
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
