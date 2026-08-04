import { useCallback, useEffect, useMemo, useState } from "react";
import { getAccessToken } from "../services/api";
import { getCurrentUser, loginUser, loginWithGoogle, logoutUser, registerUser, updateUserProfile } from "../services/auth";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      if (!getAccessToken()) {
        setIsInitializing(false);
        return;
      }
      try {
        setUser(await getCurrentUser());
      } catch {
        await logoutUser();
      } finally {
        setIsInitializing(false);
      }
    };
    restoreSession();
    const handleAutoLogout = () => setUser(null);
    window.addEventListener("auth:logout", handleAutoLogout);
    return () => window.removeEventListener("auth:logout", handleAutoLogout);
  }, []);

  const login = useCallback(async (credentials) => {
    const authenticatedUser = await loginUser(credentials);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const googleLogin = useCallback(async (payload) => {
    const authenticatedUser = await loginWithGoogle(payload);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const register = useCallback((payload) => registerUser(payload), []);
  const updateProfile = useCallback(async (payload) => {
    const updated = await updateUserProfile(payload);
    setUser(updated);
    return updated;
  }, []);

  const value = useMemo(() => ({ user, isInitializing, login, googleLogin, logout, register, updateProfile }), [user, isInitializing, login, googleLogin, logout, register, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

