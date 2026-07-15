import {
  useState,
  useEffect,
  createContext,
  useContext,
  useReducer,
} from "react";

const BASE_URL = "http://localhost:8000";

/**
 * Private context - not exported. Access via useCities() hook only.
 */
const CitiesContext = createContext();

/**
 * Pure reducer - no side effects, no async.
 * All business logic + state transitions centralised here.
 * Action types named as past-tense events (not setters).
 *
 * @param {{cities, isLoading, currentCity, error}} state
 * @param {{type: string, payload?: any}} action
 */
function reducer(state, action) {
  switch (action.type) {
    case "loading": {
      return {
        ...state,
        isLoading: true,
      };
    }
    case "cities/loaded": {
      return {
        ...state,
        cities: action.payload,
        isLoading: false,
      };
    }
    case "city/loaded": {
      return {
        ...state,
        currentCity: action.payload,
        isLoading: false,
      };
    }
    case "city/created": {
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload, // also set as active - atomic update
      };
    }
    case "city/deleted": {
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: {}, // reset - deleted city should no longer be active
      };
    }
    case "rejected": {
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    }
    default:
      throw new Error("Unknown action type");
  }
}

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

/**
 * Provider component for all city-related state.
 * Wraps the app so any component can access cities data via useCities()
 *
 * @param {React.ReactNode} children - The component tree to provide to
 */
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(function () {
    /**
     * fetches all cities from API on intial render.
     * try/catch ensures isLoading always resets even if fetch fails.
     */
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading data",
        });
      }
    }
    fetchCities();
  }, []);

  /**
   * Fetches a single city by ID from the API.
   * Skips API call if the requested city is already loaded as currentCity.
   * Called by the City component when it mounts or when the URL id changes.
   * Note: URL params are strings - Number(id) needed to compare with numeric API id.
   *
   * @param {string} id - City ID from the URL param
   */
  async function getCity(id) {
    if (Number(id) === currentCity.id) return;
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading the city",
      });
    }
  }

  /**
   * Creates a new city via POST request and updates local state.
   * Must update setCities manually - remote state change don't
   * automatically reflect in UI state (React Query handles this in bigger apps).
   * Dispatches city/created which updates both cities array and currentCity automatically.
   *
   * @params {Object} newCity - City object to save: { cityName, countryName, emoji, date, notes, position}
   */
  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json(); // data = newCity with id assigned by json-server
      // console.log(data);

      // Manually sync UI state - without this, city only appears after page reload
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating city.",
      });
    }
  }

  /**
   * Deletes a city by ID from the API and removes it from local state.
   * Uses filter (not splice) - never mutate state directly.
   * Dispatches city/deleted which removes from cities array and resets currentCity.
   *
   * @param {Number} id - ID of the city to delete
   */
  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${BASE_URL}/cities/${id}`, { method: "DELETE" });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting city.",
      });
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity, // handler functions exposed - not dispatch
        createCity, // component stays clean, async logic stays here
        deleteCity,
        error,
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
