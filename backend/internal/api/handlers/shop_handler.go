package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/shops"
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

	utils.JSONResponse(w, http.StatusOK, states)
}

// GetStateByID handles retrieving a state by its ID
func (h *shopHandler) GetStateByID(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	uuid, err := uuid.Parse(req.ID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	state, err := h.service.GetStateByID(r.Context(), uuid)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to get state")
		return
	}

	utils.JSONResponse(w, http.StatusOK, state)
}

// CreateState handles creating a new state
func (h *shopHandler) CreateState(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	state, err := h.service.CreateState(r.Context(), req.Name)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create state")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, state)
}

// UpdateState handles updating an existing state
func (h *shopHandler) UpdateState(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID   string `json:"id"`
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	uuid, err := uuid.Parse(req.ID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	state, err := h.service.UpdateState(r.Context(), &shops.UpdateStateParams{
		ID:   uuid,
		Name: req.Name,
	})
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update state")
		return
	}

	utils.JSONResponse(w, http.StatusOK, state)
}

// DeleteState handles deleting a state by its ID
func (h *shopHandler) DeleteState(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	uuid, err := uuid.Parse(req.ID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	if err := h.service.DeleteState(r.Context(), uuid); err != nil {
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

	utils.JSONResponse(w, http.StatusOK, shops)
}

// GetShopByID handles retrieving a shop by its ID
func (h *shopHandler) GetShopByID(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	uuid, err := uuid.Parse(req.ID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	shop, err := h.service.GetShopByID(r.Context(), uuid)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to get shop")
		return
	}

	utils.JSONResponse(w, http.StatusOK, shop)
}

// CreateShop handles creating a new shop
func (h *shopHandler) CreateShop(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	shop, err := h.service.CreateShop(r.Context(), &shops.CreateShopParams{
		Name: req.Name,
	})
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create shop")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, shop)
}

// UpdateShop handles updating an existing shop
func (h *shopHandler) UpdateShop(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID   string `json:"id"`
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	uuid, err := uuid.Parse(req.ID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	shop, err := h.service.UpdateShop(r.Context(), &shops.UpdateShopParams{
		ID:   uuid,
		Name: req.Name,
	})
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update shop")
		return
	}

	utils.JSONResponse(w, http.StatusOK, shop)
}

// DeleteShop handles deleting a shop by its ID
func (h *shopHandler) DeleteShop(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	uuid, err := uuid.Parse(req.ID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	if err := h.service.DeleteShop(r.Context(), uuid); err != nil {
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

	utils.JSONResponse(w, http.StatusOK, allocations)
}

// GetProductAllocationByID retrieves a product allocation by its ID
func (h *shopHandler) GetProductAllocationByID(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	uuid, err := uuid.Parse(req.ID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	allocation, err := h.service.GetProductAllocationByID(r.Context(), uuid)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to get product allocation")
		return
	}

	utils.JSONResponse(w, http.StatusOK, allocation)
}

// CreateProductAllocation creates a new product allocation
func (h *shopHandler) CreateProductAllocation(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ShopID        string `json:"shop_id"`
		ProductID     string `json:"product_id"`
		FilmQuantity  int32  `json:"film_quantity"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	shopID, err := uuid.Parse(req.ShopID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	productID, err := uuid.Parse(req.ProductID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	allocation, err := h.service.CreateProductAllocation(r.Context(), &shops.CreateProductAllocationParams{
		ShopID:        shopID,
		ProductID:     productID,
		FilmQuantity:  req.FilmQuantity,
	})
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create product allocation")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, allocation)
}

// UpdateProductAllocation updates an existing product allocation
func (h *shopHandler) UpdateProductAllocation(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID            string `json:"id"`
		ProductID    string `json:"product_id"`
    ShopID       string `json:"shop_id"`
    FilmQuantity int32  `json:"film_quantity"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	id, err := uuid.Parse(req.ID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}
	productID, err := uuid.Parse(req.ProductID)

	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	shopID, err := uuid.Parse(req.ShopID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	allocation, err := h.service.UpdateProductAllocation(r.Context(), &shops.UpdateProductAllocationParams{
		ID:            id,
		ProductID:     productID,
		ShopID:       shopID,
		FilmQuantity: req.FilmQuantity,
	})
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update product allocation")
		return
	}

	utils.JSONResponse(w, http.StatusOK, allocation)
}

// DeleteProductAllocation deletes a product allocation by its ID
func (h *shopHandler) DeleteProductAllocation(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	uuid, err := uuid.Parse(req.ID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	if err := h.service.DeleteProductAllocation(r.Context(), uuid); err != nil {
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

	utils.JSONResponse(w, http.StatusOK, details)
}

// GetShopDetailsByID retrieves shop details by ID
func (h *shopHandler) GetShopDetailsByID(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	uuid, err := uuid.Parse(req.ID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	detail, err := h.service.GetShopDetailsByID(r.Context(), uuid)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to get shop details")
		return
	}

	utils.JSONResponse(w, http.StatusOK, detail)
}
