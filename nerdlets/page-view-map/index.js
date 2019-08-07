import React from 'react';
import PropTypes from 'prop-types';
import { Map, CircleMarker, Pane, TileLayer, Rectangle, Tooltip } from 'react-leaflet'
import gql from 'graphql-tag';
import { Spinner, Stack, StackItem, PieChart, NerdGraphQuery, NrqlQuery, Modal } from 'nr1';
import DetailsModal from './DetailsModal';

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
            hideModal: false, //false for development
        }
    }

    getPageViewData = () => {
        NrqlQuery.query({accountId: this.state.accountId, query: 'SELECT * FROM PageView'})
            .then(response => {
                console.log('nrql response data:', response.data);
            })
    };

    viewPageViewDetails = () => {
        this.setState({hideModal: false})
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
                accountId: parseInt(accountId),
            });
            this.getPageViewData()
        }).catch((error) => { console.log(error); })
    }

    render() {
        const position = [49.7497638, 18.6354709];
        return <div alignmentType={Stack.ALIGNMENT_TYPE.FILL}>
            <Map
            className="containerMap"
            style={{height: '90vh'}}
            center={position}
            zoom={13}
            zoomControl={true}
            ref={(ref) => { this.mapRef = ref }}>
                <CircleMarker center={position} onClick={this.viewPageViewDetails}>
                </CircleMarker>
                <TileLayer
                attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </Map>
            <DetailsModal hidden={this.state.hideModal}
                          onClose={() => {this.setState({hideModal: true})}}
                          accountId={this.state.accountId}/>
        </div>
    }
}
