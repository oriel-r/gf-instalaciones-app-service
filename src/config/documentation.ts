import { DocumentBuilder } from "@nestjs/swagger";

const swaggerConfig = new DocumentBuilder().
    setTitle('gf-installations').
    setDescription('This is a documentation for the API of GF Instalaciones').
    setVersion(process.env.VERSION as string). 
    addBearerAuth().
    build()

export default swaggerConfig