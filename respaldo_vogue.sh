#!/bin/bash
# =============================================================================
# respaldo_vogue.sh
# Script de respaldo automatizado para la base de datos PostgreSQL en Supabase
# Proyecto: VoguePerfum
# Alumno:   Uziel Isaac Pech Balam
# Actividad: Act 3 - RETO: Respaldo Nombre Único
# =============================================================================

# -----------------------------------------------------------------------------
# DECLARACIÓN DE VARIABLES
# -----------------------------------------------------------------------------

# HOST: Dirección del servidor de base de datos en Supabase
HOST="db.csyzgajyfzjlwyxdudyj.supabase.co"

# PORT: Puerto estándar de PostgreSQL
PORT="5432"

# DBNAME: Nombre de la base de datos a respaldar
DBNAME="postgres"

# DBUSER: Usuario de la base de datos (por defecto en Supabase es "postgres")
DBUSER="postgres"

# BACKUP_DIR: Carpeta donde se guardarán los archivos de respaldo.
# Si no existe, el script la creará automáticamente.
BACKUP_DIR="$HOME/respaldos_vogue"

# TIMESTAMP: Captura la fecha y hora actual con el formato YYYYMMDDHHMMSS
# El comando `date` con el formato `+%Y%m%d%H%M%S` produce una cadena como:
#   20260312103045  →  2026 (año) 03 (mes) 12 (día) 10 (hora) 30 (min) 45 (seg)
# Esto garantiza que cada respaldo tenga un nombre único e irrepetible.
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

# FILENAME: Nombre final del archivo .sql siguiendo la nomenclatura requerida:
#   NombreBaseDeDatos_YYYYMMDDHHMMSS.sql
FILENAME="VoguePerfum_${TIMESTAMP}.sql"

# FILEPATH: Ruta completa del archivo de respaldo
FILEPATH="${BACKUP_DIR}/${FILENAME}"

# -----------------------------------------------------------------------------
# PREPARACIÓN DEL ENTORNO
# -----------------------------------------------------------------------------

# Crear el directorio de respaldos si no existe (-p evita error si ya existe)
mkdir -p "$BACKUP_DIR"

echo "========================================"
echo "  Iniciando respaldo de VoguePerfum"
echo "  Fecha y hora: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================"
echo "Destino: $FILEPATH"
echo ""

# -----------------------------------------------------------------------------
# EJECUCIÓN DEL RESPALDO
# El comando pg_dump extrae el esquema y los datos de la BD en formato SQL.
#
# Parámetros utilizados:
#   -h $HOST   → Especifica el host del servidor de base de datos
#   -p $PORT   → Especifica el puerto (5432 por defecto en PostgreSQL)
#   -U $DBUSER → Usuario para autenticarse en la base de datos
#   -d $DBNAME → Nombre de la base de datos a respaldar
#   --no-password → No solicita contraseña interactiva (usa PGPASSWORD)
#
# La redirección > "$FILEPATH" toma toda la salida estándar (stdout) del
# comando pg_dump (que es el contenido SQL del respaldo) y la escribe
# directamente en el archivo indicado por $FILEPATH.
# -----------------------------------------------------------------------------

# La variable de entorno PGPASSWORD evita la solicitud interactiva de contraseña.
# IMPORTANTE: Reemplaza "TU_CONTRASEÑA_AQUI" con tu contraseña real de Supabase
# (la encontrarás en Supabase → Project Settings → Database → Database password)
export PGPASSWORD="suMD8dRnBuaord0y"

pg_dump \
    -h "$HOST" \
    -p "$PORT" \
    -U "$DBUSER" \
    -d "$DBNAME" \
    --no-password \
    > "$FILEPATH"

# Captura el código de salida del comando anterior (0 = éxito, otro = error)
EXIT_CODE=$?

# Limpia la variable de contraseña de la memoria por seguridad
unset PGPASSWORD

# -----------------------------------------------------------------------------
# VERIFICACIÓN DEL RESULTADO
# $? devuelve 0 si el comando anterior fue exitoso, o un número distinto si falló
# -----------------------------------------------------------------------------
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Respaldo completado exitosamente."
    echo "   Archivo generado: $FILENAME"
    echo "   Tamaño: $(du -sh "$FILEPATH" | cut -f1)"
else
    echo "❌ ERROR: El respaldo falló con código de salida $EXIT_CODE."
    echo "   Verifica tu conexión a Supabase y la contraseña configurada."
    # Elimina el archivo vacío generado en caso de error
    rm -f "$FILEPATH"
fi

echo "========================================"
