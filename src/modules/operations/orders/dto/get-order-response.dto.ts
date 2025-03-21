import { BaseDto } from "src/common/entities/base.dto";
import { Installation } from "../../installations/entities/installation.entity";
import { Order } from "../entities/order.entity";

export class GetOrderResponseDto extends BaseDto {
    id: string;
    orderNumber: string;
    description: string;
    title: string;
    progress: number;

    installations: Installation[];
    constructor(data: Order){
        super(data)

        this.id = data.id
        this.orderNumber = data.orderNumber
        this.title = data.title
        this.description = data.description
    
    }
}