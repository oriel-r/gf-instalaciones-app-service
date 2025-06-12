import { getIdsFromAraay } from "src/common/helpers/get-ids-from-array";
import { Order } from "src/modules/operations/orders/entities/order.entity";

export class OrderCompletedEvent {
  orderNumber: string;
  clientId: string[];
  date: Date | null;
  
  constructor({orderNumber, client, endDate }: Order) {
    this.orderNumber = orderNumber,
    this.date = endDate,
    this.clientId = getIdsFromAraay(client)
  }
}