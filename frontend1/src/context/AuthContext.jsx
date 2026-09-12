import { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/api";

export const ROLES = {
  CONSUMER: "Consumer",
  RETAIL_MANAGER: "Retail Manager",
  WAREHOUSE_OPERATOR: "Warehouse Operator",
  FOOD_INSPECTOR: "Food Quality Inspector",
  ADMINISTRATOR: "Administrator",
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("ffm_user");
      if (!saved || saved === "null" || saved === "undefined") return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Restore authenticated session from backend on initial mount
  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("ffm-auth-token");
      if (token) {
        try {
          const currentUser = await apiService.getMe();
          setUser(currentUser);
          localStorage.setItem("ffm_user", JSON.stringify(currentUser));
        } catch (err) {
          console.warn("[AuthContext] Token expired or invalid. Clearing session.", err);
          localStorage.removeItem("ffm-auth-token");
          localStorage.removeItem("ffm_user");
          setUser(null);
        }
      }
      setIsLoading(false);
    }

    restoreSession();
  }, []);

  const login = async (usernameOrEmail, password, role = ROLES.CONSUMER) => {
    try {
      const dbUser = await apiService.login(usernameOrEmail, password, role);
      setUser(dbUser);
      localStorage.setItem("ffm_user", JSON.stringify(dbUser));
      return dbUser;
    } catch (err) {
      console.error("[AuthContext] Login failed:", err);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const dbUser = await apiService.register(userData);
      setUser(dbUser);
      localStorage.setItem("ffm_user", JSON.stringify(dbUser));
      return dbUser;
    } catch (err) {
      console.error("[AuthContext] Registration failed:", err);
      throw err;
    }
  };

  const adminLogin = async (adminUsername, password) => {
    try {
      const dbUser = await apiService.adminLogin(adminUsername, password);
      setUser(dbUser);
      localStorage.setItem("ffm_user", JSON.stringify(dbUser));
      return dbUser;
    } catch (err) {
      console.error("[AuthContext] Admin login failed:", err);
      throw err;
    }
  };

  const adminRegister = async (adminData) => {
    return register({ ...adminData, role: ROLES.ADMINISTRATOR });
  };

  const switchRole = (newRole) => {
    setUser((prev) => (prev ? { ...prev, role: newRole } : prev));
  };

  const updateUserUsername = (newUsername) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, username: newUsername };
      localStorage.setItem("ffm_user", JSON.stringify(updated));
      return updated;
    });
  };

  const updateUserProfilePhoto = (photoUrl) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, profilePhoto: photoUrl, profile_photo: photoUrl };
      localStorage.setItem("ffm_user", JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem("ffm_user");
    localStorage.removeItem("ffm_admin");
    localStorage.removeItem("ffm-auth-token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : ROLES.CONSUMER,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        adminLogin,
        adminRegister,
        updateUserUsername,
        updateUserProfilePhoto,
        switchRole,
        logout,
        ROLES,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
