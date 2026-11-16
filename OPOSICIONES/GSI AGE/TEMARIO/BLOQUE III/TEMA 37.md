# Tema 37: La plataforma .NET

La plataforma .NET. Modelo de programación. Servicios. Herramientas. Persistencia. Seguridad.

## La plataforma .NET

### Modelo de programación y servicios

.NET es una plataforma para construir aplicaciones, con runtime (CLR), bibliotecas base y lenguajes como C#, F# y Visual Basic. El runtime administra ejecución, tipos, excepciones, memoria y recolección de basura; el código se compila normalmente a CIL y se ejecuta mediante runtime. .NET moderno es multiplataforma; .NET Framework es una plataforma anterior principalmente Windows y no debe confundirse con .NET actual.

ASP.NET Core construye servicios web y APIs; .NET ofrece inyección de dependencias, configuración, logging, tareas asíncronas y herramientas de línea de comandos. NuGet gestiona paquetes; SDK y MSBuild construyen proyectos. El ecosistema facilita pruebas, contenedores y despliegue en nube o servidores propios.

### Persistencia y seguridad

Entity Framework Core es un ORM para mapear objetos a bases relacionales, generar consultas LINQ y gestionar migraciones; también pueden usarse ADO.NET u otros proveedores. Se deben controlar consultas, transacciones, concurrencia y credenciales.

La seguridad incluye identidad y autorización basadas en políticas, validación de entrada, protección de secretos, actualizaciones, TLS, manejo seguro de errores y dependencias confiables. Autenticación externa puede integrarse mediante OpenID Connect/OAuth 2.0; no se deben almacenar contraseñas en texto claro. La configuración por entorno y el mínimo privilegio son claves. La elección de versiones con soporte, pruebas automatizadas y análisis de paquetes forman parte del mantenimiento.
