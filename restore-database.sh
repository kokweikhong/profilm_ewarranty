#!/bin/bash

# ProFilm eWarranty - Database Restore Script
# This script restores a PostgreSQL database from a backup

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Configuration
CONTAINER_NAME="profilm_postgres"
DB_USER="profilm"
DB_NAME="profilm_ewarranty"
BACKUP_DIR="/opt/backups/profilm_ewarranty"

# Parse command line arguments
BACKUP_FILE=""
SKIP_CONFIRMATION=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --file)
            BACKUP_FILE="$2"
            shift 2
            ;;
        --latest)
            BACKUP_FILE="latest"
            shift
            ;;
        --backup-dir)
            BACKUP_DIR="$2"
            shift 2
            ;;
        --yes|-y)
            SKIP_CONFIRMATION=true
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --file FILE          Specify backup file to restore"
            echo "  --latest             Restore from the latest backup"
            echo "  --backup-dir DIR     Specify custom backup directory (default: /opt/backups/profilm_ewarranty)"
            echo "  --yes, -y            Skip confirmation prompt"
            echo "  --help               Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 --latest"
            echo "  $0 --file /path/to/backup.sql.gz"
            echo "  $0 --file backup_20241225_120000.sql.gz"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

print_info "=============================================="
print_info "   ProFilm eWarranty Database Restore         "
print_info "=============================================="
echo ""

# Check if Docker is running
if ! docker ps &> /dev/null; then
    print_error "Docker is not running or you don't have permission to access it."
    exit 1
fi

# Check if PostgreSQL container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    print_error "PostgreSQL container '${CONTAINER_NAME}' is not running."
    print_error "Please start the container first: docker-compose up -d postgres"
    exit 1
fi

print_info "PostgreSQL container is running."

# Determine backup file to restore
if [ "$BACKUP_FILE" = "latest" ]; then
    # Find the latest backup
    LATEST_SQL_GZ=$(find "$BACKUP_DIR" -name "profilm_ewarranty_backup_*.sql.gz" -type f 2>/dev/null | sort -r | head -n 1)
    LATEST_SQL=$(find "$BACKUP_DIR" -name "profilm_ewarranty_backup_*.sql" -type f 2>/dev/null | sort -r | head -n 1)
    
    if [ -n "$LATEST_SQL_GZ" ] && [ -n "$LATEST_SQL" ]; then
        # Compare timestamps, use the most recent one
        if [ "$LATEST_SQL_GZ" -nt "$LATEST_SQL" ]; then
            BACKUP_FILE="$LATEST_SQL_GZ"
        else
            BACKUP_FILE="$LATEST_SQL"
        fi
    elif [ -n "$LATEST_SQL_GZ" ]; then
        BACKUP_FILE="$LATEST_SQL_GZ"
    elif [ -n "$LATEST_SQL" ]; then
        BACKUP_FILE="$LATEST_SQL"
    else
        print_error "No backup files found in $BACKUP_DIR"
        exit 1
    fi
    
    print_info "Using latest backup: $(basename "$BACKUP_FILE")"
elif [ -z "$BACKUP_FILE" ]; then
    # No file specified, list available backups
    print_info "Available backups in $BACKUP_DIR:"
    echo ""
    
    BACKUPS=($(find "$BACKUP_DIR" -name "profilm_ewarranty_backup_*" -type f 2>/dev/null | sort -r))
    
    if [ ${#BACKUPS[@]} -eq 0 ]; then
        print_error "No backup files found in $BACKUP_DIR"
        exit 1
    fi
    
    for i in "${!BACKUPS[@]}"; do
        BACKUP_NAME=$(basename "${BACKUPS[$i]}")
        BACKUP_SIZE=$(du -h "${BACKUPS[$i]}" | cut -f1)
        BACKUP_DATE=$(date -r "${BACKUPS[$i]}" "+%Y-%m-%d %H:%M:%S")
        echo "  $((i+1)). $BACKUP_NAME ($BACKUP_SIZE) - $BACKUP_DATE"
    done
    
    echo ""
    read -p "Enter backup number to restore (or 'q' to quit): " selection
    
    if [ "$selection" = "q" ] || [ "$selection" = "Q" ]; then
        print_info "Restore cancelled."
        exit 0
    fi
    
    if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt ${#BACKUPS[@]} ]; then
        print_error "Invalid selection."
        exit 1
    fi
    
    BACKUP_FILE="${BACKUPS[$((selection-1))]}"
else
    # Check if provided file path is relative or absolute
    if [ ! -f "$BACKUP_FILE" ]; then
        # Try in backup directory
        if [ -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
            BACKUP_FILE="${BACKUP_DIR}/${BACKUP_FILE}"
        else
            print_error "Backup file not found: $BACKUP_FILE"
            exit 1
        fi
    fi
fi

# Verify backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    print_error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
print_info "Backup file: $(basename "$BACKUP_FILE")"
print_info "Backup size: $BACKUP_SIZE"

# Warning and confirmation
echo ""
print_warning "=============================================="
print_warning "              ⚠️  WARNING  ⚠️                  "
print_warning "=============================================="
print_warning "This will REPLACE ALL DATA in the database!"
print_warning "Database: $DB_NAME"
print_warning "Current data will be PERMANENTLY LOST!"
print_warning "=============================================="
echo ""

if [ "$SKIP_CONFIRMATION" = false ]; then
    read -p "Are you sure you want to continue? Type 'YES' to confirm: " confirmation
    
    if [ "$confirmation" != "YES" ]; then
        print_info "Restore cancelled."
        exit 0
    fi
fi

# Create a pre-restore backup
print_step "Creating a safety backup before restore..."
SAFETY_BACKUP_FILE="${BACKUP_DIR}/pre_restore_safety_$(date +%Y%m%d_%H%M%S).sql"
if docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" "$DB_NAME" > "$SAFETY_BACKUP_FILE"; then
    gzip "$SAFETY_BACKUP_FILE"
    print_info "Safety backup created: $(basename "${SAFETY_BACKUP_FILE}.gz")"
else
    print_warning "Failed to create safety backup, but continuing with restore..."
fi

# Restore database
print_step "Restoring database from backup..."

# Check if file is compressed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    print_info "Decompressing and restoring..."
    if gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" "$DB_NAME"; then
        print_info "Database restored successfully!"
    else
        print_error "Failed to restore database."
        exit 1
    fi
else
    print_info "Restoring from uncompressed backup..."
    if docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" "$DB_NAME" < "$BACKUP_FILE"; then
        print_info "Database restored successfully!"
    else
        print_error "Failed to restore database."
        exit 1
    fi
fi

# Summary
echo ""
print_info "=============================================="
print_info "         Restore Completed Successfully!      "
print_info "=============================================="
echo ""
print_info "Restored from: $(basename "$BACKUP_FILE")"
print_info "Database: $DB_NAME"
echo ""
print_info "Safety backup available at:"
print_info "  ${SAFETY_BACKUP_FILE}.gz"
echo ""
