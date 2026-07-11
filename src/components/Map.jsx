import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useUrlPosition } from "../hooks/useUrlPosition";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import styles from "./Map.module.css";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";

import Button from "./Button";

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
   * cities: read directly from context - no props needed.
   * THis is the power of global state - just grab it anywhere.
   */
  const { cities } = useCities();

  /**
   * State because it will update when user selects a city.
   * mapPosition: the remembered map center.
   * Persisits in state so map doesnot jump back to default
   * when query string disappears (e.g. user clicks Back).
   * @type {[Array, Function]}
   */
  const [mapPosition, setMapPosition] = useState([40, 0]);

  /**
   * Rename destructred values to avoid naming collisions:
   * isLoading -> isLoadingPosition (cities context also has isLoading)
   * position -> geolocationPosition (more specific, avoids ambiguity)
   */
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  /**
   * Read lat/lng from URL - set when user clicked the city
   * useUrlPosition encapsulates the useSearchParams logic for reuse.
   */
  const [mapLat, mapLng] = useUrlPosition();

  /**
   * Sync URL lat/lng into mapPosition state.
   * Only updates when both values exist - prevents reset on Back navigation.
   */
  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng],
  );

  /**
   * Sync geolocation position into mapPosition.
   * Can't write to mapPosition directly from inside the hook,
   * so useEffect watches geolocationPosition and syncs it.
   * Trade-off: introduces one extra render cycle.
   */
  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition],
  );
  return (
    <div className={styles.mapContainer}>
      {/* Button outside MapContainer - Leaflet doesnot handle React events */}
      {/* Hidden once position found - no value in showing it again */}
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        className={styles.map} // REQUIRED: sets height 100% so map is visible
        center={mapPosition}
        zoom={6}
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

        {/* One marker per city - position from city.position.lat/lng */}
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            {/* Popup content: emoji + city name */}
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        {/* Moves map to mapPosition whenever it changes */}
        <ChangeCenter position={mapPosition} />

        {/* Handles map clicks -> navigate to form with lat/lng */}
        <DetectClick />
      </MapContainer>
    </div>
  );
}

/**
 * Moves the map to a new position when position prop changes.
 * Required because MapContainer center prop is NOT reactive.
 * Must be rendered inside MapContainer to access the map instance.
 *
 * @param {Array} position - [lat, lng] to center the map on
 * @returns {null} Renders nothing - only has a side effect
 */
function ChangeCenter({ position }) {
  const map = useMap(); // gets current Leaflet map instance
  map.setView(position);
  return null;
}

/**
 * Detects map clicks and navigates to the form with lat/lng in URL.
 * useMapEvents is the React Leaflet way to handle map events.
 * Must be rendered inside MapContainer.
 *
 * @returns {null} Renders nothing - only has a side effect
 */
function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    /**
     * e.latlng: Leaflet's clicked position object {lat, lng}
     * Not a native browser event = comes from Leaflet's event system.
     * Pass position to form via query string - no global state needed.
     */
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
  return null;
}

export default Map;
