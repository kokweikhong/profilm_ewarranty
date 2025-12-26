package main

import (
	"context"
	"fmt"
	"log"
	"os"

	config "github.com/kokweikhong/profilm_ewarranty/backend/configs"
	database "github.com/kokweikhong/profilm_ewarranty/backend/internal/db"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/services"
)

func main() {
	ctx := context.Background()

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Connect to database
	dbCfg := database.Config{
		Host:     "localhost",
		Port:     cfg.Database.Port,
		User:     cfg.Database.User,
		Password: cfg.Database.Password,
		DBName:   cfg.Database.DBName,
		SSLMode:  cfg.Database.SSLMode,
	}

	db, err := database.NewPostgresPool(ctx, dbCfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Initialize users service
	usersService := services.NewUsersService(db)

	// Admin credentials
	adminUsername := "admin"
	adminPassword := "admin@profilm"

	// Check if admin user already exists
	existingUser, err := usersService.GetUserByUsername(ctx, adminUsername)
	if err == nil && existingUser != nil {
		fmt.Printf("❌ Admin user '%s' already exists (ID: %d)\n", adminUsername, existingUser.ID)
		fmt.Println("If you want to reset the password, please delete the existing user first.")
		os.Exit(1)
	}

	// Create admin user with shop_id = null
	fmt.Println("Creating admin user...")
	user, err := usersService.CreateUser(ctx, nil, "admin", adminUsername, adminPassword)
	if err != nil {
		log.Fatalf("Failed to create admin user: %v", err)
	}

	fmt.Println("\n✅ Admin user created successfully!")
	fmt.Println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
	fmt.Printf("Username: %s\n", user.Username)
	fmt.Printf("Password: %s\n", adminPassword)
	fmt.Printf("Role:     %s\n", user.Role)
	fmt.Printf("Shop ID:  %v\n", user.ShopID)
	fmt.Printf("User ID:  %d\n", user.ID)
	fmt.Println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
	fmt.Println("\n⚠️  Please keep these credentials safe!")
	fmt.Println("💡 You can now login at: http://localhost:3000/login")
}
