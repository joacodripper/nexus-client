import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, CheckCircle, Shield, Zap, Layers, ArrowRight } from 'lucide-react';

import DashboardMockup from '../components/DashboardMockup';

export default function Landing() {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <LayoutDashboard className="icon-accent" />
          <span>NEXUS</span>
        </div>
        <div className="nav-links">
          <Link to="/login" className="btn-ghost">Iniciar Sesión</Link>
          <Link to="/register" className="btn-primary">Empezar Gratis</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero">
        <div className="hero-content">
          <div className="badge animate-fade-in-up">🚀 Nexus v1.0 está en vivo</div>
          <h1 className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Gestiona tus proyectos <br/>
            <span className="text-gradient">con la máxima elegancia.</span>
          </h1>
          <p className="subtitle animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Nexus es la plataforma definitiva para organizar tu trabajo.
            Diseño premium, modo claro/oscuro y sincronización en tiempo real.
          </p>
          <div className="cta-group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/register" className="btn-primary btn-large">
              Comenzar Ahora <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Dashboard Mockup Preview */}
        <div className="hero-image-wrapper animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="glow-effect"></div>
          <DashboardMockup />
        </div>
      </main>

      {/* Features Section */}
      <section className="section-padding">
        <div className="section-header">
          <h2>Todo lo que necesitas para triunfar</h2>
          <p>Herramientas poderosas empaquetadas en una interfaz simple y hermosa.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card glass">
            <Zap className="feature-icon" />
            <h3>Ultrarrápido</h3>
            <p>Arquitectura moderna con React y Django para una experiencia sin interrupciones.</p>
          </div>
          <div className="feature-card glass">
            <Layers className="feature-icon" />
            <h3>Organización Visual</h3>
            <p>Divide tus proyectos en tareas manejables y visualiza tu progreso al instante.</p>
          </div>
          <div className="feature-card glass">
            <Shield className="feature-icon" />
            <h3>Seguridad Total</h3>
            <p>Tus datos están protegidos con encriptación avanzada y autenticación por tokens.</p>
          </div>
          <div className="feature-card glass">
            <CheckCircle className="feature-icon" />
            <h3>Modo Adaptable</h3>
            <p>Trabaja cómodo de día o de noche con nuestro sistema de Modo Claro y Oscuro.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="section-padding steps-section">
        <div className="section-header">
          <h2>¿Cómo funciona Nexus?</h2>
          <p>En tan solo tres pasos estarás dominando tu productividad.</p>
        </div>
        <div className="steps-grid">
          <div className="step-item">
            <div className="step-number">1</div>
            <h3>Crea una cuenta</h3>
            <p>Regístrate en menos de 1 minuto, sin tarjetas de crédito y 100% gratis.</p>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <h3>Añade tus proyectos</h3>
            <p>Crea tu primer proyecto y agrégale todas las tareas que necesites realizar.</p>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <h3>Mide tu progreso</h3>
            <p>Marca las tareas como completadas y observa cómo avanza tu barra de progreso.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-padding pricing-section">
        <div className="pricing-card glass text-center">
          <h2 className="text-gradient">100% Gratuito y Open Source</h2>
          <p className="pricing-desc">Nexus fue diseñado para ayudarte sin cobrarte un centavo. Disfruta de todas las características premium, proyectos ilimitados y tareas infinitas.</p>
          <div className="pricing-price">
            <span>$0</span> / mes
          </div>
          <ul className="pricing-features">
            <li><CheckCircle size={16} className="icon-success" /> Proyectos Ilimitados</li>
            <li><CheckCircle size={16} className="icon-success" /> Temas Claro y Oscuro</li>
            <li><CheckCircle size={16} className="icon-success" /> Barras de Progreso Reales</li>
            <li><CheckCircle size={16} className="icon-success" /> Soporte Multidispositivo</li>
          </ul>
          <Link to="/register" className="btn-primary btn-block" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            Crear mi cuenta gratuita
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer glass">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <LayoutDashboard className="icon-accent" />
              <span>NEXUS</span>
            </div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>La plataforma definitiva para la gestión de proyectos y tareas modernas.</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Producto</h4>
              <Link to="/login">Iniciar Sesión</Link>
              <Link to="/register">Registrarse</Link>
            </div>
            <div>
              <h4>Legal</h4>
              <a href="#">Términos de Uso</a>
              <a href="#">Privacidad</a>
            </div>
            <div>
              <h4>Social</h4>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>GitHub</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Nexus Inc. Construido con React y Django.</p>
        </div>
      </footer>
    </div>
  );
}
