# Tema 45: Gestión de la configuración

Gestión de la configuración. Control de cambios y de versiones. Técnicas y herramientas de operación automática. Evaluación y monitorización del rendimiento de sistemas, infraestructuras y servicios. Gestión de la capacidad. Herramientas y técnicas utilizables.

## Gestión de la configuración

### Configuración, cambios y versiones

La gestión de configuración identifica elementos (CIs), relaciones, versiones y estados para conocer el servicio y reproducir entornos. Una CMDB debe mantener datos útiles y fiables, no ser inventario inerte. La gestión de cambios evalúa riesgo, impacto, pruebas, aprobación, calendario, comunicación y reversión; cambios estándar preautorizados siguen procedimientos controlados. Versionado y repositorios conservan historial y permiten comparar o revertir configuraciones.

### Automatización y monitorización

La operación automática usa scripts, gestores de configuración e infraestructura como código para provisionar y mantener sistemas repetibles. Control de versiones, revisión por pares, pruebas, secretos fuera del código e idempotencia limitan errores. Runbooks describen tareas frecuentes y escalado.

Monitorización recopila métricas de disponibilidad, latencia, errores, tráfico, CPU, memoria, almacenamiento y servicios. Logs explican eventos; trazas distribuidas siguen solicitudes entre componentes. Alertas requieren umbrales vinculados a impacto y acciones. SLI mide servicio, SLO fija objetivo y SLA formaliza compromiso. La gestión de eventos correlaciona señales y filtra ruido.

### Rendimiento y capacidad

Evaluar rendimiento identifica cuellos de botella mediante línea base, carga representativa, pruebas y análisis de tendencia. Capacidad planifica recursos actuales y futuros, considerando estacionalidad, crecimiento y límites. Escalado vertical u horizontal, caching, balanceo y optimización deben responder a medidas. Se documentan supuestos, margen, coste y umbrales de actuación; la monitorización continua verifica que las previsiones se cumplen.
