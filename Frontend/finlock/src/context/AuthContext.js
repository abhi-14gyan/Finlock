import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get("/api/v1/auth/me", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, checkingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
