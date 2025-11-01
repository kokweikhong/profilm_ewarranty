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

type ShopHandler interface {
	ListStates(w http.ResponseWriter, r *http.Request)
	GetStateByID(w http.ResponseWriter, r *http.Request)
	CreateState(w http.ResponseWriter, r *http.Request)
	UpdateState(w http.ResponseWriter, r *http.Request)
	DeleteState(w http.ResponseWriter, r *http.Request)

	ListShops(w http.ResponseWriter, r *http.Request)
	GetShopByID(w http.ResponseWriter, r *http.Request)
	CreateShop(w http.ResponseWriter, r *http.Request)
	UpdateShop(w http.ResponseWriter, r *http.Request)
	DeleteShop(w http.ResponseWriter, r *http.Request)

	ListProductAllocations(w http.ResponseWriter, r *http.Request)
	GetProductAllocationByID(w http.ResponseWriter, r *http.Request)
	CreateProductAllocation(w http.ResponseWriter, r *http.Request)
	UpdateProductAllocation(w http.ResponseWriter, r *http.Request)
	DeleteProductAllocation(w http.ResponseWriter, r *http.Request)

	ListShopDetails(w http.ResponseWriter, r *http.Request)
	GetShopDetailsByID(w http.ResponseWriter, r *http.Request)
}

type shopHandler struct {
	service services.ShopService
}

func NewShopHandler(service services.ShopService) ShopHandler {
	return &shopHandler{
		service: service,
	}
}

// ListStates handles listing all states
func (h *shopHandler) ListStates(w http.ResponseWriter, r *http.Request) {
	states, err := h.service.ListStates(r.Context())
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to list states")
		return
	}

	// Convert to response DTOs
	var responses []*dto.StateResponse
	for _, state := range states {
		responses = append(responses, dto.FromState(state))
	}

	utils.JSONResponse(w, http.StatusOK, responses)
}

// GetStateByID handles retrieving a state by its ID
func (h *shopHandler) GetStateByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing state ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid state ID")
		return
	}

	state, err := h.service.GetStateByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusNotFound, "State not found")
		return
	}

	// Convert to response DTO
	response := dto.FromState(state)
	utils.JSONResponse(w, http.StatusOK, response)
}

// CreateState handles creating a new state
func (h *shopHandler) CreateState(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateStateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Validate request
	if err := utils.ValidateStruct(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	state, err := h.service.CreateState(r.Context(), req.Name)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create state")
		return
	}

	// Convert to response DTO
	response := dto.FromState(state)
	utils.JSONResponse(w, http.StatusCreated, response)
}

// UpdateState handles updating an existing state
func (h *shopHandler) UpdateState(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing state ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid state ID")
		return
	}

	var req dto.UpdateStateRequest
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
	params := req.ToUpdateStateParams(id)

	state, err := h.service.UpdateState(r.Context(), params)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update state")
		return
	}

	// Convert to response DTO
	response := dto.FromState(state)
	utils.JSONResponse(w, http.StatusOK, response)
}

// DeleteState handles deleting a state by its ID
func (h *shopHandler) DeleteState(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing state ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid state ID")
		return
	}

	if err := h.service.DeleteState(r.Context(), id); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to delete state")
		return
	}

	utils.JSONResponse(w, http.StatusNoContent, nil)
}

// ListShops handles listing all shops
func (h *shopHandler) ListShops(w http.ResponseWriter, r *http.Request) {
	shops, err := h.service.ListShops(r.Context())
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to list shops")
		return
	}

	// Convert to response DTOs
	var responses []*dto.ShopResponse
	for _, shop := range shops {
		responses = append(responses, dto.FromShop(shop))
	}

	utils.JSONResponse(w, http.StatusOK, responses)
}

// GetShopByID handles retrieving a shop by its ID
func (h *shopHandler) GetShopByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing shop ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid shop ID")
		return
	}

	shop, err := h.service.GetShopByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusNotFound, "Shop not found")
		return
	}

	// Convert to response DTO
	response := dto.FromShop(shop)
	utils.JSONResponse(w, http.StatusOK, response)
}

// CreateShop handles creating a new shop
func (h *shopHandler) CreateShop(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateShopRequest
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
	params, err := req.ToCreateShopParams()
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	shop, err := h.service.CreateShop(r.Context(), params)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create shop")
		return
	}

	// Convert to response DTO
	response := dto.FromShop(shop)
	utils.JSONResponse(w, http.StatusCreated, response)
}

