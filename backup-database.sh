#!/bin/bash

# ProFilm eWarranty - Database Backup Script
# This script creates a backup of the PostgreSQL database

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

# Configuration (modify these according to your setup)
CONTAINER_NAME="profilm_postgres"
DB_USER="profilm"
DB_NAME="profilm_ewarranty"
BACKUP_DIR="/opt/backups/profilm_ewarranty"
RETENTION_DAYS=30  # Keep backups for 30 days

# Parse command line arguments
COMPRESS=true
AUTO_ROTATE=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --no-compress)
            COMPRESS=false
            shift
            ;;
        --no-rotate)
            AUTO_ROTATE=false
            shift
            ;;
        --backup-dir)
            BACKUP_DIR="$2"
            shift 2
            ;;
        --retention-days)
            RETENTION_DAYS="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --no-compress        Do not compress the backup file"
            echo "  --no-rotate          Do not automatically delete old backups"
            echo "  --backup-dir DIR     Specify custom backup directory (default: /opt/backups/profilm_ewarranty)"
            echo "  --retention-days N   Keep backups for N days (default: 30)"
            echo "  --help               Show this help message"
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
print_info "   ProFilm eWarranty Database Backup         "
print_info "=============================================="
echo ""

# Check if Docker is running
if ! docker ps &> /dev/null; then
    print_error "Docker is not running or you don't have permission to access it."
    print_error "Please start Docker or run with appropriate permissions."
    exit 1
fi

# Check if PostgreSQL container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    print_error "PostgreSQL container '${CONTAINER_NAME}' is not running."
    print_error "Please start the container first: docker-compose up -d postgres"
    exit 1
fi

print_info "PostgreSQL container is running."

# Create backup directory if it doesn't exist
print_step "Creating backup directory..."
if [ ! -d "$BACKUP_DIR" ]; then
    sudo mkdir -p "$BACKUP_DIR"
    sudo chown -R $USER:$USER "$BACKUP_DIR"
    print_info "Created backup directory: $BACKUP_DIR"
else
    print_info "Backup directory exists: $BACKUP_DIR"
fi

# Generate backup filename with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="profilm_ewarranty_backup_${TIMESTAMP}.sql"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILE}"

# Perform database backup
print_step "Creating database backup..."
if docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_PATH"; then
    print_info "Database backup created successfully!"
    
    # Get backup file size
    BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    print_info "Backup file: $BACKUP_FILE"
    print_info "Backup size: $BACKUP_SIZE"
else
    print_error "Failed to create database backup."
    exit 1
fi

# Compress backup if enabled
if [ "$COMPRESS" = true ]; then
    print_step "Compressing backup file..."
    if gzip "$BACKUP_PATH"; then
        COMPRESSED_FILE="${BACKUP_FILE}.gz"
        COMPRESSED_PATH="${BACKUP_PATH}.gz"
        COMPRESSED_SIZE=$(du -h "$COMPRESSED_PATH" | cut -f1)
        print_info "Backup compressed successfully!"
        print_info "Compressed file: $COMPRESSED_FILE"
        print_info "Compressed size: $COMPRESSED_SIZE"
        FINAL_FILE="$COMPRESSED_FILE"
    else
        print_warning "Failed to compress backup, keeping uncompressed version."
        FINAL_FILE="$BACKUP_FILE"
    fi
else
    print_info "Skipping compression (--no-compress flag used)"
    FINAL_FILE="$BACKUP_FILE"
fi

# Create a 'latest' symlink
print_step "Creating 'latest' symlink..."
LATEST_LINK="${BACKUP_DIR}/latest_backup"
if [ "$COMPRESS" = true ]; then
    LATEST_LINK="${LATEST_LINK}.sql.gz"
else
    LATEST_LINK="${LATEST_LINK}.sql"
fi

rm -f "$LATEST_LINK"
ln -s "${BACKUP_DIR}/${FINAL_FILE}" "$LATEST_LINK"
print_info "Created symlink: latest_backup -> $FINAL_FILE"

# Rotate old backups
if [ "$AUTO_ROTATE" = true ]; then
    print_step "Rotating old backups (keeping last ${RETENTION_DAYS} days)..."
    
    # Find and delete old backup files
    DELETED_COUNT=0
    while IFS= read -r old_backup; do
        rm -f "$old_backup"
        DELETED_COUNT=$((DELETED_COUNT + 1))
        print_info "Deleted old backup: $(basename "$old_backup")"
    done < <(find "$BACKUP_DIR" -name "profilm_ewarranty_backup_*.sql*" -type f -mtime +${RETENTION_DAYS})
    
    if [ $DELETED_COUNT -eq 0 ]; then
        print_info "No old backups to delete."
    else
        print_info "Deleted $DELETED_COUNT old backup(s)."
    fi
else
    print_info "Skipping backup rotation (--no-rotate flag used)"
fi

# List all backups
echo ""
print_step "Current backups in $BACKUP_DIR:"
ls -lh "$BACKUP_DIR" | grep "profilm_ewarranty_backup" | awk '{print "  " $9 " (" $5 ")"}'

# Summary
echo ""
print_info "=============================================="
print_info "         Backup Completed Successfully!       "
print_info "=============================================="
echo ""
print_info "Backup location: ${BACKUP_DIR}/${FINAL_FILE}"
print_info "Latest backup link: $LATEST_LINK"
echo ""
print_info "To restore this backup, run:"
if [ "$COMPRESS" = true ]; then
    echo "  gunzip -c ${BACKUP_DIR}/${FINAL_FILE} | docker exec -i $CONTAINER_NAME psql -U $DB_USER $DB_NAME"
else
    echo "  docker exec -i $CONTAINER_NAME psql -U $DB_USER $DB_NAME < ${BACKUP_DIR}/${FINAL_FILE}"
fi
echo ""
