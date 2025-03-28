import { BaseDto } from "src/common/entities/base.dto";
import { Installation } from "../../installations/entities/installation.entity";
import { Order } from "../entities/order.entity";
import { GetInstallationsDto } from "../../installations/dto/get-installations-response.dto";
import { UserRole } from "src/modules/user-role/entities/user-role.entity";

export class GetOrderResponseDto {
    id: string;
    orderNumber: string;
    description: string;
    title: string;
    completed: boolean;
    installationsFinished: string;
    progress: number;
    client: UserRole | null
    installations: GetInstallationsDto[];

    constructor(data: Order){

        this.id = data.id
        this.orderNumber = data.orderNumber
        this.title = data.title
        this.description = data.description
        this.progress = data.progress
        this.completed = data.completed
        this.installationsFinished = data.installationsFinished
        this.installations = data.installations.map(installation => new GetInstallationsDto(installation))
        this.client = data.client

    }

}