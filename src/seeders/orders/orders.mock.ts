export const ordersMock = [
    { orderNumber: 'ORD-001', title: 'Order 1', description: 'Description for order 1' },
    { orderNumber: 'ORD-002', title: 'Order 2', description: 'Description for order 2' },
    { orderNumber: 'ORD-003', title: 'Order 3', description: 'Description for order 3' },
    { orderNumber: 'ORD-004', title: 'Order 4', description: 'Description for order 4' },
  ];
  
  export const createInstallationMocks = (orderTitle: string, count: number) => {
    return Array.from({ length: count }, (_, index) => ({
      startDate: undefined, // en lugar de null, se usa undefined
      notes: `Installation ${index + 1} for ${orderTitle}`,
      endDate: undefined, // en lugar de null
    }));
  };
  