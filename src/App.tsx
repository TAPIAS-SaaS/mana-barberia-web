import React, { useEffect, useRef, useState } from 'react';
import {
  Scissors,
  Star,
  MapPin,
  Clock,
  Edit3,
  Save,
  Volume2,
  VolumeX,
  Navigation,
  ArrowDown,
} from 'lucide-react';
import {
  INITIAL_SERVICES,
  WHATSAPP_SECONDARY,
  BarberService,
  formatCopPrice,
  filterServicesByCategory,
  updateServicePrice,
  buildDirectWhatsAppUrl,
} from './utils/barberLogic';
import { VideoTestimonialsSection } from './components/VideoTestimonialsSection';

// Official Crisp WhatsApp Brand Emblem SVG
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M12.031 2c-5.508 0-9.987 4.479-9.987 9.988 0 1.763.459 3.479 1.332 4.992L2 22l5.143-1.349c1.464.799 3.116 1.221 4.885 1.221h.004c5.507 0 9.986-4.479 9.986-9.988 0-2.669-1.039-5.178-2.925-7.064C17.207 3.039 14.698 2 12.031 2zm5.828 14.129c-.246.693-1.428 1.326-1.988 1.409-.513.076-1.163.108-1.878-.119-.435-.138-.993-.324-1.709-.633-2.999-1.295-4.957-4.316-5.107-4.516-.149-.2-1.219-1.622-1.219-3.095 0-1.472.771-2.196 1.045-2.495.274-.3.598-.375.797-.375.199 0 .398.002.573.01.184.009.43-.07.673.514.249.599.846 2.071.921 2.221.075.15.125.325.025.524-.1.2-.15.325-.299.499-.149.175-.314.391-.448.525-.149.149-.305.311-.131.61.174.3.773 1.276 1.66 2.067 1.141 1.017 2.103 1.332 2.402 1.482.299.15.473.125.647-.075.175-.2.747-.873.946-1.173.199-.3.398-.25.672-.15.274.1 1.742.822 2.041.971.299.15.498.225.573.35.075.125.075.724-.171 1.417z" />
  </svg>
);

// Authentic Vintage Barber Crest Seal SVG (Inspired by Fígaro Colombia's heritage emblem)
const ManaCrestSeal: React.FC<{ className?: string }> = ({ className = 'w-44 h-44' }) => (
  <svg
    viewBox="0 0 220 228"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Sello tradicional Maná Barbería"
  >
    <circle cx="110" cy="104" r="90" stroke="#181A1D" strokeWidth="2.5" />
    <circle cx="110" cy="104" r="82" stroke="#181A1D" strokeWidth="1" strokeDasharray="4 3" />
    <circle cx="110" cy="104" r="58" stroke="#8C6A36" strokeWidth="1.5" />
    {/* Classic Crossed Scissors & Straight Razor Motif */}
    <line x1="84" y1="78" x2="136" y2="130" stroke="#181A1D" strokeWidth="2.5" />
    <line x1="136" y1="78" x2="84" y2="130" stroke="#181A1D" strokeWidth="2.5" />
    <circle cx="79" cy="135" r="5.5" stroke="#181A1D" strokeWidth="2" />
    <circle cx="141" cy="135" r="5.5" stroke="#181A1D" strokeWidth="2" />
    <polygon points="110,60 113,68 121,68 115,73 117,81 110,76 103,81 105,73 99,68 107,68" fill="#8C6A36" />
    {/* Heritage Typography Inside Seal */}
    <text
      x="110"
      y="39"
      textAnchor="middle"
      fill="#181A1D"
      fontSize="15"
      fontWeight="700"
      letterSpacing="4"
      fontFamily="Cormorant Garamond, Georgia, serif"
    >
      MANÁ
    </text>
    <text
      x="54"
      y="108"
      textAnchor="middle"
      fill="#6E6A63"
      fontSize="8.5"
      letterSpacing="1.5"
      fontFamily="Plus Jakarta Sans, sans-serif"
    >
      DESDE
    </text>
    <text
      x="166"
      y="108"
      textAnchor="middle"
      fill="#6E6A63"
      fontSize="8.5"
      letterSpacing="1.5"
      fontFamily="Plus Jakarta Sans, sans-serif"
    >
      2021
    </text>
    {/* Bottom Ribbon Banner */}
    <rect x="34" y="156" width="152" height="24" fill="#181A1D" />
    <text
      x="110"
      y="172"
      textAnchor="middle"
      fill="#FAF8F4"
      fontSize="11"
      fontWeight="600"
      letterSpacing="3"
      fontFamily="Plus Jakarta Sans, sans-serif"
    >
      BARBERSHOP
    </text>
    <text
      x="110"
      y="214"
      textAnchor="middle"
      fill="#181A1D"
      fontSize="9.5"
      fontWeight="500"
      letterSpacing="2.2"
      fontFamily="Plus Jakarta Sans, sans-serif"
    >
      GUAVIARE · COLOMBIA
    </text>
  </svg>
);

