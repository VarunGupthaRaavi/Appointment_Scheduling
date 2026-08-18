import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  login: (email: string, password?: string, preferredRole?: UserRole, fullName?: string) => boolean;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

// Official System Credentials Reference
export const SYSTEM_USERS = [
  {
    email: 'admin@careflow.ai',
    password: 'admin123',
    full_name: 'Dr. Arthur Pendelton (Admin)',
    role: 'admin' as UserRole
  },
  {
    email: 'doctor@careflow.ai',
    password: 'doctor123',
    full_name: 'Dr. Michael Chen (Endocrinologist)',
    role: 'doctor' as UserRole
  },
  {
    email: 'patient@careflow.ai',
    password: 'patient123',
    full_name: 'Alex Morgan (Patient)',
    role: 'patient' as UserRole
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('careflow_user');
      return saved ? JSON.parse(saved) : SYSTEM_USERS[2]; // Default demo patient
    } catch (e) {
      return SYSTEM_USERS[2];
    }
  });

  const role: UserRole | null = user?.role || null;

  const login = (email: string, password?: string, preferredRole?: UserRole, fullName?: string): boolean => {
    const found = SYSTEM_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    let assignedRole: UserRole = preferredRole || 'patient';
    let assignedName: string = fullName || email.split('@')[0].toUpperCase();

    if (found) {
      assignedRole = found.role;
      assignedName = found.full_name;
    } else {
      if (email.includes('admin')) assignedRole = 'admin';
      else if (email.includes('doctor') || email.includes('dr.')) assignedRole = 'doctor';
    }

    const profile: UserProfile = {
      id: `usr-${assignedRole}-${Math.floor(Math.random() * 1000)}`,
      email,
      full_name: assignedName,
      role: assignedRole
    };

    setUser(profile);
    try {
      localStorage.setItem('careflow_user', JSON.stringify(profile));
      localStorage.setItem('careflow_token', `token-${assignedRole}-xyz-123`);
    } catch (e) {
      console.error(e);
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('careflow_user');
      localStorage.removeItem('careflow_token');
    } catch (e) {
      console.error(e);
    }
  };

  const switchRole = (newRole: UserRole) => {
    const match = SYSTEM_USERS.find(u => u.role === newRole);
    const updated = {
      id: `usr-${newRole}-101`,
      email: match ? match.email : `${newRole}@careflow.ai`,
      full_name: match ? match.full_name : `${newRole.toUpperCase()} User`,
      role: newRole
    };
    setUser(updated);
    try {
      localStorage.setItem('careflow_user', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, switchRole }}>
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
