import { DocumentBuilder, SwaggerDocumentOptions } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder().
                                                setTitle('gf-instalrions').
                                                setDescription('This is a documentation for the API of GF Instalaciones').
                                                setVersion(process.env.VERSION as string). 
                                                addBearerAuth().
                                                build()