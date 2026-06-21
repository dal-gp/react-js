import styles from "./CountryItem.module.css";

/**
 * Single country list item - shows flag emoji and country name.
 *
 * @param { {country: string, emoji: string} } country
 */
function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>{country.emoji}</span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
