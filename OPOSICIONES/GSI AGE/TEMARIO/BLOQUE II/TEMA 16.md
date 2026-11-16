# Tema 16: Arquitectura de sistemas cliente-servidor, multicapas y multidispositivo

Arquitectura de sistemas cliente-servidor, multicapas y multidispositivo: tipología. Componentes. Interoperabilidad de componentes. Ventajas e inconvenientes. Arquitectura de servicios web.

## Arquitectura de sistemas cliente-servidor, multicapas y multidispositivo

### Tipologías y capas

En cliente-servidor, el cliente solicita servicios y el servidor los presta mediante un protocolo. La arquitectura de dos capas sitúa cliente y servidor de datos; la de tres capas separa presentación, lógica de negocio y persistencia; N capas distribuye responsabilidades en componentes desplegables. Los clientes pueden ser pesados, ligeros o navegadores; una arquitectura multidispositivo adapta interacción y presentación a escritorio, móvil y otros terminales.

### Componentes e interoperabilidad

Los componentes encapsulan funciones y exponen contratos mediante interfaces. Middleware, colas, brokers y APIs desacoplan sistemas. La interoperabilidad comprende dimensiones técnica, sintáctica y semántica: formatos comunes, protocolos, autenticación, acuerdos de datos y versionado. Deben definirse límites, manejo de errores, idempotencia, trazabilidad y políticas de compatibilidad.

### Servicios web

SOAP intercambia mensajes XML definidos por contratos WSDL y puede apoyarse en estándares WS-*; es extensible y formal, aunque más complejo. REST organiza recursos identificados por URI y usa operaciones HTTP, normalmente JSON; no es un protocolo, sino un estilo arquitectónico. OpenAPI documenta APIs HTTP. GraphQL permite solicitar campos concretos mediante un esquema. La seguridad suele apoyarse en TLS, autenticación y autorización (por ejemplo, OAuth 2.0 y OpenID Connect), validación de entradas y límites de consumo.

La separación en capas facilita mantenimiento y escalado independiente, pero añade latencia, complejidad operativa y puntos de fallo. El diseño debe equilibrar rendimiento, resiliencia, simplicidad, seguridad y disponibilidad.
