import { InstallationStatus } from 'src/common/enums/installations-status.enum';

export const ordersMock = [
  { orderNumber: 'ORD-001', title: 'Instalación residencial', description: 'Instalación de sistemas de seguridad en viviendas particulares.' },
  { orderNumber: 'ORD-002', title: 'Instalación corporativa', description: 'Instalación de señalización y sistemas en oficinas corporativas.' },
  { orderNumber: 'ORD-003', title: 'Revisión integral', description: 'Mantenimiento y revisión de instalaciones en locales comerciales.' },
  { orderNumber: 'ORD-004', title: 'Actualización tecnológica', description: 'Modernización de sistemas e infraestructura en instituciones educativas.' },
  { orderNumber: 'ORD-005', title: 'Mantenimiento industrial', description: 'Instalación y mantenimiento de equipos en plantas industriales.' },
];

export const createInstallationMocks = (orderTitle: string, count: number) => {
  // Definir una lista de posibles estados
  const statuses = [
    InstallationStatus.PENDING,
    InstallationStatus.IN_PROCESS,
    InstallationStatus.TO_REVIEW,
    InstallationStatus.POSTPONED,
    InstallationStatus.FINISHED,
    InstallationStatus.CANCEL,
  ];

  return Array.from({ length: count }, (_, i) => ({
    // Se generan fechas de inicio en función del índice (formato YYYY-MM-DD)
    startDate: `2025-04-${(10 + i).toString().padStart(2, '0')}`,
    // Nota personalizada para cada instalación
    notes: `Instalación ${i + 1} para ${orderTitle}`,
    // Para algunos ítems se asigna una fecha de fin, para otros se deja undefined
    endDate: i % 2 === 0 ? new Date(`2025-04-${(15 + i).toString().padStart(2, '0')}`) : undefined,
    // Se asigna el estado alternando entre las opciones del enum
    status: statuses[i % statuses.length],
    // Se asigna una imagen de ejemplo (esto se puede ajustar luego)
    images: [`http://example.com/${orderTitle.replace(/ /g, '').toLowerCase()}-${i + 1}.jpg`],
  }));
};
