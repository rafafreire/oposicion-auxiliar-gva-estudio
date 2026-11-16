# Tema 38: Aplicaciones web

Aplicaciones web. Diseño web multiplataforma/multidispositivo. Desarrollo web front-end y en servidor. Componentes de tecnologías de programación. Servicios web: estándares, protocolos asociados, interoperabilidad y seguridad. Internacionalización y localización.

## Aplicaciones web

### Diseño y desarrollo web

Una aplicación web combina cliente y servidor comunicados principalmente mediante HTTP. Diseño adaptable (responsive) ajusta presentación a tamaño y capacidades; diseño multidispositivo considera interacción táctil, teclado, lectores de pantalla y conectividad. HTML semántico estructura contenido, CSS presentación y JavaScript comportamiento. Front-end gestiona interfaz y estado; back-end implementa lógica, identidad, persistencia e integración. La separación exige contratos y control de versiones.

### Servicios, interoperabilidad y seguridad

Servicios REST usan recursos y métodos HTTP, con JSON frecuente; SOAP utiliza mensajes XML y contratos WSDL. OpenAPI documenta APIs. HTTPS/TLS protege transporte; OAuth 2.0 delega autorización y OpenID Connect añade autenticación. Deben aplicarse autorización por recurso, validación de entradas, protección contra CSRF/XSS/inyección, gestión de sesión, límites de tasa y registro seguro. CORS controla acceso desde distintos orígenes, no sustituye autorización. Las APIs deben ser versionadas, accesibles y monitorizables.

### Internacionalización y localización

Internacionalización prepara arquitectura para varios idiomas y regiones: Unicode, externalización de cadenas, formatos locales y soporte de escritura. Localización adapta idioma, fechas, números, monedas, ordenación, mensajes y referencias culturales al público. No se deben concatenar frases traducibles ni codificar formatos regionales. Accesibilidad, rendimiento, privacidad y compatibilidad entre navegadores y dispositivos se incorporan desde diseño. Las pruebas cubren tamaños de texto, idiomas de derecha a izquierda y formatos locales.
