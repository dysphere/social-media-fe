import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import Users from './Users'
import ErrorPage from './ErrorPage'
import Profile from "./Profile"
import Posts from "./Posts";

const Router = () => {
    const router = createBrowserRouter([
      {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
          path: 'login',
          element: <Login/>,
      },
      {
        path: 'posts',
        element: <Posts/>,
      },
      {
        path: 'users',
        element: <Users/>,
      },
      {
        path: 'profile/:id',
        element: <Profile/>
      },
    ]);
  
    return <RouterProvider router={router} />;
  };
  
  export default Router;