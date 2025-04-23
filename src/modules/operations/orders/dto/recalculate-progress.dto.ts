import { IsNotEmpty, IsString } from "class-validator"

export class RecalculateProgressDto {

    @IsNotEmpty()
    @IsString()
    orderId: string

    constructor(id: string) {
        this.orderId = id
    }

}