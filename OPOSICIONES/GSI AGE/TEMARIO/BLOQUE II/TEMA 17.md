# Tema 17: Modelo de desarrollo de aplicaciones basado en contenedores y microservicios

Modelo de desarrollo de aplicaciones basado en contenedores y microservicios. Arquitectura y soluciones. Despliegue, monitorización y escalado.

## Modelo de desarrollo de aplicaciones basado en contenedores y microservicios

### Contenedores y microservicios

Un contenedor empaqueta aplicación y dependencias y comparte el núcleo del sistema anfitrión; es más ligero que una máquina virtual, que incluye un sistema operativo invitado. Las imágenes se construyen por capas, se versionan y se distribuyen en registros. Deben ser reproducibles, mínimas, firmadas o verificables y escaneadas frente a vulnerabilidades.

Los microservicios dividen una aplicación en servicios pequeños, autónomos y desplegables por separado, organizados alrededor de capacidades de negocio. Se comunican mediante APIs síncronas o mensajería asíncrona. Cada servicio gestiona datos bajo una propiedad clara; la consistencia distribuida, transacciones, observabilidad, descubrimiento y tolerancia a fallos son retos centrales. No toda aplicación necesita microservicios: aumentan costes operativos y complejidad.

### Despliegue, monitorización y escalado

Plataformas como Kubernetes orquestan contenedores: planificación, reinicio, descubrimiento, configuración, secretos, balanceo y escalado. CI/CD automatiza construcción, pruebas, análisis, publicación y despliegue. Los despliegues rolling, blue/green y canary reducen riesgo, con rollback preparado.

La monitorización combina métricas, registros y trazas distribuidas; SLI mide un indicador, SLO fija el objetivo y SLA formaliza compromisos. El escalado puede ser vertical u horizontal y automático según carga. Seguridad desde la imagen hasta ejecución, aislamiento, mínimo privilegio y gestión de secretos son requisitos transversales.
