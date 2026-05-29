import React from 'react';
import styles from './PromotionsModal.module.css';
import type { Promotion } from '../../types/Promotion';

interface PromotionsModalProps {
  promotions: Promotion[];
  loading: boolean;
  error: Error | null;
  onClose: () => void;
  onRetry: () => void;
}

export const PromotionsModal: React.FC<PromotionsModalProps> = ({ promotions, loading, error, onClose, onRetry }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar">×</button>
        <h2 className={styles.title}>Promociones</h2>
        <p className={styles.description}>Aquí están todas las promociones disponibles actualmente. Haz clic en cada una para ver más información.</p>

        {loading && <div className={styles.spinner} />}

        {error && (
          <div className={styles.errorState}>
            <p>No se pudieron cargar las promociones.</p>
            <button className={styles.promotionLink} onClick={onRetry}>Reintentar</button>
          </div>
        )}

        {!loading && !error && promotions.length === 0 && (
          <div className={styles.emptyState}>
            <p>No hay promociones activas en este momento.</p>
          </div>
        )}

        {!loading && !error && promotions.length > 0 && (
          <div className={styles.list}>
            {promotions.map((promotion) => (
              <article key={promotion.id} className={styles.promotionCard}>
                <div className={styles.promotionHeader}>
                  <div className={styles.promotionTitleBlock}>
                    <h3 className={styles.promotionName}>
                      {promotion.nombre_comercio || 'Comercio'}
                    </h3>
                    {promotion.categoria && <span className={styles.promotionBadge}>{promotion.categoria}</span>}
                    {(promotion.titulo_popup || promotion.titulo) && (
                      <p className={styles.promotionBusiness}>{promotion.titulo_popup || promotion.titulo}</p>
                    )}
                  </div>
                </div>

                {promotion.imagen_url && (
                  <img src={promotion.imagen_url} alt={promotion.titulo_popup || promotion.titulo || 'Promoción'} className={styles.promotionImage} />
                )}

                {(promotion.texto_cuerpo || promotion.descripcion || promotion.texto) && (
                  <p className={styles.promotionDescription}>
                    {promotion.texto_cuerpo || promotion.descripcion || promotion.texto}
                  </p>
                )}

                {(() => {
                  const link = (promotion.link_destino || promotion.link || '').trim();
                  return link ? (
                    <a
                      className={styles.promotionLink}
                      href={link.startsWith('http') ? link : `https://${link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver promoción
                    </a>
                  ) : null;
                })()}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
