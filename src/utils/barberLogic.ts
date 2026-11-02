export interface BarberService {
  id: string;
  code: string;
  name: string;
  category: 'servicios' | 'combos';
  priceCop: number;
  durationMin: number;
  description: string;
  includes: string[];
  featured?: boolean;
}

export const WHATSAPP_PRIMARY = '573224250545';
export const WHATSAPP_SECONDARY = '573160480297';

export const INITIAL_SERVICES: BarberService[] = [
  {
    id: 'corte-cabello',
    code: '01',
    name: 'Corte de Cabello Profesional',
    category: 'servicios',
    priceCop: 25000,
    durationMin: 40,
    description:
      'Cortes clásicos, modernos o degradados adaptados a tu estilo personal, con terminación limpia a navaja y peinado con productos profesionales.',
    includes: [
      'Asesoría según tu estilo',
      'Corte con máquina y tijera',
      'Definición de contornos a navaja',
      'Peinado con cera o acabado natural',
    ],
  },
  {
    id: 'arreglo-barba',
    code: '02',
    name: 'Arreglo y Perfilado de Barba',
    category: 'servicios',
    priceCop: 18000,
    durationMin: 30,
    description:
      'Diseño, rebaje y alineación de barba y bigote utilizando vapor ozono para abrir los poros, logrando un afeitado suave y sin irritación.',
    includes: [
      'Apertura de poros con vapor ozono',
      'Perfilado simétrico con navaja',
      'Aplicación de loción refrescante',
      'Hidratación con aceite para barba',
    ],
  },
  {
    id: 'cuidado-facial',
    code: '03',
    name: 'Limpieza y Exfoliación Facial con Vapor Ozono',
    category: 'servicios',
    priceCop: 35000,
    durationMin: 40,
    description:
      'Ideal para eliminar impurezas del clima y el polvo diario. Incluye vapor ozono, exfoliación con masaje, mascarilla hidratante, gafas relajantes y parches para ojeras.',
    includes: [
      'Vapor ozono y crema exfoliante',
      'Gafas de masaje ocular relajante',
      'Mascarilla facial hidratante',
      'Parches de colágeno para ojeras',
    ],
  },
  {
    id: 'combo-corte-barba',
    code: '04',
    name: 'Combo Clásico: Corte de Cabello + Barba',
    category: 'combos',
    priceCop: 38000,
    durationMin: 60,
    description:
      'Nuestro paquete quincenal favorito para mantener el cabello impecable y la barba perfectamente perfilada en una sola visita.',
    includes: [
      'Corte de cabello completo',
      'Arreglo y perfilado de barba con vapor',
      'Limpieza de cejas y contornos',
      'Acabado con productos premium',
    ],
    featured: true,
  },
  {
    id: 'combo-mana-vip',
    code: '05',
    name: 'Combo Maná VIP: Corte + Barba + Ritual Facial Completo',
    category: 'combos',
    priceCop: 65000,
    durationMin: 85,
    description:
      'La experiencia completa de Maná Barbería: renovación total de imagen y relajación profunda con nuestro ritual facial de vapor ozono y mascarilla.',
    includes: [
      'Corte de cabello a tu medida',
      'Ritual de barba con vapor ozono',
      'Exfoliación facial + Mascarilla + Parches de colágeno',
      'Masaje ocular y atención preferencial',
    ],
    featured: true,
  },
  {
    id: 'combo-corte-facial',
    code: '06',
    name: 'Combo Renovación: Corte de Cabello + Limpieza Facial',
    category: 'combos',
    priceCop: 52000,
    durationMin: 70,
    description:
      'Combina tu corte de cabello con nuestra exfoliación facial de vapor ozono para salir con un rostro fresco, limpio y descansado.',
    includes: [
      'Corte de cabello profesional',
      'Exfoliación facial con vapor ozono',
      'Mascarilla hidratante y parches oculares',
      'Perfilado de cejas y limpieza nasal',
    ],
  },
];

export function formatCopPrice(amount: number): string {
  const safeAmount = Math.max(0, Math.round(amount));
  return `$${safeAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} COP`;
}

export function filterServicesByCategory(
  services: BarberService[],
  category: 'todos' | BarberService['category']
): BarberService[] {
  if (category === 'todos') return services;
  return services.filter((service) => service.category === category);
}

export function updateServicePrice(
  services: BarberService[],
  serviceId: string,
  newPriceCop: number
): BarberService[] {
  if (!Number.isFinite(newPriceCop) || newPriceCop < 1000) {
    throw new Error('El precio debe ser mayor o igual a $1.000 COP.');
  }
  return services.map((s) =>
    s.id === serviceId ? { ...s, priceCop: Math.round(newPriceCop) } : s
  );
}

export function buildDirectWhatsAppUrl(
  customMessage = 'Hola Maná Barbería 💈, vi su página web y quiero consultar disponibilidad para pasar hoy.',
  targetPhone: string = WHATSAPP_PRIMARY
): string {
  const cleanTarget = targetPhone.replace(/\D/g, '');
  return `https://wa.me/${cleanTarget}?text=${encodeURIComponent(customMessage)}`;
}
