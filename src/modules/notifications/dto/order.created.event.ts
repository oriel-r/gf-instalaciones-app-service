export class OrderCreatedEvent {
  orderId: string;
  orderNumber: string;
  clientsIds: string[];

  constructor(order: { id: string; orderNumber: string; client: { id: string }[] }) {
    this.orderId = order.id;
    this.orderNumber = order.orderNumber;
    this.clientsIds = order.client ? order.client.map(c => c.id) : [];
  }
}
