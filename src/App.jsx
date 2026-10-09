import React, { useState } from 'react';
import GallerySearch from './components/GallerySearch';
import StreamingGallery from './components/StreamingGallery';
import itemsData from './data/items.json';
import SagaGallery from './components/SagaGallery'; // NUEVA Vista Asilo
import BlogSection from './components/BlogSection';
import GachaponSection from './components/GachaponSection';



function App() {
    const [menuOpen, setMenuOpen] = useState(false);

    const NAV_ITEMS = [
      { id: 'categorias', label: 'Book view (Categories)' },
      { id: 'canales',    label: 'Channel view (Streaming)' },
      { id: 'asylum',     label: '🏥 Asylum Files (Sagas)' },
      { id: 'blog',       label: '📝 Blog' },
      { id: 'gashapon',   label: '🎰 Gachapon' },
    ];

    const goTo = (id) => {
      setView(id);
      setMenuOpen(false);   // cierra el menú en móvil al elegir
    };

  // Estado para controlar qué vista estamos viendo
  const [view, setView] = useState('gashapon'); // 'categorias' | 'canales' | 'asylum'

  // Función para determinar el color de fondo general según la vista
  const getBackgroundColor = (currentView) => {
    if (currentView !== 'asylum' ) return '#141414'; // Oscuro streaming
    if (currentView === 'asylum') return '#eef2f3'; // Gris/blanco clínico asilo
    return '#fff'; // Blanco clásico libro
  };

  // Función para determinar el color del título de la Navbar
  const getTitleColor = (currentView) => {
    if (currentView === 'canales') return '#e50914'; // Rojo Netflix
    if (currentView === 'asylum') return '#16a085'; // Verde médico
    if (currentView === 'gashapon') return '#b19ccc'; // Verde médico
    return '#ece8e6'; // Marrón clásico
  };

  return (
  <div style={{ backgroundColor: getBackgroundColor(view), minHeight: '100dvh', transition: 'background-color 0.3s' }}>

    <nav className="navbar">
      <h1 className="navbar-title" style={{ color: getTitleColor(view) }}>
        Dynamic Gallery
      </h1>

      <button
        className="navbar-toggle"
        style={{ color: getTitleColor(view) }}
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Abrir menú"
        aria-expanded={menuOpen}
      >
        {menuOpen ? '✖' : '☰'}
      </button>

      <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
        {NAV_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            style={getBtnStyle(view === id, view)}
            onClick={() => goTo(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>

    <div
      className="main-content"
      style={{ maxWidth: view === 'canales' || view === 'asylum' ? '1200px' : '800px' }}
    >
      {view === 'categorias' && <GallerySearch data={itemsData} />}
      {view === 'canales' && <StreamingGallery data={itemsData} />}
      {view === 'asylum' && <SagaGallery />}
      {view === 'blog' && <BlogSection />}
      {view === 'gashapon' && <GachaponSection />}
    </div>
  </div>
);
}

// Estilos rápidos para la Navbar
const navbarStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 40px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  backgroundColor: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(128,128,128,0.2)'
};

// Función para dar estilo activo a los botones de navegación actualizada para 3 estados
const getBtnStyle = (isActive, currentView) => {
  // Color de fondo cuando el botón está activo
  let activeBgColor = '#8b5a2b'; // Por defecto Clásico (Marrón)
  if (currentView === 'canales') activeBgColor = '#e50914'; // Streaming (Rojo)
  if (currentView === 'asylum') activeBgColor = '#16a085'; // Asilo (Verde clínico)

  // Color de texto cuando el botón está inactivo
  let inactiveTextColor = '#555'; // Por defecto Clásico
  if (currentView === 'canales') inactiveTextColor = '#ccc'; // Streaming (Más claro para fondo oscuro)
  if (currentView === 'asylum') inactiveTextColor = '#2c3e50'; // Asilo (Gris oscuro/azulado clínico)

  return {
    padding: '10px 20px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    backgroundColor: isActive ? activeBgColor : 'transparent',
    color: isActive ? '#fff' : inactiveTextColor,
    transition: 'all 0.3s ease'
  };
};

export default App;