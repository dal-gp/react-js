import CityItem from "./CityItem";
import Spinner from "./Spinner";
import Message from "./Message";
import styles from "./CityList.module.css";

/**
 * Renders a list of visited cities.
 * Three possible UI states: isLoading, empty, populated.
 *
 * @param {Array} cities - Array of city objects from API
 * @param {boolean} isLoading - True while fetch is in progress
 */
function CityList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  /** Empty state - shown on first use before any cities are added */
  if (!cities.length)
    return <Message message="Add your city by clicking on a city on the map" />;
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
