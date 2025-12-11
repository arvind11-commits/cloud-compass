import { useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
}

const AUTH_KEY = 'cloud_roadmap_auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    // Mock validation - in real app this would hit an API
    if (email && password.length >= 6) {
      const newUser = { email, name: email.split('@')[0] };
      localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return true;
    }
    return false;
  };

  const signup = (email: string, password: string): boolean => {
    // Mock signup - same as login for prototype
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return { user, isLoading, login, signup, logout };
};
