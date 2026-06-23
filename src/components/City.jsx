import { useParams } from "react-router-dom";

/**
 * Detailed view for a single city.
 * Reads the city id from the URL using useParams.
 * @returns City detail placeholder
 */
function City() {
  /**
   * useParams returns an object matching the route's :param names.
   * Route is "cities/:id" → returns {id: "1234567"}
   */
  const { id } = useParams();
  return <div>City {id}</div>;
}

export default City;
