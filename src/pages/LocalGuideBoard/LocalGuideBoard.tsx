import React, { useState, useMemo, useEffect } from 'react';
import { useLocalities } from '../../hooks/useLocalities';
import { usePopups } from '../../hooks/usePopups';
import { usePromotions } from '../../hooks/usePromotions';
import { LocalCard } from '../../components/LocalCard/LocalCard';
import { LocalDetail } from '../../components/LocalDetail/LocalDetail';
import { PopupModal } from '../../components/PopupModal/PopupModal';
import { PromotionsModal } from '../../components/PromotionsModal/PromotionsModal';
import styles from './LocalGuideBoard.module.css';

const FILTROS_CATEGORIAS = [
  'Comercios',
  'Gastronomía y Alimentos',
  'Hogar',
  'Industrias',
  'Salud y Belleza',
  'Servicios y Vehículos',
  'Turismo y Hospedaje',
  'Servicios Profesionales',
  'Servicios Particulares',
  'Institucional',
  'Deportes',
  'Entretenimiento y Ocio'
];


export const LocalGuideBoard: React.FC = () => {
  const { data, loading, error, refetch } = useLocalities();

  const [catSeleccionada, setCatSeleccionada] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState<string>('');
  const [selectedLocalId, setSelectedLocalId] = useState<string | number | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showTownModal, setShowTownModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showPromotionsModal, setShowPromotionsModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Popup logic
  const { popups } = usePopups();
  const { promotions, loading: promotionsLoading, error: promotionsError, refetch: refetchPromotions } = usePromotions();
  const [popupsLastSeen, setPopupsLastSeen] = useState<Record<number, string>>({});

  useEffect(() => {
    // Configurar favicon y título de la pestaña
    const link = (document.querySelector("link[rel*='icon']") || document.createElement('link')) as HTMLLinkElement;
    link.type = 'image/jpeg';
    link.rel = 'icon';
    link.href = 'https://i.ibb.co/KpX42FxH/logo.jpg';
    document.head.appendChild(link);
    document.title = "Guía Despeñaderos";

    const stored = localStorage.getItem('popupsLastSeen');
    if (stored) {
      try { setPopupsLastSeen(JSON.parse(stored)); } catch (e) { }
    }
  }, []);

  // Bloquear el scroll del fondo cuando el menú móvil está abierto
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showMobileMenu]);

  const activePopup = popups.find(p => {
    const lastSeenDate = popupsLastSeen[p.id];
    const today = new Date().toLocaleDateString();
    return lastSeenDate !== today;
  });

  const handleClosePopup = (id: number) => {
    const today = new Date().toLocaleDateString();
    const updated = { ...popupsLastSeen, [id]: today };
    setPopupsLastSeen(updated);
    localStorage.setItem('popupsLastSeen', JSON.stringify(updated));
  };





  const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    'Comercios': '🛍️',
    'Gastronomía y Alimentos': '🍽️',
    'Hogar': '🏠',
    'Industrias': '🏭',
    'Salud y Belleza': '⚕️',
    'Servicios y Vehículos': '🔧',
    'Turismo y Hospedaje': '🏨',
    'Servicios Profesionales': '💼',
    'Servicios Particulares': '👤',
    'Institucional': '🏛️',
    'Deportes': '⚽',
    'Entretenimiento y Ocio': '🎭'
  };

  const selectedLocal = useMemo(() => {
    return selectedLocalId ? data.find(l => l.id === selectedLocalId) || null : null;
  }, [data, selectedLocalId]);

  const listaFiltrada = useMemo(() => {
    const filtrados = data.filter(local => {
      const cumpleFiltroCat = catSeleccionada === null || local.rubro === catSeleccionada;
      const normalizaTexto = busqueda.toLowerCase().trim();

      const cumpleTexto =
        local.nombre.toLowerCase().includes(normalizaTexto) ||
        local.descripcion.toLowerCase().includes(normalizaTexto) ||
        local.rubro.toLowerCase().includes(normalizaTexto) ||
        (local.subcategoria && local.subcategoria.toLowerCase().includes(normalizaTexto));

      return cumpleFiltroCat && cumpleTexto;
    });

    return filtrados.sort((a, b) => {
      if (a.esPremium && !b.esPremium) return -1;
      if (!a.esPremium && b.esPremium) return 1;
      return 0;
    });
  }, [data, catSeleccionada, busqueda]);

  if (selectedLocal) {
    return <LocalDetail local={selectedLocal} onBack={() => setSelectedLocalId(null)} />;
  }

  return (
    <div className={styles.boardContainer}>

      <header className={styles.header}>
        <div className={styles.topBar}>
          <div className={styles.logoWrapper}>
            <img src="https://i.ibb.co/6c8LZqDc/logo.png" alt="Logo" className={styles.logo} />
          </div>
          <nav className={styles.mainNav}>
            <a
              href="#"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                setCatSeleccionada(null);
                setBusqueda('');
                setSelectedLocalId(null);
              }}
            >
              Inicio
            </a>

            <a
              href="#"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                setShowVideoModal(true);
              }}
            >
              ¿Qué es Guía D?
            </a>

            <a
              href="#"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                setShowTownModal(true);
              }}
            >
              Nuestro Pueblo
            </a>
            <a
              href="#"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                setShowPromotionsModal(true);
              }}
            >
              Promociones
            </a>
            <a
              href="#"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                setShowContactModal(true);
              }}
            >
              Contacto
            </a>
            <a
              href="#"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                setShowQRModal(true);
              }}
            >
              Compártenos
            </a>
          </nav>


          <button
            className={`${styles.hamburger} ${showMobileMenu ? styles.hamburgerActive : ''}`}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`${styles.mobileMenu} ${showMobileMenu ? styles.mobileMenuActive : ''}`}>
          <div className={styles.mobileLogoWrapper} onClick={() => { setCatSeleccionada(null); setBusqueda(''); setSelectedLocalId(null); setShowMobileMenu(false); }} style={{ cursor: 'pointer' }}>
            <img src="https://i.ibb.co/6c8LZqDc/logo.png" alt="Logo" className={styles.mobileLogo} />
          </div>
          <nav className={styles.mobileNav}>
            <a href="#" onClick={(e) => { e.preventDefault(); setCatSeleccionada(null); setBusqueda(''); setSelectedLocalId(null); setShowMobileMenu(false); }}>Inicio</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowVideoModal(true); setShowMobileMenu(false); }}>¿Qué es Guía D?</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowTownModal(true); setShowMobileMenu(false); }}>Nuestro Pueblo</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowPromotionsModal(true); setShowMobileMenu(false); }}>Promociones</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowContactModal(true); setShowMobileMenu(false); }}>Contacto</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowQRModal(true); setShowMobileMenu(false); }}>Compártenos</a>
          </nav>
        </div>





        <div className={styles.heroContent}>
          <h1 className={styles.title}>Guía Despeñaderos</h1>
          <p className={styles.subtitle}>Encuentra lo mejor de tu localidad</p>

          <div className={styles.searchWrapper}>
            <div className={styles.searchIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="search"
              placeholder="Busca lo que necesites"
              value={busqueda}

              onChange={(e) => {
                setBusqueda(e.target.value);
                setCatSeleccionada(null);
              }}
              className={styles.searchInput}
            />
          </div>

          <nav className={styles.categoryNav} aria-label="Filtrar por rubro">
            {FILTROS_CATEGORIAS.map(cat => (
              <button
                key={cat}
                className={`${styles.categoryPill} ${catSeleccionada === cat ? styles.activePill : ''}`}
                onClick={() => {
                  setCatSeleccionada(cat);
                  setBusqueda('');
                }}
              >
                <span className={styles.categoryIcon}>
                  {CATEGORY_ICONS[cat] || '✨'}
                </span>
               {cat}

              </button>
            ))}
          </nav>
        </div>
      </header>


      {loading && (
        <div className={styles.statusView}>
          <div className={styles.loaderSpinner}></div>
          <p>Conectando con Despeñaderos...</p>
        </div>
      )}

      {!loading && error && (
        <div className={styles.statusView}>
          <p className={styles.errorText}>
            Oops, detectamos un problema de conexión intentando cargar la guía.
          </p>
          <button className={styles.retryButton} onClick={refetch}>
            Reconectar
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {listaFiltrada.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No se encontraron locales para tu búsqueda o filtro actual.</p>
              <button
                className={styles.retryButton}
                onClick={() => { setBusqueda(''); setCatSeleccionada(null); }}
              >
                Limpiar Búsqueda
              </button>
            </div>
          ) : (
            <main className={styles.gridContainer}>
              {listaFiltrada.map((local) => (
                <LocalCard
                  key={local.id}
                  local={local}
                  onClickCard={setSelectedLocalId}
                />
              ))}
            </main>
          )}
        </>
      )}

      {showVideoModal && (
        <div className={styles.modalOverlay} onClick={() => setShowVideoModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setShowVideoModal(false)}>×</button>
            <div className={styles.videoResponsive}>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/IrbFagGkLFM?autoplay=1"
                title="¿Qué es Guía D?"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
      {showTownModal && (
        <div className={`${styles.modalOverlay} ${styles.fadeIn}`} onClick={() => setShowTownModal(false)}>
          <div className={`${styles.elegantModal} ${styles.scaleIn}`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalElegant} onClick={() => setShowTownModal(false)}>×</button>
            <div className={styles.townContent}>
              <h2 className={styles.townTitle}>Despeñaderos: Corazón del Valle de Paravachasca</h2>
              <div className={styles.townDivider}></div>
              <p className={styles.townText}>
                Ubicada en el departamento Santa María, Córdoba, Despeñaderos es un punto estratégico sobre la Ruta Nacional 36 que conecta la capital provincial con Río Cuarto.
              </p>
              <p className={styles.townText}>
                Su paisaje único de piedemonte combina la serenidad de la llanura con la fuerza de las montañas, todo enmarcado por el emblemático Río Xanaes.
              </p>
              <div className={styles.townFooter}>
                <img src="https://i.ibb.co/6c8LZqDc/logo.png" alt="Logo" className={styles.smallLogo} />
              </div>
            </div>
          </div>
        </div>
      )}
      {showContactModal && (
        <div className={`${styles.modalOverlay} ${styles.fadeIn}`} onClick={() => setShowContactModal(false)}>
          <div className={`${styles.elegantModal} ${styles.scaleIn}`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalElegant} onClick={() => setShowContactModal(false)}>×</button>
            <div className={styles.townContent}>
              <h2 className={styles.townTitle}>Contacto</h2>
              <div className={styles.townDivider}></div>

              <div className={styles.contactItemStaggered} style={{ animationDelay: '0.4s' }}>
                <span className={styles.contactIcon}>✉️</span>
                <a href="mailto:fabricioosre.dev@gmail.com" className={styles.contactLink}>
                  fabricioosre.dev@gmail.com
                </a>
              </div>

              <div className={styles.contactItemStaggered} style={{ animationDelay: '0.8s' }}>
                <span className={styles.contactIcon}>💬</span>
                <a href="https://wa.me/5491136026505" className={styles.contactLink}>
                  +54 9 11 3602-6505
                </a>
              </div>

              <div className={styles.townFooter}>
                <p className={styles.contactNote}>Desarrollado con ❤️ para Despeñaderos y nuestros visitantes</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPromotionsModal && (
        <PromotionsModal
          promotions={promotions}
          loading={promotionsLoading}
          error={promotionsError}
          onClose={() => setShowPromotionsModal(false)}
          onRetry={refetchPromotions}
        />
      )}
      {showQRModal && (
        <div className={`${styles.modalOverlay} ${styles.fadeIn}`} onClick={() => setShowQRModal(false)}>
          <div className={`${styles.elegantModal} ${styles.scaleIn}`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalElegant} onClick={() => setShowQRModal(false)}>×</button>
            <div className={styles.townContent}>
              <h2 className={styles.townTitle}>Escanea el QR y descarga nuestra App</h2>
              <div className={styles.townDivider}></div>

              <div className={styles.qrContainer}>
                <img src="./qr-app.png" alt="QR Code App" className={styles.qrImage} />
              </div>

              <div className={styles.townFooter}>
                <p className={styles.contactNote}>¡Lleva la Guía D siempre con vos!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePopup && (
        <PopupModal
          popup={activePopup}
          onClose={() => handleClosePopup(activePopup.id)}
        />
      )}
    </div>



  );
};
