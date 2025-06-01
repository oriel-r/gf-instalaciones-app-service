import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { SheetssyncService } from './sheetssync.service';
import { ApiOperation } from '@nestjs/swagger';

interface PromiseResponse {
  orderNumber: string,
  status: string
  value: any
}
 

@Controller('sheetssync')
export class SheetssyncController {
  constructor(private readonly sheetssyncService: SheetssyncService) {}

  @ApiOperation({
    summary: 'this endpoint recive the sheets data'
  })
  @Post('webhook/sheets')
  async createOrder(@Body() data ) {
    const dataArray = Array.isArray(data) ? data : [data]

    console.log(dataArray)
    const response: PromiseResponse[]= []
    for(const item of dataArray) {
      const resolve = {
        orderNumber: item['orderNumber'],
        status: 'fulfilled',
        value: item['orderNumber']
      }
      response.push(resolve)
    }
    console.log(response)
    return response
  }

  @ApiOperation({
    summary: 'this endpoint send data for the test'
  })
  @Post('webhook/installations')
  async addData(@Body() data) {
    return {message: 'post for load data'}
  }
}

/* 
interface ApiResultDTO {
  externalId: string;
  status: 'exitoso' | 'fallido';
  error?: string;
}

async function enviarLote(peticiones: Array<{externalId: string, payload: any}>): Promise<ApiResultDTO[]> {
  // 1. Crear promesas con el identificador embebido
  const promesas = peticiones.map(({ externalId, payload }) =>
    llamadaApi(payload)
      .then(() => ({ externalId, status: 'fulfilled' as const }))
      .catch((err) => ({ externalId, status: 'rejected' as const, reason: err }))
  );

  // 2. Esperar a que todas terminen
  const resultados = await Promise.allSettled(promesas);

  // 3. Transformar al DTO definitivo
  return resultados.map(r => {
    if (r.status === 'fulfilled') {
      const { externalId } = r.value;   // <-- venía embebido
      return { externalId, status: 'exitoso' };
    } else {
      const { externalId, reason } = r.reason;
      return { externalId, status: 'fallido', error: String(reason) };
    }
  });
}
*/
