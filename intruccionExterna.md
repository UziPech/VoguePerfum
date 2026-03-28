Escribe un script de Bash (respaldo_vogue.sh) para macOS que automatice el respaldo de una base de datos PostgreSQL alojada en Supabase. El script debe usar la herramienta pg_dump y generar un archivo .sql siguiendo estrictamente la nomenclatura NombreBaseDeDatos_YYYYMMDDHHMMSS.sql. Incluye comentarios claros en español explicando la declaración de variables, cómo se usa el comando date para formatear la hora y cómo funciona la redirección del archivo.

Redacta un documento formal en formato Markdown para una tarea escolar de la Universidad Tecnológica Metropolitana.

Portada:

Alumno: Uziel Isaac Pech Balam

Actividad: Act 3 - RETO: Respaldo Nombre Único

Desarrollo:

Escribe una introducción formal para el profesor. Explica que, dado que el entorno de desarrollo es macOS y la base de datos es PostgreSQL, se adaptó la rúbrica (originalmente para SQL Server Agent) utilizando un script de Bash y el programador de tareas crontab del sistema operativo, cumpliendo con el mismo objetivo de automatización y nomenclatura.

Documenta el script generado en el paso anterior. Explica detalladamente qué hace cada variable, el comando pg_dump y los parámetros de fecha.

Deja marcadores visuales claros como [INSERTAR CAPTURA AQUÍ] en los siguientes pasos:

Edición del script en el IDE.

Configuración del trabajo automatizado en la terminal usando crontab -e.

Verificación del archivo .sql generado en la carpeta de destino con el nombre único.