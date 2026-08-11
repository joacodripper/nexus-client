import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, LayoutList, CheckSquare } from 'lucide-react';
import { get, post, patch, del } from '../api';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const fetchProject = useCallback(async () => {
    // Detalle del proyecto + sus tareas (filtradas en el servidor)
    const response = await get(`/projects/${id}/`);
    if (!response.ok) return null;

    const projectData = await response.json();
    const tasksResponse = await get(`/tasks/?project=${id}`);
    const tasksData = tasksResponse.ok ? await tasksResponse.json() : [];

    return { project: projectData, tasks: tasksData };
  }, [id]);

  useEffect(() => {
    let ignore = false;
    fetchProject()
      .then((data) => {
        if (ignore) return;
        if (!data) {
          navigate('/dashboard'); // Go back if not found
          return;
        }
        setProject(data.project);
        setTasks(data.tasks);
      })
      .catch((error) => {
        console.error('Error fetching project:', error);
        if (!ignore) navigate('/dashboard');
      });
    return () => {
      ignore = true;
    };
  }, [fetchProject, navigate]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await post('/tasks/', {
        title: newTaskTitle,
        status: 'pending',
        project: parseInt(id, 10),
      });

      if (response.ok) {
        setNewTaskTitle('');
        fetchProject().then((data) => {
          if (data) setTasks(data.tasks);
        }); // Refresh tasks
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await patch(`/tasks/${taskId}/`, { status: newStatus });

      if (response.ok) {
        // Update local state without fetching all again
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

  if (!project) return <div className="loading-state">Cargando proyecto...</div>;

  return (
    <main className="dashboard-content">
      <div className="project-details-wrapper">
        <header className="project-header glass">
          <button className="btn-ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={18} /> Volver
          </button>
          <div className="project-title-area">
            <LayoutList size={28} className="icon-accent" />
            <h1>{project.title}</h1>
          </div>
        </header>

        <form className="create-task-form glass" onSubmit={handleCreateTask}>
          <input
            type="text"
            placeholder="Escribe una nueva tarea..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            <Plus size={18} /> Añadir Tarea
          </button>
        </form>

        <div className="tasks-list">
          {tasks.length === 0 ? (
            <div className="empty-state glass">
              <CheckSquare size={48} className="icon-accent" />
              <h3>Ninguna tarea pendiente</h3>
              <p>Añade tareas arriba para comenzar a organizarte.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="task-card glass animate-fade-in-up">
                <div className="task-info">
                  <h3>{task.title}</h3>
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
      </div>
    </main>
  );
}
