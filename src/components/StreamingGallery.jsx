import React, { useState } from 'react';
import './StreamingTheme.css';

export default function StreamingGallery({ data }) {
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Estado independiente para controlar el modal del personaje
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);

  // Agrupar los datos dinámicamente por canal [cite: 61]
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.Canal]) {
      acc[item.Canal] = [];
    }
    acc[item.Canal].push(item);
    return acc;
  }, {});

  // Función para cerrar el modal principal limpiando también el personaje si estuviera abierto
  const closeMainModal = () => {
    setSelectedItem(null);
    setPersonajeSeleccionado(null);
  };

  return (
    <div className="streaming-container">
      <div className="streaming-header">
        <h2>Available Channels</h2>
      </div>

      {/* RENDERIZADO DEL CARRUSEL POR CANAL */}
      {Object.keys(groupedData).map(canal => (
        <div key={canal} className="channel-row">
          <h3 className="channel-title">{canal}</h3>
          <div className="carousel">
            {groupedData[canal].map(item => (
              <div 
                key={item.id} 
                className="carousel-card"
                onClick={() => setSelectedItem(item)}
              >
                <img src={item.Imagen} alt={item.Name} className="card-image" />
                <div className="card-overlay">
                  <h4>{item.Name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* MODAL PRINCIPAL: DETALLE DEL ITEM */}
      {selectedItem && (
        <div className="streaming-modal-backdrop" onClick={closeMainModal}>
          <div className="streaming-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeMainModal}>X</button>
            <img src={selectedItem.Imagen} alt={selectedItem.Name} className="modal-banner" />
            
            <div className="modal-content">
              <h2>{selectedItem.Name}</h2>
              <p className="modal-meta">
                <span className="match">98% for you</span> {selectedItem.Anio} • {selectedItem.Type}
              </p>
              <p className="modal-desc">{selectedItem.Descripcion}</p>
              <a href={selectedItem.Link}>
                  <button 
                    key={selectedItem.Link} 
                    className="streaming-character-btn"
                    //onClick={() => setPersonajeSeleccionado(personaje)}
                  >
                   Play - "{selectedItem.Name}"
                  </button>
              </a>
              <p className="modal-cast"><strong>Author:</strong> {selectedItem.Autor}</p>
              
              {/* NUEVA SECCIÓN: REPARTO / PERSONAJES */}
              {selectedItem.Personajes && selectedItem.Personajes.length > 0 && (
                <div className="streaming-character-section">
                  <h3 className="cast-title">Reparto:</h3>
                  <div className="streaming-character-group">
                    {selectedItem.Personajes.map(personaje => (
                      <button 
                        key={personaje} 
                        className="streaming-character-btn"
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
        </div>
      )}

      {/* MODAL SECUNDARIO: DETALLE DEL PERSONAJE */}
      {personajeSeleccionado && (
        <div className="streaming-character-modal-backdrop" onClick={() => setPersonajeSeleccionado(null)}>
          <div className="streaming-character-modal" onClick={e => e.stopPropagation()}>
            <h2>{personajeSeleccionado}</h2>
            <div className="character-placeholder-content">
              <p>
                <em>Coming Soon info of {personajeSeleccionado} </em>
              </p>
            </div>
            <button 
              className="streaming-character-close-btn" 
              onClick={() => setPersonajeSeleccionado(null)}
            >
              Return to title
            </button>
          </div>
        </div>
      )}
    </div>
  );
}