import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useCities } from "../contexts/CitiesContext";

import styles from "./City.module.css";
import Spinner from "./Spinner";
import BackButton from "./BackButton";

/**
 * Formats an ISO date string to human-readable format.
 *
 * @param {string} date - ISO date string
 * @returns {string} e.g. "Thursday, October 31, 2027"
 */
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

/**
 * Detailed view for a single city.
 * Reads the city id from URL, fetches from context, displays full details.
 *
 * @returns City detail page or Spinner while loading
 */
function City() {
  /**
   * useParams returns an object matching the route's :param names.
   * Route is "cities/:id" → returns {id: "1234567"}
   */
  const { id } = useParams();

  const { getCity, currentCity, isLoading } = useCities();

  const { cityName, emoji, date, notes } = currentCity;

  /**
   * Fetch the city matching the URL id.
   * Depends on id: re-fetches when user navigates to a different city.
   * Depends on getCity: ESLint requirement for funtions used insdie effects.
   */
  useEffect(
    function () {
      getCity(id);
    },
    [id],
  );

  if (isLoading) return <Spinner />;
  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>
      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;
