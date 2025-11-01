package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/api/dto"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/products"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/services"
	"github.com/kokweikhong/profilm_ewarranty/backend/pkg/utils"
)

type ProductHandler interface {
	CreateProductBrand(w http.ResponseWriter, r *http.Request)
	GetProductBrandByID(w http.ResponseWriter, r *http.Request)
	ListProductBrands(w http.ResponseWriter, r *http.Request)
	UpdateProductBrand(w http.ResponseWriter, r *http.Request)
	DeleteProductBrand(w http.ResponseWriter, r *http.Request)

	CreateProductType(w http.ResponseWriter, r *http.Request)
	GetProductTypeByID(w http.ResponseWriter, r *http.Request)
	ListProductTypes(w http.ResponseWriter, r *http.Request)
	UpdateProductType(w http.ResponseWriter, r *http.Request)
	DeleteProductType(w http.ResponseWriter, r *http.Request)

	CreateProductSeries(w http.ResponseWriter, r *http.Request)
	GetProductSeriesByID(w http.ResponseWriter, r *http.Request)
	ListProductSeries(w http.ResponseWriter, r *http.Request)
	ListProductSeriesByType(w http.ResponseWriter, r *http.Request)
	UpdateProductSeries(w http.ResponseWriter, r *http.Request)
	DeleteProductSeries(w http.ResponseWriter, r *http.Request)

	CreateProductName(w http.ResponseWriter, r *http.Request)
	GetProductNameByID(w http.ResponseWriter, r *http.Request)
	ListProductNames(w http.ResponseWriter, r *http.Request)
	ListProductNamesBySeries(w http.ResponseWriter, r *http.Request)
	UpdateProductName(w http.ResponseWriter, r *http.Request)
	DeleteProductName(w http.ResponseWriter, r *http.Request)

	CreateWarrantyYear(w http.ResponseWriter, r *http.Request)
	GetWarrantyYearByID(w http.ResponseWriter, r *http.Request)
	ListWarrantyYears(w http.ResponseWriter, r *http.Request)
	UpdateWarrantyYear(w http.ResponseWriter, r *http.Request)
	DeleteWarrantyYear(w http.ResponseWriter, r *http.Request)

	CreateProduct(w http.ResponseWriter, r *http.Request)
	ListProducts(w http.ResponseWriter, r *http.Request)
	GetProductByID(w http.ResponseWriter, r *http.Request)
	UpdateProduct(w http.ResponseWriter, r *http.Request)
	DeleteProduct(w http.ResponseWriter, r *http.Request)

	ListProductsWithDetails(w http.ResponseWriter, r *http.Request)
	GetProductDetailsByID(w http.ResponseWriter, r *http.Request)
}

type productHandler struct {
	service services.ProductService
}

func NewProductHandler(service services.ProductService) ProductHandler {
	return &productHandler{
		service: service,
	}
}

// CreateProductBrand handles the creation of a new product brand
func (h *productHandler) CreateProductBrand(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateProductBrandRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Validate request
	if err := utils.ValidateStruct(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	brand, err := h.service.CreateProductBrand(r.Context(), req.Name)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create product brand")
		return
	}

	// Convert to response DTO
	response := dto.FromProductBrand(brand)
	utils.JSONResponse(w, http.StatusCreated, response)
}

// GetProductBrandByID retrieves a product brand by its ID
func (h *productHandler) GetProductBrandByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing brand ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid brand ID")
		return
	}

	brand, err := h.service.GetProductBrandByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusNotFound, "Product brand not found")
		return
	}

	// Convert to response DTO
	response := dto.FromProductBrand(brand)
	utils.JSONResponse(w, http.StatusOK, response)
}

// ListProductBrands lists all product brands
func (h *productHandler) ListProductBrands(w http.ResponseWriter, r *http.Request) {
	brands, err := h.service.ListProductBrands(r.Context())
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to list product brands")
		return
	}

	// Convert to response DTOs
	var responses []*dto.ProductBrandResponse
	for _, brand := range brands {
		responses = append(responses, dto.FromProductBrand(brand))
	}

	utils.JSONResponse(w, http.StatusOK, responses)
}

