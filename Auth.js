import { createContext, useContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import Loading from "./components/Loading";
import Login from "./components/Login";
import nookies from "nookies";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    return auth.onIdTokenChanged(async (user) => {
      const token = await user?.getIdToken();
      if (!user) {
        console.log("no user");
        setCurrentUser(null);
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        nookies.set(undefined, "token", token, {});
        return;
      }
      setCurrentUser(user);
      setLoading(false);
      nookies.set(undefined, "token", token, {});

      console.log("token", token);
      console.log("user", user);
    });
  }, []);

  if (loading) {
    return <Loading type="bubbles" color="yellowgreen" />;
  }
  if (!currentUser) {
    return <Login />;
  } else {
    return (
      <AuthContext.Provider value={{ currentUser }}>
        {children}
      </AuthContext.Provider>
    );
  }

};

export const useAuth = () => useContext(AuthContext);
