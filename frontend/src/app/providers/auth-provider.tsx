import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from 'react';
import { type User, type AuthTokens } from '@/features/auth/types/auth.types';
import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { authService } from '@/features/auth/services/auth.service';

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = storage.get<User>(STORAGE_KEYS.USER);
        const accessToken = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);

        if (storedUser && accessToken) {
          setUser(storedUser);
          setTokens({
            accessToken,
            refreshToken: refreshToken || '',
          });

          // Validate token by fetching current user
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
          } catch {
            // Token expired or invalid
            logout();
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback((userData: User, authTokens: AuthTokens) => {
    setUser(userData);
    setTokens(authTokens);

    // Store in localStorage
    storage.set(STORAGE_KEYS.USER, userData);
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, authTokens.accessToken);
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, authTokens.refreshToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setTokens(null);

    // Clear localStorage
    storage.remove(STORAGE_KEYS.USER);
    storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    storage.remove(STORAGE_KEYS.ORGANIZATION);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      storage.set(STORAGE_KEYS.USER, currentUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  const value = {
    user,
    tokens,
    isAuthenticated: !!user && !!tokens,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};