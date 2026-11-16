# Tema 47: Planificación física y dimensionamiento de un centro de procesamiento de datos

Planificación física y dimensionamiento de un centro de procesamiento de datos. Virtualización y consolidación de servidores y recursos. Vulnerabilidades, riesgo y protección. Sistemas de alta disponibilidad y balanceo de carga. Recuperación ante desastres.

## Planificación física y dimensionamiento de un centro de procesamiento de datos

### Planificación y dimensionamiento del CPD

Un centro de procesamiento de datos se diseña según criticidad, capacidad actual y crecimiento: emplazamiento, estructura, racks, cableado, energía, climatización, seguridad física, detección y extinción de incendios, monitorización y mantenimiento. Se planifica distribución de cargas, pasillos fríos/calientes, flujo de aire, contención, puesta a tierra y acceso. UPS cubre interrupciones breves y permite transición a generador; autonomía, pruebas y combustible deben dimensionarse.

Se calculan potencia IT, pérdidas, refrigeración, espacio, conectividad y densidad por rack. La eficiencia energética puede expresarse con PUE, relación entre energía total del centro y energía del equipamiento IT; un valor próximo a 1 indica menor sobrecoste, pero debe interpretarse con clima y diseño.

### Virtualización, protección y continuidad

Hipervisores consolidan máquinas virtuales; contenedores comparten núcleo. Consolidación mejora uso y agilidad, pero genera concentración de riesgo y contención. Se segmentan redes, restringe gestión, protege hipervisores, actualiza firmware y separa copias del entorno.

Alta disponibilidad usa redundancia, clústeres, replicación y balanceo, eliminando puntos únicos de fallo según objetivo. N+1 aporta un elemento redundante adicional; redundancia no equivale automáticamente a continuidad probada. Plan de recuperación ante desastres define servicios prioritarios, RTO/RPO, sitio alternativo, dependencias, comunicaciones, pruebas y retorno. Se analizan amenazas físicas y cibernéticas, riesgo residual y medidas de protección.
