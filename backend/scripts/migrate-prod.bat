@echo off

REM Production Database - BE CAREFUL!
set DB_URL=postgresql://username:password@production-host:5432/profilm_ewarranty?sslmode=require

echo WARNING: Running PRODUCTION migrations!
echo Press Ctrl+C to cancel, or
pause

echo Running production migrations...
goose -dir migrations postgres "%DB_URL%" up

echo Production migrations completed!