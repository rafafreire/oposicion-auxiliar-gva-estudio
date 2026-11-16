# Tema 42: Administración del Sistema operativo y software de base

Administración del Sistema operativo y software de base.

## Administración del Sistema operativo y software de base

### Administración del sistema operativo

Administrar un SO consiste en mantener un entorno estable, seguro y disponible. Tareas: instalación y configuración base, inventario, cuentas y grupos, privilegios, servicios, parches, almacenamiento, red, registros, copias, cuotas y monitorización. Se parte de una configuración segura conocida, se minimizan servicios y puertos y se separan cuentas administrativas de las de uso diario. Los cambios se documentan y prueban antes de producción.

En Windows se administran dominios y políticas mediante herramientas de gestión, PowerShell, servicios, registro, NTFS y Event Viewer. En Linux/Unix se usan shell, systemd u otros init, permisos y ACL, sudo, paquetes y logs; la distribución determina herramientas. La gestión remota debe cifrarse y auditarse.

### Software de base y operación

El software de base incluye firmware, hipervisores, controladores, middleware, runtimes, servidores y utilidades. Se controlan versiones, licencias, soporte y vulnerabilidades; actualizaciones se despliegan escalonadamente con rollback. Automatización mediante scripts e infraestructura como código reduce variación, pero requiere revisión, secretos protegidos y ejecución idempotente. La observabilidad combina métricas, eventos y registros. Los procedimientos de arranque, parada, recuperación y escalado documentan dependencias y responsables.
