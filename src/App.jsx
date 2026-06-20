import { BrowserRouter, Route, Routes } from "react-router-dom";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import Homepage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";

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
    <BrowserRouter>
      <Routes>
        {/* index = default route at "/"  */}
        <Route index element={<Homepage />} />
        <Route path="product" element={<Product />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="login" element={<Login />} />

        {/* Nested routes - child paths are relative to "app" */}
        <Route path="app" element={<AppLayout />}>
          {/* index route: /app with no sub-path shows cities by default */}
          <Route index element={<p>List of cities</p>} />
          {/* /app/cities */}
          <Route path="cities" element={<p>List of cities</p>} />
          {/* /app/countries */}
          <Route path="countries" element={<p>Countries</p>} />
          {/* /app/form - linked from map click, not from AppNav*/}
          <Route path="form" element={<p>Form</p>} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
