// ProFilm eWarranty API
// @title           ProFilm eWarranty API
// @version         1.0
// @description     This is the API server for ProFilm eWarranty system.
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@swagger.io

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8082
// @BasePath  /

// @securityDefinitions.basic  BasicAuth

// @externalDocs.description  OpenAPI
// @externalDocs.url          https://swagger.io/resources/open-api/
package main

import (
	"log"
	"net/http"

	_ "github.com/kokweikhong/profilm_ewarranty/backend/docs"
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
	log.Printf("Starting server on port %s...", "8082")
	if err := http.ListenAndServe(":8082", r); err != nil {
		log.Fatal("Failed to start server:", err)
	}

}
