export class DeleteResponse {
    constructor(entity: string, id: string, message?: string) {
      this.entity = entity;
      this.id = id;
      this.message = message || 'Recurso eliminado correctamente.';
    }
  
    entity: string;
    id: string;
    message: string;
  }