const VISUAL_PILLARS = [
  {
    id: 'pillar-corte',
    title: 'Corte & estilo',
    subtitle: 'Degradados limpios, tijera y contornos a navaja',
    imgSrc: 'assets/aistudio/IMG-20261101-WA0033_84c0d217.jpg',
  },
  {
    id: 'pillar-barba',
    title: 'Barba & navaja',
    subtitle: 'Perfilado simétrico con apertura de poros en vapor ozono',
    imgSrc: 'assets/aistudio/IMG-20261101-WA0035_69a59250.jpg',
  },
  {
    id: 'pillar-espacio',
    title: 'Ritual facial & sede',
    subtitle: 'Instalaciones climatizadas frente a Empoaguas',
    imgSrc: 'assets/aistudio/IMG-20261101-WA0034_315726ac.jpg',
  },
];

export default function App() {
  // Services & Simulated Prices State
  const [services, setServices] = useState<BarberService[]>(INITIAL_SERVICES);
  const [serviceTab, setServiceTab] = useState<'todos' | 'servicios' | 'combos'>('todos');
  const [isEditingPrices, setIsEditingPrices] = useState<boolean>(false);
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const [priceUpdateMessage, setPriceUpdateMessage] = useState<string | null>(null);

  // Hero "Conoce Nuestra Sede" Video State
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [heroMuted, setHeroMuted] = useState<boolean>(true);

  const visibleServices = filterServicesByCategory(services, serviceTab);
  const mainWhatsAppUrl = buildDirectWhatsAppUrl();
  const secondaryWhatsAppUrl = buildDirectWhatsAppUrl(
    WHATSAPP_SECONDARY,
    'Hola Maná Barbería, quiero consultar disponibilidad para un servicio.'
  );

  // Smooth Scroll-Reveal Observer
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-scroll-reveal]');
    if (typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -25px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [serviceTab]);

  const toggleHeroSound = () => {
    const v = heroVideoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setHeroMuted(v.muted);
  };

  const handleTogglePriceEditor = () => {
    if (!isEditingPrices) {
      const drafts: Record<string, string> = {};
      services.forEach((s) => {
        drafts[s.id] = String(s.priceCop);
      });
      setPriceDrafts(drafts);
    }
    setIsEditingPrices(!isEditingPrices);
    setPriceUpdateMessage(null);
  };

  const handleSaveServicePrice = (serviceId: string) => {
    const rawVal = Number(priceDrafts[serviceId]);
    if (!Number.isFinite(rawVal) || rawVal < 1000) return;
    const updated = updateServicePrice(services, serviceId, rawVal);
    setServices(updated);
    setPriceUpdateMessage('Precio actualizado en el catálogo.');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#181A1D] overflow-x-hidden">
      {/* =====================================================================
          STICKY EDITORIAL HEADER (Architectural Fígaro Style — Zero curves)
         ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#E2DCD0]">
        <div className="max-w-[1360px] mx-auto px-3.5 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Crest & Wordmark */}
          <a
            href="#"
            className="flex items-center gap-2 sm:gap-2.5 text-[#181A1D] shrink-0 min-w-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 border border-[#181A1D] flex items-center justify-center shrink-0">
              <Scissors className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#181A1D] -rotate-45" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif-editorial text-base sm:text-2xl font-bold tracking-[0.07em] sm:tracking-[0.12em] uppercase leading-none truncate">
                MANÁ BARBERÍA
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.13em] sm:tracking-[0.22em] uppercase text-[#78736A] mt-0.5 truncate">
                San José del Guaviare
              </span>
            </div>
          </a>

          {/* Desktop Editorial Navigation */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.18em] uppercase font-medium text-[#383633]"
          >
            <a href="#inicio" className="hover:text-[#8C6A36] transition-colors whitespace-nowrap">
              Inicio
            </a>
            <a href="#servicios" className="hover:text-[#8C6A36] transition-colors whitespace-nowrap">
              Servicios
            </a>
            <a href="#protocolo" className="hover:text-[#8C6A36] transition-colors whitespace-nowrap">
              Protocolo Maná
            </a>
            <a href="#experiencias" className="hover:text-[#8C6A36] transition-colors whitespace-nowrap">
              Reseñas y Videos
            </a>
            <a href="#ubicacion" className="hover:text-[#8C6A36] transition-colors whitespace-nowrap">
              Sede
            </a>
          </nav>

          {/* Official WhatsApp Button (Properly sized for mobile & desktop) */}
          <div className="flex items-center shrink-0">
            <a
              href={mainWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar a Maná Barbería por WhatsApp"
              className="btn-editorial-whatsapp px-3 sm:px-5 py-2 sm:py-2.5 text-[10px] sm:text-[11px] tracking-[0.1em] sm:tracking-[0.16em] uppercase font-semibold inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#25D366] shrink-0" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Mobile Architectural Navigation Strip (Never hidden or clipped on mobile) */}
        <nav
          aria-label="Navegación móvil"
          className="md:hidden border-t border-[#E5E0D5] bg-[#F3EFE6] px-2 py-2"
        >
          <div className="grid grid-cols-4 gap-1 text-center text-[10px] tracking-[0.14em] uppercase font-semibold text-[#383633]">
            <a href="#inicio" className="py-1.5 hover:text-[#8C6A36] whitespace-nowrap">
              Inicio
            </a>
            <a href="#servicios" className="py-1.5 hover:text-[#8C6A36] whitespace-nowrap">
              Servicios
            </a>
            <a href="#experiencias" className="py-1.5 hover:text-[#8C6A36] whitespace-nowrap">
              Reseñas
            </a>
            <a href="#ubicacion" className="py-1.5 hover:text-[#8C6A36] whitespace-nowrap">
              Sede
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* ===================================================================
            50/50 ARCHITECTURAL SPLIT HERO (Inspired by Fígaro Colombia)
            Left: Warm Cream Editorial Panel | Right: Full-Bleed Sede Video
           =================================================================== */}
        <section id="inicio" className="bg-[#F3EFE6] border-b border-[#E2DCD0]">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[600px] lg:min-h-[680px]">
            {/* Left Half: Editorial Statement & Direct WhatsApp CTA (6 cols) */}
            <div className="animate-fade-up lg:col-span-6 px-5 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20 flex flex-col justify-between">
              <div className="my-auto">
                <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-[#8C6A36] mb-4">
                  Maná Barber Shop · Frente a Empoaguas (Crr 19D # 19-10)
                </p>

                <h1 className="text-5xl sm:text-6xl lg:text-[66px] font-medium text-[#181A1D] leading-[1.03] tracking-tight mb-6">
                  Tu estilo merece un ritual.
                </h1>

                <p className="text-base sm:text-lg text-[#45423E] leading-relaxed max-w-lg mb-9 font-serif-editorial">
                  Servicios, atención y espacios pensados para que disfrutes cada visita en San José
                  del Guaviare. Más de <strong>1.230 clientes satisfechos</strong> y una valoración
                  de <strong>4.7 ★ estrellas</strong> respaldan nuestro trabajo.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 mb-10">
                  <a
                    href={mainWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-editorial-whatsapp w-full sm:w-auto px-4 sm:px-7 py-3.5 sm:py-4 text-[11px] sm:text-xs tracking-[0.08em] sm:tracking-[0.16em] uppercase font-semibold inline-flex items-center justify-center gap-2.5 text-center"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
                    <span>WhatsApp Directo · 322 425 0545</span>
                  </a>

                  <a
                    href="#servicios"
                    className="btn-editorial-outline w-full sm:w-auto px-4 sm:px-6 py-3.5 sm:py-4 text-[11px] sm:text-xs tracking-[0.1em] sm:tracking-[0.16em] uppercase font-semibold inline-flex items-center justify-center gap-2 text-center"
                  >
                    <span>Ver Servicios y Combos</span>
                  </a>
                </div>

                {/* Fígaro Signature Hairline Editorial Link */}
                <a
                  href="#experiencia-mana"
                  className="inline-flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#181A1D] hover:text-[#8C6A36] transition-colors"
                >
                  <span className="w-10 h-px bg-[#181A1D]" aria-hidden="true" />
                  <span>Descubre la experiencia</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Architectural Hairline Proof Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-10 border-t border-[#DCD5C7]">
                <div>
                  <div className="text-2xl sm:text-3xl font-semibold font-serif-editorial text-[#181A1D] whitespace-nowrap">
                    +1.230
                  </div>
                  <div className="text-[11px] text-[#6E6A63] uppercase tracking-wider mt-0.5">
                    Clientes satisfechos
                  </div>
                </div>
                <div className="border-l border-[#DCD5C7] pl-4">
                  <div className="text-2xl sm:text-3xl font-semibold font-serif-editorial text-[#181A1D] flex items-center gap-1 whitespace-nowrap">
                    <span>4.7</span>
                    <Star className="w-4 h-4 fill-[#8C6A36] text-[#8C6A36]" />
                  </div>
                  <div className="text-[11px] text-[#6E6A63] uppercase tracking-wider mt-0.5">
                    Valoración real
                  </div>
                </div>
                <div className="sm:border-l border-[#DCD5C7] sm:pl-4">
                  <div className="text-2xl sm:text-3xl font-semibold font-serif-editorial text-[#181A1D] whitespace-nowrap">
                    9am – 9pm
                  </div>
                  <div className="text-[11px] text-[#6E6A63] uppercase tracking-wider mt-0.5">
                    Lunes a Domingo
                  </div>
                </div>
                <div className="border-l border-[#DCD5C7] pl-4">
                  <div className="text-2xl sm:text-3xl font-semibold font-serif-editorial text-[#181A1D] whitespace-nowrap">
                    Crr 19D
                  </div>
                  <div className="text-[11px] text-[#6E6A63] uppercase tracking-wider mt-0.5">
                    # 19-10 · Empoaguas
                  </div>
                </div>
              </div>
            </div>

            {/* Right Half: Pure Video Showcase (Only the video and the icon-only sound toggle button, zero black borders) */}
            <div className="lg:col-span-6 px-5 sm:px-12 lg:pl-4 lg:pr-16 pb-12 sm:pb-16 lg:py-20 flex items-center justify-center">
              <div className="relative w-full aspect-video overflow-hidden border border-[#DCD5C7] shadow-[0_20px_50px_rgba(24,26,29,0.12)]">
                <video
                  ref={heroVideoRef}
                  src="assets/aistudio/VID-20261101-WA0043_b09e1ac6.mp4"
                  poster="assets/aistudio/IMG-20261101-WA0034_315726ac.jpg"
                  autoPlay
                  muted={heroMuted}
                  loop
                  playsInline
                  className="w-full h-full object-cover object-center block"
                />

                {/* Icon-Only Sound Toggle Button */}
                <button
                  type="button"
                  onClick={toggleHeroSound}
                  aria-label={heroMuted ? 'Activar sonido del video' : 'Silenciar video'}
                  title={heroMuted ? 'Activar sonido' : 'Silenciar'}
                  className="absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 z-20 w-10 h-10 sm:w-11 sm:h-11 bg-[#181A1D]/85 hover:bg-[#8C6A36] text-[#FAF8F4] border border-white/25 flex items-center justify-center transition-colors shadow-lg"
                >
                  {heroMuted ? (
                    <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-[#FAF8F4]" />
                  ) : (
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#25D366]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            EDITORIAL INTRO & 3-COLUMN SHARP PHOTO SHOWCASE
            ("De lo esencial a lo personal." & "Diseñados para ti" — Fígaro Style)
           =================================================================== */}
        <section
          id="experiencia-mana"
          className="py-20 sm:py-28 px-4 sm:px-8 max-w-[1240px] mx-auto"
        >
          {/* Centered Editorial Manifesto */}
          <div
            data-scroll-reveal
            className="reveal-on-scroll text-center max-w-2xl mx-auto mb-20 sm:mb-24"
          >
            <p className="text-[11px] tracking-[0.24em] uppercase font-semibold text-[#8C6A36] mb-3">
              La Experiencia Maná
            </p>
            <h2 className="text-4xl sm:text-6xl font-medium text-[#181A1D] leading-[1.06] mb-4">
              De lo esencial a lo personal.
            </h2>
            <p className="text-base sm:text-lg text-[#4A4742] font-serif-editorial leading-relaxed">
              Explora nuestros servicios, visita nuestra sede frente a Empoaguas y escríbenos al
              WhatsApp para vivir el momento que quieres disfrutar.
            </p>
          </div>

          {/* "Diseñados para ti" Header + 3 Sharp Architectural Photo Columns */}
          <div
            data-scroll-reveal
            className="reveal-on-scroll flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
          >
            <div>
              <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-[#8C6A36] mb-1.5">
                Nuestras Especialidades
              </p>
              <h3 className="text-4xl sm:text-5xl font-medium text-[#181A1D]">
                Diseñados para ti
              </h3>
            </div>

            <a
              href={mainWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] tracking-[0.18em] uppercase font-semibold text-[#181A1D] border-b border-[#181A1D] pb-1 hover:text-[#8C6A36] hover:border-[#8C6A36] transition-colors self-start sm:self-auto whitespace-nowrap"
            >
              Consultar por WhatsApp
            </a>
          </div>

          {/* 3 Sharp Rectangular Photo Frames (Zero curves — exact Fígaro visual grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VISUAL_PILLARS.map((pillar, idx) => (
              <figure
                key={pillar.id}
                data-scroll-reveal
                className={`reveal-on-scroll ${
                  idx === 1 ? 'reveal-delay-1' : idx === 2 ? 'reveal-delay-2' : ''
                } group relative aspect-[4/5] bg-[#14171C] overflow-hidden border border-[#E2DCD0]`}
              >
                <img
                  src={pillar.imgSrc}
                  alt={pillar.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                  <div className="text-2xl sm:text-3xl font-serif-editorial font-medium text-[#FAF8F4]">
                    {pillar.title}
                  </div>
                  <div className="text-xs text-[#E2DCD0] mt-1">{pillar.subtitle}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 01: MENÚ EDITORIAL DE SERVICIOS GENERALES Y COMBOS
            Sharp Architectural Cards with Hairline Rules (Zero curves)
           =================================================================== */}
        <section
          id="servicios"
          aria-labelledby="servicios-heading"
          className="scroll-mt-24 py-20 sm:py-24 px-4 sm:px-8 bg-[#F3EFE6] border-t border-[#E2DCD0]"
        >
          <div className="max-w-[1240px] mx-auto">
            <div
              data-scroll-reveal
              className="reveal-on-scroll flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 border-b border-[#DCD5C7] pb-6"
            >
              <div>
                <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-[#8C6A36] mb-2">
                  Carta de Servicios & Paquetes
                </p>
                <h2
                  id="servicios-heading"
                  className="text-4xl sm:text-5xl font-medium text-[#181A1D]"
                >
                  Servicios y combos
                </h2>
                <p className="text-sm sm:text-base text-[#524F49] mt-2 max-w-xl">
                  Cortes de cabello en general, perfilado de barba con vapor ozono y cuidado facial
                  completo. Tarifas claras listas para personalizar.
                </p>
              </div>

              {/* Architectural Underline Tabs + Price Editor Toggle */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                <div
                  role="tablist"
                  aria-label="Ver servicios o combos"
                  className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-6 w-full sm:w-auto"
                >
                  {[
                    { id: 'todos', mobileLabel: 'Todo', desktopLabel: 'Todo el Menú' },
                    { id: 'servicios', mobileLabel: 'Servicios', desktopLabel: 'Servicios Generales' },
                    { id: 'combos', mobileLabel: 'Combos VIP', desktopLabel: 'Combos VIP' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={serviceTab === cat.id}
                      onClick={() => setServiceTab(cat.id as any)}
                      className={`pb-2.5 text-[11px] sm:text-xs tracking-[0.15em] uppercase font-semibold transition-colors text-center whitespace-nowrap border-b-2 ${
                        serviceTab === cat.id
                          ? 'border-[#181A1D] text-[#181A1D]'
                          : 'border-transparent text-[#78736A] hover:text-[#181A1D]'
                      }`}
                    >
                      <span className="sm:hidden">{cat.mobileLabel}</span>
                      <span className="hidden sm:inline">{cat.desktopLabel}</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleTogglePriceEditor}
                  className="px-4 py-2 text-[11px] tracking-[0.15em] uppercase font-semibold border border-[#181A1D] text-[#181A1D] hover:bg-[#181A1D] hover:text-[#FAF8F4] inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingPrices ? 'Cerrar Editor' : 'Ajustar Precios'}</span>
                </button>
              </div>
            </div>

            {priceUpdateMessage && (
              <div className="mb-8 p-4 bg-[#FAF8F4] border border-[#8C6A36] text-xs text-[#181A1D] flex items-center justify-between">
                <span>{priceUpdateMessage}</span>
                <button
                  type="button"
                  onClick={() => setPriceUpdateMessage(null)}
                  className="underline font-semibold ml-4 whitespace-nowrap shrink-0"
                >
                  Ocultar
                </button>
              </div>
            )}

            {/* Sharp Architectural Services & Combos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleServices.map((service, idx) => (
                <div
                  key={service.id}
                  data-scroll-reveal
                  className={`reveal-on-scroll ${
                    idx % 3 === 1 ? 'reveal-delay-1' : idx % 3 === 2 ? 'reveal-delay-2' : ''
                  } bg-[#FAF8F4] border p-7 sm:p-8 flex flex-col justify-between transition-colors ${
                    service.featured
                      ? 'border-[#8C6A36]'
                      : 'border-[#DFD9CE] hover:border-[#8C6A36]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] tracking-[0.16em] uppercase text-[#8C6A36] font-semibold mb-3">
                      <span>
                        {service.code} · {service.category === 'combos' ? 'Combo Especial' : 'Servicio'}{' '}
                        ({service.durationMin} min)
                      </span>
                      {service.featured && (
                        <span className="text-[#181A1D] border-b border-[#8C6A36]">Recomendado</span>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-[28px] font-medium text-[#181A1D] leading-tight mb-3">
                      {service.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#524F49] leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <ul className="space-y-2 mb-6 border-t border-[#E5E0D5] pt-4">
                      {service.includes.map((item, i) => (
                        <li key={i} className="text-xs text-[#383633] flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 bg-[#8C6A36] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-[#E5E0D5]">
                    {isEditingPrices && (
                      <div className="flex items-center gap-2 mb-3">
                        <label htmlFor={`price-input-${service.id}`} className="sr-only">
                          Nuevo precio en COP para {service.name}
                        </label>
                        <input
                          id={`price-input-${service.id}`}
                          type="number"
                          min={1000}
                          step={1000}
                          value={priceDrafts[service.id] ?? service.priceCop}
                          onChange={(e) =>
                            setPriceDrafts((prev) => ({
                              ...prev,
                              [service.id]: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-1.5 text-xs font-mono-tabular bg-white border border-[#181A1D] text-[#181A1D]"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveServicePrice(service.id)}
                          className="px-3.5 py-1.5 text-xs font-semibold bg-[#181A1D] text-[#FAF8F4] inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Guardar</span>
                        </button>
                      </div>
                    )}

                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] tracking-[0.16em] uppercase text-[#78736A]">
                        Valor
                      </span>
                      <span className="text-2xl sm:text-3xl font-serif-editorial font-semibold text-[#181A1D]">
                        {formatCopPrice(service.priceCop)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 02: "PROTOCOLO MANÁ" SYMMETRICAL HERITAGE SECTION
            (Directly inspired by Fígaro Colombia's "Protocolo Fígaro")
           =================================================================== */}
        <section
          id="protocolo"
          aria-labelledby="protocolo-heading"
          className="scroll-mt-24 py-20 sm:py-28 px-4 sm:px-8 bg-[#FAF8F4] border-t border-[#E2DCD0]"
        >
          <div className="max-w-[1140px] mx-auto">
            <div data-scroll-reveal className="reveal-on-scroll text-center max-w-xl mx-auto mb-16">
              <div className="text-[#181A1D] text-lg mb-2" aria-hidden="true">
                ✦
              </div>
              <p className="text-[11px] tracking-[0.24em] uppercase font-semibold text-[#8C6A36] mb-2">
                Cada Visita Cuenta
              </p>
              <h2
                id="protocolo-heading"
                className="text-4xl sm:text-6xl font-medium text-[#181A1D] mb-3"
              >
                Protocolo Maná
              </h2>
              <p className="text-sm sm:text-base text-[#524F49] font-serif-editorial">
                Un protocolo pensado para que disfrutes cada visita en Maná Barbería.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left 3 Pillars (4 cols) */}
              <div
                data-scroll-reveal
                className="reveal-on-scroll lg:col-span-4 space-y-8 text-center lg:text-left"
              >
                <div>
                  <h3 className="text-2xl font-medium text-[#181A1D] mb-1.5">
                    Cuéntanos tu estilo
                  </h3>
                  <p className="text-xs sm:text-sm text-[#524F49] leading-relaxed">
                    Asesoría personalizada, técnica profesional y acabados pensados para tu imagen.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-medium text-[#181A1D] mb-1.5">
                    Definimos cada detalle
                  </h3>
                  <p className="text-xs sm:text-sm text-[#524F49] leading-relaxed">
                    Perfilado, máquina, tijera, navaja y vapor ozono para un resultado limpio y
                    preciso.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-medium text-[#181A1D] mb-1.5">
                    Cuidamos tu imagen
                  </h3>
                  <p className="text-xs sm:text-sm text-[#524F49] leading-relaxed">
                    Exfoliación facial, mascarilla hidratante y detalles que elevan tu experiencia.
                  </p>
                </div>
              </div>

              {/* Center Vintage Barber Seal & Underlined Link (4 cols) */}
              <div
                data-scroll-reveal
                className="reveal-on-scroll reveal-delay-1 lg:col-span-4 flex flex-col items-center justify-center py-4"
              >
                <ManaCrestSeal className="w-48 h-48 sm:w-56 sm:h-56 mb-6" />
                <a
                  href={mainWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#181A1D] border-b border-[#181A1D] pb-1.5 hover:text-[#8C6A36] hover:border-[#8C6A36] transition-colors"
                >
                  Pedir turno por WhatsApp
                </a>
              </div>

              {/* Right 3 Pillars (4 cols) */}
              <div
                data-scroll-reveal
                className="reveal-on-scroll reveal-delay-2 lg:col-span-4 space-y-8 text-center lg:text-left"
              >
                <div>
                  <h3 className="text-2xl font-medium text-[#181A1D] mb-1.5">
                    Contacto directo y rápido
                  </h3>
                  <p className="text-xs sm:text-sm text-[#524F49] leading-relaxed">
                    Escríbenos directamente a nuestro WhatsApp sin llenar formularios ni esperas.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-medium text-[#181A1D] mb-1.5">
                    Ubicación central
                  </h3>
                  <p className="text-xs sm:text-sm text-[#524F49] leading-relaxed">
                    Encuéntranos frente a Empoaguas (Carrera 19D # 19-10) en San José del Guaviare.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-medium text-[#181A1D] mb-1.5">
                    Horario continuo
                  </h3>
                  <p className="text-xs sm:text-sm text-[#524F49] leading-relaxed">
                    Abiertos de Lunes a Domingo de 9:00 AM a 9:00 PM para locales y visitantes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 03: RESEÑAS REALES Y VIDEOS EN EL SILLÓN
           =================================================================== */}
        <VideoTestimonialsSection />

        {/* ===================================================================
            SECTION 04: DARK CHARCOAL ARCHITECTURAL LOCATION & WHATSAPP BANNER
            (Inspired by Fígaro Colombia's dark charcoal contrast section)
           =================================================================== */}
        <section
          id="ubicacion"
          aria-labelledby="ubicacion-heading"
          className="scroll-mt-24 py-20 sm:py-24 px-4 sm:px-8 bg-[#1C2026] text-[#FAF8F4]"
        >
          <div className="max-w-[1240px] mx-auto">
            <div
              data-scroll-reveal
              className="reveal-on-scroll flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-14 border-b border-white/15"
            >
              <div>
                <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-[#C5A065] mb-3">
                  Sede Principal · San José del Guaviare
                </p>
                <h2
                  id="ubicacion-heading"
                  className="text-4xl sm:text-6xl font-medium text-[#FAF8F4] leading-[1.06]"
                >
                  ¿Listo para visitar Maná Barbería?
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 shrink-0">
                <a
                  href={mainWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-editorial-light px-4 sm:px-7 py-3.5 sm:py-4 text-[11px] sm:text-xs tracking-[0.1em] sm:tracking-[0.18em] uppercase font-semibold inline-flex items-center justify-center gap-2 text-center"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#187A40] shrink-0" />
                  <span>WhatsApp · 322 425 0545</span>
                </a>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Carrera+19D+19-10+San+Jose+del+Guaviare+Colombia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 sm:px-6 py-3.5 sm:py-4 text-[11px] sm:text-xs tracking-[0.1em] sm:tracking-[0.18em] uppercase font-semibold border border-white/35 text-[#FAF8F4] hover:bg-white/10 inline-flex items-center justify-center gap-2 transition-colors text-center"
                >
                  <Navigation className="w-3.5 h-3.5 shrink-0" />
                  <span>Abrir en Google Maps</span>
                </a>
              </div>
            </div>

            {/* Architectural Location Details & Street Reference Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pt-10 sm:pt-12 items-stretch">
              {/* Left: Architectural Street Plan Diagram (7 cols) */}
              <div
                data-scroll-reveal
                className="reveal-on-scroll lg:col-span-7 border border-white/15 bg-[#14171C] p-5 sm:p-8 flex flex-col justify-between min-h-[340px] relative overflow-hidden"
              >
                <svg
                  className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
                  viewBox="0 0 800 450"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <rect width="800" height="450" fill="#14171C" />
                  <rect x="40" y="30" width="260" height="160" fill="#1C2026" stroke="#2D333D" />
                  <rect x="360" y="30" width="390" height="160" fill="#1C2026" stroke="#2D333D" />
                  <rect x="40" y="250" width="260" height="170" fill="#1C2026" stroke="#2D333D" />
                  <rect x="360" y="250" width="390" height="170" fill="#1C2026" stroke="#2D333D" />
                  <line
                    x1="0"
                    y1="220"
                    x2="800"
                    y2="220"
                    stroke="#C5A065"
                    strokeWidth="4"
                    strokeDasharray="12 8"
                  />
                  <line x1="330" y1="0" x2="330" y2="450" stroke="#3E4652" strokeWidth="3" />
                  <text
                    x="480"
                    y="210"
                    fill="#C5A065"
                    fontSize="13"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    CARRERA 19D (VÍA PRINCIPAL)
                  </text>
                </svg>

                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.18em] uppercase text-[#C5A065]">
                  <span>Plano de Referencia · San José del Guaviare</span>
                  <span>Parqueadero Frente al Local</span>
                </div>

                <div className="relative z-10 my-6 bg-[#1C2026]/95 border border-[#C5A065] p-5 sm:p-6 max-w-md">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-[#C5A065] mb-1">
                    Punto de Referencia Exacto
                  </div>
                  <div className="text-xl sm:text-2xl font-serif-editorial font-medium text-[#FAF8F4]">
                    Frente a EMPOAGUAS · Carrera 19D # 19-10
                  </div>
                  <p className="text-xs text-[#D5D0C5] mt-1.5">
                    Diagonal a la torre de Empoaguas, San José del Guaviare, Guaviare, Colombia.
                  </p>
                </div>

                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#A39E93] border-t border-white/10 pt-3">
                  <span>Coordenadas céntricas de fácil acceso</span>
                  <span className="text-[#FAF8F4]">Atención para locales y turistas</span>
                </div>
              </div>

              {/* Right: Direct Contact & Hours Summary (5 cols) */}
              <div
                data-scroll-reveal
                className="reveal-on-scroll reveal-delay-1 lg:col-span-5 border border-white/15 bg-[#171B20] p-5 sm:p-8 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-[#C5A065] font-semibold mb-2">
                    Contacto Directo
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-serif-editorial font-medium text-[#FAF8F4] mb-4">
                    Atención inmediata por WhatsApp
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D5D0C5] leading-relaxed mb-6">
                    Escríbenos directamente a cualquiera de nuestras dos líneas de WhatsApp para
                    consultar disponibilidad o venir directamente a nuestra sede.
                  </p>

                  <div className="space-y-3 border-t border-white/15 pt-5 text-xs sm:text-sm text-[#D5D0C5]">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#C5A065] shrink-0" />
                      <span>Carrera 19D # 19-10, Frente a Empoaguas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#C5A065] shrink-0" />
                      <span>Lunes a Domingo: 9:00 AM – 9:00 PM</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-6 mt-6 border-t border-white/15">
                  <a
                    href={mainWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-3 sm:px-5 bg-[#25D366] hover:bg-[#1FB858] text-[#0B0D10] text-[11px] sm:text-xs tracking-[0.06em] sm:tracking-[0.14em] uppercase font-bold flex items-center justify-center gap-2 transition-colors text-center"
                  >
                    <WhatsAppIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">WhatsApp Principal · 322 425 0545</span>
                  </a>

                  <a
                    href={secondaryWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-3 sm:px-5 border border-white/30 hover:border-[#C5A065] text-[#FAF8F4] text-[11px] sm:text-xs tracking-[0.06em] sm:tracking-[0.14em] uppercase font-semibold flex items-center justify-center gap-2 transition-colors text-center"
                  >
                    <WhatsAppIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">WhatsApp Línea 2 · 316 048 0297</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          EDITORIAL FOOTER (Fígaro Colombia Charcoal Footer Style)
         ===================================================================== */}
      <footer className="py-14 px-4 sm:px-8 bg-[#14171C] text-[#D5D0C5] border-t border-white/10">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
          <div>
            <div className="font-serif-editorial text-2xl font-bold tracking-[0.12em] uppercase text-[#FAF8F4] mb-3">
              MANÁ BARBERÍA
            </div>
            <p className="text-sm font-serif-editorial text-[#A39E93] max-w-xs">
              Una experiencia de barbería cuidada en cada detalle en San José del Guaviare.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#C5A065] font-semibold mb-3">
              Navegación
            </div>
            <div>
              <a href="#inicio" className="hover:text-[#FAF8F4] transition-colors">
                Inicio & Nuestra Sede
              </a>
            </div>
            <div>
              <a href="#servicios" className="hover:text-[#FAF8F4] transition-colors">
                Servicios y Combos
              </a>
            </div>
            <div>
              <a href="#protocolo" className="hover:text-[#FAF8F4] transition-colors">
                Protocolo Maná
              </a>
            </div>
            <div>
              <a href="#experiencias" className="hover:text-[#FAF8F4] transition-colors">
                Reseñas y Videos Reales
              </a>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#C5A065] font-semibold mb-3">
              Sede & Contacto
            </div>
            <div>Frente a Empoaguas · Carrera 19D # 19-10</div>
            <div>San José del Guaviare, Guaviare, Colombia</div>
            <div>Lunes a Domingo · 9:00 AM – 9:00 PM</div>
            <div>Instagram: @BARBERIA_MANA</div>
          </div>
        </div>

        <div className="max-w-[1240px] mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#78736A]">
          <span>© {new Date().getFullYear()} Maná Barbería · Todos los derechos reservados.</span>
          <span>Más de 1.230 clientes satisfechos · Valoración 4.7 ★</span>
        </div>
      </footer>
    </div>
  );
}
