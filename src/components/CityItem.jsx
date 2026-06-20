import styles from "./CityItem.module.css";

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
 * Delete button has no functionality yet.
 *
 * @param {{emoji: string, cityName: string, date: string, id: number}} city
 * @returns
 */
function CityItem({ city }) {
  return (
    <li className={styles.cityItem}>
      <span className={styles.emoji}>{city.emoji}</span>
      <h3 className={styles.name}>{city.cityName}</h3>
      <time className={styles.date}>({formatDate(city.date)})</time>
      <button className={styles.deleteBtn}>&times;</button>
    </li>
  );
}

export default CityItem;
