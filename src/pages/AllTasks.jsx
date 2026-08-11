import { useEffect, useState } from 'react';
import { CheckSquare, Trash2, FolderKanban } from 'lucide-react';
import { Link } from 'react-router-dom';
import { get, patch, del } from '../api';

export default function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState({});

  useEffect(() => {
    let ignore = false;

    Promise.all([get('/tasks/'), get('/projects/')])
      .then(async ([tasksRes, projectsRes]) => {
        const tasksData = tasksRes.ok ? await tasksRes.json() : [];
        const projectsData = projectsRes.ok ? await projectsRes.json() : [];
        return { tasksData, projectsData };
      })
      .then(({ tasksData, projectsData }) => {
        if (ignore) return;
        setTasks(tasksData);

        // Mapear IDs de proyecto a títulos
        const projMap = {};
        projectsData.forEach((p) => {
          projMap[p.id] = p.title;
        });
        setProjects(projMap);
      })
      .catch((error) => console.error('Error fetching data:', error));

    return () => {
      ignore = true;
    };
  }, []);

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await patch(`/tasks/${taskId}/`, { status: newStatus });

      if (response.ok) {
        setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('¿Eliminar esta tarea?')) return;
    try {
      const response = await del(`/tasks/${taskId}/`);

      if (response.ok) {
        setTasks(tasks.filter((t) => t.id !== taskId));
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
          tasks.map((task) => (
            <div key={task.id} className="task-card glass animate-fade-in-up">
              <div className="task-info">
                <h3>{task.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <FolderKanban size={14} color="var(--text-secondary)" />
                  <Link
                    to={`/project/${task.project}`}
                    className="text-secondary"
                    style={{ fontSize: '0.9rem', textDecoration: 'none' }}
                  >
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
