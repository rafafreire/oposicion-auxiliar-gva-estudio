# Cuestionarios GSI en JSON

Los `EXAMEN GSI AAAA.md` son las fuentes de preguntas recibidas. El script `generar_json_examenes.py` genera junto a ellas `EXAMEN_GSI_AAAA.json`, usando el mismo esquema de pregunta y opciones que los exámenes de AUX ADM GVA.

Las plantillas definitivas del INAP están disponibles para 2008, 2011, 2013, 2018, 2019, 2022 y 2024; sus respuestas se incorporan al JSON. Para 2008, 2011 y 2013, el cuestionario reúne tres bloques: las preguntas 1–50 corresponden a I y II, 51–100 al bloque III y desde la 101 al bloque IV. El resto de preguntas se conserva para practicar, con `respuesta_correcta: null` y sin puntuación automática, porque las fuentes no incluyen una plantilla verificable.

`PLANTILLAS_OFICIALES_GSI.json` guarda las claves extraídas de las plantillas oficiales y sus fuentes. Para regenerar los cuestionarios, ejecuta:

```sh
python generar_json_examenes.py
```
