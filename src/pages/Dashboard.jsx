import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, FolderKanban, CheckSquare, Clock, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const { user, logout, API_URL } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProjects();
  }, [user, navigate]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/projects/`, {
        headers: {
          'Authorization': `Token ${user.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    try {
      const response = await fetch(`${API_URL}/projects/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`
        },
        body: JSON.stringify({ title: newProjectTitle, description: '' })
      });
      
      if (response.ok) {
        setNewProjectTitle('');
        fetchProjects(); // Refresh list
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDeleteProject = async (e, id) => {
    e.stopPropagation(); // Evitar que el clic abra el proyecto
    if (!window.confirm("¿Seguro que deseas eliminar este proyecto y todas sus tareas?")) return;

    try {
      const response = await fetch(`${API_URL}/projects/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${user.token}`
        }
      });
      
      if (response.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return <div className="loading-state">Cargando...</div>;

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <h1>Mis Proyectos</h1>
        <form className="create-project-form" onSubmit={handleCreateProject}>
          <input 
            type="text" 
            placeholder="Nuevo Proyecto..."
            value={newProjectTitle}
            onChange={(e) => setNewProjectTitle(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            <Plus size={18} /> Crear
          </button>
        </form>
      </header>

      <div className="projects-grid">
        {projects.length === 0 ? (
          <div className="empty-state glass">
            <FolderKanban size={48} className="icon-accent" />
            <h3>No tienes proyectos aún</h3>
            <p>Crea tu primer proyecto arriba para empezar.</p>
          </div>
        ) : (
          projects.map(project => {
            const totalTasks = project.tasks ? project.tasks.length : 0;
            const completedTasks = project.tasks ? project.tasks.filter(t => t.status === 'completed').length : 0;
            const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

            return (
              <div 
                key={project.id} 
                className="project-card glass animate-fade-in-up"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <div className="project-card-header">
                  <h3>{project.title}</h3>
                  <button 
                    className="btn-icon-danger" 
                    onClick={(e) => handleDeleteProject(e, project.id)}
                    title="Eliminar proyecto"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="project-meta">Creado el {new Date(project.created_at).toLocaleDateString()}</p>
                <div className="project-stats" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{totalTasks} Tareas</span>
                    <span>{progress}% Completado</span>
                  </div>
                  <div className="progress-container">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
