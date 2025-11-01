@echo off

REM Development Database
set DB_URL=postgresql://postgres:postgres@localhost:5432/profilm_ewarranty_dev?sslmode=disable

echo Running development migrations...
goose -dir migrations postgres "%DB_URL%" up

echo Development migrations completed!