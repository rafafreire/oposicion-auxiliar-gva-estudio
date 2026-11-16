# Tema 46: Almacenamiento de datos

Almacenamiento de datos: arquitectura, tipos, componentes, protocolos, gestión y administración. Virtualización del almacenamiento.

## Almacenamiento de datos

### Arquitectura y tipos de almacenamiento

DAS conecta discos directamente al servidor; NAS ofrece archivos mediante red; SAN proporciona almacenamiento de bloques a servidores a través de una red dedicada o lógica. Almacenamiento de bloques es habitual para bases de datos y máquinas virtuales; de archivos, para carpetas compartidas; de objetos, para contenido masivo con metadatos y acceso por API. Protocolos frecuentes incluyen SATA/SAS, Fibre Channel, iSCSI, NFS, SMB y S3-compatible.

RAID combina discos para disponibilidad o rendimiento, pero no sustituye a copias de seguridad. RAID 1 replica; RAID 5/6 distribuyen paridad; RAID 10 combina espejo y distribución. Deben considerarse fallos múltiples, reconstrucción y latencia. Multipath ofrece rutas redundantes; zoning y masking controlan acceso SAN.

### Gestión, administración y virtualización

La administración controla capacidad, rendimiento, disponibilidad, firmware, redundancia, snapshots, replicación, cifrado, cuotas, alertas y ciclo de vida de soportes. Thin provisioning asigna capacidad bajo demanda, pero puede sobreaprovisionar y requiere vigilancia. Tiering sitúa datos según rendimiento/coste. Deduplicación y compresión reducen espacio con costes de CPU.

La virtualización abstrae volúmenes lógicos de discos físicos, facilita movilidad, expansión y gestión central, pero introduce dependencias de controladoras y red. Se evalúan IOPS, throughput, latencia, resiliencia, crecimiento y restauración. Snapshots son puntos de recuperación dependientes del sistema y no equivalen a copias independientes.
