import React from 'react';
import styles from './LocalDetail.module.css';
import { isLocalOpen } from '../../utils/businessHours';
import { getYoutubeEmbedUrl } from '../../utils/videoUtils';
import type { LocalListing } from '../../types/LocalListing';

interface LocalDetailProps {
  local: LocalListing;
  onBack: () => void;
}

export const LocalDetail: React.FC<LocalDetailProps> = ({ local, onBack }) => {
  const isCurrentlyOpen = isLocalOpen(local.horarios);

  const rawMapLink = typeof local.ubicacion === 'string' ? local.ubicacion : local.ubicacion?.googleMapsLink;
  const hasMapLink = Boolean(rawMapLink && rawMapLink.trim() !== '');
  const mapLink = hasMapLink ? rawMapLink : '#';

  const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const;

  const heroImage = local.imagenes && local.imagenes.length > 0 ? local.imagenes[0] : '';
  const galleryImages = local.imagenes && local.imagenes.length > 1 ? local.imagenes.slice(1) : [];
  const youtubeEmbedUrl = getYoutubeEmbedUrl(local.videoUrl);

  return (
    <div className={styles.detailContainer}>
      <button className={styles.backButton} onClick={onBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Volver a la guía
      </button>

      {/* Hero Section */}
      {heroImage && (
        <div className={styles.heroSection}>
          <div className={styles.heroImageWrapper}>
            <img src={heroImage} alt={local.nombre} className={styles.heroImage} />
          </div>
        </div>
      )}

      <div className={styles.contentWrapper} style={!heroImage ? { marginTop: '4rem' } : {}}>
        <div className={styles.header}>
          <span className={styles.badgeRubro}>
            {local.rubro}{local.subcategoria ? ` · ${local.subcategoria}` : ''}
          </span>
          <h2 className={styles.title}>{local.nombre}</h2>
          <div className={styles.statusWrapper}>
            {isCurrentlyOpen ? (
              <span className={styles.statusOpen}>
                <span className={styles.statusDot}></span> Abierto ahora
              </span>
            ) : (
              <span className={styles.statusClosed}>
                <span className={styles.statusDot}></span> Cerrado por el momento
              </span>
            )}
          </div>
        </div>

        <div className={styles.mainGrid}>
          {/* Columna Izquierda: Descripción e Imágenes adicionales */}
          <div className={styles.leftColumn}>
            <section className={styles.sectionBlock}>
              <h3 className={styles.sectionTitle}>Sobre nosotros</h3>
              <p className={styles.description}>{local.descripcion}</p>
            </section>

            {/* Solo Premium: Galería y Video */}
            {local.esPremium && (
              <>
                {galleryImages.length > 0 && (
                  <section className={styles.sectionBlock}>
                    <div className={styles.gallery}>
                      {galleryImages.map((img, idx) => (
                        <div key={idx} className={styles.galleryImageWrapper}>
                          <img src={img} alt={`Vista ${idx + 1} de ${local.nombre}`} className={styles.galleryImage} loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {youtubeEmbedUrl && (
                  <section className={styles.sectionBlock}>
                    <div className={styles.videoWrapper}>
                      <iframe
                        width="100%"
                        height="315"
                        src={youtubeEmbedUrl}
                        title={`Video de ${local.nombre}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className={styles.videoIframe}
                      ></iframe>
                    </div>
                  </section>
                )}
              </>
            )}
          </div>

          {/* Columna Derecha: Horarios y Ubicación */}
          <div className={styles.rightColumn}>
            <div className={styles.stickySidebar}>
              <section className={styles.sidebarBlock}>
                <h3 className={styles.sectionTitle}>Horario de Atención</h3>
                <ul className={styles.scheduleList}>
                  {dias.map(dia => {
                    const horario = local.horarios[dia];
                    return (
                      <li key={dia} className={styles.scheduleItem}>
                        <span className={styles.dayName}>{dia.charAt(0).toUpperCase() + dia.slice(1)}</span>
                        <span className={styles.hours}>
                          {horario?.abierto ? (
                            horario.apertura && horario.cierre
                              ? `${horario.apertura} – ${horario.cierre}`
                              : 'Abierto'
                          ) : 'Cerrado'}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className={styles.sidebarBlock}>
                <h3 className={styles.sectionTitle}>Ubicación</h3>
                {local.direccion && (
                  <p className={styles.direccionText}>
                    📍 {local.direccion}
                  </p>
                )}
                {hasMapLink ? (
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapLinkBtn}
                  >
                    Abrir en Google Maps
                  </a>
                ) : (
                  <p className={styles.emptyMap}>La ubicación no está disponible para este negocio.</p>
                )}
              </section>

              {/* Contacto: WhatsApp y Email solo Premium. Telefono para todos. */}
              {(local.telefono || (local.esPremium && (local.whatsapp || local.email))) && (
                <section className={styles.sidebarBlock}>
                  <h3 className={styles.sectionTitle}>Contacto</h3>
                  <div className={styles.contactList}>
                    {local.telefono && (
                      <a href={`tel:${local.telefono}`} className={styles.contactItem}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        <span>{local.telefono}</span>
                      </a>
                    )}
                    {local.esPremium && (
                      <>
                        {local.whatsapp && (
                          <a href={`https://wa.me/${local.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-7.6 8.38 8.38 0 0 1 3.8.9L21 4.5z"></path></svg>
                            <span>WhatsApp</span>
                          </a>
                        )}
                        {local.email && (
                          <a href={`mailto:${local.email}`} className={styles.contactItem}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            <span>{local.email}</span>
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </section>
              )}

              {/* Redes Sociales - Solo Premium */}
              {local.esPremium && local.redesSociales && Object.keys(local.redesSociales).length > 0 && (
                <section className={styles.sidebarBlock}>
                  <h3 className={styles.sectionTitle}>Redes Sociales</h3>
                  <div className={styles.socialGrid}>
                    {local.redesSociales.instagram && (
                      <a href={local.redesSociales.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="Instagram">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      </a>
                    )}
                    {local.redesSociales.facebook && (
                      <a href={local.redesSociales.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="Facebook">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                      </a>
                    )}
                    {local.redesSociales.whatsapp && (
                      <a href={local.redesSociales.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="WhatsApp">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-7.6 8.38 8.38 0 0 1 3.8.9L21 4.5z"></path></svg>
                      </a>
                    )}
                    {local.redesSociales.tiktok && (
                      <a href={local.redesSociales.tiktok} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="TikTok">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                      </a>
                    )}
                  </div>
                </section>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
