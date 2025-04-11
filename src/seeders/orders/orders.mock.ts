import { InstallationStatus } from 'src/common/enums/installations-status.enum';

// Ahora se definen más órdenes
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
    // Genera una fecha aleatoria entre mayo (5) y agosto (8) del 2025
    const randomMonth = Math.floor(Math.random() * (8 - 5 + 1)) + 5; // 5 a 8
    const randomDay = Math.floor(Math.random() * 28) + 1; // días de 1 a 28
    const monthStr = randomMonth.toString().padStart(2, '0');
    const dayStr = randomDay.toString().padStart(2, '0');

    // Para algunas instalaciones (en índices pares) se asigna una fecha de fin 3 días después (sin sobrepasar el 28)
    const dayEnd = randomDay + 3 > 28 ? 28 : randomDay + 3;
    const dayEndStr = dayEnd.toString().padStart(2, '0');

    return {
      startDate: `2025-${monthStr}-${dayStr}`,
      notes: `Instalación ${i + 1} para ${orderTitle}`,
      // Algunos ítems cuentan con una fecha de fin, otros quedan sin definir
      endDate: i % 2 === 0 ? new Date(`2025-${monthStr}-${dayEndStr}`) : undefined,
      status: statuses[i % statuses.length],
      images: [`http://example.com/${orderTitle.replace(/ /g, '').toLowerCase()}-${i + 1}.jpg`],
    };
  });
};