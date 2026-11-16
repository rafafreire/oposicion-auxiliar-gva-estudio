# Tema 22: Gestión de la atención a clientes y usuarios

Gestión de la atención a clientes y usuarios: centros de contacto, CRM. Arquitectura multicanal. Sistemas de respuesta de voz interactiva (IVR). Voice XML.

## Gestión de la atención a clientes y usuarios

### Centros de contacto y CRM

Un centro de contacto gestiona interacciones de usuarios por teléfono, correo, web, chat, mensajería y redes. Integra distribución de llamadas, colas, IVR, grabación cuando sea lícita, base de conocimiento, gestión de casos y métricas. El CRM (Customer Relationship Management) organiza datos e historial de relación para atención, seguimiento y análisis; debe asegurar calidad, control de acceso, minimización y cumplimiento de protección de datos.

Los indicadores típicos incluyen nivel de servicio, tiempo medio de espera, resolución en primer contacto, abandono, satisfacción y casos pendientes. Deben interpretarse juntos: optimizar velocidad puede empeorar calidad. La gestión del conocimiento proporciona respuestas consistentes y actualizadas.

### Arquitectura multicanal e IVR

Multicanal significa ofrecer varios canales; omnicanal añade continuidad contextual entre ellos. El usuario debería poder cambiar de canal sin repetir innecesariamente información. La arquitectura integra canales, identidad, CRM, enrutamiento y sistemas de tramitación mediante APIs y colas; contempla disponibilidad, escalado, observabilidad y accesibilidad.

Un IVR recibe tonos o voz, presenta menús, identifica necesidades y enruta llamadas o automatiza trámites. Debe ofrecer opciones claras, acceso a operador, manejo de errores y alternativas accesibles. Los datos recogidos deben limitarse a la finalidad y protegerse.

### VoiceXML

VoiceXML es un lenguaje XML para describir diálogos de voz en navegadores de voz, con formularios, menús, gramáticas, recogida de entradas y síntesis de voz. Se integra con telefonía mediante una plataforma de voz y con aplicaciones mediante servidores. La separación de diálogo y lógica de negocio facilita mantenimiento, pero su uso actual convive con estándares y soluciones de voz más recientes.
