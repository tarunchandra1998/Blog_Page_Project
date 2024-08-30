import { useEffect, createContext, useContext, useState } from "react";

const AuthContext = createContext();

// By Auth Provider we can access from anywhere
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  useEffect(() => {
    const data = localStorage.getItem("auth");

    if (data) {
      const parsedData = JSON.parse(data);
      setAuth({
        ...auth,
        user: parsedData.user,
        token: parsedData.token,
      });
    }
    // for disable unnecessary page loading
    //eslint-disable-next-line
  }, []);
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};
//------------------7.33
// exporting the context to get it work
// custom  hook
const useAuth = () => useContext(AuthContext);

// now we can use this useAuth anywhere

export { useAuth, AuthProvider };
