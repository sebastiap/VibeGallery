import React, { useState } from 'react';
import GallerySearch from './components/GallerySearch';
import StreamingGallery from './components/StreamingGallery';
import itemsData from './data/items.json';
import SagaGallery from './components/SagaGallery'; // NUEVA Vista Asilo

function App() {
  // Estado para controlar qué vista estamos viendo
  const [view, setView] = useState('categorias'); // 'categorias' | 'canales' | 'asylum'

  // Función para determinar el color de fondo general según la vista
  const getBackgroundColor = (currentView) => {
    if (currentView === 'canales') return '#141414'; // Oscuro streaming
    if (currentView === 'asylum') return '#eef2f3'; // Gris/blanco clínico asilo
    return '#fff'; // Blanco clásico libro
  };

  // Función para determinar el color del título de la Navbar
  const getTitleColor = (currentView) => {
    if (currentView === 'canales') return '#e50914'; // Rojo Netflix
    if (currentView === 'asylum') return '#16a085'; // Verde médico
    return '#3a2614'; // Marrón clásico
  };

  return (
    <div style={{ backgroundColor: getBackgroundColor(view), minHeight: '100vh', transition: 'background-color 0.3s' }}>
      
      {/* BARRA DE NAVEGACIÓN */}
      <nav style={navbarStyles}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: getTitleColor(view), transition: 'color 0.3s' }}>
          Mi Galería Dinámica
        </h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            style={getBtnStyle(view === 'categorias', view)} 
            onClick={() => setView('categorias')}
          >
            Vista Clásica (Libro)
          </button>
          <button 
            style={getBtnStyle(view === 'canales', view)} 
            onClick={() => setView('canales')}
          >
            Vista de Canales (Streaming)
          </button>
          {/* BOTÓN CORREGIDO PARA LA VISTA ASILO */}
          <button 
            style={getBtnStyle(view === 'asylum', view)} 
            onClick={() => setView('asylum')}
          >
            🏥 Archivos del Asilo (Sagas)
          </button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL (RENDERIZADO CONDICIONAL CORREGIDO) */}
      <div style={{ 
        maxWidth: view === 'canales' || view === 'asylum' ? '1200px' : '800px', 
        margin: '0 auto', 
        padding: '20px',
        transition: 'all 0.3s'
      }}>
        {view === 'categorias' && <GallerySearch data={itemsData} />}
        {view === 'canales' && <StreamingGallery data={itemsData} />}
        {view === 'asylum' && <SagaGallery />}
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