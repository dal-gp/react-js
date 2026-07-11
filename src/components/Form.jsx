import { useEffect, useState } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Spinner from "./Spinner";
import Message from "./Message";

const BASE_URL = `https://api.bigdatacloud.net/data/reverse-geocode-client`;

/**
 * TODO: comment
 */
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  // Form field state
  const [cityName, setCityName] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [countryName, setCountryName] = useState("");
  const [emoji, setEmoji] = useState("");

  // Geocoding state - separate from context isLoading
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState("");

  /**
   * Read lat/lng from URL - set when user clicked the map.
   *useUrPosition ecapsulates the useSearchParams logic for reuse.
   */
  const [lat, lng] = useUrlPosition();

  /**
   * Fetch city data from reverse geocoding API whenever lat/lng changes.
   * lat/lng must be in dep array - without them clicking a new location
   * changes the URL but the effect never re-runs (stale data shown).
   */
  useEffect(
    function () {
      async function fetchCityData() {
        try {
          setIsLoadingGeocoding(true);
          setGeocodingError(""); // reset previous error before each fetch
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`,
          );
          const data = await res.json();

          // Guard: no countryCode means user clicked ocean/empty area
          if (!data.countryCode)
            throw new Error(
              "That does not seem to be a city. Click somewhere else 😉",
            );
          // Pre-fill form fields from API response
          setCityName(data.city || data.locality || ""); // locality fallback for small places
          setCountryName(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (e) {
          setGeocodingError(e.message);
        } finally {
          setIsLoadingGeocoding(false);
        }
      }
      if (!lat || !lng) return;
      fetchCityData();
    },
    [lat, lng], // re-run when position changes
  );

  // Show spinner while geocoding
  if (isLoadingGeocoding) return <Spinner />;

  // Show error if clicked outside a city (ocean, empty area)
  if (geocodingError) return <Message message="Ouch" />;

  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          type="text"
          id="cityName"
          value={cityName}
          onChange={(e) => setCityName(e.targer.value)}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>
      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          type="text"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to x</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
