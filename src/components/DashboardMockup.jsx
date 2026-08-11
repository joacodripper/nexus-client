import { FolderKanban, CheckSquare, Clock, Plus, Trash2 } from 'lucide-react';

export default function DashboardMockup() {
  return (
    <div className="mockup-container glass">
      {/* Mockup Sidebar */}
      <div className="mockup-sidebar">
        <div className="mockup-brand">
          <FolderKanban size={24} className="icon-accent" />
          <span style={{ fontWeight: 600, color: '#fff' }}>NEXUS</span>
        </div>
        <div className="mockup-nav">
          <div className="mockup-nav-item active"><FolderKanban size={16} /> Proyectos</div>
          <div className="mockup-nav-item"><CheckSquare size={16} /> Tareas</div>
          <div className="mockup-nav-item"><Clock size={16} /> Actividad</div>
        </div>
      </div>

      {/* Mockup Content */}
      <div className="mockup-content">
        <div className="mockup-header">
          <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Proyectos</h2>
          <div className="mockup-form">
            <div className="mockup-input">Nuevo proyecto...</div>
            <div className="mockup-btn"><Plus size={16} /> Crear</div>
          </div>
        </div>

        <div className="mockup-grid">
          {/* Card 1 */}
          <div className="mockup-card">
            <div className="mockup-card-header">
              <h3 style={{ color: '#fff', fontSize: '1.1rem' }}>Lanzamiento Web</h3>
              <Trash2 size={14} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Creado el {new Date().toLocaleDateString()}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>8 Tareas</span>
              <span>75% Completado</span>
            </div>
            <div className="progress-container" style={{ marginTop: '0.5rem' }}>
              <div className="progress-fill" style={{ width: '75%' }}></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="mockup-card">
            <div className="mockup-card-header">
              <h3 style={{ color: '#fff', fontSize: '1.1rem' }}>Campaña Marketing</h3>
              <Trash2 size={14} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Creado el {new Date().toLocaleDateString()}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>12 Tareas</span>
              <span>30% Completado</span>
            </div>
            <div className="progress-container" style={{ marginTop: '0.5rem' }}>
              <div className="progress-fill" style={{ width: '30%' }}></div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="mockup-card">
            <div className="mockup-card-header">
              <h3 style={{ color: '#fff', fontSize: '1.1rem' }}>App Móvil</h3>
              <Trash2 size={14} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Creado el {new Date().toLocaleDateString()}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>5 Tareas</span>
              <span>100% Completado</span>
            </div>
            <div className="progress-container" style={{ marginTop: '0.5rem' }}>
              <div className="progress-fill" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
