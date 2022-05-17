import React, { useState, useEffect, createContext } from "react";
import { useCookies } from 'react-cookie'

export const  UserContext = createContext();

export const UserProvider = props => {

  const [cookies, setCookie] = useCookies(['token', 'user', 'userRole'])
  const [token, setToken] = useState(cookies.token)
  const [user, setUser] = useState(cookies.user);
  const [userRole, setUserRole] = useState(cookies.userRole);
  const [pageSize, setPageSize] = useState(10);

  return (
    < UserContext.Provider value={[user, token, userRole, pageSize, setUser, setToken, setUserRole, setPageSize]}>
      {props.children}
    </ UserContext.Provider>
  );
};
