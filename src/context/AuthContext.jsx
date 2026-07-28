import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Usa la variable de entorno en producción, y localhost en desarrollo
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    if (token) {
      // If we have a token, we could optionally verify it or fetch user details.
      // For this simple version, we assume token means logged in.
      // We will extract username from localStorage if saved.
      setUser({
        token,
        username: localStorage.getItem('username'),
      });
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
        setUser({ token: data.token, username: data.username });
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        return { success: true };
      } else {
        return { success: false, message: data.error || 'Credenciales inválidas' };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión con el servidor.' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
        setUser({ token: data.token, username: data.username });
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        return { success: true };
      } else {
        // Simple error parsing
        const errorMsg = Object.values(data).flat().join(', ');
        return { success: false, message: errorMsg || 'Error al registrarse.' };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión con el servidor.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, API_URL }}>
      {children}
    </AuthContext.Provider>
  );
};
