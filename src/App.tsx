import { useRoutes, ActiveLink } from "raviger";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Upload } from "./pages/Upload";
import { Viewer } from "./pages/Viewer";
import { Search } from "./pages/Search";
import { Filesystem } from "./pages/Filesystem";
import { Config } from "pages/Config";
import { NotFoundPage } from "./pages/NotFoundPage";
import { Auth } from "./components/Auth";
import { ThemeToggle } from "components/ThemeToggle";
import { normalizePath } from "utils/url";

const routeConfig = [
  { path: "/", label: "Home", component: () => <Home /> },
  { path: "/about", label: "About", component: () => <About /> },
  { path: "/upload", label: "Upload", component: () => <Upload /> },
  { path: "/viewer", label: "Viewer", component: () => <Viewer /> },
  { path: "/search", label: "Search", component: () => <Search /> },
  { path: "/filesystem", label: "Filesystem", component: () => <Filesystem /> },
  { path: "/config", label: "Config", component: () => <Config /> },
].map((route) => ({
  ...route,
  path: normalizePath(route.path),
}));

const routes = Object.fromEntries(
  routeConfig.map(({ path, component }) => [path, component])
);

const routeNav = routeConfig.map(({ path, label }) => ({ path, label }));

const App = () => {
  const routeResult = useRoutes(routes);
  return (
    <div>
      <div className="navbar p-0">
        <div className="flex-1">
          {routeNav.map(({ path, label }) => (
            <ActiveLink
              key={label}
              href={path}
              className="btn btn-ghost"
              exactActiveClass="btn-active"
            >
              {label}
            </ActiveLink>
          ))}
        </div>
        <div className="flex-none gap-2">
          <Auth />
          <ThemeToggle />
        </div>
      </div>
      {/* This makes the page take up all the space minus 4rem for the padding and 4rem for the header */}
      <div className="px-8 py-8 h-[calc(100vh-8rem)]">
        {routeResult || <NotFoundPage />}
      </div>
    </div>
  );
};

export default App;
