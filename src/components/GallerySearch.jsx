import React, { useState } from 'react';
import './BookTheme.css'; 

const filterKeys = ["Categoria", "Tipo", "Nombre"];

export default function GallerySearch({ data }) {
  const [filters, setFilters] = useState({});
  // NUEVO: Estado para controlar qué personaje se seleccionó para el Modal
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);

  const filteredData = data.filter(item =>
    Object.keys(filters).every(k => item[k] === filters[k])
  );

  let currentKeyIndex = filterKeys.findIndex(key => !filters[key]);
  const isFinished = currentKeyIndex === -1;
  const currentKey = filterKeys[currentKeyIndex];

  let options = [];
  if (!isFinished) {
    options = [...new Set(filteredData.map(item => item[currentKey]))];
  }

  const handleSelect = (key, value) => {
    let newFilters = { ...filters, [key]: value };
    
    let tempFiltered = data.filter(item =>
      Object.keys(newFilters).every(k => item[k] === newFilters[k])
    );

    let nextIndex = filterKeys.indexOf(key) + 1;
    while (nextIndex < filterKeys.length - 1) {
      const nextKey = filterKeys[nextIndex];
      const nextOptions = [...new Set(tempFiltered.map(item => item[nextKey]))];
      
      if (nextOptions.length === 1) {
        newFilters[nextKey] = nextOptions[0];
        nextIndex++;
      } else {
        break;
      }
    }
    setFilters(newFilters);
  };

  const handleBreadcrumbClick = (targetKey) => {
    if (!targetKey) {
      setFilters({}); 
      return;
    }
    const targetIndex = filterKeys.indexOf(targetKey);
    const newFilters = {};
    filterKeys.forEach((key, index) => {
      if (index <= targetIndex && filters[key]) {
        newFilters[key] = filters[key];
      }
    });
    setFilters(newFilters);
  };

  const selectedItem = isFinished ? filteredData[0] : null;

  return (
    <div className="book-container">
      
      {/* Breadcrumbs... */}
      <nav className="book-breadcrumbs">
        <span className="breadcrumb-item link" onClick={() => handleBreadcrumbClick(null)}>
          📖 Inicio
        </span>
        {filterKeys.map(key => filters[key] && (
          <React.Fragment key={key}>
            <span className="breadcrumb-separator"> 🪶 </span>
            <span 
              className={`breadcrumb-item ${key !== 'Nombre' ? 'link' : 'active'}`}
              onClick={() => key !== 'Nombre' && handleBreadcrumbClick(key)}
            >
              {filters[key]}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Pantalla de Filtros */}
      {!isFinished ? (
        <div className="book-section">
          <h2 className="book-subtitle">Selecciona una {currentKey}:</h2>
          <div className="button-group">
            {options.map(opt => (
              <button key={opt} className="book-button" onClick={() => handleSelect(currentKey, opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Pantalla Final con Nuevo Bloque de Personajes */
        <div className="book-detail-card">
          <h1 className="book-title">{selectedItem.Nombre}</h1>
          <div className="book-meta">
            <span><strong>Autor:</strong> {selectedItem.Autor}</span>
            <span className="separator">•</span>
            <span><strong>Año:</strong> {selectedItem.Anio}</span>
          </div>

          {selectedItem.Imagen && (
            <div className="book-image-wrapper">
              <img src={selectedItem.Imagen} alt={selectedItem.Nombre} className="book-image"/>
            </div>
          )}

          <p className="book-description">{selectedItem.Descripcion}</p>

          {/* NUEVO: SECCIÓN DE PERSONAJES */}
          {selectedItem.Personajes && selectedItem.Personajes.length > 0 && (
            <div style={{ marginTop: '30px', borderTop: '1px solid #b89768', paddingTop: '20px' }}>
              <h3 style={{ fontFamily: 'Cinzel, serif', color: '#5c3a21', marginBottom: '15px' }}>
                Conoce a los Personajes
              </h3>
              <div className="button-group">
                {selectedItem.Personajes.map(personaje => (
                  <button 
                    key={personaje} 
                    className="book-button"
                    onClick={() => setPersonajeSeleccionado(personaje)}
                  >
                    {personaje}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="book-button reset-button" onClick={() => handleBreadcrumbClick(null)} style={{ marginTop: '40px' }}>
            ← Volver al inicio
          </button>
        </div>
      )}

      {/* NUEVO: MODAL DE PERSONAJE */}
      {personajeSeleccionado && (
        <div className="character-modal-backdrop" onClick={() => setPersonajeSeleccionado(null)}>
          <div className="character-modal" onClick={e => e.stopPropagation()}>
            <h2>{personajeSeleccionado}</h2>
            <p>
              <em>Aquí conectaremos próximamente tu nuevo JSON para cargar la historia, foto y detalles de {personajeSeleccionado}.</em>
            </p>
            <button 
              className="book-button reset-button" 
              onClick={() => setPersonajeSeleccionado(null)}
              style={{ marginTop: '20px' }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}