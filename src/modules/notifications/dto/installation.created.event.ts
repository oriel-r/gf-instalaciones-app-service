export class InstallationCreatedEvent {
  address: {
    street: string
    number: string
    city: {
      name: string
      province: { name: string }
    }
  }
}
