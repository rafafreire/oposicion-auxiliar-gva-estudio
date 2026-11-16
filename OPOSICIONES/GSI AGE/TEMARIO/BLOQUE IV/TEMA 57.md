# Tema 57: Sistemas de videoconferencia

Sistemas de videoconferencia. Protocolos. Dimensionamiento y calidad de servicio en las comunicaciones y acondicionamiento de salas y equipos.

## Sistemas de videoconferencia

### Protocolos y componentes

La videoconferencia integra captura, codificación, señalización, transporte, decodificación y reproducción de audio y vídeo. SIP establece sesiones; H.323 es una familia histórica de protocolos de videoconferencia; SDP negocia medios y RTP/RTCP transporta paquetes y reporta estadísticas. Códecs como H.264/H.265 para vídeo y Opus o G.711 para audio comprimen flujos; interoperabilidad depende de perfiles y negociación.

Una MCU mezcla o distribuye medios centralmente; una SFU reenvía flujos seleccionados a participantes, reduciendo procesamiento central y permitiendo adaptación. Sistemas incluyen cámaras, micrófonos, altavoces, DSP, códecs, pantallas y plataformas de reunión.

### Dimensionamiento, QoS y salas

El diseño estima participantes simultáneos, resolución, cuadros por segundo, códecs, ancho de banda por flujo y sobrecarga. Se reserva capacidad y se prueba subida y bajada. Latencia, jitter y pérdida degradan especialmente voz; QoS clasifica y prioriza tráfico, pero no arregla enlaces saturados. Redundancia, Wi-Fi o cable, NAT traversal, firewall y pruebas de interoperabilidad se consideran desde diseño.

La sala requiere acústica adecuada, iluminación frontal, cámaras con encuadre correcto, micrófonos que cubran asistentes y tratamiento de eco y ruido. Accesibilidad incluye subtítulos, interpretación y participación remota. Se gestionan actualizaciones, privacidad, consentimiento de grabación, seguridad de reuniones y soporte al usuario.
