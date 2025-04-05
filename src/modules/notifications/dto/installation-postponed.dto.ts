import { IsUUID } from "class-validator"
import { CreateNotificationDto } from "./create-notification.dto"

export class InstallationPostponedDto {

    @IsUUID()
    coordinatorId: string

    constructor(coordinator: string) {
        this.coordinatorId = coordinator
    }
}