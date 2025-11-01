package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/api/dto"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/services"
	"github.com/kokweikhong/profilm_ewarranty/backend/pkg/utils"
)

type WarrantyHandler interface {
	ListCarParts(w http.ResponseWriter, r *http.Request)
	GetCarPartByID(w http.ResponseWriter, r *http.Request)
	CreateCarPart(w http.ResponseWriter, r *http.Request)
	UpdateCarPart(w http.ResponseWriter, r *http.Request)
	DeleteCarPart(w http.ResponseWriter, r *http.Request)
	ListWarranties(w http.ResponseWriter, r *http.Request)
	GetWarrantyByID(w http.ResponseWriter, r *http.Request)
	CreateWarranty(w http.ResponseWriter, r *http.Request)
	UpdateWarranty(w http.ResponseWriter, r *http.Request)
	DeleteWarranty(w http.ResponseWriter, r *http.Request)
}

type warrantyHandler struct {
	service services.WarrantyService
}

func NewWarrantyHandler(service services.WarrantyService) WarrantyHandler {
	return &warrantyHandler{
		service: service,
	}
}

// ListCarParts lists all car parts
func (h *warrantyHandler) ListCarParts(w http.ResponseWriter, r *http.Request) {
	parts, err := h.service.ListCarParts(r.Context())
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to list car parts")
		return
	}

	// Convert to response DTOs
	var responses []*dto.CarPartResponse
	for _, part := range parts {
		responses = append(responses, dto.FromCarPart(part))
	}

	utils.JSONResponse(w, http.StatusOK, responses)
}

// GetCarPartByID retrieves a car part by its ID
func (h *warrantyHandler) GetCarPartByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing car part ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid car part ID")
		return
	}

	part, err := h.service.GetCarPartByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusNotFound, "Car part not found")
		return
	}

	// Convert to response DTO
	response := dto.FromCarPart(part)
	utils.JSONResponse(w, http.StatusOK, response)
}

// CreateCarPart creates a new car part
func (h *warrantyHandler) CreateCarPart(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateCarPartRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Validate request
	if err := utils.ValidateStruct(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	// Convert to SQLC params
	params := req.ToCreateCarPartParams()

	carPart, err := h.service.CreateCarPart(r.Context(), params)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create car part")
		return
	}

	// Convert to response DTO
	response := dto.FromCarPart(carPart)
	utils.JSONResponse(w, http.StatusCreated, response)
}

// UpdateCarPart updates an existing car part
func (h *warrantyHandler) UpdateCarPart(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing car part ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid car part ID")
		return
	}

	var req dto.UpdateCarPartRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Validate request
	if err := utils.ValidateStruct(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	// Get current car part data for the update (SQLC requires all fields)
	currentPart, err := h.service.GetCarPartByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusNotFound, "Car part not found")
		return
	}

	// Convert to SQLC params
	params := req.ToUpdateCarPartParams(id, currentPart)

	carPart, err := h.service.UpdateCarPart(r.Context(), id, params)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update car part")
		return
	}

	// Convert to response DTO
	response := dto.FromCarPart(carPart)
	utils.JSONResponse(w, http.StatusOK, response)
}

// DeleteCarPart deletes a car part by its ID
func (h *warrantyHandler) DeleteCarPart(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing car part ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid car part ID")
		return
	}

	if err := h.service.DeleteCarPart(r.Context(), id); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to delete car part")
		return
	}

	utils.JSONResponse(w, http.StatusNoContent, nil)
}

// ListWarranties lists all warranties
func (h *warrantyHandler) ListWarranties(w http.ResponseWriter, r *http.Request) {
	warranties, err := h.service.ListWarranties(r.Context())
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to list warranties")
		return
	}

	// Convert to response DTOs
	var responses []*dto.WarrantyResponse
	for _, warranty := range warranties {
		responses = append(responses, dto.FromWarranty(warranty))
	}

	utils.JSONResponse(w, http.StatusOK, responses)
}

// GetWarrantyByID retrieves a warranty by its ID
func (h *warrantyHandler) GetWarrantyByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing warranty ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid warranty ID")
		return
	}

	warranty, err := h.service.GetWarrantyByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusNotFound, "Warranty not found")
		return
	}

	// Convert to response DTO
	response := dto.FromWarranty(warranty)
	utils.JSONResponse(w, http.StatusOK, response)
}

// CreateWarranty creates a new warranty
func (h *warrantyHandler) CreateWarranty(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateWarrantyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Validate request
	if err := utils.ValidateStruct(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	// Convert to SQLC params
	params, err := req.ToCreateWarrantyParams()
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	warranty, err := h.service.CreateWarranty(r.Context(), params)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create warranty")
		return
	}

	// Convert to response DTO
	response := dto.FromWarranty(warranty)
	utils.JSONResponse(w, http.StatusCreated, response)
}

// UpdateWarranty updates an existing warranty
func (h *warrantyHandler) UpdateWarranty(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing warranty ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid warranty ID")
		return
	}

	var req dto.UpdateWarrantyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Validate request
	if err := utils.ValidateStruct(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	// Get current warranty data for the update (SQLC requires all fields)
	currentWarranty, err := h.service.GetWarrantyByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusNotFound, "Warranty not found")
		return
	}

	// Convert to SQLC params
	params, err := req.ToUpdateWarrantyParams(id, currentWarranty)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	warranty, err := h.service.UpdateWarranty(r.Context(), id, params)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update warranty")
		return
	}

	// Convert to response DTO
	response := dto.FromWarranty(warranty)
	utils.JSONResponse(w, http.StatusOK, response)
}

// DeleteWarranty deletes a warranty by its ID
func (h *warrantyHandler) DeleteWarranty(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing warranty ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid warranty ID")
		return
	}

	if err := h.service.DeleteWarranty(r.Context(), id); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to delete warranty")
		return
	}

	utils.JSONResponse(w, http.StatusNoContent, nil)
}
