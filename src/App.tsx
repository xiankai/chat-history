import { useRoutes, Link } from 'raviger';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Upload } from './pages/Upload';
import { Viewer } from './pages/Viewer';
import { Search } from './pages/Search';
import { NotFoundPage } from './pages/NotFoundPage';

const routes = {
  '/': () => <Home />,
  '/about': () => <About />,
  '/upload': () => <Upload />,
  '/viewer': () => <Viewer />,
  '/search': () => <Search />,
};

const App = () => {
  const routeResult = useRoutes(routes);
  return (
    <div>
      <div id="nav">
        <Link href="/">Home</Link> | <Link href="/about">About</Link> |
        <Link href="/upload">Upload</Link> | <Link href="/viewer">Viewer</Link>{' '}
        | <Link href="/search">Search</Link>
      </div>
      {routeResult || <NotFoundPage />}
    </div>
  );
};

export default App;
