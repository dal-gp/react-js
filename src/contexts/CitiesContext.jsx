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

  /**
   * Creates a new city via POST request and updates local state.
   * Must update setCities manually - remote state change don't
   * automatically reflect in UI state (React Query handles this in bigger apps).
   *
   * @params {Object} newCity - City object to save: { cityName, countryName, emoji, date, notes, position}
   */
  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json(); // data = newCity with id assigned by json-server
      // console.log(data);

      // Manually sync UI state - without this, city only appears after page reload
      setCities((c) => [...c, data]);
    } catch {
      alert("There was an error creating city.");
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Deletes a city by ID from the API and removes it from local state.
   * Uses filter (not splice) - never mutate state directly.
   *
   * @param {Number} id - ID of the city to delete
   */
  async function deleteCity(id) {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${id}`, { method: "DELETE" });
      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      alert("There was an error creating city.");
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
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

/**
 * Custom hook to consume CitiesContext.
 * Throws a clear error if used outside CitiesProvider.
 */
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
