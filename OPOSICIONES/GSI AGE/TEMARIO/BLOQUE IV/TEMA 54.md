# Tema 54: La red Internet

La red Internet: arquitectura de red. Principios de funcionamiento. Servicios: evolución, estado actual y perspectivas de futuro. Internet de las Cosas (IoT).

## La red Internet

### Arquitectura y funcionamiento de Internet

Internet es una red de redes interconectadas que utiliza la familia TCP/IP y encaminamiento distribuido. Los sistemas autónomos intercambian rutas mediante BGP; operadores conectan redes mediante tránsito y puntos de intercambio. DNS es jerárquico y distribuido; resuelve nombres mediante registros. IPv4 e IPv6 identifican interfaces; routers encaminan paquetes. TCP ofrece transporte fiable y control de congestión; UDP prioriza baja sobrecarga; QUIC combina transporte seguro sobre UDP.

### Servicios y evolución

Servicios incluyen Web (HTTP/HTTPS), correo (SMTP, IMAP), resolución DNS, transferencia de ficheros, voz y vídeo, nube y redes sociales. HTTPS usa TLS para proteger canal, pero no garantiza veracidad del contenido. CDNs acercan contenido y reducen latencia. IPv6 amplía el espacio de direcciones y mejora autoconfiguración, aunque la transición convive con IPv4 y mecanismos de traducción.

La evolución incorpora movilidad, edge computing, virtualización de red y automatización. Retos: concentración de plataformas, privacidad, seguridad, accesibilidad, neutralidad, resiliencia y brecha digital.

### Internet de las Cosas

IoT conecta sensores, actuadores y objetos con plataformas y servicios. Arquitectura típica: dispositivo, gateway/edge, conectividad, plataforma de datos y aplicación. Protocolos incluyen MQTT, CoAP, HTTP y redes LPWAN según consumo y alcance. Ciclo de vida seguro requiere identidad única, arranque seguro, actualizaciones firmadas, credenciales únicas, cifrado, inventario y fin de soporte. La segmentación y minimización de datos limitan impacto; equipos con soporte vencido deben retirarse o aislarse.
