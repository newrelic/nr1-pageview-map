import React from 'react';
import PropTypes from 'prop-types';
import { Map, Marker, Popup, TileLayer, Rectangle } from 'react-leaflet'

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
        }
    }

    render() {
        return <Map
        className="containerMap"
        style={{height: '90vh'}}
        center={[49.7497638, 18.6354709]}
        zoom={13}
        zoomControl={true}
        ref={(ref) => { this.mapRef = ref }}>
            <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </Map>
    }
}
