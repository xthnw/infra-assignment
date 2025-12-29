import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
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

const GEOJSON_URL = "/yanchumchon_2568.json";

function MapFocus({ data }: { data: GeoJSON.GeoJsonObject | null }) {
    const map = useMap();
    useEffect(() => {
        if (data) {
            const geoJsonLayer = L.geoJSON(data);
            // check ว่ามีข้อมูลไหมก่อนซูม (ป้องกัน error ถ้าไฟล์เปล่า)
            if (geoJsonLayer.getLayers().length > 0) {
                map.fitBounds(geoJsonLayer.getBounds());
            }
        }
    }, [data, map]);
    return null;
}

export default function GeoJSONMap() {
    const [geoData, setGeoData] = useState<GeoJSON.GeoJsonObject | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(GEOJSON_URL);
                setGeoData(response.data);
            } catch (err: unknown) {
                console.error("Error fetching local JSON:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="relative h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200">

            <div className="absolute top-4 right-4 z-[1000] bg-white px-3 py-1 rounded shadow text-sm font-bold text-green-700">
                📂 Local Data: ย่านชุมชนเก่า ทั่วประเทศ 2568
            </div>

            {loading && (
                <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-gray-100 bg-opacity-80">
                    <span className="text-green-600 font-bold animate-pulse">กำลังโหลดข้อมูลแผนที่...</span>
                </div>
            )}

            <MapContainer center={[13.7563, 100.5018]} zoom={6} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {geoData && (
                    <>
                        <GeoJSON
                            data={geoData}
                            style={{
                                color: "#ea580c",
                                weight: 2,
                                fillColor: "#f97316",
                                fillOpacity: 0.3
                            }}
                            onEachFeature={(feature: GeoJSON.Feature<GeoJSON.Geometry, Record<string, unknown> | null>, layer: L.Layer) => {
                                const props = (feature.properties || {}) as Record<string, unknown>;
                                // สร้างตาราง HTML แสดงข้อมูลทุก Field โดยอัตโนมัติ
                                let popupContent =
                                    `<div class="font-sans text-sm min-w-[200px]">
                    <h3 class="font-bold text-white bg-orange-600 px-2 py-1 rounded-t mb-0">📍 รายละเอียดพื้นที่
                    </h3>
                    <div class="max-h-[200px] overflow-y-auto border border-gray-200 border-t-0 p-2 bg-white rounded-b">
                    <table class="w-full text-left border-collapse">
                    <tbody>
                `;

                                // วนลูปดึง Key และ Value ออกมาสร้างแถวตาราง
                                Object.entries(props).forEach(([key, value]) => {
                                    // กรองเอาเฉพาะที่มีค่า (ไม่เอาค่า null)
                                    if (value !== null && value !== undefined && value !== "") {
                                        const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                                        popupContent += `<tr class="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td class="font-semibold text-gray-500 pr-2 py-1 text-xs uppercase align-top select-none w-1/3">${key}:</td>
                        <td class="text-gray-800 py-1 text-sm break-words">${displayValue}</td>
                        </tr>
                    `;
                                    }
                                });

                                popupContent += `
                        </tbody>
                    </table>
                    </div>
                </div>
                `;

                                layer.bindPopup(popupContent);
                            }}
                        />
                        <MapFocus data={geoData} />
                    </>
                )}
            </MapContainer>
        </div>
    );
}