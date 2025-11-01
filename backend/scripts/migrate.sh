#!/bin/bash

# Database URL - update this with your actual database credentials
DB_URL="postgresql://postgres:postgres@localhost:5432/profilm_ewarranty?sslmode=disable"

echo "Running database migrations..."
goose -dir migrations postgres "$DB_URL" up

echo "Migrations completed!"