import { createContext } from "react";

export const AuthContext = createContext({
    user: {},
    isAuth: false,
    addAuth: () => {},
    removeAuth: () => {},
  });


  