// UpdateShop handles updating an existing shop
func (h *shopHandler) UpdateShop(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing shop ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid shop ID")
		return
	}

	var req dto.UpdateShopRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Validate request
	if err := utils.ValidateStruct(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	// Get current shop data for the update (SQLC requires all fields)
	currentShop, err := h.service.GetShopByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusNotFound, "Shop not found")
		return
	}

	// Convert to SQLC params
	params, err := req.ToUpdateShopParams(id, currentShop)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	shop, err := h.service.UpdateShop(r.Context(), params)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update shop")
		return
	}

	// Convert to response DTO
	response := dto.FromShop(shop)
	utils.JSONResponse(w, http.StatusOK, response)
}

// DeleteShop handles deleting a shop by its ID
func (h *shopHandler) DeleteShop(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing shop ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid shop ID")
		return
	}

	if err := h.service.DeleteShop(r.Context(), id); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to delete shop")
		return
	}

	utils.JSONResponse(w, http.StatusNoContent, nil)
}

// ListProductAllocations handles listing all product allocations
func (h *shopHandler) ListProductAllocations(w http.ResponseWriter, r *http.Request) {
	allocations, err := h.service.ListProductAllocations(r.Context())
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to list product allocations")
		return
	}

	// Convert to response DTOs
	var responses []*dto.ProductAllocationResponse
	for _, allocation := range allocations {
		responses = append(responses, dto.FromProductAllocation(allocation))
	}

	utils.JSONResponse(w, http.StatusOK, responses)
}

// GetProductAllocationByID retrieves a product allocation by its ID
func (h *shopHandler) GetProductAllocationByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing allocation ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid allocation ID")
		return
	}

	allocation, err := h.service.GetProductAllocationByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusNotFound, "Product allocation not found")
		return
	}

	// Convert to response DTO
	response := dto.FromProductAllocation(allocation)
	utils.JSONResponse(w, http.StatusOK, response)
}

// CreateProductAllocation creates a new product allocation
func (h *shopHandler) CreateProductAllocation(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateProductAllocationRequest
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
	params, err := req.ToCreateProductAllocationParams()
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	allocation, err := h.service.CreateProductAllocation(r.Context(), params)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create product allocation")
		return
	}

	// Convert to response DTO
	response := dto.FromProductAllocation(allocation)
	utils.JSONResponse(w, http.StatusCreated, response)
}

// UpdateProductAllocation updates an existing product allocation
func (h *shopHandler) UpdateProductAllocation(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing allocation ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid allocation ID")
		return
	}

	var req dto.UpdateProductAllocationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Validate request
	if err := utils.ValidateStruct(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	// Get current allocation data for the update (SQLC requires all fields)
	currentAllocation, err := h.service.GetProductAllocationByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusNotFound, "Product allocation not found")
		return
	}

	// Convert to SQLC params
	params, err := req.ToUpdateProductAllocationParams(id, currentAllocation)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	allocation, err := h.service.UpdateProductAllocation(r.Context(), params)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update product allocation")
		return
	}

	// Convert to response DTO
	response := dto.FromProductAllocation(allocation)
	utils.JSONResponse(w, http.StatusOK, response)
}

// DeleteProductAllocation deletes a product allocation by its ID
func (h *shopHandler) DeleteProductAllocation(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing allocation ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid allocation ID")
		return
	}

	if err := h.service.DeleteProductAllocation(r.Context(), id); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to delete product allocation")
		return
	}

	utils.JSONResponse(w, http.StatusNoContent, nil)
}

// ListShopDetails lists all shop details
func (h *shopHandler) ListShopDetails(w http.ResponseWriter, r *http.Request) {
	details, err := h.service.ListShopDetails(r.Context())
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to list shop details")
		return
	}

	// Convert to response DTOs
	var responses []*dto.ShopDetailResponse
	for _, detail := range details {
		responses = append(responses, dto.FromShopDetail(detail))
	}

	utils.JSONResponse(w, http.StatusOK, responses)
}

// GetShopDetailsByID retrieves shop details by ID
func (h *shopHandler) GetShopDetailsByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing shop ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid shop ID")
		return
	}

	detail, err := h.service.GetShopDetailsByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusNotFound, "Shop details not found")
		return
	}

	// Convert to response DTO
	response := dto.FromShopDetail(detail)
	utils.JSONResponse(w, http.StatusOK, response)
}
