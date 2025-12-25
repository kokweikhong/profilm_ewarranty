package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/handlers/dto"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/services"
	"github.com/kokweikhong/profilm_ewarranty/backend/pkg/utils"
)

type ProductAllocationsHandler interface {
	// ListProductAllocations returns a list of product allocations.
	ListProductAllocations(w http.ResponseWriter, r *http.Request)
	// CreateProductAllocation creates a new product allocation.
	CreateProductAllocation(w http.ResponseWriter, r *http.Request)
	// GetProductAllocationByID returns a single product allocation by ID.
	GetProductAllocationByID(w http.ResponseWriter, r *http.Request)
	// UpdateProductAllocation updates an existing product allocation.
	UpdateProductAllocation(w http.ResponseWriter, r *http.Request)
	// GetProductsFromProductAllocationsByShopID returns products associated with a specific shop ID.
	GetProductsFromProductAllocationsByShopID(w http.ResponseWriter, r *http.Request)
}

type productAllocationsHandler struct {
	productAllocationsService services.ProductAllocationsService
}

func NewProductAllocationsHandler(productAllocationsService services.ProductAllocationsService) ProductAllocationsHandler {
	return &productAllocationsHandler{
		productAllocationsService: productAllocationsService,
	}
}

// ListProductAllocations returns a list of product allocations from the view.
func (h *productAllocationsHandler) ListProductAllocations(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	pAllocationsView, err := h.productAllocationsService.ListProductAllocationsView(ctx)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, pAllocationsView)
}

// CreateProductAllocation creates a new product allocation.
func (h *productAllocationsHandler) CreateProductAllocation(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req dto.CreateProductAllocationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	params, err := req.ToCreateProductAllocationParams()
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	allocation, err := h.productAllocationsService.CreateProductAllocation(ctx, params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.NewHTTPSuccessResponse(w, http.StatusCreated, allocation)
}

// GetProductAllocationByID returns a single product allocation by ID.
func (h *productAllocationsHandler) GetProductAllocationByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Get ID from URL path parameter
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 32)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid ID")
		return
	}

	row, err := h.productAllocationsService.GetProductAllocationByID(ctx, int32(id))
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusNotFound, "Product allocation not found")
		return
	}

	utils.NewHTTPSuccessResponse(w, http.StatusOK, row)
}

// UpdateProductAllocation updates an existing product allocation.
func (h *productAllocationsHandler) UpdateProductAllocation(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Get ID from URL path parameter
	idStr := chi.URLParam(r, "id")
	id, err := utils.ConvertParamToInt32(idStr)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid ID")
		return
	}

	var req dto.UpdateProductAllocationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Map DTO to sqlc params
	params, err := req.ToUpdateProductAllocationParams(id)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}
	params.ID = int32(id)
	allocation, err := h.productAllocationsService.UpdateProductAllocation(ctx, params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.NewHTTPSuccessResponse(w, http.StatusOK, allocation)
}

// GetProductsFromProductAllocationsByShopID returns products associated with a specific shop ID.
func (h *productAllocationsHandler) GetProductsFromProductAllocationsByShopID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	// Get shop ID from URL path parameter
	idStr := chi.URLParam(r, "shop_id")
	id, err := utils.ConvertParamToInt32(idStr)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid shop ID")
		return
	}
	products, err := h.productAllocationsService.GetProductsFromProductAllocationsByShopID(ctx, id)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to get products")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, products)
}
