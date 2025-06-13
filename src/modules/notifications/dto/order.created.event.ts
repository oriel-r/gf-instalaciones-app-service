import { Order } from 'src/modules/operations/orders/entities/order.entity';

export class OrderCreatedEvent {
  orderId: string;
  orderNumber: string;
  clientsIds: string[];

  constructor({ id, orderNumber, client }: Order) {
    this.orderId = id;
    this.orderNumber = orderNumber;
    this.clientsIds = client ? client.map((c) => c.id) : [];
  }
}
