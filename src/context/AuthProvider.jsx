import { useState } from 'react';
import { post } from '../api';
import { AuthContext } from './AuthContext';

// Restaura la sesión directamente desde localStorage (sin efecto ni loading):
// si hay token, el usuario queda logueado desde el primer render.
function getStoredUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return { token, username: localStorage.getItem('username') };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const setSession = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    setUser({ token: data.token, username: data.username });
  };

  const login = async (username, password) => {
    try {
      const response = await post('/login/', { username, password }, { auth: false });
      const data = await response.json();
      if (response.ok) {
        setSession(data);
        return { success: true };
      }
      return { success: false, message: data.error || 'Credenciales inválidas' };
    } catch {
      return { success: false, message: 'Error de conexión con el servidor.' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await post('/register/', { username, email, password }, { auth: false });
      const data = await response.json();
      if (response.ok) {
        setSession(data);
        return { success: true };
      }
      // Los errores de validación llegan como objeto {campo: [errores]}
      const errorMsg = Object.values(data).flat().join(', ');
      return { success: false, message: errorMsg || 'Error al registrarse.' };
    } catch {
      return { success: false, message: 'Error de conexión con el servidor.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
