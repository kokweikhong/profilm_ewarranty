package main

import (
	"log"
	"net/http"

	"github.com/kokweikhong/profilm_ewarranty/backend/internal/api"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/api/handlers"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/config"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/claims"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/products"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/shops"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/warranties"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/services"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize database
	db, err := db.NewDB(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Initialize SQLC queries
	productQueries := products.New(db.Pool)
	shopQueries := shops.New(db.Pool)
	warrantyQueries := warranties.New(db.Pool)
	claimQueries := claims.New(db.Pool)

	services := services.NewService(db.Pool, &services.Queries{
		Product:  productQueries,
		Shop:     shopQueries,
		Warranty: warrantyQueries,
		Claim:    claimQueries,
	})

	// Initialize handlers
	handler := handlers.NewHandler(services)

	router := api.NewRouter(handler)
	// Setup routes
	r := router.SetupRoutes()

	// Start the server
	log.Printf("Starting server on port %s...", cfg.Port)
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal("Failed to start server:", err)
	}

}