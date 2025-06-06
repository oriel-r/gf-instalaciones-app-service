export class ImagesRejectedEvent {
  installationId: string;
  installerIds: string[];
  reason?: string;
}