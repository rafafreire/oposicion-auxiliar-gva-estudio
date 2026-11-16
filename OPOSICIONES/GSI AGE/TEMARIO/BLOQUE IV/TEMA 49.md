# Tema 49: Redes locales

Redes locales. Tipología, protocolos y técnicas de transmisión. Métodos de acceso. Dispositivos de interconexión. Seguridad. Normativa Reguladora.

## Redes locales

### Topologías, Ethernet y acceso al medio

Una LAN conecta equipos en ámbito limitado. Topologías físicas incluyen estrella, bus y anillo; la lógica puede diferir. Ethernet (IEEE 802.3) usa tramas con direcciones MAC; switches aprenden MAC por puerto y reenvían tramas, separando dominios de colisión. VLAN (802.1Q) segmenta dominios de difusión; enlaces troncales transportan varias VLAN. STP evita bucles de capa 2. Wi-Fi se trata específicamente en el tema de redes inalámbricas.

Ethernet moderno es conmutado y full-duplex; el CSMA/CD histórico se asocia a Ethernet compartido half-duplex, no a enlaces conmutados modernos. CSMA/CA reduce colisiones en redes inalámbricas.

### Interconexión, seguridad y normativa

Hub repite señales; bridge/switch conecta segmentos de capa 2; router enruta entre redes IP; punto de acceso enlaza clientes Wi-Fi; firewall aplica reglas entre zonas. Segmentación, ACL, 802.1X, port security, actualización y monitorización reducen riesgo. Se protegen planos de administración y se limita acceso físico.

El diseño define direccionamiento, VLAN, redundancia, capacidad, QoS y gestión. Normas habituales: IEEE 802.3 (Ethernet), 802.1Q (VLAN), 802.1D/802.1w (bridging/STP y evolución), TIA-568 e ISO/IEC 11801 para cableado. Se aplican además ENS y normativa de protección de datos según entorno.
