import React, { useEffect, useState } from 'react';
import styles from './PopupModal.module.css';
import type { Popup } from '../../types/Popup';

interface PopupModalProps {
  popup: Popup;
  onClose: () => void;
}

export const PopupModal: React.FC<PopupModalProps> = ({ popup, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to trigger animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for fade out animation
  };

  return (
    <div className={`${styles.overlay} ${isVisible ? styles.visible : ''}`} onClick={handleClose}>
      <div 
        className={`${styles.modalContainer} ${isVisible ? styles.modalVisible : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={handleClose} aria-label="Cerrar">
          &times;
        </button>

        {popup.imagen_url && (
          <div className={styles.imageWrapper}>
            <img src={popup.imagen_url} alt={popup.titulo_popup || 'Popup image'} className={styles.image} />
          </div>
        )}

        <div className={styles.content}>
          {popup.categoria && (
            <span className={styles.categoryBadge}>{popup.categoria}</span>
          )}
          
          {popup.titulo_popup && (
            <h2 className={styles.title}>{popup.titulo_popup}</h2>
          )}
          
          {popup.nombre_comercio && (
            <p className={styles.businessName}>{popup.nombre_comercio}</p>
          )}

          {popup.texto_cuerpo && (
            <div className={styles.bodyText}>
              {popup.texto_cuerpo.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}

          {popup.link_destino && (
            <a 
              href={popup.link_destino} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.ctaButton}
            >
              Saber más
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
