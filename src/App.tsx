import { useRoutes, ActiveLink } from "raviger";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Upload } from "./pages/Upload";
import { Viewer } from "./pages/Viewer";
import { Search } from "./pages/Search";
import { NotFoundPage } from "./pages/NotFoundPage";

const routes = {
  "/": () => <Home />,
  "/about": () => <About />,
  "/upload": () => <Upload />,
  "/viewer": () => <Viewer />,
  "/search": () => <Search />,
};

const routeNav = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/upload", label: "Upload" },
  { path: "/viewer", label: "Viewer" },
  { path: "/search", label: "Search" },
];

const App = () => {
  const routeResult = useRoutes(routes);
  return (
    <div>
      <div className="navbar">
        {routeNav.map(({ path, label }) => (
          <ActiveLink
            href={path}
            className="btn btn-ghost"
            exactActiveClass="btn-active"
          >
            {label}
          </ActiveLink>
        ))}
      </div>
      {routeResult || <NotFoundPage />}
    </div>
  );
};

export default App;
