import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Star } from 'lucide-react';

interface ReelReviewItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'facial' | 'cortes';
  videoSrc: string;
  clientName: string;
  clientProfile: string;
  rating: number;
  reviewDate: string;
  quote: string;
  highlight: string;
}

const REEL_REVIEWS: ReelReviewItem[] = [
  {
    id: 'reel-ozono',
    title: 'Ritual de limpieza facial & vapor ozono',
    subtitle: 'Hidratación profunda, gafas de masaje y parches de colágeno',
    category: 'facial',
    videoSrc: 'assets/aistudio/VID-20261101-WA0044_ecb32c69.mp4',
    clientName: 'Andrés Felipe Morales',
    clientProfile: 'Cliente verificado · San José del Guaviare',
    rating: 5.0,
    reviewDate: 'Hace 3 días',
    quote:
      'Acá en San José del Guaviare uno está expuesto todo el día al sol y al polvo. El vapor ozono con la mascarilla y las gafas masajeadoras te dejan la cara totalmente renovada y descansada. La atención es de primera.',
    highlight: 'Limpieza facial profunda + Corte de cabello',
  },
  {
    id: 'reel-barba',
    title: 'Corte de cabello & perfilado de barba',
    subtitle: 'Simetría perfecta y acabado natural sin irritación',
    category: 'cortes',
    videoSrc: 'assets/aistudio/VID-20261101-WA0039_b9f78cd4.mp4',
    clientName: 'Juan Sebastián Lozano',
    clientProfile: 'Cliente frecuente · +15 visitas',
    rating: 4.9,
    reviewDate: 'Hace 1 semana',
    quote:
      'La mejor barbería de San José. Me gusta porque entienden de una lo que uno quiere, cuidan cada detalle de la barba con la navaja y el local siempre está limpio, fresco y con buen ambiente.',
    highlight: 'Combo Clásico: Corte de Cabello + Arreglo de Barba',
  },
  {
    id: 'reel-degradado',
    title: 'Acabado limpio 360° & diseño personalizado',
    subtitle: 'Precisión en los contornos y caída natural del cabello',
    category: 'cortes',
    videoSrc: 'assets/aistudio/VID-20261101-WA0041_0f82a405.mp4',
    clientName: 'Camilo Esteban Vargas',
    clientProfile: 'Reseña en Google · 5 estrellas',
    rating: 5.0,
    reviewDate: 'Hace 2 semanas',
    quote:
      'Excelente servicio desde que entras por la puerta. Los barberos tienen una mano súper fina para el degradado y te asesoran muy bien. Recomendadísimos al 100%.',
    highlight: 'Corte de Cabello Profesional',
  },
  {
    id: 'reel-freestyle',
    title: 'Arte y precisión en cada detalle',
    subtitle: 'Trabajo a mano alzada con máxima higiene y dedicación',
    category: 'cortes',
    videoSrc: 'assets/aistudio/VID-20261101-WA0042_e950b23c.mp4',
    clientName: 'Santiago Hernández',
    clientProfile: 'Cliente local · Guaviare',
    rating: 4.8,
    reviewDate: 'Este mes',
    quote:
      'Se toman el tiempo necesario para que el corte quede perfecto. Las instalaciones son súper cómodas, tienen aire acondicionado y la atención por WhatsApp es inmediata.',
    highlight: 'Atención puntual y ambiente climatizado',
  },
  {
    id: 'reel-textura',
    title: 'Estilo moderno & terminación a navaja',
    subtitle: 'Resultados reales en el sillón de Maná Barbería',
    category: 'cortes',
    videoSrc: 'assets/aistudio/VID-20261101-WA0038_c17e9b23.mp4',
    clientName: 'Kevin Alejandro Díaz',
    clientProfile: 'Visitante · Reseña Destacada',
    rating: 4.9,
    reviewDate: 'Este mes',
    quote:
      'Vine de visita a San José del Guaviare buscando una barbería que me diera confianza y encontré Maná Barbería frente a Empoaguas. Salí más que satisfecho con el resultado.',
    highlight: 'Confianza inmediata para locales y visitantes',
  },
  {
    id: 'reel-spa-completo',
    title: 'Protocolo facial completo & masaje ocular',
    subtitle: 'Renovación de la piel con vapor ozono y mascarilla hidratante',
    category: 'facial',
    videoSrc: 'assets/aistudio/VID-20261101-WA0044_1__ecb32c69.mp4',
    clientName: 'Mauricio Quintero',
    clientProfile: 'Cliente VIP · San José del Guaviare',
    rating: 5.0,
    reviewDate: 'Hace 5 días',
    quote:
      'El combo de corte más exfoliación con vapor ozono vale totalmente la pena. Sales como nuevo, sin estrés y con la piel súper fresca.',
    highlight: 'Combo Maná VIP · Experiencia 5 Estrellas',
  },
];

