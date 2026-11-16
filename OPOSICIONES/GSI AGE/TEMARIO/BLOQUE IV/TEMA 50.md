# Tema 50: Administración de redes locales

Administración de redes locales. Gestión de usuarios y dispositivos. Monitorización y control de tráfico. Gestión SNMP.

## Administración de redes locales

### Gestión de usuarios y dispositivos

Administrar LAN incluye inventario, direccionamiento, VLAN, configuración de switches y puntos de acceso, DHCP, DNS, NTP, autenticación y políticas. Directorios centralizados facilitan identidad y grupos; 802.1X controla acceso a puerto con servidor RADIUS. NAC puede evaluar postura del dispositivo antes de conectarlo. Se asignan permisos mínimos y se separan redes de usuarios, servidores, invitados y administración.

Los cambios de configuración se versionan y respaldan. Se documentan puertos, conexiones, propietario y criticidad; protocolos de descubrimiento se limitan para evitar exponer información.

### Monitorización, tráfico y SNMP

Se vigilan disponibilidad, errores de interfaz, descartes, utilización, latencia, pérdida, broadcast, cambios de topología, CPU y memoria. NetFlow/IPFIX aportan flujos agregados para analizar origen, destino y volumen; captura de paquetes sirve para diagnóstico puntual y controlado. QoS clasifica tráfico y aplica colas, priorización y límites, sin crear ancho de banda.

SNMP usa gestores, agentes y MIB/OID. Get consulta objetos, Set cambia algunos parámetros permitidos, traps/informs notifican eventos. SNMPv3 añade autenticación y privacidad; versiones antiguas pueden transmitir community strings sin protección adecuada. Debe restringirse acceso, usar SNMPv3 cuando sea posible y monitorizar de forma segura. Los umbrales y alertas deben correlacionarse con impacto y niveles de servicio.
