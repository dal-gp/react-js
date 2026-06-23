import { BrowserRouter, Route, Routes } from "react-router-dom";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import Homepage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import CityList from "./components/CityList";
import { useEffect, useState } from "react";
import CountryList from "./components/CountryList";
import City from "./components/City";

/**
 * Root component - defines all application routes.
 * BrowserRouter enables client-side routing (no page reloads).
 * Routes picks the first matching Route and renders its element.
 * path="*" catches any URL not matched by the other routes (404).
 *
 * kept in same order as nav links
 */
const BASE_URL = "http://localhost:8000";
function App() {
  /**
   * cities: array of city objects from the API
   * @type {[Array, Function]}
   */
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
        console.log(data);
        setCities(data);
      } catch {
        alert("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* index = default route at "/"  */}
        <Route index element={<Homepage />} />
        <Route path="product" element={<Product />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="login" element={<Login />} />

        {/* Nested routes - child paths are relative to "app".
            Pass cities and isLoading via element prop -
            this is why Route uses element={<JSX />} not component={Component} */}
        <Route path="app" element={<AppLayout />}>
          {/* index route: /app with no sub-path shows cities by default */}
          <Route
            index
            element={<CityList cities={cities} isLoading={isLoading} />}
          />
          {/* /app/cities */}
          <Route
            path="cities"
            element={<CityList cities={cities} isLoading={isLoading} />}
          />
          {/* Dynamic route - :id will be any city id */}
          <Route path="cities/:id" element={<City />} />
          {/* /app/countries */}
          <Route
            path="countries"
            element={<CountryList cities={cities} isLoading={isLoading} />}
          />
          {/* /app/form - linked from map click, not from AppNav*/}
          <Route path="form" element={<p>Form</p>} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
