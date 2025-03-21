import { BaseDto } from "src/common/entities/base.dto";
import { City } from "../../city/entities/city.entity";
import { Adress } from "../entities/adress.entity";

export class AdresResponseDto extends BaseDto {
    id: string;
    street: string;
    number: string;
    note: string;
    postalCode: string;
    city: string
    province: string

    constructor(data: Adress){
        super(data)
        this.id = data.id,
        this.street = data.street
        this.number = data.number,
        this.postalCode = data.postalCode,
        this.note = data.note,
        this.city = data.city.name,
        this.province = data.city.province.name
    }
}