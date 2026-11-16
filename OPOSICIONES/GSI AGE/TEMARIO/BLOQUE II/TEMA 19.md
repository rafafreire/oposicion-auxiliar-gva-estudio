# Tema 19: Lenguajes de marca o etiqueta

Lenguajes de marca o etiqueta. Características y funcionalidades. SGML, HTML, XML y sus derivaciones. Lenguajes de script.

## Lenguajes de marca o etiqueta

### Lenguajes de marcado

Un lenguaje de marcado añade etiquetas y estructura a un documento. SGML es un metalenguaje del que derivan lenguajes como HTML y XML. HTML define estructura semántica de páginas y formularios; CSS separa presentación. El marcado semántico mejora accesibilidad, indexación y mantenimiento; HTML debe validarse y usarse conforme a su versión y especificación.

XML permite definir vocabularios estructurados y extensibles, con etiquetas anidadas, atributos y reglas bien formadas. DTD o XML Schema (XSD) pueden validar estructura y tipos; espacios de nombres evitan colisiones. XPath selecciona nodos, XSLT transforma documentos y XQuery consulta colecciones. JSON es un formato de intercambio ligero, no un lenguaje de marcado.

### Lenguajes de script

Los scripts automatizan tareas o aportan comportamiento a aplicaciones; pueden ejecutarse en navegador, servidor o sistema operativo. JavaScript es central en el navegador; Python, PHP, PowerShell y Bash son ejemplos para automatización o servidor. Un lenguaje de scripting puede interpretarse o compilarse a código intermedio.

Al procesar marcado no se debe confiar en entradas: validar esquemas, escapar contenido según contexto y evitar XXE en parsers XML y XSS en HTML. La separación entre contenido, estilo y lógica facilita pruebas, accesibilidad y seguridad.
