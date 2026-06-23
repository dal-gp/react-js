import { useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

/**
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
  console.log(searchParams);
  console.log("-");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  return (
    <div className={styles.mapContainer}>
      <h1>Map</h1>
      <h1>
        Position: {lat}, {lng}
      </h1>
      {/* Example of prgrammatic update  */}
      <button onClick={() => setSearchParams({ lat: 1, lng: 2 })}>
        Change position
      </button>
    </div>
  );
}

export default Map;
