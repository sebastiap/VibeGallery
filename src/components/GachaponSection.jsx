import React, { useState, useEffect } from 'react';
import itemsData from '../data/items.json';
import personajesData from '../data/personajes.json';
import './GachaponTheme.css';

const RAREZAS = ['SSR ★★★★★', 'SR ★★★★☆', 'UR ★──────★', 'R ★★★☆☆'];
const COLORES = ['#ff70a6', '#70d6ff', '#ffd166', '#9b5de5', '#ff9770', '#06d6a0'];
const MAX_GACHA_LIMIT = 10;
const STORAGE_KEY = 'gacha_collection';

const saveCollection = (collection) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  } catch (e) {
    console.error('Error al guardar en localStorage:', e);
  }
};

const getCollection = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Error al consultar localStorage:', e);
    return [];
  }
};

const clearCollection = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error al limpiar localStorage:', e);
  }
};

const buildFullPool = () => [
  ...itemsData.map(i => ({
    id: `item-${i.Name}`,
    nombre: i.Name,
    subtitulo: `${i.Category} • ${i.Type || i.Canal || 'Objeto'}`,
    imagen: i.Imagen || 'https://picsum.photos/seed/item/200/200',
    frase: i.Descripcion || i.Detalles || 'Una maravillosa historia por descubrir en la galería.',
    link: i.Link || i.Sitio || '#',
    tipo: 'item'
  })),
  ...personajesData.map(p => ({
    id: `personaje-${p.Nombre}`,
    nombre: p.Nombre,
    subtitulo: `Origen: ${p.origen}`,
    imagen: p.Imagen || 'https://picsum.photos/seed/personaje/200/200',
    frase: p.Info?.Frase || p.Historia || '¡Un personaje icónico de la colección!',
    link: p.bots?.[0]?.Link || p.historia?.[0]?.Link || '#',
    tipo: 'personaje'
  }))
];

