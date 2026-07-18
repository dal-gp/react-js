# WorldWise

A travel tracking app where you can log all the cities you have visited around
the world. Built to learn React Router, the Context API, and how to build a
real-world single page application with an interactive map.

> **Work in progress** - this README gets updated as new features are added.

## What it does

- A marketing homepage with a "Start tracking now" button
- Product and Pricing pages
- A login page (pre-filled with test credentials for development)
- Navigation that highlights the current page
- The main app at /app with a sidebar showing a list of visited cities loaded from a fake API
- Countries list derived automatically from the cities data
- Loading spinner while cities are being fetched
- Empty state message when no cities have been added yet
- Click a city in the list to see its full detail view (name, date, notes, flag)
- Active city highligthted in the list while its detail is open
- Interactive Leaflet map with markers and popups for each visited city
- Click anywhere on the map to open the add-city form
- Map moves to the selected city when clicked in the list
- "Use your position" button moves the map to your GPS location
- Click the map to open a fom that auto-fills city and country via a free reverse geocoding API ( no key needed)
- Flag emoji derived automatically from the country code
- Friendly error message if user clicks in the ocean or somewhwere with no city
- Date picker to select when you visited the city
- Submit the form to save the city - appears in the list immediately
- Form shows a loading/disabled state while saving
- Delete a city by click x button on any list
- Login page with email and password (test credentials: jack@example.com / qwerty)
- After login, redirected to the app automatically
- Logged-in user shown in the top right corner with avatar and name
- Logout button returns to the homepage
- Protected routes -- visiting /app without logging in redirects to the homepage

## How to run it

You need two terminals.

**Terminal 1 - fake API:**

```bash
npm install
npm run server
```

**Terminal 2 - React app**

```bash
npm run dev
```

