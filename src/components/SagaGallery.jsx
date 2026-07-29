import React, { useState } from 'react';
import './AsylumTheme.css';
import itemsData from '../data/items.json';

const SagaGallery = () => {
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);

  // 1. Filtrar solo los elementos que tengan el campo "Saga"
  const sagaItems = itemsData.filter(item => item.Saga && item.Saga.trim() !== "");

  // 2. Agrupar los resultados por el nombre de la Saga
  const sagasAgrupadas = sagaItems.reduce((acc, item) => {
    if (!acc[item.Saga]) {
      acc[item.Saga] = [];
    }
    acc[item.Saga].push(item);
    return acc;
  }, {});

  return (
    <div className="asylum-container">
      <div className="asylum-header">
        <h1 className="clinical-title">REGISTRO DE PACIENTES / ARCHIVOS DE SAGA</h1>
        <p className="clinical-subtitle">ADVERTENCIA: Información clasificada del asilo.</p>
      </div>

      <div className="asylum-wards">
        {Object.keys(sagasAgrupadas).map(sagaName => (
          <div key={sagaName} className="asylum-ward-section">
            <h2 className="ward-title">PABELLÓN: {sagaName.toUpperCase()}</h2>
            <div className="patient-grid">
              {sagasAgrupadas[sagaName].map(item => (
                <div key={item.id} className="patient-file">
                  <div className="file-image-container">
                    <img src={item.Imagen} alt={item.Nombre} className="patient-photo" />
                    <div className="file-overlay">EXPEDIENTE #{item.id}</div>
                  </div>
                  <div className="patient-data">
                    <h3>{item.Nombre}</h3>
                    <p className="patient-diagnostics"><strong>Autor:</strong> {item.Autor}</p>
                    <p className="patient-diagnostics"><strong>Año de Ingreso:</strong> {item.Anio}</p>
                    
                    {item.Speech && (
                      <div className="patient-quote">
                        <em>"{item.Speech}"</em>
                      </div>
                    )}
                    
                    <p className="patient-notes"><strong>Notas Clínicas:</strong> {item.Descripcion}</p>
                    
                    {item.Personajes && item.Personajes.length > 0 && (
                      <div className="subject-links">
                        <strong>Sujetos Involucrados:</strong>
                        <div className="pill-group">
                          {item.Personajes.map((personaje, index) => (
                            <button 
                              key={index} 
                              className="subject-pill"
                              onClick={() => setPersonajeSeleccionado(personaje)}
                            >
                              {personaje}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Clínico para Personajes */}
      {personajeSeleccionado && (
        <div className="asylum-modal-overlay" onClick={() => setPersonajeSeleccionado(null)}>
          <div className="asylum-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal-clinical" onClick={() => setPersonajeSeleccionado(null)}>
              [ CERRAR EXPEDIENTE ]
            </button>
            <h2>Sujeto: {personajeSeleccionado}</h2>
            <p className="modal-warning">Buscando registros médicos y antecedentes en la base de datos...</p>
            {/* Aquí luego conectarás los datos de tu personajes.json */}
          </div>
        </div>
      )}
    </div>
  );
};

export default SagaGallery;