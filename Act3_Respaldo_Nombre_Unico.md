# Act 3 - RETO: Respaldo Nombre Único

---

## Portada

| Campo          | Detalle                                          |
|----------------|--------------------------------------------------|
| **Institución**| Universidad Tecnológica Metropolitana            |
| **Alumno**     | Uziel Isaac Pech Balam                           |
| **Actividad**  | Act 3 - RETO: Respaldo Nombre Único              |
| **Fecha**      | 12 de marzo de 2026                              |

---

## Introducción

Estimado profesor:

La presente actividad tiene como objetivo la implementación de un proceso automatizado de respaldo de base de datos con nomenclatura única, cumpliendo con los requisitos de la rúbrica establecida para la materia.

Dado que mi entorno de desarrollo es **macOS** y el motor de base de datos utilizado es **PostgreSQL** (alojado en Supabase), se realizó una adaptación técnica justificada de la rúbrica original, la cual fue diseñada para **SQL Server Agent** en entornos Windows.

La adaptación consiste en los siguientes cambios equivalentes:

| Elemento original (SQL Server / Windows) | Adaptación utilizada (macOS / PostgreSQL) |
|------------------------------------------|-------------------------------------------|
| SQL Server Agent (trabajo programado)    | `crontab` — programador de tareas de Unix |
| T-SQL + `BACKUP DATABASE`                | Script de Bash + `pg_dump`                |
| Nombre único con `GETDATE()`             | Nombre único con `date +%Y%m%d%H%M%S`    |
| Extensión `.bak`                         | Extensión `.sql`                          |

El objetivo central de la rúbrica — **automatizar un respaldo con nombre único basado en fecha y hora** — se cumple en su totalidad mediante esta adaptación, manteniendo la misma lógica, propósito y resultado esperado.

---

## Desarrollo

### 1. Script de Bash: `respaldo_vogue.sh`

A continuación se documenta y explica el script creado para automatizar el respaldo de la base de datos **VoguePerfum** alojada en Supabase.

#### Código completo del script

```bash
#!/bin/bash
# =============================================================================
# respaldo_vogue.sh
# Script de respaldo automatizado para la base de datos PostgreSQL en Supabase
# =============================================================================

# HOST: Dirección del servidor de base de datos en Supabase
HOST="db.csyzgajyfzjlwyxdudyj.supabase.co"

# PORT: Puerto estándar de PostgreSQL
PORT="5432"

# DBNAME: Nombre de la base de datos a respaldar
DBNAME="postgres"

# DBUSER: Usuario de la base de datos
DBUSER="postgres"

# BACKUP_DIR: Carpeta donde se almacenarán los archivos de respaldo
BACKUP_DIR="$HOME/respaldos_vogue"

# TIMESTAMP: Fecha y hora actual en formato YYYYMMDDHHMMSS
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

# FILENAME: Nombre del archivo con nomenclatura requerida
FILENAME="VoguePerfum_${TIMESTAMP}.sql"

# FILEPATH: Ruta completa del archivo de respaldo
FILEPATH="${BACKUP_DIR}/${FILENAME}"

mkdir -p "$BACKUP_DIR"

export PGPASSWORD="TU_CONTRASEÑA_AQUI"

pg_dump \
    -h "$HOST" \
    -p "$PORT" \
    -U "$DBUSER" \
    -d "$DBNAME" \
    --no-password \
    > "$FILEPATH"

EXIT_CODE=$?
unset PGPASSWORD

if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Respaldo completado: $FILENAME"
else
    echo "❌ Error en el respaldo (código: $EXIT_CODE)"
    rm -f "$FILEPATH"
fi
```

---

#### Explicación detallada de variables y comandos

**Variables de conexión**

- `HOST`: Dirección DNS del servidor PostgreSQL en Supabase. Es el punto de conexión remoto al que `pg_dump` se conectará para extraer la base de datos.
- `PORT`: Puerto `5432`, que es el puerto estándar de PostgreSQL. Supabase lo usa por defecto.
- `DBNAME`: El nombre interno de la base de datos. En Supabase, la base de datos se llama `postgres` por convención.
- `DBUSER`: Usuario con el que se autentica la conexión. En Supabase es `postgres` por defecto.

---

**Variable `TIMESTAMP` y el comando `date`**

```bash
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
```

El comando `date` con el parámetro `+"%Y%m%d%H%M%S"` genera una cadena de texto con la fecha y hora exacta del momento en que se ejecuta el script. La tabla siguiente explica cada especificador de formato:

| Especificador | Significado       | Ejemplo |
|---------------|-------------------|---------|
| `%Y`          | Año con 4 dígitos | `2026`  |
| `%m`          | Mes (01–12)       | `03`    |
| `%d`          | Día (01–31)       | `12`    |
| `%H`          | Hora (00–23)      | `10`    |
| `%M`          | Minutos (00–59)   | `30`    |
| `%S`          | Segundos (00–59)  | `45`    |

