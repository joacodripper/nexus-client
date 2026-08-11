import { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, FolderKanban, CheckSquare, Clock, Moon, Sun } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Tema inicial desde localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('nexus-theme') || 'dark';
  });
  const firstRender = useRef(true);

  useEffect(() => {
    // Aplicamos la clase en <html> (no en <body>): algunos navegadores móviles
    // dejan la pantalla en blanco al repintar en vivo los colores del body.
    document.documentElement.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('nexus-theme', theme);

    // En el primer render no hay nada que repintar todavía.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    // Al cambiar el tema, algunos navegadores móviles fallan el repintado y la
    // pantalla queda en blanco hasta recargar. Forzar un reflow lo corrige.
    requestAnimationFrame(() => {
      document.body.style.display = 'none';
      requestAnimationFrame(() => {
        document.body.style.display = '';
      });
    });
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null; // ProtectedRoute will handle this

  return (
    <div className="dashboard-container">
      <aside className="sidebar glass">
        <div className="sidebar-header">
          <FolderKanban className="icon-accent" size={32} />
          <h2>NEXUS</h2>
        </div>
        <div className="user-profile">
          <div className="avatar">{(user.username || '?').charAt(0).toUpperCase()}</div>
          <span>{user.username}</span>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <FolderKanban size={18} /> Proyectos
          </NavLink>
          <NavLink 
            to="/tasks" 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <CheckSquare size={18} /> Tareas
          </NavLink>
          <NavLink 
            to="/activity" 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <Clock size={18} /> Actividad
          </NavLink>
        </nav>
        
        <div className="sidebar-actions">
          <button className="btn-ghost" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <><Sun size={18} /> Modo Claro</>
            ) : (
              <><Moon size={18} /> Modo Oscuro</>
            )}
          </button>
          <button className="btn-ghost btn-logout" onClick={handleLogout}>
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Aquí se renderizarán todas las sub-páginas (Dashboard, AllTasks, ProjectDetails, etc) */}
      <Outlet />
    </div>
  );
}