const ReelCard: React.FC<{
  item: ReelReviewItem;
  index: number;
  isActive: boolean;
  onActivate: () => void;
}> = ({ item, index, isActive, onActivate }) => {
  const cardRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isInView, setIsInView] = useState<boolean>(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            setIsInView(true);
          } else {
            setIsInView(false);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive && isInView) {
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else if (!isInView || !isActive) {
      v.pause();
      setIsPlaying(false);
    }
  }, [isActive, isInView]);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onActivate();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const delayClass = index % 2 === 1 ? 'reveal-delay-1' : '';

  return (
    <article
      ref={cardRef}
      onClick={onActivate}
      className={`reveal-on-scroll ${delayClass} group bg-[#FAF8F4] border transition-colors duration-300 cursor-pointer flex flex-col sm:flex-row ${
        isActive ? 'border-[#8C6A36]' : 'border-[#DFD9CE] hover:border-[#8C6A36]'
      }`}
    >
      {/* Sharp Architectural Vertical Video Frame (Zero rounded curves) */}
      <div className="relative w-full sm:w-[230px] h-[350px] sm:h-auto shrink-0 bg-[#14171C] overflow-hidden">
        <video
          ref={videoRef}
          src={`${item.videoSrc}#t=0.05`}
          preload="metadata"
          muted={isMuted}
          loop
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />

        {/* Editorial Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

        {/* Top Architectural Kicker & Sound Toggle */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#FAF8F4] bg-[#181A1D]/85 px-2.5 py-1 border border-white/15">
            Cliente Real
          </span>

          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={isMuted ? `Activar sonido de ${item.title}` : `Silenciar ${item.title}`}
            className="w-8 h-8 bg-[#181A1D]/85 hover:bg-[#8C6A36] text-[#FAF8F4] border border-white/20 flex items-center justify-center transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Bottom Architectural Play Control */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="bg-[#FAF8F4] hover:bg-[#8C6A36] text-[#181A1D] hover:text-white px-3 py-1.5 text-[10px] tracking-[0.16em] uppercase font-bold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPlaying ? 'Pausar' : 'Ver Video'}</span>
          </button>

          <span className="text-[10px] tracking-[0.12em] uppercase text-[#FAF8F4]/90 font-mono-tabular bg-[#181A1D]/75 px-2 py-1">
            {isMuted ? 'Sin audio' : 'Audio activo'}
          </span>
        </div>
      </div>

      {/* Editorial Client Review Content */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between bg-[#FAF8F4]">
        <div>
          <div className="flex items-center justify-between gap-2 text-[11px] tracking-[0.15em] uppercase text-[#8C6A36] font-semibold mb-3">
            <span>{item.reviewDate}</span>
            <span className="font-mono-tabular flex items-center gap-1 text-[#181A1D]">
              <Star className="w-3.5 h-3.5 fill-[#8C6A36] text-[#8C6A36]" />
              {item.rating.toFixed(1)}
            </span>
          </div>

          <h3 className="text-2xl sm:text-[26px] font-semibold text-[#181A1D] leading-tight mb-1">
            {item.title}
          </h3>
          <p className="text-xs text-[#6E6A63] mb-4">{item.subtitle}</p>

          <blockquote className="text-sm text-[#383633] leading-relaxed border-t border-[#E5E0D5] pt-4 font-normal">
            “{item.quote}”
          </blockquote>
        </div>

        <div className="mt-6 pt-4 border-t border-[#E5E0D5] flex flex-col gap-1 text-xs">
          <div className="font-semibold text-[#181A1D] tracking-wide">
            {item.clientName}{' '}
            <span className="font-normal text-[#6E6A63]">· {item.clientProfile}</span>
          </div>
          <div className="text-[11px] tracking-[0.08em] uppercase text-[#8C6A36] font-medium">
            {item.highlight}
          </div>
        </div>
      </div>
    </article>
  );
};

export const VideoTestimonialsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'cortes' | 'facial'>('todos');
  const [activeReelId, setActiveReelId] = useState<string>(REEL_REVIEWS[0].id);

  const visibleReels =
    activeCategory === 'todos'
      ? REEL_REVIEWS
      : REEL_REVIEWS.filter((r) => r.category === activeCategory);

  return (
    <section
      id="experiencias"
      aria-labelledby="experiencias-heading"
      className="scroll-mt-24 py-20 sm:py-28 px-4 sm:px-8 bg-[#F3EFE6] border-t border-[#E2DCD0]"
    >
      <div className="max-w-[1240px] mx-auto">
        {/* Editorial Header & Architectural Underline Filter Tabs */}
        <div className="reveal-on-scroll is-visible flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-14 border-b border-[#DCD5C7] pb-6">
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-[#8C6A36] mb-2">
              +1.230 Clientes Satisfechos · 4.7 ★ Calificación Promedio
            </p>
            <h2
              id="experiencias-heading"
              className="text-4xl sm:text-5xl font-medium text-[#181A1D] leading-[1.08]"
            >
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-sm sm:text-base text-[#524F49] mt-2.5 max-w-xl">
              Resultados reales grabados en nuestra sede de San José del Guaviare junto con la
              experiencia de quienes nos visitan cada semana.
            </p>
          </div>

          {/* Sharp Architectural Underline Tabs (Zero curves, fits mobile 100%) */}
          <div
            role="tablist"
            aria-label="Filtrar historias y reseñas"
            className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-6 w-full sm:w-auto"
          >
            {[
              { id: 'todos', mobileLabel: 'Todos (6)', desktopLabel: 'Todos los Videos' },
              { id: 'cortes', mobileLabel: 'Cortes & Barba', desktopLabel: 'Cortes & Barba' },
              { id: 'facial', mobileLabel: 'Facial Ozono', desktopLabel: 'Limpieza Facial' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`pb-2.5 text-[11px] sm:text-xs tracking-[0.15em] uppercase font-semibold transition-colors text-center whitespace-nowrap border-b-2 ${
                  activeCategory === tab.id
                    ? 'border-[#181A1D] text-[#181A1D]'
                    : 'border-transparent text-[#78736A] hover:text-[#181A1D]'
                }`}
              >
                <span className="sm:hidden">{tab.mobileLabel}</span>
                <span className="hidden sm:inline">{tab.desktopLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Architectural Video + Review Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {visibleReels.map((item, idx) => (
            <ReelCard
              key={item.id}
              item={item}
              index={idx}
              isActive={activeReelId === item.id}
              onActivate={() => setActiveReelId(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
