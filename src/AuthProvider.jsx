import React, {useState, useEffect} from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState({});
  const [isAuth, setAuth] = useState(false);

  const addAuth = () => {
      setAuth(true);
  };

  const removeAuth = () => {
      setAuth(false);
  };

  useEffect(() => {
      if (isAuth) {
      fetch("https://social-media-be-oqoe.onrender.com/user/current",
          {
            credentials: 'include',
          }
      )
        .then((response) => response.json())
        .then((response) => setUser(response.user))
        .catch((error) => console.error(error));
  }
    }, [isAuth]);

  return (
  <AuthContext.Provider value={{ user, isAuth, addAuth, removeAuth }}>
      {children}
    </AuthContext.Provider>
    );
};