import { createContext } from 'react';

// Objeto de contexto separado en su propio archivo para que el provider
// pueda fast-refresh sin advertencias (regla react-refresh/only-export-components).
export const AuthContext = createContext(null);
