import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import Homepage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import { CitiesProvider } from "./contexts/CitiesContext";

/**
 * Root component - defines all application routes.
 * BrowserRouter enables client-side routing (no page reloads).
 * Routes picks the first matching Route and renders its element.
 * path="*" catches any URL not matched by the other routes (404).
 *
 * kept in same order as nav links
 */
function App() {
  return (
    <CitiesProvider>
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
            {/* index route: /app with no sub-path shows cities by default
              /app redirects to /app/cities
              replace: swaps history entry instead of pushing - Back button works
              */}
            <Route index element={<Navigate replace to="cities" />} />
            {/* /app/cities */}
            {/* No props! CityList will read from context via useCities() */}
            <Route path="cities" element={<CityList />} />
            {/* Dynamic route - :id will be any city id */}
            <Route path="cities/:id" element={<City />} />
            {/* /app/countries */}
            {/* No props! CountryList will read from context via useCities() */}
            <Route path="countries" element={<CountryList />} />
            {/* /app/form - linked from map click, not from AppNav*/}
            <Route path="form" element={<Form />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </CitiesProvider>
  );
}

export default App;
