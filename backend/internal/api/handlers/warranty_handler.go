package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/warranties"
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

	utils.JSONResponse(w, http.StatusOK, parts)
}

// GetCarPartByID retrieves a car part by its ID
func (h *warrantyHandler) GetCarPartByID(w http.ResponseWriter, r *http.Request) {
	idParam := r.URL.Query().Get("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid car part ID")
		return
	}

	part, err := h.service.GetCarPartByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to retrieve car part")
		return
	}

	utils.JSONResponse(w, http.StatusOK, part)
}

// CreateCarPart creates a new car part
func (h *warrantyHandler) CreateCarPart(w http.ResponseWriter, r *http.Request) {
	var params *warranties.CreateCarPartParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	carPart, err := h.service.CreateCarPart(r.Context(), params)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create car part")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, carPart)
}

// UpdateCarPart updates an existing car part
func (h *warrantyHandler) UpdateCarPart(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID string `json:"id"`
		*warranties.UpdateCarPartParams
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	id, err := uuid.Parse(req.ID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid car part ID")
		return
	}

	carPart, err := h.service.UpdateCarPart(r.Context(), id, req.UpdateCarPartParams)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update car part")
		return
	}
	utils.JSONResponse(w, http.StatusOK, carPart)
}

// DeleteCarPart deletes a car part by its ID
func (h *warrantyHandler) DeleteCarPart(w http.ResponseWriter, r *http.Request) {
	var params struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	id, err := uuid.Parse(params.ID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid car part ID")
		return
	}
	if err := h.service.DeleteCarPart(r.Context(), id); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to delete car part")
		return
	}
	utils.JSONResponse(w, http.StatusOK, nil)
}

// ListWarranties lists all warranties
func (h *warrantyHandler) ListWarranties(w http.ResponseWriter, r *http.Request) {
	warranties, err := h.service.ListWarranties(r.Context())
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to list warranties")
		return
	}

	utils.JSONResponse(w, http.StatusOK, warranties)
}

// GetWarrantyByID retrieves a warranty by its ID
func (h *warrantyHandler) GetWarrantyByID(w http.ResponseWriter, r *http.Request) {
	idParam := r.URL.Query().Get("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid warranty ID")
		return
	}

	warranty, err := h.service.GetWarrantyByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to retrieve warranty")
		return
	}

	utils.JSONResponse(w, http.StatusOK, warranty)
}

// CreateWarranty creates a new warranty
func (h *warrantyHandler) CreateWarranty(w http.ResponseWriter, r *http.Request) {
	var params warranties.CreateWarrantyParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	warranty, err := h.service.CreateWarranty(r.Context(), &params)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create warranty")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, warranty)
}

// UpdateWarranty updates an existing warranty
func (h *warrantyHandler) UpdateWarranty(w http.ResponseWriter, r *http.Request) {
	var params struct {
		ID string `json:"id"`
		*warranties.UpdateWarrantyParams
	}


	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	id, err := uuid.Parse(params.ID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid warranty ID")
		return
	}

	warranty, err := h.service.UpdateWarranty(r.Context(), id, params.UpdateWarrantyParams)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update warranty")
		return
	}

	utils.JSONResponse(w, http.StatusOK, warranty)
}

// DeleteWarranty deletes a warranty by its ID
func (h *warrantyHandler) DeleteWarranty(w http.ResponseWriter, r *http.Request) {
	var params struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	id, err := uuid.Parse(params.ID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid warranty ID")
		return
	}
	if err := h.service.DeleteWarranty(r.Context(), id); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to delete warranty")
		return
	}
	utils.JSONResponse(w, http.StatusOK, nil)
}