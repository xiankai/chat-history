import { useRoutes, A } from 'hookrouter';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Upload } from './pages/Upload';
import { Viewer } from './pages/Viewer';
import { Search } from './pages/Search';
import { NotFoundPage } from './pages/NotFoundPage';
import { StrictMode } from 'react';

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
        <A href="/">Home</A> |<A href="/about">About</A> |
        <A href="/upload">Upload</A> |<A href="/viewer">Viewer</A> |
        <A href="/search">Search</A>
      </div>
      <StrictMode>{routeResult || <NotFoundPage />}</StrictMode>
    </div>
  );
};

export default App;