**Ejemplo de salida:** `20260312103045`

Esto garantiza que cada ejecución del script produce un nombre de archivo distinto e irrepetible, incluso si se ejecuta en el mismo día.

---

**Variable `FILENAME` — Nomenclatura requerida**

```bash
FILENAME="VoguePerfum_${TIMESTAMP}.sql"
```

Produce el nombre de archivo siguiendo estrictamente el formato solicitado:

```
VoguePerfum_20260312103045.sql
```

Donde `VoguePerfum` es el nombre de la base de datos y `20260312103045` es el timestamp generado.

---

**El comando `pg_dump` y sus parámetros**

```bash
pg_dump \
    -h "$HOST" \
    -p "$PORT" \
    -U "$DBUSER" \
    -d "$DBNAME" \
    --no-password \
    > "$FILEPATH"
```

`pg_dump` es la herramienta oficial de PostgreSQL para exportar una base de datos. Sus parámetros son:

| Parámetro       | Descripción                                           |
|-----------------|-------------------------------------------------------|
| `-h $HOST`      | Dirección del servidor remoto (host de Supabase)      |
| `-p $PORT`      | Puerto de conexión (`5432`)                           |
| `-U $DBUSER`    | Usuario de autenticación (`postgres`)                 |
| `-d $DBNAME`    | Base de datos a respaldar (`postgres`)                |
| `--no-password` | Suprime el prompt interactivo de contraseña           |

---

**Redirección del archivo con `>`**

```bash
pg_dump [...] > "$FILEPATH"
```

El operador `>` en Bash redirige la **salida estándar (stdout)** del comando `pg_dump` hacia un archivo. `pg_dump` genera instrucciones SQL (como `CREATE TABLE`, `INSERT INTO`, etc.) y en lugar de mostrarlas en pantalla, el operador `>` las escribe directamente en el archivo `.sql` indicado por `$FILEPATH`. Si el archivo no existe, lo crea; si ya existe, lo sobreescribe.

---

### 2. Capturas de pantalla requeridas

#### 2.1 Edición del script en el IDE

> [INSERTAR CAPTURA AQUÍ]
>
> *Descripción de la captura: Mostrar el archivo `respaldo_vogue.sh` abierto en el editor de código (por ejemplo, Visual Studio Code), con el código completo visible y el nombre del archivo en la barra superior.*

---

#### 2.2 Configuración del trabajo automatizado con `crontab`

Para programar la ejecución automática del script, se utiliza `crontab`, el programador de tareas estándar en sistemas Unix/macOS.

**Comando para editar el crontab:**

```bash
crontab -e
```

**Línea agregada al crontab para ejecutar el respaldo cada día a las 2:00 AM:**

```cron
0 2 * * * /bin/bash /Users/uzielcastillo/Development/VoguePerfum/respaldo_vogue.sh >> $HOME/respaldos_vogue/respaldo.log 2>&1
```

Explicación de la sintaxis cron `0 2 * * *`:

| Campo  | Valor | Significado                   |
|--------|-------|-------------------------------|
| Minuto | `0`   | En el minuto 0                |
| Hora   | `2`   | A las 2:00 AM                 |
| Día    | `*`   | Cualquier día del mes         |
| Mes    | `*`   | Cualquier mes                 |
| Día semana | `*` | Cualquier día de la semana |

> [INSERTAR CAPTURA AQUÍ]
>
> *Descripción de la captura: Mostrar la terminal con el editor de crontab abierto (`crontab -e`) y la línea de programación ingresada.*

---

#### 2.3 Verificación del archivo `.sql` generado

Después de ejecutar el script manualmente (o esperar la ejecución automática), se puede verificar el archivo generado en la carpeta de destino con el siguiente comando:

```bash
ls -lh ~/respaldos_vogue/
```

> [INSERTAR CAPTURA AQUÍ]
>
> *Descripción de la captura: Mostrar la terminal con la salida del comando `ls -lh ~/respaldos_vogue/`, donde se visualice el archivo `.sql` con el nombre único generado (ej: `VoguePerfum_20260312103045.sql`) y su tamaño en disco.*

---

## Conclusión

Mediante este ejercicio se logró implementar exitosamente un proceso de respaldo automatizado para la base de datos PostgreSQL del proyecto **VoguePerfum**, alojada en Supabase. Se utilizó el script de Bash `respaldo_vogue.sh` junto con la herramienta `pg_dump` para extraer el contenido completo de la base de datos, generando un archivo `.sql` con nomenclatura única basada en la fecha y hora de ejecución (`YYYYMMDDHHMMSS`).

La automatización se configuró mediante `crontab`, el equivalente funcional de SQL Server Agent en entornos macOS/Linux, cumpliendo con el objetivo central de la actividad: **garantizar respaldos periódicos con nombre irrepetible para evitar sobreescritura y facilitar la trazabilidad**.
