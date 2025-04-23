import { InstallationStatus } from 'src/common/enums/installations-status.enum';

export const ordersMock = [
  { orderNumber: 'ORD-001', title: 'Instalación residencial', description: 'Instalación de sistemas de seguridad en viviendas particulares.' },
  { orderNumber: 'ORD-002', title: 'Instalación corporativa', description: 'Instalación de señalización y sistemas en oficinas corporativas.' },
  { orderNumber: 'ORD-003', title: 'Revisión integral', description: 'Mantenimiento y revisión de instalaciones en locales comerciales.' },
  { orderNumber: 'ORD-004', title: 'Actualización tecnológica', description: 'Modernización de sistemas e infraestructura en instituciones educativas.' },
  { orderNumber: 'ORD-005', title: 'Mantenimiento industrial', description: 'Instalación y mantenimiento de equipos en plantas industriales.' },
  { orderNumber: 'ORD-006', title: 'Instalación de energía solar', description: 'Implementación de sistemas de energía renovable en residencias.' },
  { orderNumber: 'ORD-007', title: 'Optimización de red', description: 'Instalación y mejora de redes internas en oficinas y comercios.' },
  { orderNumber: 'ORD-008', title: 'Seguridad perimetral', description: 'Instalación de cercas y sistemas de monitoreo para propiedades.' },
  { orderNumber: 'ORD-009', title: 'Mostaza', description: 'Instalación de cercas y sistemas de monitoreo para propiedades.' },
  { orderNumber: 'ORD-010', title: 'Mayonesa', description: 'Instalación de cercas y sistemas de monitoreo para propiedades.' },
  { orderNumber: 'ORD-011', title: 'Ketchup', description: 'Instalación de cercas y sistemas de monitoreo para propiedades.' },
  { orderNumber: 'ORD-012', title: 'Papas', description: 'Instalación de cercas y sistemas de monitoreo para propiedades.' },
  { orderNumber: 'ORD-013', title: 'Un pancho!', description: 'Instalación de cercas y sistemas de monitoreo para propiedades.' },
  { orderNumber: 'ORD-014', title: 'Una de carne', description: 'Instalación de cercas y sistemas de monitoreo para propiedades.' },
  { orderNumber: 'ORD-015', title: 'Una de choclo', description: 'Instalación de cercas y sistemas de monitoreo para propiedades.' },
  { orderNumber: 'ORD-016', title: 'Dos de choclo', description: 'Instalación de cercas y sistemas de monitoreo para propiedades.' },
  { orderNumber: 'ORD-017', title: 'Una de carne', description: 'Instalación de cercas y sistemas de monitoreo para propiedades.' },
  { orderNumber: 'ORD-018', title: 'Tres de choclo', description: 'Instalación de cercas y sistemas de monitoreo para propiedades.' },
];

export const createInstallationMocks = (orderTitle: string, count: number) => {
  const statuses = [
    InstallationStatus.PENDING,
    InstallationStatus.IN_PROCESS,
    InstallationStatus.TO_REVIEW,
    InstallationStatus.POSTPONED,
    InstallationStatus.FINISHED,
    InstallationStatus.CANCEL,
  ];

  return Array.from({ length: count }, (_, i) => {
    // Fecha aleatoria entre mayo (05) y agosto (08) de 2025
    const randomMonth = Math.floor(Math.random() * (8 - 5 + 1)) + 5; // 5..8
    const randomDay = Math.floor(Math.random() * 28) + 1;           // 1..28
    const monthStr = String(randomMonth).padStart(2, '0');
    const dayStr   = String(randomDay).padStart(2, '0');

    // Hora aleatoria entre 08:00 y 18:45 en múltiplos de 15 minutos
    const hour      = Math.floor(Math.random() * 11) + 8; // 8..18
    const minuteArr = [0, 15, 30, 45];
    const minute    = minuteArr[Math.floor(Math.random() * minuteArr.length)];
    const hourStr   = String(hour).padStart(2, '0');
    const minStr    = String(minute).padStart(2, '0');

    // Componer el ISO 8601 con offset -03:00
    const startIso = `2025-${monthStr}-${dayStr}T${hourStr}:${minStr}:00-03:00`;

    // Para algunos índices pares, asignar endDate 3 días después al mismo horario
    const dayEnd    = Math.min(randomDay + 3, 28);
    const dayEndStr = String(dayEnd).padStart(2, '0');
    const endIso    = (i % 2 === 0)
      ? `2025-${monthStr}-${dayEndStr}T${hourStr}:${minStr}:00-03:00`
      : undefined;

    return {
      startDate: startIso,
      notes:     `Instalación ${i + 1} para ${orderTitle}`,
      endDate:   endIso ? new Date(endIso) : undefined,
      status:    statuses[i % statuses.length],
      images: [
        `https://res.cloudinary.com/ddhx1kogg/image/upload/v.../img1.png`,
        `https://res.cloudinary.com/ddhx1kogg/image/upload/v.../img2.png`,
        `https://res.cloudinary.com/ddhx1kogg/image/upload/v.../img3.png`,
      ],
    };
  });
};