// UpdateProductBrand updates a product brand's details
func (h *productHandler) UpdateProductBrand(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing brand ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid brand ID")
		return
	}

	var req dto.UpdateProductBrandRequest
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
	params := req.ToUpdateProductBrandParams(id)

	brand, err := h.service.UpdateProductBrand(r.Context(), id, params)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update product brand")
		return
	}

	// Convert to response DTO
	response := dto.FromProductBrand(brand)
	utils.JSONResponse(w, http.StatusOK, response)
}

// DeleteProductBrand deletes a product brand by ID
func (h *productHandler) DeleteProductBrand(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Missing brand ID")
		return
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid brand ID")
		return
	}

	if err := h.service.DeleteProductBrand(r.Context(), id); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to delete product brand")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// CreateProductType handles the creation of a new product type
func (h *productHandler) CreateProductType(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateProductTypeRequest
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
	params, err := req.ToCreateProductTypeParams()
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request data: "+err.Error())
		return
	}

	productType, err := h.service.CreateProductType(r.Context(), params)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create product type")
		return
	}

	// Convert to response DTO
	response := dto.FromProductType(productType)
	utils.JSONResponse(w, http.StatusCreated, response)
}

// GetProductTypeByID retrieves a product type by its ID
func (h *productHandler) GetProductTypeByID(w http.ResponseWriter, r *http.Request) {
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

	response, err := h.service.GetProductTypeByID(r.Context(), uuid)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to get product type")
		return
	}

	utils.JSONResponse(w, http.StatusOK, response)
}

// ListProductTypes lists all product types
func (h *productHandler) ListProductTypes(w http.ResponseWriter, r *http.Request) {
	types, err := h.service.ListProductTypes(r.Context())
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to list product types")
		return
	}

	utils.JSONResponse(w, http.StatusOK, types)
}

// UpdateProductType updates a product type's details
func (h *productHandler) UpdateProductType(w http.ResponseWriter, r *http.Request) {
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

	response, err := h.service.UpdateProductType(r.Context(), &products.UpdateProductTypeParams{
		ID:   uuid,
		Name: req.Name,
	})
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update product type")
		return
	}

	utils.JSONResponse(w, http.StatusOK, response)
}

// DeleteProductType deletes a product type by its ID
func (h *productHandler) DeleteProductType(w http.ResponseWriter, r *http.Request) {
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

	if err := h.service.DeleteProductType(r.Context(), uuid); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to delete product type")
		return
	}

	utils.JSONResponse(w, http.StatusNoContent, nil)
}

// CreateProductSeries handles the creation of a new product series
func (h *productHandler) CreateProductSeries(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name          string `json:"name"`
		ProductTypeID string `json:"product_type_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	productTypeID, err := uuid.Parse(req.ProductTypeID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	response, err := h.service.CreateProductSeries(r.Context(), &products.CreateProductSeriesParams{
		Name:          req.Name,
		ProductTypeID: productTypeID,
	})
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create product series")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, response)
}

// GetProductSeriesByID retrieves a product series by its ID
func (h *productHandler) GetProductSeriesByID(w http.ResponseWriter, r *http.Request) {
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

	response, err := h.service.GetProductSeriesByID(r.Context(), uuid)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to get product series")
		return
	}

	utils.JSONResponse(w, http.StatusOK, response)
}

// ListProductSeries lists all product series
func (h *productHandler) ListProductSeries(w http.ResponseWriter, r *http.Request) {
	series, err := h.service.ListProductSeries(r.Context())
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to list product series")
		return
	}

	utils.JSONResponse(w, http.StatusOK, series)
}

// ListProductSeriesByType lists product series by product type ID
func (h *productHandler) ListProductSeriesByType(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ProductTypeID string `json:"product_type_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	productTypeID, err := uuid.Parse(req.ProductTypeID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	series, err := h.service.ListProductSeriesByType(r.Context(), productTypeID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to list product series")
		return
	}

	utils.JSONResponse(w, http.StatusOK, series)
}

