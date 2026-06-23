# WorldWise

A travel tracking app where you can log all the cities you have visited around
the world. Built to learn React Router and how single page applications work.

> **Work in progress** - this README gets updated as new features are added.

## What it does

- A marketing homepage with a "Start tracking now" button
- Product and Pricing pages
- A login page (pre-filled with test credentials for development)
- Navigation that highlights the current page
- The main app at /app with a sidebar showing a list of visited cities loaded from a fake API
- Loading spinner while cities are being fetched
- Empty state message when no cities have been added yet

## How to run it

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually [http://localhost:5173](http://localhost:5173))

> Note: this project uses Vite, not Create React App. The dev command is `npm run dev` not `npm start`.

## Tech

- React 18
- Vite (build tool)
- React Router (routing and navigation)
- CSS Modules (component-scoped styling)

## What I learned

**Routing and single page applications** - before this project I didnot understand what "single page application" meant. Now I do. When you click a link on a normal website the browser loads a completely new page from the server. In an SPA, JavaScript just swaps out the component and updates the URL without reloading. That is why it feels so fast and smooth. React Router is what handles this in React itself does not come with routing built in.

**Setting up routes** - you need three components from React Router: `BrowserRouter` wraps the whole app, `Routes` is a container for your route definitions, and `Route` maps a URL path to a component. The `path="*"` route at the end catches any URL that doesn't match anything else - that is your 404 page.

**Link vs NavLink** - you can't use a regular `<a>` tag for internal navigation in a React app because it causes a full page reload. React Router gives you `Link` and `NavLink` instead. `NavLink` is the one to use in navigation menus because it automatically adds an `active` CSS class to whichever link matches the current URL. That way you can style the current page link differently without any manual logic.

**URL params** - this was a satisfying thing to learn. Instead of stroing the selected city in React state and passing it down through props, I just put the city ID in the URL. Click a city, the URL becomes `/app/cities/1234567`, and the City component reads that ID with `useParams()`. No state lifted, no prop drilling. THe data just lives in the URL. One small thing that tripped me up: relative vs absolute paths in the Link `to` prop. If I write `to={id}` it appends to the current URL path, giving me `/app/cities/1234567`. If i write `to={/${id}}` with a leading slash it replaces the whole path and I just get `/1234567` which is wrong.

**Nested routes and Outlet** - this was the most intersting routing concept so far. When you want different content to show inside the same layout based on URL, you use nested routes. For example, /app/cities and /app/countries both show the AppLayout but with different content in the sidebar. The Outlet component is what makes this work - it is a placeholder inside the parent component where React Router drops in the matched child route. Without Outlet, nested routes would be defined but nothing would actually render.

**CSS Modules** - instead of one big global CSS file, each component gets its own `.module.css` file. Behind the scenes every class name gets a random string attached to it, so two components can both have a class called `.nav` and they will never clash. The only tricky part was styling React Router's `active` class - since that class name comes from an external library and is nto scoped by CSS Modules, I had to wrap it with `:global(.active)` so it matches the literal class name instead of getting renamed.

**camelCase class names** - when writing CSS Modules you have to name your classes in camelCase (like `ctaLink`) instead of the usual kebab-case (`case-link`). The reason is that CSS Module classes get exported as a JS object, and `styles.cta-link` is not valid JavaScript. You would need `sytles["cta-link"]` instead, which is annoying, so camelCase is the convention.

**public/ vs src/assets/** - images that you reference by a plain string path (`src="/logo.png"`) go in the `public/` folder. Images you want to `import` directly int your JS go in `src/assets/`. I used the public folder approach for all the images here, which keeps things simple.

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
    components/ ← reusable UI components
        PageNav.jsx + PageNav.module.css
        AppNav.jsx + AppNav.module.css
        Logo.jsx + Logo.module.css
        Sidebar.jsx + Sidebar.module.css
        Map.jsx + Map.module.jsx
    index.css   ← global resets, fonts, CSS variables, .cta class
    App.jsx     ← route definitions
data/           ← will hold city/country data for the main app
public/         ← images referenced by URL (logo.png, bg.jpg, etc)
```
