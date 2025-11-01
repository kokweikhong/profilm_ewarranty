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

type ClaimsHandler interface {
	ListClaims(w http.ResponseWriter, r *http.Request)
	GetClaimByID(w http.ResponseWriter, r *http.Request)
	CreateClaim(w http.ResponseWriter, r *http.Request)
	UpdateClaim(w http.ResponseWriter, r *http.Request)
	DeleteClaim(w http.ResponseWriter, r *http.Request)
}

type claimsHandler struct {
	service services.ClaimService
}

func NewClaimsHandler(service services.ClaimService) ClaimsHandler {
	return &claimsHandler{
		service: service,
	}
}

// ListClaims handles listing all claims
func (h *claimsHandler) ListClaims(w http.ResponseWriter, r *http.Request) {
	claims, err := h.service.ListClaims(r.Context())
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to list claims")
		return
	}

	// Convert to response DTOs
	var responses []*dto.ClaimResponse
	for _, claim := range claims {
		responses = append(responses, dto.FromClaim(claim))
	}

	utils.JSONResponse(w, http.StatusOK, responses)
}

// GetClaimByID handles retrieving a claim by its ID
func (h *claimsHandler) GetClaimByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid claim ID")
		return
	}

	claim, err := h.service.GetClaimByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to retrieve claim")
		return
	}

	// Convert to response DTO
	response := dto.FromClaim(claim)
	utils.JSONResponse(w, http.StatusOK, response)
}

// CreateClaim handles creating a new claim
func (h *claimsHandler) CreateClaim(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateClaimRequest
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
	params, err := req.ToCreateClaimParams()
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request data: "+err.Error())
		return
	}

	claim, err := h.service.CreateClaim(r.Context(), params)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create claim")
		return
	}

	// Convert to response DTO
	response := dto.FromClaim(claim)
	utils.JSONResponse(w, http.StatusCreated, response)
}

// UpdateClaim handles updating an existing claim
func (h *claimsHandler) UpdateClaim(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid claim ID")
		return
	}

	var req dto.UpdateClaimRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Validate request
	if err := utils.ValidateStruct(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	// Get current claim for merge
	currentClaim, err := h.service.GetClaimByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusNotFound, "Claim not found")
		return
	}

	// Convert to SQLC params
	params, err := req.ToUpdateClaimParams(currentClaim)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request data: "+err.Error())
		return
	}

	updatedClaim, err := h.service.UpdateClaim(r.Context(), params)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update claim")
		return
	}

	// Convert to response DTO
	response := dto.FromClaim(updatedClaim)
	utils.JSONResponse(w, http.StatusOK, response)
}

// DeleteClaim handles deleting a claim by its ID
func (h *claimsHandler) DeleteClaim(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid claim ID")
		return
	}

	if err := h.service.DeleteClaim(r.Context(), id); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to delete claim")
		return
	}

	utils.JSONResponse(w, http.StatusNoContent, nil)
}