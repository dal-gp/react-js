import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import styles from "./Map.module.css";

/**
 * Interactive map using React Leaflet.
 * Placeholder marker at default center
 *
 * Map container - reads position from query string.
 * Any component can read the same values - no prop drilling needed.
 *
 * useSearchParams returns [searchParams, setSearchParams]
 * - mirrors useState's [value, setter] pattern.
 */
function Map() {
  /**
   * searchParams: URLSearchParams instance - use .get(), not dot notation
   * setSearchParams: updates the query string (replaces entirely)
   */
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  /**
   * State because it will update when user selects a city.
   * @type {[Array, Function]}
   */
  const [mapPosition, setMapPosition] = useState([40, 0]);
  return (
    <div className={styles.mapContainer}>
      <MapContainer
        className={styles.map} // REQUIRED: sets height 100% so map is visible
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true} //false by default - enable for usability
      >
        {/*
         * TileLayer: the map background imagery.
         * Using openstreetmap.fr/hot instead of .org for more organic colours.
         * Free to use, no API key required.
         */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {/* Placeholder marker */}
        <Marker position={mapPosition}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Map;
