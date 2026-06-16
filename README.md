# WorldWise

A travel tracking app where you can log all the cities you have visited around
the world. Built to learn React Router and how single page applications work.

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

## Project structure

```
src/
    pages/      ← page-level components matched to routes
        Homepage.jsx
        Product.jsx
        Pricing.jsx
        PageNotFound.jsx
    components/ ← reusable UI components
        PageNav.jsx
    App.jsx     ← route definitions live here
```