// UpdateProductSeries updates a product series' details
func (h *productHandler) UpdateProductSeries(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID            string `json:"id"`
		Name          string `json:"name"`
		ProductTypeID string `json:"product_type_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	uuidID, err := uuid.Parse(req.ID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	productTypeID, err := uuid.Parse(req.ProductTypeID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	response, err := h.service.UpdateProductSeries(r.Context(), &products.UpdateProductSeriesParams{
		ID:            uuidID,
		Name:          req.Name,
		ProductTypeID: productTypeID,
	})
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update product series")
		return
	}

	utils.JSONResponse(w, http.StatusOK, response)
}

// DeleteProductSeries deletes a product series by its ID
func (h *productHandler) DeleteProductSeries(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID string `json:"id"`
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

	if err := h.service.DeleteProductSeries(r.Context(), id); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to delete product series")
		return
	}

	utils.JSONResponse(w, http.StatusNoContent, nil)
}

// CreateProductName creates a new product name under a specific product series
func (h *productHandler) CreateProductName(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name            string `json:"name"`
		ProductSeriesID string `json:"product_series_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	productSeriesID, err := uuid.Parse(req.ProductSeriesID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	response, err := h.service.CreateProductName(r.Context(), &products.CreateProductNameParams{
		Name:            req.Name,
		ProductSeriesID: productSeriesID,
	})
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create product name")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, response)
}

// GetProductNameByID retrieves a product name by its ID
func (h *productHandler) GetProductNameByID(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID string `json:"id"`
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

	response, err := h.service.GetProductNameByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to get product name")
		return
	}

	utils.JSONResponse(w, http.StatusOK, response)
}

// ListProductNames lists all product names
func (h *productHandler) ListProductNames(w http.ResponseWriter, r *http.Request) {
	names, err := h.service.ListProductNames(r.Context())
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to list product names")
		return
	}

	utils.JSONResponse(w, http.StatusOK, names)
}

// ListProductNamesBySeries lists product names by product series ID
func (h *productHandler) ListProductNamesBySeries(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ProductSeriesID string `json:"product_series_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	productSeriesID, err := uuid.Parse(req.ProductSeriesID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	names, err := h.service.ListProductNamesBySeries(r.Context(), productSeriesID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to list product names by series")
		return
	}

	utils.JSONResponse(w, http.StatusOK, names)
}

// UpdateProductName updates a product name's details
func (h *productHandler) UpdateProductName(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID              string `json:"id"`
		Name            string `json:"name"`
		ProductSeriesID string `json:"product_series_id"`
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

	productSeriesID, err := uuid.Parse(req.ProductSeriesID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	response, err := h.service.UpdateProductName(r.Context(), &products.UpdateProductNameParams{
		ID:              id,
		Name:            req.Name,
		ProductSeriesID: productSeriesID,
	})
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update product name")
		return
	}

	utils.JSONResponse(w, http.StatusOK, response)
}

// DeleteProductName deletes a product name by its ID
func (h *productHandler) DeleteProductName(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID string `json:"id"`
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

	if err := h.service.DeleteProductName(r.Context(), id); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to delete product name")
		return
	}

	utils.JSONResponse(w, http.StatusNoContent, nil)
}

// CreateWarrantyYear creates a new warranty year entry
func (h *productHandler) CreateWarrantyYear(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Years int32 `json:"years"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	warrantyYear, err := h.service.CreateWarrantyYear(r.Context(), req.Years)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create warranty year")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, warrantyYear)
}

// GetWarrantyYearByID retrieves a warranty year by its ID
func (h *productHandler) GetWarrantyYearByID(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID string `json:"id"`
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

	warrantyYear, err := h.service.GetWarrantyYearByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to retrieve warranty year")
		return
	}

	utils.JSONResponse(w, http.StatusOK, warrantyYear)
}

// ListWarrantyYears lists all warranty years
func (h *productHandler) ListWarrantyYears(w http.ResponseWriter, r *http.Request) {
	warrantyYears, err := h.service.ListWarrantyYears(r.Context())
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to retrieve warranty years")
		return
	}

	utils.JSONResponse(w, http.StatusOK, warrantyYears)
}

// UpdateWarrantyYear updates a warranty year's details
func (h *productHandler) UpdateWarrantyYear(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID    string `json:"id"`
		Years int32  `json:"years"`
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

	warrantyYear, err := h.service.UpdateWarrantyYear(r.Context(), &products.UpdateWarrantyYearParams{
		ID:    id,
		Years: req.Years,
	})
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update warranty year")
		return
	}

	utils.JSONResponse(w, http.StatusOK, warrantyYear)
}

