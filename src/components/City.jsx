import { useParams, useSearchParams } from "react-router-dom";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  return (
    <div>
      <h1>City {id}</h1>
      <p>
        Position: {lat}, {lng}
      </p>
    </div>
  );
}

export default City;
