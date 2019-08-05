import React from 'react';
import PropTypes from 'prop-types';
import { Map, Marker, Popup, TileLayer, CircleMarker } from 'react-leaflet'
import response from './response.json';

export default class PageViewMap extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        launcherUrlState: PropTypes.object,
        nerdletUrlState: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.response = require('./response.json');
    }

    componentWillMount() {
    }

    render() {
        return <Map
        style={{height: '100%'}}
        center={[this.response.results[0].events[0].asnLatitude, this.response.results[0].events[0].asnLongitude]}
        zoom={13}
        zoomControl={true}
        ref={(ref) => { this.mapRef = ref }}>
            {response.results[0].events.map((event, i) => {
               return (
                    <CircleMarker key={i} center={[event.asnLatitude, event.asnLongitude]} color="green" radius={20}>
                        <Popup>Popup in CircleMarker</Popup>
                    </CircleMarker>
               ) 
            })}
            <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </Map>
    }
}
