import React, { useState } from 'react';
import blogData from '../data/blog.json';
import './BlogTheme.css';

export default function BlogSection() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`blog-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="blog-header">
        <div>
          <h2>🌸 Otaku Diary 🍙</h2>
          <p>Just some intrusive thoughts i have and share.</p>
        </div>
        <button className="theme-toggle-btn" onClick={toggleTheme} title="Cambiar Tema">
          {isDarkMode ? '🌙' : '☀️'}
        </button>
      </div>

      <div className="blog-posts">
        {blogData.map((post) => (
          <article key={post.id} className="blog-card">
            <h3 className="blog-title">{post.titulo}</h3>
            <div className="blog-meta">
              <span>By <strong>{post.autor}</strong> - {post.fecha}</span>
            </div>
            {post.imagen && (
              <img src={post.imagen} alt={post.titulo} className="blog-image" />
            )}
            <p className="blog-content">{post.contenido}</p>
            <div className="blog-tags">
              {post.etiquetas.map((tag, index) => (
                <span key={index} className="blog-tag">#{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}