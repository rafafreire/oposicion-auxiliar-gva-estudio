# Tema 36: La arquitectura Java EE/Jakarta EE

La arquitectura Java EE/Jakarta EE. Características de funcionamiento. Elementos constitutivos. Productos y herramientas. Persistencia. Seguridad.

## La arquitectura Java EE/Jakarta EE

### Componentes y funcionamiento

Jakarta EE (antes Java EE) define APIs y perfiles para aplicaciones empresariales Java ejecutadas en contenedores. El contenedor proporciona servicios comunes —ciclo de vida, seguridad, transacciones, inyección y acceso a recursos— y desacopla lógica de negocio de infraestructura. La plataforma permite desplegar componentes portables, aunque existen diferencias de producto y versión.

Componentes habituales: servlets y Jakarta Server Pages para web; CDI para inyección y contexto; Jakarta REST (JAX-RS) para APIs HTTP; Jakarta Persistence (JPA) para mapeo objeto-relacional; Bean Validation; mensajería; y servicios de transacción. Un servidor de aplicaciones ofrece contenedores web y servicios empresariales; despliegue puede ser WAR o EAR según arquitectura.

### Persistencia y seguridad

JPA mapea entidades a tablas, administra contexto de persistencia y consultas JPQL; transacciones controlan operaciones y consistencia. Deben gestionarse conexiones, lazy/eager loading, concurrencia y migraciones de esquema. Seguridad combina autenticación, roles, autorización, transporte TLS, gestión de secretos y protección contra inyección y fallos de configuración. Principio de mínimo privilegio y validación de entradas son esenciales.

Herramientas incluyen JDK, Maven/Gradle, IDE, servidores compatibles, pruebas y observabilidad. Jakarta EE convive con frameworks ligeros y microservicios; la elección depende de estándares requeridos, operación, habilidades y ciclo de vida. Se debe seleccionar una versión con soporte y mantener dependencias actualizadas.
