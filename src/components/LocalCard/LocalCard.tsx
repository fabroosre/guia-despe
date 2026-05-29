import React from 'react';
import styles from './LocalCard.module.css';
import { isLocalOpen } from '../../utils/businessHours';
import type { LocalListing } from '../../types/LocalListing';

interface LocalCardProps {
  local: LocalListing;
  onClickCard?: (id: string | number) => void;
}

export const LocalCard: React.FC<LocalCardProps> = ({ local, onClickCard }) => {
  const mainImageUrl = local.imagenes && local.imagenes.length > 0 ? local.imagenes[0] : null;

  const isCurrentlyOpen = isLocalOpen(local.horarios);

  const rawMapLink = typeof local.ubicacion === 'string' ? local.ubicacion : local.ubicacion?.googleMapsLink;
  const hasMapLink = Boolean(rawMapLink && rawMapLink.trim() !== '');
  const mapLink = hasMapLink ? rawMapLink : '#';

  return (
    <article
      className={styles.cardContainer}
      onClick={() => onClickCard && onClickCard(local.id)}
      role="button"
      tabIndex={0}
    >
      <div className={styles.imageWrapper}>
        <span className={styles.badgeRubro}>
          {local.rubro}{local.subcategoria ? ` | ${local.subcategoria}` : ''}
        </span>
        {local.esPremium && (
          <span className={styles.premiumBadge}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </span>
        )}

        {mainImageUrl ? (
          <img
            src={mainImageUrl}
            alt={`Fotografía de ${local.nombre}`}
            className={styles.mainImage}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholder}>Sin imagen</div>
        )}
      </div>

      <div className={styles.infoContainer}>
        <h3 className={styles.title} title={local.nombre}>
          {local.nombre}
        </h3>

        <p className={styles.descripcionCorta}>
          {local.descripcion}
        </p>

        <div className={styles.statusWrapper}>
          {isCurrentlyOpen ? (
            <span className={styles.statusOpen}>
              <span className={styles.statusDot}></span> Atendiendo ahora
            </span>
          ) : (
            <span className={styles.statusClosed}>
              <span className={styles.statusDot}></span> Cerrado por el momento
            </span>
          )}
        </div>
        <div className={styles.actionWrapper}>
          {hasMapLink ? (
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkMapBtn}
              onClick={(e) => e.stopPropagation()}
            >
              Cómo llegar
            </a>
          ) : (
            <button
              className={`${styles.linkMapBtn} ${styles.linkMapBtnDisabled}`}
              disabled
              onClick={(e) => e.stopPropagation()}
            >
              Ubicación no disponible
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

