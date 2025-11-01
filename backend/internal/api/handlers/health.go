package handlers

import (
	"encoding/json"
	"net/http"
)

type HealthHandler struct{}

func NewHealthHandler() *HealthHandler {
	return &HealthHandler{}
}

type HealthResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func (h *HealthHandler) Health(w http.ResponseWriter, r *http.Request) {
	response := HealthResponse{
		Status:  "ok",
		Message: "Server is running",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
