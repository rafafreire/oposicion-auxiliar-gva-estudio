# Tema 53: La seguridad en redes

La seguridad en redes. Seguridad perimetral. Control de accesos. Técnicas criptográficas y protocolos seguros. Mecanismos de firma digital. Redes privadas virtuales. Seguridad en el puesto del usuario.

## La seguridad en redes

### Seguridad perimetral y control de accesos

La seguridad de red combina segmentación y controles en límites internos y externos. Firewalls con estado filtran conexiones; NGFW añade inspección de aplicación; WAF protege aplicaciones web; IDS detecta y alerta, IPS puede bloquear. VPN conecta de forma cifrada redes o usuarios. DMZ separa servicios expuestos de redes internas. Arquitectura zero trust exige verificar identidad, dispositivo y contexto por solicitud, sin confiar automáticamente por ubicación.

El control de acceso se basa en identidad, autenticación multifactor, autorización por roles o atributos, mínimo privilegio y revisión. NAC controla incorporación de dispositivos; ACL permiten o deniegan flujos. Las reglas deben documentarse, probarse y depurarse.

### Criptografía, firma y VPN

Cifrado simétrico usa una clave compartida y es eficiente; asimétrico usa pareja pública/privada para intercambio, firma y establecimiento de claves. Hash criptográfico comprueba integridad, no cifra; HMAC autentica mensajes con clave. PKI vincula identidades a claves mediante certificados y autoridades de certificación. Firma digital usa clave privada y validación pública para integridad y autenticidad, no confidencialidad por sí sola.

TLS protege conexiones de aplicación; IPsec protege en capa IP y puede operar en modo transporte o túnel. VPN debe gestionar claves, autenticación, actualización y rutas seguras. En el puesto se aplican EDR, parches, cifrado, bloqueo, protección de navegador y mínimo privilegio. DNS, correo y acceso remoto requieren controles específicos.
