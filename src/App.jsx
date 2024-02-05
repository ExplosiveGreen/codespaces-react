import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from './components/Home';
import Login from './components/Login';
import E404 from './components/E404';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/Login",
    element: <Login/>,
  },
  {
    path: "*",
    element: <E404/>,
  },
]);
function App() {
  return (
    <createBrowserRouter>
      <RouterProvider router={router} />
    </createBrowserRouter>
  );
}

export default App;
