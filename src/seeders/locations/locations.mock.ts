export const provincesMock = [
    { name: 'Buenos Aires' },
    { name: 'CABA-GBA' },
    { name: 'Catamarca' },
    { name: 'Chaco' },
    { name: 'Chubut' },
    { name: 'Córdoba' },
    { name: 'Corrientes' },
    { name: 'Entre Ríos' },
    { name: 'Formosa' },
    { name: 'Jujuy' },
    { name: 'La Pampa' },
    { name: 'La Rioja' },
    { name: 'Mendoza' },
    { name: 'Misiones' },
    { name: 'Neuquén' },
    { name: 'Río Negro' },
    { name: 'Salta' },
    { name: 'San Juan' },
    { name: 'San Luis' },
    { name: 'Santa Cruz' },
    { name: 'Santa Fe' },
    { name: 'Santiago del Estero' },
    { name: 'Tierra del Fuego' },
    { name: 'Tucumán' },
  ];
  
  export const createCitiesMock = (provinceName: string) => [
    { name: `Ciudad 1 de ${provinceName}` },
    { name: `Ciudad 2 de ${provinceName}` },
    { name: `Ciudad 3 de ${provinceName}` },
  ];
  
  export const createAddressMock = (cityName: string) => [
    { street: `Calle 1 de ${cityName}`, number: '100', note: 'Nota 1', postalCode: '0001' },
    { street: `Calle 2 de ${cityName}`, number: '200', note: 'Nota 2', postalCode: '0002' },
    { street: `Calle 3 de ${cityName}`, number: '300', note: 'Nota 3', postalCode: '0003' },
  ];
  