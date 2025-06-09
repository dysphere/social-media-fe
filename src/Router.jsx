import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RequireAuth from "./Auth";
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import Users from './Users';
import ErrorPage from './ErrorPage';
import Profile from "./Profile";
import Posts from "./Posts";
import Post from "./Post";

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
        element: (
          <RequireAuth><Posts/></RequireAuth>),
      },
      {
        path: 'post/:id',
        element: (
        <RequireAuth><Post/></RequireAuth>)
      },
      {
        path: 'users',
        element: (
        <RequireAuth><Users/></RequireAuth>),
      },
      {
        path: 'profile/:id',
        element: (
        <RequireAuth><Profile/></RequireAuth>)
      },
    ]);
  
    return <RouterProvider router={router} />;
  };
  
  export default Router;