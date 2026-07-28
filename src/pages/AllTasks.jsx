import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CheckSquare, Trash2, FolderKanban } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AllTasks() {
  const { user, API_URL } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState({});

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Get all tasks
      const tasksRes = await fetch(`${API_URL}/tasks/`, {
        headers: { 'Authorization': `Token ${user.token}` }
      });
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      }

      // Get projects to map project IDs to titles
      const projectsRes = await fetch(`${API_URL}/projects/`, {
        headers: { 'Authorization': `Token ${user.token}` }
      });
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        const projMap = {};
        projectsData.forEach(p => {
          projMap[p.id] = p.title;
        });
        setProjects(projMap);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("¿Eliminar esta tarea?")) return;
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${user.token}`
        }
      });
      
      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <main className="dashboard-content">
      <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <CheckSquare size={32} className="icon-accent" />
          <h1>Todas mis Tareas</h1>
        </div>
      </header>

      <div className="tasks-list" style={{ maxWidth: '900px' }}>
        {tasks.length === 0 ? (
          <div className="empty-state glass">
            <CheckSquare size={48} className="icon-accent" />
            <h3>No tienes tareas</h3>
            <p>Ve a un proyecto para crear nuevas tareas.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="task-card glass animate-fade-in-up">
              <div className="task-info">
                <h3>{task.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <FolderKanban size={14} color="var(--text-secondary)" />
                  <Link to={`/project/${task.project}`} className="text-secondary" style={{ fontSize: '0.9rem', textDecoration: 'none' }}>
                    {projects[task.project] || 'Proyecto...'}
                  </Link>
                </div>
              </div>
              <div className="task-actions">
                <select 
                  className={`tag tag-${task.status}`}
                  value={task.status}
                  onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                >
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="completed">Completada</option>
                </select>
                <button 
                  className="btn-icon-danger" 
                  onClick={() => handleDeleteTask(task.id)}
                  title="Eliminar tarea"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
