import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";

const AuthCtx = createContext({
  user: null,
  isAuthed: false,
  ready: false,
  setUser: () => {},
  setAuthed: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Hydrate từ token có sẵn
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return setReady(true);
    api.get("/auth/me")
      .then(({ data }) => setUser(data))
      .catch(() => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const setAuthed = (token, userObj, remember) => {
    if (remember) localStorage.setItem("token", token);
    else sessionStorage.setItem("token", token);
    if (userObj) setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthCtx.Provider
      value={{ user, isAuthed: !!user, ready, setUser, setAuthed, logout }}
    >
      {children}
    </AuthCtx.Provider>
  );
}
