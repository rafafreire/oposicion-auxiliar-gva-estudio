# Tema 18: El modelo TCP/IP y el modelo de referencia de interconexión de sistemas abiertos (OSI) de ISO

El modelo TCP/IP y el modelo de referencia de interconexión de sistemas abiertos (OSI) de ISO: arquitectura, capas, interfaces, protocolos, direccionamiento y encaminamiento.

## El modelo TCP/IP y el modelo de referencia de interconexión de sistemas abiertos (OSI) de ISO

### Capas y modelos

OSI es un modelo de referencia de siete capas: física (señales), enlace (tramas y acceso al medio), red (paquetes y encaminamiento), transporte (comunicación extremo a extremo), sesión, presentación y aplicación. TCP/IP agrupa funciones en acceso a red, Internet, transporte y aplicación. El encapsulado añade cabeceras al descender por capas; el receptor las elimina. Una interfaz define servicios entre capas y un protocolo reglas entre entidades pares.

### Protocolos, direccionamiento y encaminamiento

En la capa de aplicación operan HTTP, DNS, SMTP y otros; transporte incluye TCP, fiable y orientado a conexión, y UDP, no orientado a conexión y de menor sobrecarga. IP ofrece entrega de datagramas sin garantía; ICMP comunica errores y estado. Ethernet y Wi-Fi operan en acceso/enlace.

IPv4 usa direcciones de 32 bits; IPv6, 128 bits. Subredes y prefijos separan identificador de red y de host. ARP resuelve IPv4 a direcciones de enlace en redes locales; Neighbor Discovery cumple funciones relacionadas en IPv6. Puertos identifican aplicaciones de transporte.

El encaminamiento selecciona rutas según tablas y métricas. Los protocolos interiores, como OSPF, intercambian rutas dentro de un sistema autónomo; BGP intercambia prefijos entre sistemas autónomos. NAT traduce direcciones, aunque no sustituye una política de seguridad. DNS traduce nombres a registros, y DHCP asigna parámetros IP dinámicos.
