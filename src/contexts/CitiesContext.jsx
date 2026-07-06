import { useState, useEffect, createContext, useContext } from "react";

const BASE_URL = "http://localhost:8000";

/**
 * Private context - not exported. Access via useCities() hook only.
 */
const CitiesContext = createContext();

/**
 * Provider component for all city-related state.
 * Wraps the app so any component can access cities data via useCities()
 *
 * @param {React.ReactNode} children - The component tree to provide to
 */
function CitiesProvider({ children }) {
  /**
   * cities: array of city objects from the API
   * @type {[Array, Function]}
   */
  const [cities, setCities] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Starts as {} not null - safe to destructure even before data loads
   * @type {[Object, Function]}
   */
  const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    /**
     * fetches all cities from API on intial render.
     * try/catch ensures isLoading always resets even if fetch fails.
     */
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch {
        alert("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  /**
   * Fetches a single city by ID from the API.
   * Called by the City component when it mounts or when the URL id changes.
   *
   * @param {string} id - City ID from the URL param
   */
  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch {
      alert("There was an error loading the city...");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity, // the single city being viewed
        getCity, // function to fetch a city by id
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
