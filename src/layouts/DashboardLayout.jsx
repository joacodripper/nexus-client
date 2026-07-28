import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, FolderKanban, CheckSquare, Clock, Moon, Sun } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Theme state initialized from localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('nexus-theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('nexus-theme', theme);
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
          <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
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
        
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button className="btn-ghost" onClick={toggleTheme} style={{ justifyContent: 'flex-start' }}>
            {theme === 'dark' ? (
              <><Sun size={18} /> Modo Claro</>
            ) : (
              <><Moon size={18} /> Modo Oscuro</>
            )}
          </button>
          <button className="btn-ghost btn-logout" onClick={handleLogout} style={{ justifyContent: 'flex-start' }}>
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Aquí se renderizarán todas las sub-páginas (Dashboard, AllTasks, ProjectDetails, etc) */}
      <Outlet />
    </div>
  );
}
