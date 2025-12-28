package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/handlers/dto"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/services"
	"github.com/kokweikhong/profilm_ewarranty/backend/pkg/utils"
)

// ProductsHandler defines the HTTP contract for product-related endpoints.
// It is framework-agnostic and can be wired to chi, gin, echo, etc.
type ProductsHandler interface {
	// GetProducts returns a list of products.
	GetProducts(w http.ResponseWriter, r *http.Request)

	// GetProductByID returns a single product by ID.
	GetProductByID(w http.ResponseWriter, r *http.Request)

	// CreateProduct creates a new product.
	CreateProduct(w http.ResponseWriter, r *http.Request)

	// UpdateProduct updates an existing product.
	UpdateProduct(w http.ResponseWriter, r *http.Request)

	// ListProductBrands lists all product brands.
	ListProductBrands(w http.ResponseWriter, r *http.Request)

	// GetProductTypes lists product types.
	GetProductTypes(w http.ResponseWriter, r *http.Request)

	// GetProductSeries lists product series.
	GetProductSeries(w http.ResponseWriter, r *http.Request)

	// GetProductNames lists product names.
	GetProductNames(w http.ResponseWriter, r *http.Request)
}

type productsHandler struct {
	productsService services.ProductsService
}

func NewProductsHandler(productsService services.ProductsService) ProductsHandler {
	return &productsHandler{
		productsService: productsService,
	}
}

// GetProducts returns a list of products.
func (h *productsHandler) GetProducts(w http.ResponseWriter, r *http.Request) {
	products, err := h.productsService.GetProducts(r.Context())
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to get products")
		return
	}

	productsResponse := make([]dto.ProductDetialResponse, 0, len(products))
	for _, p := range products {
		productResp := dto.ProductDetialResponse{
			ID:               p.ID,
			WarrantyInMonths: p.WarrantyInMonths,
			FilmSerialNumber: p.FilmSerialNumber,
			FilmQuantity:     p.FilmQuantity,
			ShipmentNumber:   p.ShipmentNumber,
			Description:      p.Description,
			IsActive:         p.IsActive,
			CreatedAt:        p.CreatedAt,
			UpdatedAt:        p.UpdatedAt,
			BrandName:        p.BrandName,
			TypeName:         p.TypeName,
			SeriesName:       p.SeriesName,
			ProductName:      p.ProductName,
		}
		productsResponse = append(productsResponse, productResp)
	}

	utils.NewHTTPSuccessResponse(w, http.StatusOK, productsResponse)
}

// GetProductByID returns a single product by ID.
func (h *productsHandler) GetProductByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := utils.ConvertParamToInt32(idParam)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid product ID")
		return
	}

	product, err := h.productsService.GetProductByID(r.Context(), id)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to get product")
		return
	}

	utils.NewHTTPSuccessResponse(w, http.StatusOK, product)
}

// CreateProduct creates a new product.
func (h *productsHandler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateProductRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	params := req.ToCreateProductParams()

	product, err := h.productsService.CreateProduct(r.Context(), params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to create product")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusCreated, product)
}

// UpdateProduct updates an existing product.
func (h *productsHandler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := utils.ConvertParamToInt32(idParam)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid product ID")
		return
	}
	var req dto.UpdateProductRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	params := req.ToUpdateProductParams(id)

	product, err := h.productsService.UpdateProduct(r.Context(), params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to update product")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, product)
}

// ListProductBrands lists all product brands.
func (h *productsHandler) ListProductBrands(w http.ResponseWriter, r *http.Request) {
	brands, err := h.productsService.ListProductBrands(r.Context())
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to list product brands")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, brands)
}

// GetProductTypes lists product types for the given brand.
func (h *productsHandler) GetProductTypes(w http.ResponseWriter, r *http.Request) {
	types, err := h.productsService.ListProductTypes(r.Context())
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to list product types")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, types)
}

// GetProductSeries lists product series.
func (h *productsHandler) GetProductSeries(w http.ResponseWriter, r *http.Request) {
	series, err := h.productsService.ListProductSeries(r.Context())
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to list product series")
		return
	}

	utils.NewHTTPSuccessResponse(w, http.StatusOK, series)
}

// GetProductNames lists product names.
func (h *productsHandler) GetProductNames(w http.ResponseWriter, r *http.Request) {
	names, err := h.productsService.ListProductNames(r.Context())
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid series ID")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, names)
}