// DeleteWarrantyYear deletes a warranty year by its ID
func (h *productHandler) DeleteWarrantyYear(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID string `json:"id"`
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

	if err := h.service.DeleteWarrantyYear(r.Context(), id); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to delete warranty year")
		return
	}

	utils.JSONResponse(w, http.StatusNoContent, nil)
}

// CreateProduct creates a new product entry
func (h *productHandler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ProductNameID  string `json:"product_name_id"`
		ProductBrandID string `json:"product_brand_id"`
		WarrantyYears  int32  `json:"warranty_years"`
		FilmSerialNo   string `json:"film_serial_no"`
		FilmQuantity   int32  `json:"film_quantity"`
		FilmShipmentNo string `json:"film_shipment_no"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	productNameID, err := uuid.Parse(req.ProductNameID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format for Product Name ID")
		return
	}
	productBrandID, err := uuid.Parse(req.ProductBrandID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format for Product Brand ID")
		return
	}

	product, err := h.service.CreateProduct(r.Context(), &products.CreateProductParams{
		ProductNameID:  productNameID,
		ProductBrandID: productBrandID,
		WarrantyYears:  req.WarrantyYears,
		FilmSerialNo:   req.FilmSerialNo,
		FilmQuantity:   req.FilmQuantity,
		FilmShipmentNo: req.FilmShipmentNo,
	})
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create product")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, product)
}

// GetProductByID retrieves a product by its ID
func (h *productHandler) GetProductByID(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID string `json:"id"`
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

	product, err := h.service.GetProductByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to retrieve product")
		return
	}

	utils.JSONResponse(w, http.StatusOK, product)
}

// ListProducts lists all products
func (h *productHandler) ListProducts(w http.ResponseWriter, r *http.Request) {
	products, err := h.service.ListProducts(r.Context())
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to retrieve products")
		return
	}

	utils.JSONResponse(w, http.StatusOK, products)
}

// UpdateProduct updates a product's details
func (h *productHandler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID             string `json:"id"`
		ProductNameID  string `json:"product_name_id"`
		ProductBrandID string `json:"product_brand_id"`
		WarrantyYears  int32  `json:"warranty_years"`
		FilmSerialNo   string `json:"film_serial_no"`
		FilmQuantity   int32  `json:"film_quantity"`
		FilmShipmentNo string `json:"film_shipment_no"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	id, err := uuid.Parse(req.ID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format for Product ID")
		return
	}
	productNameID, err := uuid.Parse(req.ProductNameID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format for Product Name ID")
		return
	}
	productBrandID, err := uuid.Parse(req.ProductBrandID)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid UUID format for Product Brand ID")
		return
	}

	product, err := h.service.UpdateProduct(r.Context(), id, &products.UpdateProductParams{
		ID:             id,
		ProductNameID:  productNameID,
		ProductBrandID: productBrandID,
		WarrantyYears:  req.WarrantyYears,
		FilmSerialNo:   req.FilmSerialNo,
		FilmQuantity:   req.FilmQuantity,
		FilmShipmentNo: req.FilmShipmentNo,
	})
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update product")
		return
	}

	utils.JSONResponse(w, http.StatusOK, product)
}

// DeleteProduct deletes a product by its ID
func (h *productHandler) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID string `json:"id"`
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

	if err := h.service.DeleteProduct(r.Context(), id); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to delete product")
		return
	}

	utils.JSONResponse(w, http.StatusNoContent, nil)
}

// ListProductsWithDetails lists all products with detailed information
func (h *productHandler) ListProductsWithDetails(w http.ResponseWriter, r *http.Request) {
	products, err := h.service.ListProductsWithDetails(r.Context())
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to retrieve product details")
		return
	}

	utils.JSONResponse(w, http.StatusOK, products)
}

// GetProductDetailsByID retrieves detailed information of a product by its ID
func (h *productHandler) GetProductDetailsByID(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID string `json:"id"`
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

	product, err := h.service.GetProductDetailsByID(r.Context(), id)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to retrieve product details")
		return
	}

	utils.JSONResponse(w, http.StatusOK, product)
}
