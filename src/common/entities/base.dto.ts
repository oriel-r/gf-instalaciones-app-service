import { DeepPartial } from "typeorm";

export abstract class BaseDto {
    constructor(partial: DeepPartial<BaseDto>) {
        Object.assign(this, partial)
    }
}