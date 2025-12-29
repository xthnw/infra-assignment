import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const WMS_URL = "https://gis.onep.go.th/geoserver/onepmap/wms";
const LAYER_NAME = "onepmap:9000_2566_environment";

export default function WMSMap() {
    return (
        <div className="relative h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200">

            <div className="absolute top-4 right-4 z-[1000] bg-white px-3 py-1 rounded shadow text-sm font-bold text-blue-700">
                🌐 Live WMS Layer
            </div>

            <MapContainer center={[13.7563, 100.5018]} zoom={6} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <WMSTileLayer
                    url={WMS_URL}
                    layers={LAYER_NAME}
                    format="image/png"
                    transparent={true}
                    version="1.1.0"
                    opacity={0.6}
                />
            </MapContainer>

        </div>
    );
}