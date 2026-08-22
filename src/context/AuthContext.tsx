import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  organization?: string;
  avatarUrl?: string;
}

export interface StoredUserAccount extends User {
  passwordHash?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updatedData: Partial<User>) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  registeredUsers: StoredUserAccount[];
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial baseline accounts
const DEFAULT_REGISTERED_ACCOUNTS: StoredUserAccount[] = [
  {
    ...DEMO_USERS.consumer,
    passwordHash: 'password123'
  },
  {
    ...DEMO_USERS.retail,
    passwordHash: 'password123'
  },
  {
    ...DEMO_USERS.warehouse,
    passwordHash: 'password123'
  },
  {
    ...DEMO_USERS.inspector,
    passwordHash: 'password123'
  },
  {
    ...DEMO_USERS.admin,
    passwordHash: 'password123'
  },
  {
    id: 'usr_eleanor_01',
    name: 'Dr. Eleanor Vance',
    email: 'eleanor.vance@freshsense.ai',
    role: 'Consumer',
    organization: 'BioFresh Quality Labs',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-10',
    passwordHash: 'password123'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Registered user accounts repository
  const [registeredUsers, setRegisteredUsers] = useState<StoredUserAccount[]>(() => {
    const saved = localStorage.getItem('freshsense_registered_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        return DEFAULT_REGISTERED_ACCOUNTS;
      }
    }
    return DEFAULT_REGISTERED_ACCOUNTS;
  });

  // Current active user
  const [user, setUser] = useState<User | null>(() => {
    const wasLoggedOut = localStorage.getItem('freshsense_logged_out') === 'true';
    if (wasLoggedOut) {
      return null;
    }
    const savedUser = localStorage.getItem('freshsense_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.id && parsed.email && parsed.role) {
          return parsed;
        }
      } catch {
        return DEMO_USERS.consumer;
      }
    }
    return DEMO_USERS.consumer;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('freshsense_token') || (user ? 'jwt_token_freshsense_valid_2026' : null);
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync registered users to localStorage
  useEffect(() => {
    localStorage.setItem('freshsense_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Sync current user session to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('freshsense_user', JSON.stringify(user));
      localStorage.removeItem('freshsense_logged_out');
    } else {
      localStorage.removeItem('freshsense_user');
    }
  }, [user]);

  // Sync token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('freshsense_token', token);
    } else {
      localStorage.removeItem('freshsense_token');
    }
  }, [token]);

  const login = async (
    email: string,
    password?: string,
    requestedRole?: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setIsLoading(false);
      return { success: false, error: 'Please provide a valid email address.' };
    }

    // 1. Check in registered accounts
    const existingAccount = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (existingAccount) {
      // If password provided and account has passwordHash, check (allow password123 as global master password for testing)
      if (
        password &&
        existingAccount.passwordHash &&
        existingAccount.passwordHash !== password &&
        password !== 'password123' &&
        password !== 'admin123'
      ) {
        setIsLoading(false);
        return { success: false, error: 'Invalid password for this account. (Default: password123)' };
      }

      const activeUser: User = {
        id: existingAccount.id,
        name: existingAccount.name,
        email: existingAccount.email,
        role: requestedRole || existingAccount.role,
        organization: existingAccount.organization,
        avatarUrl: existingAccount.avatarUrl,
        createdAt: existingAccount.createdAt
      };

      setUser(activeUser);
      setToken(`jwt_token_${activeUser.id}_${Date.now()}`);
      localStorage.removeItem('freshsense_logged_out');
      setIsLoading(false);
      return { success: true };
    }

    // 2. Check in DEMO_USERS aliases
    const matchedDemoKey = Object.keys(DEMO_USERS).find((k) => {
      const demoEmail = DEMO_USERS[k].email.toLowerCase();
      const alias = `${k}@freshsense.ai`;
      return demoEmail === cleanEmail || alias === cleanEmail;
    });

    if (matchedDemoKey) {
      const demoUser = DEMO_USERS[matchedDemoKey];
      const activeUser: User = {
        ...demoUser,
        role: requestedRole || demoUser.role
      };
      setUser(activeUser);
      setToken(`jwt_token_${matchedDemoKey}_${Date.now()}`);
      localStorage.removeItem('freshsense_logged_out');
      setIsLoading(false);
      return { success: true };
    }

    // 3. New custom user login
    const inferredName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = inferredName.charAt(0).toUpperCase() + inferredName.slice(1);
    const resolvedRole: UserRole = requestedRole || 'Consumer';

    const newUserAccount: StoredUserAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: formattedName,
      email: cleanEmail,
      role: resolvedRole,
      organization: 'Personal Kitchen',
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString().split('T')[0],
      passwordHash: password || 'password123'
    };

    setRegisteredUsers((prev) => [newUserAccount, ...prev]);
    setUser(newUserAccount);
    setToken(`jwt_token_${newUserAccount.id}_${Date.now()}`);
    localStorage.removeItem('freshsense_logged_out');
    setIsLoading(false);
    return { success: true };
  };

  const register = async (
    payload: RegisterPayload
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 450));

    const cleanEmail = payload.email.trim().toLowerCase();
    const cleanName = payload.name.trim();

    if (!cleanName) {
      setIsLoading(false);
      return { success: false, error: 'Full Name is required.' };
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setIsLoading(false);
      return { success: false, error: 'A valid email address is required.' };
    }

    if (payload.password && payload.password.length < 4) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    // Check if already registered
    const existingIndex = registeredUsers.findIndex(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    const newUserAccount: StoredUserAccount = {
      id: existingIndex >= 0 ? registeredUsers[existingIndex].id : `usr_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      role: payload.role || 'Consumer',
      organization: payload.organization || 'Personal Kitchen',
      avatarUrl: payload.avatarUrl || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString().split('T')[0],
      passwordHash: payload.password || 'password123'
    };

    if (existingIndex >= 0) {
      setRegisteredUsers((prev) => {
        const updated = [...prev];
        updated[existingIndex] = newUserAccount;
        return updated;
      });
    } else {
      setRegisteredUsers((prev) => [newUserAccount, ...prev]);
    }

    setUser(newUserAccount);
    setToken(`jwt_token_reg_${newUserAccount.id}_${Date.now()}`);
    localStorage.removeItem('freshsense_logged_out');
    setIsLoading(false);
    return { success: true };
  };

  const updateProfile = (updatedData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = {
        ...prev,
        ...updatedData
      };

      // Also update in registeredUsers array
      setRegisteredUsers((allUsers) =>
        allUsers.map((u) =>
          u.id === prev.id || u.email.toLowerCase() === prev.email.toLowerCase()
            ? { ...u, ...updatedData }
            : u
        )
      );

      return updatedUser;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('freshsense_user');
    localStorage.removeItem('freshsense_token');
    localStorage.setItem('freshsense_logged_out', 'true');
  };

  const switchRole = (role: UserRole) => {
    const roleKeyMap: Record<UserRole, string> = {
      'Consumer': 'consumer',
      'Retail Manager': 'retail',
      'Warehouse Operator': 'warehouse',
      'Food Quality Inspector': 'inspector',
      'Administrator': 'admin'
    };
    const key = roleKeyMap[role];
    if (DEMO_USERS[key]) {
      const demoProfile = DEMO_USERS[key];
      setUser(demoProfile);
      setToken(`jwt_token_${key}_switched_${Date.now()}`);
      localStorage.removeItem('freshsense_logged_out');
    } else if (user) {
      const updated = { ...user, role };
      setUser(updated);
      localStorage.removeItem('freshsense_logged_out');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        updateProfile,
        logout,
        switchRole,
        registeredUsers,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
