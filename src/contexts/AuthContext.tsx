import React, {createContext, useState, useContext, ReactNode} from 'react';
import axios from 'axios';
import {BASE_URL} from 'api/axios';
import {Alert} from 'react-native';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface User {
  id: string;
  name: string;
  username: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: false,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({children}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/customers/authenticate`, {
        username,
        password,
      });

      const token = response.data;

      // Set token in axios default headers
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      setUser(response.data);
    } catch (error) {
      Alert.alert('Error', "You've entered wrong credentials", [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      console.error('Login error', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    try {
      setUser(null);
      delete axios.defaults.headers.common.Authorization;
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{user, loading, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
