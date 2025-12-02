package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	config "github.com/kokweikhong/profilm_ewarranty/backend/configs"
	database "github.com/kokweikhong/profilm_ewarranty/backend/internal/db"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/handlers"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/server"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/services"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("No .env file found or error loading .env file")
	}

	cfg, err := config.Load()
	if err != nil {
		panic(fmt.Sprintf("Failed to load config: %v", err))
	}

	ctx := context.Background()
	db, err := database.NewPostgresPool(ctx, database.Config(cfg.Database))
	if err != nil {
		panic(fmt.Sprintf("Failed to connect to database: %v", err))
	}

	defer db.Close()
	fmt.Println("Successfully connected to the database")

	// Application initialization and server start logic goes here.
	productService := services.NewProductsService(db)
	productHandler := handlers.NewProductsHandler(productService)
	shopsService := services.NewShopsService(db)
	shopsHandler := handlers.NewShopsHandler(shopsService)
	router := chi.NewRouter()
	routes := server.NewRoutes(productHandler, shopsHandler)
	routes.RegisterRoutes(router)

	fmt.Println("Server starting on :8080")
	if err := http.ListenAndServe(":8080", router); err != nil {
		panic(fmt.Sprintf("Failed to start server: %v", err))
	}
}
