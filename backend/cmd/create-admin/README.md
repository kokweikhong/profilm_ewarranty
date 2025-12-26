# Create Admin User

This command line program creates an admin user in the database with predefined credentials.

## Admin Credentials

- **Username**: `admin`
- **Password**: `admin@profilm`
- **Shop ID**: `null` (not associated with any shop)

## Usage

### Using Make (Recommended)

```bash
make create-admin
```

### Using Go Run

```bash
go run cmd/create-admin/main.go
```

### Using Compiled Binary

```bash
# Build the binary
go build -o bin/create-admin cmd/create-admin/main.go

# Run the binary
./bin/create-admin
```

## Output

Successful execution:

```
Creating admin user...

✅ Admin user created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Username: admin
Password: admin@profilm
Shop ID:  <nil>
User ID:  1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Please keep these credentials safe!
💡 You can now login at: http://localhost:3000/login
```

If admin user already exists:

```
❌ Admin user 'admin' already exists (ID: 1)
If you want to reset the password, please delete the existing user first.
```

## Features

- ✅ Creates admin user with null shop_id (super admin)
- ✅ Checks if admin user already exists before creating
- ✅ Uses secure password hashing (bcrypt)
- ✅ Provides clear success/error messages
- ✅ Shows login URL for convenience

## Security Notes

⚠️ **Important**: This creates an admin user with a default password. For production environments:

1. Change the password immediately after first login
2. Consider using environment variables for credentials
3. Implement password complexity requirements
4. Add password expiration policies

## Database Requirements

- PostgreSQL database must be running
- Migrations must be applied (users table must exist)
- Database connection configured in environment variables or config file

## Troubleshooting

### Connection Error

```
Failed to connect to database: ...
```

**Solution**: Ensure PostgreSQL is running and connection details in config are correct.

### User Already Exists

```
Admin user 'admin' already exists
```

**Solution**: Delete the existing admin user from the database or use a different username.

### Migration Not Applied

```
relation "users" does not exist
```

**Solution**: Run migrations first:

```bash
make migrate-up
```

## Related Commands

- `make migrate-up` - Apply database migrations
- `make seed` - Seed database with sample data
- `make run` - Start the API server