Then open the URL shown in the terminal (usually [http://localhost:5173](http://localhost:5173))

> Note: this project uses Vite, not Create React App. The dev command is `npm run dev` not `npm start`.

## Tech

- React 18
- Vite (build tool)
- React Router (routing and navigation)
- CSS Modules (component-scoped styling)
- React Leaflet + Leaflet (interactive map)
- json-server (fake REST API for cities data)
- BigDataCloud reverse geocoding API (free, no API key)

## What I learned

**Routing and single page applications** - before this project I didnot understand what "single page application" meant. Now I do. When you click a link on a normal website the browser loads a completely new page from the server. In an SPA, JavaScript just swaps out the component and updates the URL without reloading. That is why it feels so fast and smooth. React Router is what handles this in React itself does not come with routing built in.

**Setting up routes** - you need three components from React Router: `BrowserRouter` wraps the whole app, `Routes` is a container for your route definitions, and `Route` maps a URL path to a component. The `path="*"` route at the end catches any URL that doesn't match anything else - that is your 404 page.

**Link vs NavLink** - you can't use a regular `<a>` tag for internal navigation in a React app because it causes a full page reload. React Router gives you `Link` and `NavLink` instead. `NavLink` is the one to use in navigation menus because it automatically adds an `active` CSS class to whichever link matches the current URL. That way you can style the current page link differently without any manual logic.

**Navigate component for redirects** - a small but important thing. THe index route at `/app` needs to redirect to `/app/cities` so the Cities tab is always active by default. The `<Navigate replace to="cities" />` component does this decleratively right in JSX. The `replace` prop is essential - without it the redirect adds to the browser history stack and the user gets stuck in a redirect loop when they click Back. With `replace`, the `/app` entry gets swapped out and Back works normally.

**Programmatic navigation** - `useNavigate` was simpler than I expected. You get a `navigate` function and call it with a path or a number. `navigate("form")` goes to the form, `navigate(-1)` goes back like clicking the browser back button. THe tricky part was the Back button inside a form - clicking it was submitting the form and reloading the page before `navigate(-1)` could fire. THe fix is always `e.preventDefault()` first, then navigate. Also learned a useful CSS Modules trick: `styles[type]` where type is a prop string like "primary" or "back" - lets you pick a class dynamically without hardcoding it.

**Query string for global state** - after URL params, the query string was the next piece that made things click. THe position of the city on the map (lat/lng) goes into the URL as a query string when you click a city: `/app/cities/1234567?lat=38.72&lng=-9.14`. Then the Map component reads it with `useSearchParams().get("lat")`. No prop drilling, no lifted state - the URL just is the shared state. The gotch is that `searchParams` is not a plain object so you can't do `searchParams.lat`, you have to use `.get('lat')`.

**URL params** - this was a satisfying thing to learn. Instead of stroing the selected city in React state and passing it down through props, I just put the city ID in the URL. Click a city, the URL becomes `/app/cities/1234567`, and the City component reads that ID with `useParams()`. No state lifted, no prop drilling. THe data just lives in the URL. One small thing that tripped me up: relative vs absolute paths in the Link `to` prop. If I write `to={id}` it appends to the current URL path, giving me `/app/cities/1234567`. If i write `to={/${id}}` with a leading slash it replaces the whole path and I just get `/1234567` which is wrong.

**Nested routes and Outlet** - this was the most intersting routing concept so far. When you want different content to show inside the same layout based on URL, you use nested routes. For example, /app/cities and /app/countries both show the AppLayout but with different content in the sidebar. The Outlet component is what makes this work - it is a placeholder inside the parent component where React Router drops in the matched child route. Without Outlet, nested routes would be defined but nothing would actually render.

**CSS Modules** - instead of one big global CSS file, each component gets its own `.module.css` file. Behind the scenes every class name gets a random string attached to it, so two components can both have a class called `.nav` and they will never clash. The only tricky part was styling React Router's `active` class - since that class name comes from an external library and is nto scoped by CSS Modules, I had to wrap it with `:global(.active)` so it matches the literal class name instead of getting renamed.

**camelCase class names** - when writing CSS Modules you have to name your classes in camelCase (like `ctaLink`) instead of the usual kebab-case (`case-link`). The reason is that CSS Module classes get exported as a JS object, and `styles.cta-link` is not valid JavaScript. You would need `sytles["cta-link"]` instead, which is annoying, so camelCase is the convention.

**public/ vs src/assets/** - images that you reference by a plain string path (`src="/logo.png"`) go in the `public/` folder. Images you want to `import` directly int your JS go in `src/assets/`. I used the public folder approach for all the images here, which keeps things simple.

**Context + useReduer pattern** - after getting the app working with the useState inside the context, I refactored it to use useReducer instead. All three state variables (cities, isLoading, currentcity) moved into one initialState object and all transitions moved into one reducer function. The big advantage is atomic updates - when a city is created, one dispatch can update the cities array AND set the new city as current active city at the same time. With separate useState calls you need two setters. Actions types are named as past-tense events(`cities/created`, `cities/deleted`) not(`setCities`) - this makes it immediately obvious what triggered the change and what side effects it has. The async handler functions (getCity, createCity, deleteCity) still live outside the reducer because reducers must be pure - no fetch calls allowed inside them.

**Context API for state management** - after learning React Router, the Context API was the next big thing. All the cities data (fetching, loading state, error handling) moved out of App.jsx into a CitiesContext.jsx file. App.jsx went from having useState, useEffect, BASE_URL, and prop passing all over the place to just having route defintions. Components like CityList now all useCities() to get their data directly - no props passed down from parent to child. The custom hook pattern with the undefined guard (throws a clear error if used outside the provider) is something I will use in every project going forward.

**React Leaflet** - two packages needed: `leaflet` (the base library) and `react-leaflet` (the React wrapper). The Leaflet CSS must be imported globally - not in a CSS module. The `MapContainer` `center` prop is not reactive, so moving the map requires a custom component that uses the `useMap()` hook to call `map.setView()`. Detecting map clicks needs `useMapEvents({click: e => ... })` inside another custom component. Both return null - they exist only for their side effects.

**Geolocation** - the `useGeolocation` custom hook I build earlier in the course dropped straight into this project with no changes. This was the first time I saw the real value of custom hooks being portable between projects.

**Reverse geocoding in the form** - when the form opens after a map click, it reads `lat` and `lng` from the URL query string and immediately fetches the BigDataCloud reverse geocoding API to get the city name, country, and country code. The country code gets covnerted to a flag emoji using a clever Unicode trick (`convertToEmoji`). I also had to handle the case where the user clicks in the ocean - the API returns no `countryCode` in that case, so i throw an error and show a message instead of a broken form. One thing that was easy to miss: `lat` and `lng` must be in the `useEffect` dependency array, otherwise clicking a different spot on the map does nothing - the form just shows stale data from the first click.

**useUrlPosition custom hook** - both Map and Form needed to read `lat` and `lng` from the URL query string. Instead of duplicating the `useSearchParams` logic in both, I extracted it into a `useUrlPosition` hook that returns `[lat, lng]`. This was the first time I built a custom hook on top of another custom hook (`useSearchParams` from React Router) - that is completely fine as long as there is at least one React hook inside.

**Creating data with a POST request** - the form submits a POST request to json-server to save a new city. One thing that surprised me: after the POST succeeds, the cities list in the sidebar doesn't automatically update. I had to manually add the new city to the React state array with `setCities(c => [...c, data])`. This is fine for a small app but in a bigger project React Query handles this automatically. The other important thing was making `handleSubmit` async so i could `await createCity(newCity)` before calling `navigate("/app/cities")`. Without the await, the navigation fires before the city is saved and the list looks wrong.

**Deleting data with a DELETE request** - simpler than POST. Just pass {method: "DELETE"} to fetch with the resource URL - no body, no headers, no response to parse. The tricky part was the delete button living inside a <Link> element. Clicking the button was also triggering the link navigation to the city detail page. Fix: `e.preventDefault()` in the button's onClick handler stops the parent link from firing. Then manually remove the city from the state array with `filter` so it disappears immediately without a page reload.

**react-datepicker** - swapped the plain date text input for a proper date picker component from npm. The main difference from a normal input: the `onChange` callback receives a `Date` object directly, not an event, so it's `(date) => setDate(date)` not `(e) => setDate(e.target.value)`.

**Authentication flow** - the login redirect was the trickiest part here. After calling `login(email, password)`, the `isAuthenticated` state doesn't update until the next render -- so you can't just call `navigate("/app")` right after. Instead I used a `useEffect` that watches `isAuthenticated` and redirects when it becomes true. This also handles the case where an already-logged-in user visits the login page -- the effect fires immediately and redirects them. The `{replace: true}` option on navigate is essential -- without it, clicking Back after login sends you to the login page, which immediately redirects you forward again (an infinite loop). With replace, the login page is removed from history entirely. For logout: I had to navigate away before React re-renders the User component with a null user object, otherwise reading `user.avatar` crashes.

**Protected routes** - the ProtectedRoute component wraps AppLayout and checks `isAuthenticated` from the auth context. If false, it redirects to "/". There was a subtle bug `useEffect` fires _after_ the component renders, so without a null guard, the child component (including User) would try to render with a null user object and crash before the redirect could fire. The fix: return `null` when not authenticated so children never mount in the first place.

## Project structure

```
src/
    pages/      ← page-level components matched to routes
        Homepage.jsx + Homepage.module.css
        Product.jsx + Product.module.css
        Pricing.jsx         ← shares Product.module.css
        Login.jsx + Login.module.css
        AppLayout.jsx       ← main app screen (list + map), still a placeholder
        PageNotFound.jsx
        ProtectedRoute.jsx
    components/ ← reusable UI components
        PageNav.jsx + PageNav.module.css
        AppNav.jsx + AppNav.module.css
        Logo.jsx + Logo.module.css
        Sidebar.jsx + Sidebar.module.css
        Map.jsx + Map.module.jsx
        CityList.jsx + CityList.module.css
        CityItem.jsx + CityItem.module.css
        CountryList.jsx + CountryList.module.css
        CountryItem.jsx + CountryItem.module.css
        Button.jsx + Button.module.css
        BackButton.jsx + BackButton.module.css
        Spinner.jsx + Spinner.module.css
        Message.jsx + Message.module.css
        Form.jsx + Form.module.css
        User.jsx + User.module.css
    contexts/
        CitiesContext.jsx   ← cities state, fetching, useCities() hook
        FakeAuthContext.jsx
    hooks/
        useGeolocation.jsx  ← reusable geolocation hook
        useUrlPosition.js   ← reusable url position hook
    index.css               ← global resets, fonts, CSS variables, .cta class
    App.jsx                 ← route definitions
data/                       ← will hold city/country data for the main app
public/                     ← images referenced by URL (logo.png, bg.jpg, etc)
```
