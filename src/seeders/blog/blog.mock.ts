import { CreateCategoryDto } from "src/modules/blog/blog-categories/dtos/create-blog-category.dto";
import { CreateBlogPostTemplate } from "src/modules/blog/blog-post-tamplates/dtos/create-template.dto";
import { CreateBlogPostDto } from "src/modules/blog/blog-posts/dtos/create-post.dto";
import { BlogPostStatus } from "src/common";


export const categoriesMock: CreateCategoryDto[] = [
    {
      name: "Instalación de Lonas Publicitarias",
      description:
        "Procedimientos, recomendaciones y pautas para la instalación de lonas publicitarias de gran formato en exteriores.",
    },
    {
      name: "Montaje de Vinilos Adhesivos",
      description:
        "Métodos y consejos para la aplicación de vinilos adhesivos en superficies de vidrio, metal y otros materiales.",
    },
    {
      name: "Rotulación Vehicular y Estructuras Móviles",
      description:
        "Guías para la rotulación de flotas vehiculares y otras estructuras móviles, destacando la durabilidad y la visibilidad.",
    },
  ];
  

  export const templatesMock: CreateBlogPostTemplate[] = [
    {
      name: "Plantilla 1",
      numberOfContentBlocks: 1,
    },
    {
      name: "Plantilla 2",
      numberOfContentBlocks: 2,
    },
    {
      name: "Plantilla 3",
      numberOfContentBlocks: 3,
    },
  ];

  export const blogPostsMock: CreateBlogPostDto[] = [
    //
    // CATEGORÍA 1: "Instalación de Lonas Publicitarias"
    //
    {
      title: "Diseño y Montaje de Lonas en Vallas Publicitarias",
      category: "Instalación de Lonas Publicitarias",
      template: "Plantilla 1",
      isHighlight: true, // Único artículo destacado
      status: BlogPostStatus.Published,
      content: [
        {
          imageUrl: "", // Para Plantilla 1, se deja vacío
          videoUrl: "",
          paragraph: [
            "Aprende paso a paso cómo diseñar una lona publicitaria eficaz, contemplando la ubicación y el mensaje clave.",
            "Descubre las medidas de seguridad recomendadas al instalar lonas en vallas de gran formato al aire libre.",
          ],
          list: ["Diseño e impresión de la lona", "Herramientas necesarias", "Protocolo de seguridad"],
        },
      ],
    },
    {
      title: "Cuidados Posteriores a la Instalación de Lonas",
      category: "Instalación de Lonas Publicitarias",
      template: "Plantilla 1",
      isHighlight: false,
      status: BlogPostStatus.Published,
      content: [
        {
          imageUrl: "", // Para Plantilla 1, se deja vacío
          videoUrl: "",
          paragraph: [
            "Mantener una lona publicitaria limpia y bien tensada puede prolongar su impacto visual y su vida útil.",
            "Realizar inspecciones periódicas te ayudará a detectar daños menores a tiempo y evitar un deterioro mayor.",
          ],
          list: [
            "Revisiones periódicas de tensado",
            "Limpieza y prevención de hongos",
            "Reparaciones rápidas ante daños leves",
          ],
        },
      ],
    },
    {
      title: "Selección de Materiales para Lonas de Gran Formato",
      category: "Instalación de Lonas Publicitarias",
      template: "Plantilla 2",
      isHighlight: false,
      status: BlogPostStatus.Published,
      content: [
        {
          imageUrl:
            "https://gfinstalaciones.com.ar/hs-fs/hubfs/DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp?width=1024&height=1024&name=DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp",
          videoUrl: "",
          paragraph: [
            "El PVC, el microperforado y la tela son opciones populares para la impresión de lonas publicitarias.",
            "Conoce las diferencias en resistencia al viento y la durabilidad de cada tipo de material.",
          ],
          list: [],
        },
        {
          imageUrl:
            "https://gfinstalaciones.com.ar/hs-fs/hubfs/DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp?width=1024&height=1024&name=DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp",
          videoUrl: "",
          paragraph: [
            "La elección del gramaje y el tratamiento UV puede marcar la diferencia en ambientes con condiciones climáticas extremas.",
            "Un análisis costo-beneficio adecuado te permitirá optimizar la inversión en tus campañas.",
          ],
          list: ["Gramaje recomendado", "Protección UV", "Costo-beneficio"],
        },
      ],
    },
    {
      title: "Mantenimiento Preventivo de Estructuras con Lonas",
      category: "Instalación de Lonas Publicitarias",
      template: "Plantilla 3",
      isHighlight: false,
      status: BlogPostStatus.Published,
      content: [
        {
          imageUrl:
            "https://gfinstalaciones.com.ar/hs-fs/hubfs/DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp?width=1024&height=1024&name=DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp",
          videoUrl: "",
          paragraph: [
            "Una estructura resistente y en buen estado es fundamental para el éxito de la instalación de lonas.",
            "Los soportes metálicos o de madera deben revisarse con frecuencia para prevenir fallas que comprometan la lona.",
          ],
          list: [],
        },
        {
          imageUrl:
            "https://gfinstalaciones.com.ar/hs-fs/hubfs/DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp?width=1024&height=1024&name=DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp",
          videoUrl: "",
          paragraph: [
            "La corrosión, la deformación y las fisuras pueden poner en riesgo la seguridad y el aspecto estético del anuncio.",
            "Documentar cada inspección ayudará a programar mantenimientos oportunos y evitar costos mayores.",
          ],
          list: ["Inspección periódica", "Herramientas de medición", "Registro fotográfico"],
        },
        {
          imageUrl:
            "https://gfinstalaciones.com.ar/hs-fs/hubfs/DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp?width=1024&height=1024&name=DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp",
          videoUrl: "",
          paragraph: [
            "Asegura el uso de equipamiento de protección personal al momento de realizar trabajos en altura.",
            "Es esencial delimitar la zona e informar a terceros para prevenir accidentes durante la revisión.",
          ],
          list: ["Equipos de protección personal", "Bloqueo de tránsito peatonal y vehicular"],
        },
      ],
    },
  
    //
    // CATEGORÍA 2: "Montaje de Vinilos Adhesivos"
    //
    {
      title: "Vinilos en Vidrios Exteriores: Paso a Paso",
      category: "Montaje de Vinilos Adhesivos",
      template: "Plantilla 1",
      isHighlight: false,
      status: BlogPostStatus.Published,
      content: [
        {
          imageUrl: "", // Para Plantilla 1, se deja vacío
          videoUrl: "",
          paragraph: [
            "Antes de colocar un vinilo, asegúrate de limpiar completamente la superficie con productos que no dejen residuos.",
            "La técnica de aplicación en húmedo ayuda a corregir imperfecciones y burbujas, pero requiere práctica y paciencia.",
          ],
          list: ["Limpieza y secado de la superficie", "Posicionamiento del vinilo", "Eliminación de burbujas"],
        },
      ],
    },
    {
      title: "Optimización de la Adhesión en Climas Húmedos",
      category: "Montaje de Vinilos Adhesivos",
      template: "Plantilla 1",
      isHighlight: false,
      status: BlogPostStatus.Published,
      content: [
        {
          imageUrl: "", // Para Plantilla 1, se deja vacío
          videoUrl: "",
          paragraph: [
            "La humedad puede provocar una menor adherencia del vinilo, facilitando la aparición de burbujas.",
            "Aplica aire caliente para secar la superficie y sella con cuidado los bordes para evitar filtraciones.",
          ],
          list: ["Uso de pistola de calor", "Secado forzado", "Sellado de bordes"],
        },
      ],
    },
    {
      title: "Diferencias entre Vinilos Mate y Brillante",
      category: "Montaje de Vinilos Adhesivos",
      template: "Plantilla 2",
      isHighlight: false,
      status: BlogPostStatus.Published,
      content: [
        {
          imageUrl:
            "https://gfinstalaciones.com.ar/hs-fs/hubfs/DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp?width=1024&height=1024&name=DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp",
          videoUrl: "",
          paragraph: [
            "El vinilo brillante destaca los colores, pero puede generar reflejos molestos en ambientes con mucha iluminación.",
            "El vinilo mate ofrece una apariencia más sobria y reduce los destellos, siendo ideal para interiores minimalistas.",
          ],
          list: ["Reflejo de la luz", "Calidad visual", "Mantenimiento"],
        },
        {
          imageUrl:
            "https://gfinstalaciones.com.ar/hs-fs/hubfs/DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp?width=1024&height=1024&name=DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp",
          videoUrl: "",
          paragraph: [
            "En exteriores, la elección depende de la resistencia al clima y la durabilidad frente al desgaste.",
            "Compara precios y condiciones de reposición para encontrar el equilibrio entre impacto visual y presupuesto.",
          ],
          list: ["Duración promedio", "Costos de reposición", "Impacto estético"],
        },
      ],
    },
    {
      title: "Vinilos Perforados en Fachadas Comerciales",
      category: "Montaje de Vinilos Adhesivos",
      template: "Plantilla 3",
      isHighlight: false,
      status: BlogPostStatus.Published,
      content: [
        {
          imageUrl:
            "https://gfinstalaciones.com.ar/hs-fs/hubfs/DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp?width=1024&height=1024&name=DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp",
          videoUrl: "",
          paragraph: [
            "Los vinilos perforados permiten la visión desde el interior sin perder la fuerza publicitaria en el exterior.",
            "Son ideales para fachadas donde se busca luminosidad natural y un alto impacto visual al mismo tiempo.",
          ],
          list: [],
        },
        {
          imageUrl:
            "https://gfinstalaciones.com.ar/hs-fs/hubfs/DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp?width=1024&height=1024&name=DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp",
          videoUrl: "",
          paragraph: [
            "La alineación precisa y el recorte cuidadoso son esenciales en superficies curvas o ventanas contiguas.",
            "Un montaje paso a paso garantiza un resultado uniforme y minimiza los errores de posicionamiento.",
          ],
          list: ["Medición previa", "Corte al ras", "Adhesión secuencial"],
        },
        {
          imageUrl:
            "https://gfinstalaciones.com.ar/hs-fs/hubfs/DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp?width=1024&height=1024&name=DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp",
          videoUrl: "",
          paragraph: [
            "Consulta las regulaciones locales que restringen el uso de vinilos en edificios históricos o ciertos distritos.",
            "La seguridad al trabajar en altura o sobre fachadas inclinadas requiere equipamiento especializado.",
          ],
          list: ["Permisos municipales", "Altura y seguridad", "Responsabilidad civil"],
        },
      ],
    },
  
    //
    // CATEGORÍA 3: "Rotulación Vehicular y Estructuras Móviles"
    //
    {
      title: "Rotulación de Flotas: Impacto Publicitario",
      category: "Rotulación Vehicular y Estructuras Móviles",
      template: "Plantilla 1",
      isHighlight: false,
      status: BlogPostStatus.Published,
      content: [
        {
          imageUrl: "", // Para Plantilla 1, se deja vacío
          videoUrl: "",
          paragraph: [
            "La rotulación de vehículos comerciales refuerza la identidad de marca y capta la atención en movimiento.",
            "Cada desplazamiento del vehículo se convierte en una oportunidad de publicidad eficaz y de bajo costo.",
          ],
          list: ["Visibilidad en tránsito", "Bajo costo por impacto", "Profesionalismo"],
        },
      ],
    },
    {
      title: "Protección de la Rotulación ante la Intemperie",
      category: "Rotulación Vehicular y Estructuras Móviles",
      template: "Plantilla 1",
      isHighlight: false,
      status: BlogPostStatus.Published,
      content: [
        {
          imageUrl: "", // Para Plantilla 1, se deja vacío
          videoUrl: "",
          paragraph: [
            "Los vinilos aplicados en vehículos pueden deteriorarse con mayor rapidez si se exponen constantemente al sol y la lluvia.",
            "Utiliza selladores anti-UV y técnicas de limpieza adecuadas para prolongar la vida útil de la rotulación.",
          ],
          list: ["Encerrado en garaje", "Uso de selladores anti-UV", "Limpiezas periódicas con productos neutros"],
        },
      ],
    },
    {
      title: "Rotulación en Unidades de Transporte Público",
      category: "Rotulación Vehicular y Estructuras Móviles",
      template: "Plantilla 2",
      isHighlight: false,
      status: BlogPostStatus.Published,
      content: [
        {
          imageUrl:
            "https://gfinstalaciones.com.ar/hs-fs/hubfs/DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp?width=1024&height=1024&name=DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp",
          videoUrl: "",
          paragraph: [
            "Los autobuses y taxis ofrecen un amplio espacio para plasmar mensajes publicitarios de gran impacto.",
            "El tránsito urbano convierte a cada vehículo en un soporte móvil altamente visible para marcas y campañas.",
          ],
          list: [],
        },
        {
          imageUrl:
            "https://gfinstalaciones.com.ar/hs-fs/hubfs/DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp?width=1024&height=1024&name=DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp",
          videoUrl: "",
          paragraph: [
            "Asegúrate de conocer las normativas locales que limitan ciertos diseños o ubicaciones de vinilos en vehículos de uso público.",
            "La responsabilidad ante daños o infracciones recae tanto en el anunciante como en la empresa transportista.",
          ],
          list: ["Normas municipales", "Límites de diseño", "Responsabilidad ante daños"],
        },
      ],
    },
    {
      title: "Instalación y Desinstalación Rápida de Vinilos en Flotas",
      category: "Rotulación Vehicular y Estructuras Móviles",
      template: "Plantilla 3",
      isHighlight: false,
      status: BlogPostStatus.Published,
      content: [
        {
          imageUrl:
            "https://gfinstalaciones.com.ar/hs-fs/hubfs/DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp?width=1024&height=1024&name=DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp",
          videoUrl: "",
          paragraph: [
            "Cuando las campañas cambian con frecuencia, es vital contar con métodos de rotulación rápidos y eficientes.",
            "Reducir el tiempo de inactividad de los vehículos se traduce en mayores beneficios y una mejor imagen de marca.",
          ],
          list: [],
        },
        {
          imageUrl:
            "https://gfinstalaciones.com.ar/hs-fs/hubfs/DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp?width=1024&height=1024&name=DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp",
          videoUrl: "",
          paragraph: [
            "Los adhesivos removibles facilitan la desinstalación, aunque requieren un cuidado especial en la aplicación.",
            "La técnica en húmedo o en seco puede variar según el tipo de vinilo y la superficie del vehículo.",
          ],
          list: ["Adhesivo permanente", "Adhesivo removible", "Aplicación en seco vs. húmedo"],
        },
        {
          imageUrl:
            "https://gfinstalaciones.com.ar/hs-fs/hubfs/DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp?width=1024&height=1024&name=DALL%C2%B7E%202024-11-07%2002.00.00%20-%20A%20modern%2C%20dynamic%20image%20of%20a%20large-format%20graphic%20installation%20in%20progress.%20The%20scene%20includes%20a%20team%20of%20workers%20wearing%20safety%20gear%20and%20using%20modern%20.webp",
          videoUrl: "",
          paragraph: [
            "Para flotas grandes, es esencial planificar las rutas y turnos de instalación de forma coordinada.",
            "Un buen control logístico evita retrasos y sobrecostes en la renovación de las campañas publicitarias.",
          ],
          list: ["Planificación de rutas", "Coordinación con talleres", "Optimización de turnos de reemplazo"],
        },
      ],
    },
  ];
  
  