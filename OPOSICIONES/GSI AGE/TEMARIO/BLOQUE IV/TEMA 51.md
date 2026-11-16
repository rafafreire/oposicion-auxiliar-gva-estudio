# Tema 51: Redes de área extensa

Redes de área extensa. Tecnologías WDM y MPLS SD-WAN. Protocolos de encaminamiento.

## Redes de área extensa

### WDM, MPLS y SD-WAN

Una WAN conecta redes distantes mediante operadores o enlaces propios. WDM multiplexa varias longitudes de onda sobre una fibra; CWDM usa separaciones más amplias y DWDM más canales y capacidad. MPLS etiqueta paquetes para encaminamiento por caminos conmutados, permite ingeniería de tráfico y VPN de operador; no cifra por sí mismo el tráfico.

SD-WAN abstrae enlaces WAN y aplica políticas centralizadas para seleccionar rutas según aplicación, coste, latencia y disponibilidad. Puede combinar Internet, MPLS y LTE/5G. Requiere proteger controladores, túneles, credenciales y separación de clientes; no elimina necesidad de arquitectura y operación de red.

### Encaminamiento

Enrutamiento estático es simple y controlado, pero poco adaptable; dinámico intercambia información. OSPF es IGP de estado de enlace y calcula rutas mediante SPF; IS-IS también usa estado de enlace. RIP es vector distancia con límites de escalabilidad. BGP es EGP entre sistemas autónomos y aplica políticas además de métricas.

La selección considera prefijo más específico, distancia administrativa y métrica, según plataforma. Se diseñan sumarización, redundancia, convergencia, filtrado y prevención de bucles. En producción, cambios de routing deben probarse y monitorizarse para evitar anuncios erróneos o pérdida masiva de conectividad.
