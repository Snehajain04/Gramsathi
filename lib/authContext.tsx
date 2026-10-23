'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Language, UserRole } from '@/types';
import { DEMO_USERS } from '@/lib/mockData';
import { getTranslation } from '@/lib/i18n';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  language: Language;
  phone?: string;
  state?: string;
  district?: string;
}

interface AuthContextType {
  user: User | null;
  language: Language;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (input: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'gramsathi_registered_users';
const SESSION_KEY = 'gramsathi_user';
const LANG_KEY = 'gramsathi_lang';
const DEMO_PASSWORD = 'demo123';

type StoredUser = User & { passwordHash: string };

async function hashPassword(password: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    return password;
  }
  const data = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY) || localStorage.getItem('cropshield_registered_users');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY) || localStorage.getItem('cropshield_user');
      const savedLang = (localStorage.getItem(LANG_KEY) || localStorage.getItem('cropshield_lang')) as Language | null;
      if (saved) setUser(JSON.parse(saved));
      if (savedLang) setLanguageState(savedLang);
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const localUser = getStoredUsers().find(u => u.email.toLowerCase() === normalizedEmail);

      if (localUser) {
        const passwordHash = await hashPassword(password);
        if (passwordHash !== localUser.passwordHash) {
          return { success: false, error: 'Incorrect password.' };
        }
        const cleanUser: User = { ...localUser };
        delete (cleanUser as Partial<StoredUser>).passwordHash;
        setUser(cleanUser);
        setLanguageState(cleanUser.language);
        localStorage.setItem(SESSION_KEY, JSON.stringify(cleanUser));
        localStorage.setItem(LANG_KEY, cleanUser.language);
        return { success: true };
      }

      const found = DEMO_USERS.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!found) return { success: false, error: 'Account not found. Please register first or use a demo account.' };
      if (password !== DEMO_PASSWORD) return { success: false, error: 'Incorrect password. Demo accounts use demo123.' };

      setUser(found);
      setLanguageState(found.language);
      localStorage.setItem(SESSION_KEY, JSON.stringify(found));
      localStorage.setItem(LANG_KEY, found.language);
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (input: RegisterInput) => {
    setIsLoading(true);
    try {
      const email = input.email.trim().toLowerCase();
      const name = input.name.trim();

      if (!name || !email || !input.password) return { success: false, error: 'Name, email and password are required.' };
      if (input.password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
      if (!/^\S+@\S+\.\S+$/.test(email)) return { success: false, error: 'Enter a valid email address.' };

      const existsInDemo = DEMO_USERS.some(u => u.email.toLowerCase() === email);
      const users = getStoredUsers();
      if (existsInDemo || users.some(u => u.email.toLowerCase() === email)) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        role: input.role,
        language: input.language,
        phone: input.phone?.trim() || undefined,
        state: input.state?.trim() || undefined,
        district: input.district?.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      const passwordHash = await hashPassword(input.password);
      saveStoredUsers([...users, { ...newUser, passwordHash }]);

      setUser(newUser);
      setLanguageState(newUser.language);
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
      localStorage.setItem(LANG_KEY, newUser.language);
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_KEY, lang);
    if (user) {
      const updated = { ...user, language: lang };
      setUser(updated);
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      const users = getStoredUsers();
      const index = users.findIndex(u => u.id === user.id);
      if (index >= 0) {
        users[index] = { ...users[index], language: lang };
        saveStoredUsers(users);
      }
    }
  };

  const t = (key: string) => getTranslation(language, key);

  return (
    <AuthContext.Provider value={{ user, language, isLoading, login, register, logout, setLanguage, t }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
