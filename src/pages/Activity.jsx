import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Clock, FolderKanban, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Activity() {
  const { user, API_URL } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Get projects
      const projectsRes = await fetch(`${API_URL}/projects/`, {
        headers: { 'Authorization': `Token ${user.token}` }
      });
      const projectsData = projectsRes.ok ? await projectsRes.json() : [];

      // Get tasks
      const tasksRes = await fetch(`${API_URL}/tasks/`, {
        headers: { 'Authorization': `Token ${user.token}` }
      });
      const tasksData = tasksRes.ok ? await tasksRes.json() : [];

      // Combine and format
      const combined = [
        ...projectsData.map(p => ({
          id: `p-${p.id}`,
          type: 'project',
          title: p.title,
          date: new Date(p.created_at),
          link: `/project/${p.id}`
        })),
        ...tasksData.map(t => ({
          id: `t-${t.id}`,
          type: 'task',
          title: t.title,
          date: new Date(t.created_at),
          link: `/project/${t.project}`
        }))
      ];

      // Sort by newest first
      combined.sort((a, b) => b.date - a.date);
      setActivities(combined);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activity:', error);
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-content">
      <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Clock size={32} className="icon-accent" />
          <h1>Actividad Reciente</h1>
        </div>
      </header>

      <div className="activity-timeline" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading ? (
          <div className="loading-state">Cargando actividad...</div>
        ) : activities.length === 0 ? (
          <div className="empty-state glass">
            <Clock size={48} className="icon-accent" />
            <h3>Sin actividad</h3>
            <p>Empieza a crear proyectos y tareas para verlos aquí.</p>
          </div>
        ) : (
          activities.map((item, index) => (
            <div key={item.id} className="glass animate-fade-in-up" style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'flex-start', animationDelay: `${index * 0.1}s` }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.8rem', borderRadius: '50%' }}>
                {item.type === 'project' ? <FolderKanban size={20} className="icon-accent" /> : <CheckSquare size={20} className="icon-accent" />}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '1.1rem' }}>
                  Has creado {item.type === 'project' ? 'el proyecto' : 'la tarea'} <Link to={item.link} style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>{item.title}</Link>
                </p>
                <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {item.date.toLocaleDateString()} a las {item.date.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
