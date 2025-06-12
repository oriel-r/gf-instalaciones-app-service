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
    // Fecha aleatoria mayo (5)–agosto (8) de 2025
    const month  = String(Math.floor(Math.random() * 4) + 5).padStart(2,'0');   // '05'..'08'
    const day    = String(Math.floor(Math.random() * 28) + 1).padStart(2,'0');  // '01'..'28'
    const hour   = String(Math.floor(Math.random() * 11) + 8).padStart(2,'0');  // '08'..'18'
    const minArr = [0,15,30,45];
    const min    = String(minArr[Math.floor(Math.random()*minArr.length)]).padStart(2,'0');
    const startIso = `2025-${month}-${day}T${hour}:${min}:00-03:00`;

    return {
      startDate: startIso,
      notes:     `Instalación ${i+1} para ${orderTitle}`,
      status:    statuses[i % statuses.length],
      images: [
        `https://res.cloudinary.com/.../img1.png`,
        `https://res.cloudinary.com/.../img2.png`,
        `https://res.cloudinary.com/.../img3.png`,
      ],
    };
  });
};
