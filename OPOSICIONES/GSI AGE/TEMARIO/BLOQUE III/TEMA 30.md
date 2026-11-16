# Tema 30: Modelado de datos y metodologías

Modelado de datos y metodologías. Diseño de bases de datos. El modelo lógico relacional. Normalización. Diseño lógico y físico. Problemas de concurrencia de acceso. Mecanismos de resolución de conflictos.

## Modelado de datos y metodologías

### Modelado y diseño de bases de datos

El modelo conceptual describe entidades, atributos, relaciones y reglas de negocio, habitualmente con entidad-relación. El modelo lógico transforma ese esquema al paradigma elegido; el modelo físico concreta almacenamiento, índices, particiones y parámetros. El diseño debe reflejar semántica y restricciones sin duplicar datos innecesariamente. Claves candidatas y primarias identifican filas; claves foráneas mantienen integridad referencial.

### Modelo relacional y normalización

Una relación es un conjunto de tuplas; SQL opera en tablas con valores potencialmente nulos. Las restricciones incluyen NOT NULL, UNIQUE, CHECK, PRIMARY KEY y FOREIGN KEY. Primera forma normal requiere valores atómicos; segunda elimina dependencias parciales de una clave compuesta; tercera elimina dependencias transitivas de atributos no clave; BCNF exige que todo determinante sea superclave. Normalizar reduce redundancia y anomalías de inserción, actualización y borrado. La desnormalización puede mejorar consultas si se justifica y controla consistencia.

### Concurrencia y resolución

Una transacción debe preservar ACID. Interferencias concurrentes pueden causar actualizaciones perdidas, lecturas sucias, no repetibles y fantasmas. El control pesimista usa bloqueos y puede producir interbloqueos; el optimista verifica conflictos al confirmar; MVCC mantiene versiones para lecturas concurrentes. Los niveles de aislamiento equilibran consistencia y paralelismo. Registro de transacciones y recuperación permiten rollback y redo. En sistemas distribuidos, una transacción global exige compromisos sobre disponibilidad y consistencia; se usan patrones como saga cuando no hay transacción ACID única.