export default function GachaponSection() {
  const [collection, setCollection] = useState([]);
  const [availablePool, setAvailablePool] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  const [recentPulls, setRecentPulls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isCapsuleOpened, setIsCapsuleOpened] = useState(false); // Estado para animación de apertura
  const [copiedFormat, setCopiedFormat] = useState(null);

  // Estados para filtros de inventario
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'personaje', 'item'
  const [filterRarity, setFilterRarity] = useState('ALL'); // 'ALL', 'SSR', 'SR', 'UR', 'R'

  useEffect(() => {
    const fullPool = buildFullPool();
    console.log(fullPool[0].link)
    const savedCollection = getCollection();
    
    setCollection(savedCollection);
    const savedIds = new Set(savedCollection.map(item => item.id));
    const filteredPool = fullPool.filter(item => !savedIds.has(item.id));
    setAvailablePool(filteredPool);
  }, []);

  const playSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (type === 'spin') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'chime') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + index * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + index * 0.08);
          osc.stop(ctx.currentTime + index * 0.08 + 0.4);
        });
      }
    } catch (e) {}
  };

  const spinGacha = (count = 1) => {
    if (isSpinning) return;
    const remainingSlots = MAX_GACHA_LIMIT - collection.length;

    if (remainingSlots <= 0) {
      alert(`⚠️ You has reached the maximum limit of ${MAX_GACHA_LIMIT} capsules.`);
      return;
    }
    if (availablePool.length === 0) {
      alert("🎉 Awesome! You've already obtained all the available items.");
      return;
    }

    const actualSpins = Math.min(count, remainingSlots, availablePool.length);
    setIsSpinning(true);
    playSound('spin');

    setTimeout(() => {
      let poolCopy = [...availablePool];
      const newPrizes = [];

      for (let i = 0; i < actualSpins; i++) {
        if (poolCopy.length === 0) break;
        const randomIndex = Math.floor(Math.random() * poolCopy.length);
        const prize = {
          ...poolCopy[randomIndex],
          rareza: RAREZAS[Math.floor(Math.random() * RAREZAS.length)],
          color: COLORES[Math.floor(Math.random() * COLORES.length)],
          obtainedAt: new Date().toLocaleDateString()
        };
        newPrizes.push(prize);
        poolCopy.splice(randomIndex, 1);
      }

      const updatedCollection = [...newPrizes, ...collection];
      setCollection(updatedCollection);
      saveCollection(updatedCollection);
      setAvailablePool(poolCopy);

      setRecentPulls(newPrizes);
      setSelectedCapsule(newPrizes[0]);
      setIsSpinning(false);
      setIsCapsuleOpened(false); // Reinicia la cápsula a estado cerrado
      setShowModal(true);
    }, 800);
  };

  // Romper / Abrir cápsula interactivamente
  const handleOpenCapsule = () => {
    if (isCapsuleOpened) return;
    playSound('pop');
    setTimeout(() => {
      setIsCapsuleOpened(true);
      playSound('chime');
    }, 150);
  };

  const openSavedCapsule = (item) => {
    setRecentPulls([item]);
    setSelectedCapsule(item);
    setIsCapsuleOpened(true); // Al abrir desde el inventario se muestra directamente revelada
    setShowModal(true);
    playSound('chime');
  };

  const resetCollection = () => {
    if (window.confirm('¿Deseas reiniciar tu colección y limpiar el almacenamiento local?')) {
      clearCollection();
      setCollection([]);
      setAvailablePool(buildFullPool());
    }
  };

  const getDiscordMarkdown = (item) => {
    return `✨ **Check out my new Gachapon capsule!** ✨\n` +
      `🏆 **[${item.rareza}] ${item.nombre}**\n` +
      `📌 *${item.subtitulo}*\n` +
      `💬 "${item.frase}"\n` +
      `💬 "${item.link}"\n` +
      `🖼️ ${item.imagen}`;
  };

  const getIframeSnippet = (item) => {
    return `<iframe src="${window.location.origin}?capsuleId=${encodeURIComponent(item.id)}" width="320" height="240" frameborder="0" style="border-radius:12px; border:2px solid ${item.color}; font-family:sans-serif;"></iframe>`;
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(type);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  // Filtrado dinámico del inventario
  const filteredCollection = collection.filter(item => {
    const matchType = filterType === 'ALL' || item.tipo === filterType;
    const matchRarity = filterRarity === 'ALL' || item.rareza.startsWith(filterRarity);
    return matchType && matchRarity;
  });

  const isLimitReached = collection.length >= MAX_GACHA_LIMIT;
  const isPoolEmpty = availablePool.length === 0;

  return (
    <section id="gachapon" className="gacha-section">
      <div className="gacha-header">
        <h2>🎰 Otaku Gachapon Wheel ⚡</h2>
        <p>Turn the crank, open your capsule, and filter your collectible inventory!</p>
      </div>

      <div className="gacha-container">
        {/* Máquina Expendedora */}
        <div className="gacha-machine">
          <div className="gacha-dome">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="gacha-capsule-item"
                style={{
                  background: `linear-gradient(135deg, ${COLORES[i % COLORES.length]} 50%, #ffffff 50%)`,
                  top: `${20 + (i * 15) % 130}px`,
                  left: `${25 + (i * 35) % 180}px`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>

          <div className="gacha-controls">
            <div 
              className={`gacha-crank ${isSpinning ? 'spinning' : ''}`} 
              onClick={() => spinGacha(1)}
            >
              <div className="gacha-handle" />
            </div>

            <div className="gacha-buttons-group" style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button 
                className="gacha-spin-btn" 
                onClick={() => spinGacha(1)} 
                disabled={isSpinning || isLimitReached || isPoolEmpty}
              >
                {isSpinning ? '🌀...' : '✨ Pull x1'}
              </button>
              <button 
                className="gacha-spin-btn multi" 
                onClick={() => spinGacha(5)} 
                disabled={isSpinning || isLimitReached || isPoolEmpty}
                style={{ backgroundColor: '#ff9770' }}
              >
                {isSpinning ? '🌀...' : '⚡ Pull x5'}
              </button>
            </div>
          </div>
        </div>

        {/* Historial de Colección y Filtros */}
        <div className="gacha-collection">
          <div className="gacha-collection-header">
            <h3>🎁 Your Colection ({collection.length}/{MAX_GACHA_LIMIT})</h3>
            {collection.length > 0 && (
              <button className="gacha-reset-btn" onClick={resetCollection} title="Reiniciar">
                🗑️ Restart
              </button>
            )}
          </div>

          {/* Barra de Filtros de Inventario */}
          {collection.length > 0 && (
            <div className="gacha-filter-bar">
              <div className="filter-group">
                <span>Tipo:</span>
                <button className={filterType === 'ALL' ? 'active' : ''} onClick={() => setFilterType('ALL')}>ALL </button>
                <button className={filterType === 'personaje' ? 'active' : ''} onClick={() => setFilterType('personaje')}>👤 Characters</button>
                <button className={filterType === 'item' ? 'active' : ''} onClick={() => setFilterType('item')}>📖 Bots</button>
              </div>
              <div className="filter-group">
                <span>Rareza:</span>
                <button className={filterRarity === 'ALL' ? 'active' : ''} onClick={() => setFilterRarity('ALL')}>All</button>
                {['SSR', 'SR', 'UR', 'R'].map(r => (
                  <button key={r} className={filterRarity === r ? 'active' : ''} onClick={() => setFilterRarity(r)}>{r}</button>
                ))}
              </div>
            </div>
          )}

          {filteredCollection.length === 0 ? (
            <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '15px' }}>
              {collection.length === 0 ? 'Aún no tienes cápsulas guardadas.' : 'No hay cápsulas que coincidan con los filtros seleccionados.'}
            </p>
          ) : (
            <div className="gacha-grid">
              {filteredCollection.map(item => (
                <div 
                  key={item.id} 
                  className="gacha-card clickable"
                  onClick={() => openSavedCapsule(item)}
                >
                  <img src={item.imagen} alt={item.nombre} />
                  <div className="gacha-card-name">{item.nombre}</div>
                  <div className="gacha-card-rarity" style={{ color: item.color }}>{item.rareza.split(' ')[0]}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Interactivo de Recompensa */}
      {showModal && selectedCapsule && (
        <div className="gacha-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="gacha-modal" onClick={e => e.stopPropagation()}>
            {recentPulls.length > 1 && isCapsuleOpened && (
              <div className="gacha-multi-selector">
                {recentPulls.map((p, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedCapsule(p)}
                    className={selectedCapsule.id === p.id ? 'active' : ''}
                    style={{ background: p.color }}
                  >
                    #{idx + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Vista 1: Cápsula Cerrada Interactiva */}
            {!isCapsuleOpened ? (
              <div className="unopened-capsule-container" onClick={handleOpenCapsule}>
                <div className="unopened-capsule" style={{ background: `linear-gradient(135deg, ${selectedCapsule.color} 50%, #ffffff 50%)` }}>
                  <span className="capsule-seam"></span>
                </div>
                <p className="tap-instruction">✨ Click on the capsule to open it! ✨</p>
              </div>
            ) : (
              /* Vista 2: Contenido Revelado con Animación */
              <div className="revealed-content-anim">
                <div className="gacha-img-rarity">
                <img src={selectedCapsule.imagen} alt={selectedCapsule.nombre} className="gacha-modal-img" />
                <span className="gacha-badge" style={{ background: selectedCapsule.color }}>
                  {selectedCapsule.rareza}
                </span>
                </div>
                <h3>{selectedCapsule.nombre}</h3>
                <p className="gacha-modal-sub">{selectedCapsule.subtitulo}</p>
                <blockquote className="gacha-modal-quote">"{selectedCapsule.frase}"</blockquote>
                <a href={selectedCapsule.link}>Play {selectedCapsule.nombre}! </a>

                <div className="gacha-share-box">
                  <strong>📢 Show Off Capsule</strong>
                  <div className="share-btn-group">
                    <button onClick={() => copyToClipboard(getDiscordMarkdown(selectedCapsule), 'discord')}>
                      {copiedFormat === 'discord' ? '✅ Copied' : '💬 Discord'}
                    </button>
                    {/* <button onClick={() => copyToClipboard(getIframeSnippet(selectedCapsule), 'iframe')}>
                      {copiedFormat === 'iframe' ? '✅ Copiado' : '🌐 iFrame'}
                    </button> */}
                  </div>
                </div>

                <div style={{ marginTop: '15px' }}>
                  <button className="gacha-modal-close" onClick={() => setShowModal(false)}>
                    Close ✖
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}