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
  NerdGraphQuery
} from 'nr1';
import { ENTITY_QUERY, getMarkerColor } from './util';
import NrqlFactory from './nrql-factory';
import DetailsPanel from './details-panel';
import { NerdGraphError, EmptyState } from '@newrelic/nr1-community';

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
        {platformUrlState => (
          <NerdletStateContext.Consumer>
            {nerdletUrlState => (
              <NerdGraphQuery
                query={ENTITY_QUERY}
                variables={{ entityGuid: nerdletUrlState.entityGuid }}
                fetchPolicyType={NerdGraphQuery.FETCH_POLICY_TYPE.NO_CACHE}
              >
                {({ loading, error, data }) => {
                  if (loading) {
                    return <Spinner fillContainer />;
                  }

                  if (error) {
                    return <NerdGraphError error={error} />;
                  }

                  // console.debug(data);
                  const nrqlFactory = NrqlFactory.getFactory(data);
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
                      query={nrqlFactory.getMapDataGraphQL({ appId, entity, accountId, platformUrlState })}
                    >
                      {({ loading, error, data }) => {
                        if (loading) {
                          return <Spinner fillContainer />;
                        }

                        if (error) {
                          return <NerdGraphError error={error} />;
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
                                  entity={entity}
                                  nrqlFactory={nrqlFactory}
                                  accountId={accountId}
                                  openedFacet={openedFacet}
                                  platformUrlState={platformUrlState}
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
                    <EmptyState
                      heading="No location data is available for this application"
                      desription={`${entity.name} does not have PageView events with an
                      associated appId or this application hasn't been granted access to that data.`}
                    />
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
