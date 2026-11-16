# Tema 15: La arquitectura ANSI/SPARC

La arquitectura ANSI/SPARC. Sistemas de gestión de bases de datos relacionales. El lenguaje SQL. Normas y estándares para la interoperabilidad entre gestores de bases de datos relacionales.

## La arquitectura ANSI/SPARC

### Arquitectura ANSI/SPARC

La arquitectura de tres esquemas separa: nivel externo (vistas de usuarios y aplicaciones), conceptual (modelo lógico global) e interno (organización física, índices y almacenamiento). La correspondencia entre niveles permite independencia de datos: lógica, si cambia el esquema conceptual sin alterar vistas; física, si cambia el almacenamiento sin modificar el esquema lógico.

### Bases de datos relacionales

El modelo relacional representa datos en relaciones (tablas), filas (tuplas) y columnas (atributos). Una clave identifica tuplas; las claves foráneas expresan relaciones. La integridad de entidad impide claves primarias nulas y la referencial mantiene coherencia entre relaciones. Un SGBD ofrece definición, consulta, actualización, control de concurrencia, seguridad, recuperación y transacciones.

### SQL e interoperabilidad

SQL incluye DDL para definir esquemas, DML para consultar y modificar, DCL para permisos y TCL para transacciones. SELECT combina proyección, selección, joins, agrupación y subconsultas. Las restricciones, vistas, índices y procedimientos almacenados complementan el modelo. Las transacciones deben respetar ACID: atomicidad, consistencia, aislamiento y durabilidad.

La interoperabilidad exige acordar tipos, codificación, identificadores, fechas, semántica, niveles de aislamiento y mecanismos de conexión. SQL está normalizado por ISO/IEC 9075, aunque los productos incorporan extensiones. ODBC y JDBC ofrecen APIs de acceso; drivers, conectores y formatos de intercambio facilitan integración, pero no garantizan por sí solos equivalencia semántica ni portabilidad de SQL específico del fabricante.
