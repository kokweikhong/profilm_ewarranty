@echo off

echo Installing SQLC...
go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest

echo Installing Goose...
go install github.com/pressly/goose/v3/cmd/goose@latest

echo Generating SQLC code...
sqlc generate

echo Setup complete!
echo.
echo Next steps:
echo 1. Copy .env.example to .env and update the values
echo 2. Start your PostgreSQL database
echo 3. Run migrations: goose -dir migrations postgres "your-db-url" up
echo 4. Run the application: go run cmd/api/main.go