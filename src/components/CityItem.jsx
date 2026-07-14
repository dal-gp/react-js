import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";

/**
 * Formats an ISO date string to a human-readable format.
 * Defined outside component - no reason to recreate on every render.
 *
 * @param {string} date - ISO date string
 * @returns {string} e.g "October 31, 2027"
 */
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

/**
 * Single city list item - shows emoji, name, date and delete button.
 * Clicking navigates to /app/cities/:id
 * Uses relative path (no leading slash) so it appends to /app/cities.
 * Builds the URL for this city's details page
 * - id ( URL param ): identifies which city to show
 * - lat, lng (query string): passes map position globally via URL
 *   so Map component can read it without prop drilling
 * Highlights itself when it matches the currently viewed city.
 * Uses currentCity from context - no props needed.
 *
 * @param {{emoji: string, cityName: string, date: string, id: number}} city
 */
function CityItem({ city }) {
  /**
   * currentCity: the city currently being viewed in the detail panel.
   * Compare IDs (not object) - same city fetched at different times
   * will have different object references but the same id.
   */
  const { currentCity, deleteCity } = useCities();

  /**
   * Handles delete button click.
   * e.preventDefault() required - button is inside a <Link>,
   * without it clicking x also triggers link navigation to city detail.
   *
   * @param {MouseEvent} e
   */
  function handleClick(e) {
    e.preventDefault();
    deleteCity(city.id);
  }
  return (
    <li>
      {/* Relative path: appends id to curent /app/cities URL
          to={`${id}`}  → /app/cities/1234567
          to-{`/${id}`} → /1234567
      */}
      <Link
        to={`${city.id}?lat=${city.position.lat}&lng=${city.position.lng} `}
        className={`${styles.cityItem} ${city.id === currentCity.id ? styles["cityItem--active"] : ""}`}
      >
        <span className={styles.emoji}>{city.emoji}</span>
        <h3 className={styles.name}>{city.cityName}</h3>
        <time className={styles.date}>({formatDate(city.date)})</time>
        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
