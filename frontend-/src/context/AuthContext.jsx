import { createContext, useContext, useState, useEffect } from "react";

export const ROLES = {
  CONSUMER: "Consumer",
  RETAIL_MANAGER: "Retail Manager",
  WAREHOUSE_OPERATOR: "Warehouse Operator",
  FOOD_INSPECTOR: "Food Quality Inspector",
  ADMINISTRATOR: "Administrator",
};

const DEFAULT_USER = {
  id: "usr_001",
  name: "Aarav Sharma",
  username: "aarav_sharma",
  email: "aarav.sharma@freshai.dev",
  role: ROLES.RETAIL_MANAGER,
  avatarInitials: "AS",
  avatarColor: "bg-gradient-brand",
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("ffm_user");
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("ffm_user", JSON.stringify(user));
      if (!localStorage.getItem("ffm-auth-token")) {
        localStorage.setItem("ffm-auth-token", `mock_token_${Date.now()}`);
      }
    }
  }, [user]);

  const login = (usernameOrEmail, password, role = ROLES.CONSUMER) => {
    const isEmail = usernameOrEmail.includes("@");
    const nameStr = isEmail
      ? usernameOrEmail.split("@")[0].replace(".", " ")
      : usernameOrEmail.replace(".", " ");

    const initials = nameStr
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const loggedInUser = {
      id: `usr_${Date.now()}`,
      name: nameStr.charAt(0).toUpperCase() + nameStr.slice(1),
      username: isEmail ? usernameOrEmail.split("@")[0] : usernameOrEmail,
      email: isEmail ? usernameOrEmail : `${usernameOrEmail}@freshai.dev`,
      role: role || ROLES.CONSUMER,
      avatarInitials: initials || "US",
      avatarColor: "bg-gradient-brand",
    };

    setUser(loggedInUser);
    localStorage.setItem("ffm_user", JSON.stringify(loggedInUser));
    localStorage.setItem("ffm-auth-token", `token_usr_${Date.now()}`);
    return loggedInUser;
  };

  const register = (userData) => {
    const { name, username, email, mobile, gender, profilePhoto } = userData;
    const initials = name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "US";

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name || username,
      username: username || email.split("@")[0],
      email,
      mobile,
      gender: gender || "Other",
      profilePhoto: profilePhoto || null,
      role: ROLES.CONSUMER,
      avatarInitials: initials || "US",
      avatarColor: "bg-gradient-brand",
    };

    setUser(newUser);
    localStorage.setItem("ffm_user", JSON.stringify(newUser));
    localStorage.setItem("ffm-auth-token", `token_usr_${Date.now()}`);
    return newUser;
  };

  const adminLogin = (adminUsername, password) => {
    const adminUser = {
      id: `adm_${Date.now()}`,
      name: adminUsername.charAt(0).toUpperCase() + adminUsername.slice(1) + " (Admin)",
      username: adminUsername,
      email: `${adminUsername}@admin.freshai.dev`,
      role: ROLES.ADMINISTRATOR,
      isAdmin: true,
      avatarInitials: "AD",
      avatarColor: "bg-gradient-to-r from-emerald-600 to-teal-700",
    };

    setUser(adminUser);
    localStorage.setItem("ffm_user", JSON.stringify(adminUser));
    localStorage.setItem("ffm_admin", JSON.stringify(adminUser));
    localStorage.setItem("ffm-auth-token", `token_admin_${Date.now()}`);
    return adminUser;
  };

  const adminRegister = (adminData) => {
    const { name, username, email, mobile } = adminData;
    const initials = name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "AD";

    const newAdmin = {
      id: `adm_${Date.now()}`,
      name: name || username,
      username: username || email.split("@")[0],
      email,
      mobile,
      role: ROLES.ADMINISTRATOR,
      isAdmin: true,
      avatarInitials: initials || "AD",
      avatarColor: "bg-gradient-to-r from-emerald-600 to-teal-700",
    };

    setUser(newAdmin);
    localStorage.setItem("ffm_user", JSON.stringify(newAdmin));
    localStorage.setItem("ffm_admin", JSON.stringify(newAdmin));
    localStorage.setItem("ffm-auth-token", `token_admin_${Date.now()}`);
    return newAdmin;
  };

  const switchRole = (newRole) => {
    setUser((prev) => (prev ? { ...prev, role: newRole } : prev));
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
        login,
        register,
        adminLogin,
        adminRegister,
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
