# Tema 41: Minería de datos

Minería de datos. Aplicación a la resolución de problemas de gestión. Tecnología y algoritmos. Procesamiento analítico en línea (OLAP). Big data. Entornos Hadoop o similares. Bases de datos NoSQL.

## Minería de datos

### Minería de datos y gestión

La minería de datos busca patrones útiles en conjuntos grandes mediante el proceso KDD: selección, limpieza, transformación, minería e interpretación. CRISP-DM organiza el trabajo en comprensión del negocio, comprensión de datos, preparación, modelado, evaluación y despliegue. Aplicaciones incluyen segmentación, predicción de demanda, detección de anomalías y apoyo a decisiones. Los resultados deben ser accionables y validados por dominio.

### Métodos, OLAP y Big Data

Clasificación predice clases; regresión valores; clustering agrupa sin etiquetas; asociación descubre coocurrencias; detección de anomalías identifica casos atípicos. Se separan datos de entrenamiento, validación y prueba para medir generalización; métricas dependen del problema y el coste de errores. Deben controlarse sesgo, privacidad, deriva y explicabilidad.

OLAP analiza datos multidimensionales mediante dimensiones y medidas: roll-up agrega, drill-down detalla, slice fija una dimensión y dice selecciona subcubos. Big Data se describe por volumen, velocidad, variedad y, a menudo, veracidad y valor; requiere ingestión distribuida, gobierno y calidad.

### Hadoop y NoSQL

Hadoop aporta HDFS para almacenamiento distribuido, YARN para recursos y MapReduce para procesamiento por lotes. Ecosistemas actuales pueden incluir motores de procesamiento y almacenamiento en nube. NoSQL comprende almacenes clave-valor, documentos, columnas y grafos; prioriza modelos flexibles y escalado distribuido según caso. CAP explica compromisos bajo particiones; no significa que todo NoSQL renuncie siempre a consistencia. La selección depende de consultas, transacciones, volumen, latencia, consistencia y operación.
