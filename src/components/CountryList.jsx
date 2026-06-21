import CountryItem from "./CountryItem";
import Message from "./Message";
import Spinner from "./Spinner";
import styles from "./CountryList.module.css";

/**
 * Displays a deduplicated list of countries derived from the cities array.
 * Derives countries here (not in App) so the calculation only runs
 * when this component renders - not on every App re-render.
 *
 * @param {Array} cities - Full cities array from App state
 * @param {boolean} isLoading - True while cities are being fetched
 */
function CountryList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  /**
   * Derive unique countries from cities using reduce.
   * Each unique country contributes one object: {country, emoji}.
   * If a country already exists in the accumulator array, skip it.
   */
  const countries = cities.reduce((acc, cur) => {
    if (!acc.map((el) => el.country).includes(cur.country)) {
      return [...acc, { country: cur.country, emoji: cur.emoji }];
    } else {
      return acc;
    }
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
