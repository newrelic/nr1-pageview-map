import React from 'react';
import PropTypes from 'prop-types';
import {Map, CircleMarker, Pane, TileLayer, Rectangle, Tooltip} from 'react-leaflet'
import gql from 'graphql-tag';
import { Spinner, Stack, StackItem, Grid, GridItem, NerdGraphQuery, NrqlQuery, Modal, LineChart, navigation } from 'nr1';
import DetailsModal from './DetailsModal';
const mockData = require('./mockData.json');

export default class PageViewMap extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        launcherUrlState: PropTypes.object,
        nerdletUrlState: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            lat: 49.7497638,
            lng: 18.6354709,
            zoom: 13,
            accountId: '',
            detailsOpen: false,
            mapGridEndColumn: 12,
            openedFacet: null,
        }
    }

    getPageViewData = () => {
        NrqlQuery.query({accountId: this.state.accountId, query: 'SELECT count(*) as viewCount, average(duration) as averageDuration, sum(asnLatitude)/count(*) as latitude, sum(asnLongitude)/count(*) as longitude FROM PageView FACET asn SINCE 12 DAYS AGO limit 1000'})
            .then(response => {
                console.log('nrql response data:', response.data);
            })
    };

    togglePageViewDetails = (facet) => {
        this.setState({
            detailsOpen: !this.state.detailsOpen,
            mapGridEndColumn: this.state.detailsOpen ? 12 : 7,
            openedFacet: facet,
        })
    };

    componentDidMount() {
        const q = NerdGraphQuery.query({ query: gql`{
            actor {
              accounts {
                id
              }
            }
          }` });
        q.then(results => {
            const accountId = results.data.actor.accounts[0].id;
            this.setState({
                accountId: accountId,
            });
            this.getPageViewData()
        }).catch((error) => { console.log(error); })
    }

    render() {
        return <Grid>
            <GridItem columnStart={1} columnEnd={this.state.mapGridEndColumn}>
                <Map
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
                    {mockData.data.facets.map((facet, i) => {
                        const pt = facet.results;
                        return <CircleMarker key={`circle-${i}`} center={[pt[2].result, pt[3].result]} onClick={() => this.togglePageViewDetails(facet)}>
                        </CircleMarker>
                    })}
                </Map>
            </GridItem>
            {this.state.detailsOpen &&
                <GridItem columnStart={8} columnEnd={12}>
                    <DetailsModal height={this.props.height} data={this.state.openedFacet}/>
                </GridItem>
            }
        </Grid>
    }
}
