import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import routes from './router';
import { useSelector } from 'react-redux'
function App() {
  const user = useSelector((state) => state.user.user)
  const router = createBrowserRouter(
  routes.filter(item => 
    (!user && item.auth.includes('noauth')) ||
    (user && item.auth.includes(user.__t))
  )
);
  return (
    <createBrowserRouter>
      <RouterProvider router={router} />
    </createBrowserRouter>
  );
}

export default App;
