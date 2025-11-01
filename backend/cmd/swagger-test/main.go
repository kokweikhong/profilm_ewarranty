package main

import (
	"log"
	"net/http"

	"github.com/kokweikhong/profilm_ewarranty/backend/internal/api/handlers"
)

// Simple test server for Swagger documentation without database dependency
func main() {
	// Create a simple handler structure for testing
	testHandler := &handlers.Handler{
		Swagger: handlers.NewSwaggerHandler(),
	}

	// Create a simple router for testing Swagger
	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "ok", "message": "Swagger test server is running"}`))
	})

	// Swagger routes
	mux.Handle("/docs", testHandler.Swagger.ServeSwaggerUI())
	mux.Handle("/swagger.yaml", testHandler.Swagger.ServeSwaggerSpec())

	// Start server
	log.Println("Starting Swagger test server on port 8080...")
	log.Println("Swagger documentation available at: http://localhost:8080/docs")
	log.Println("Health check available at: http://localhost:8080/health")
	
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}