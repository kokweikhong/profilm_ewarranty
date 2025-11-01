# Product Handler Refactoring Guide

Based on the products_dto.go, here's how to update your product_handler.go:

## 1. Updated Imports

```go
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
```

## 2. Handler Pattern Examples

### CREATE Handler Pattern

```go
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
```

### GET BY ID Handler Pattern

```go
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
```

### LIST Handler Pattern

```go
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
```

### UPDATE Handler Pattern

```go
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
```

### DELETE Handler Pattern

```go
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
```

## 3. Service Method Signature Differences

### Simple Create (just takes a string):

- `CreateProductBrand(ctx, name string)`
- `CreateWarrantyYear(ctx, years int32)`

### Params Create (takes full SQLC params):

- `CreateProductType(ctx, *CreateProductTypeParams)`
- `CreateProductSeries(ctx, *CreateProductSeriesParams)`
- `CreateProductName(ctx, *CreateProductNameParams)`
- `CreateProduct(ctx, *CreateProductParams)`

## 4. Apply This Pattern To All Handlers

For each entity (ProductType, ProductSeries, ProductName, WarrantyYear, Product):

1. **CREATE**: Use appropriate DTO request → validate → convert to params (if needed) → call service → convert response
2. **GET BY ID**: Get ID from URL → parse UUID → call service → convert response
3. **LIST**: Call service → convert array response
4. **UPDATE**: Get ID from URL + DTO request → validate → convert to params → call service → convert response
5. **DELETE**: Get ID from URL → call service → return 204

## 5. Key Changes Made

✅ **Proper REST patterns**: GET/DELETE use URL parameters, not request body  
✅ **DTO usage**: All requests/responses use DTOs instead of inline structs  
✅ **Validation**: All requests are validated using struct tags  
✅ **Error handling**: Better error messages and status codes  
✅ **Response formatting**: Consistent JSON responses with proper DTOs  
✅ **UUID handling**: Proper UUID parsing and error handling

## 6. Benefits

- **Type Safety**: DTOs prevent UUID/pgtype issues
- **Validation**: Input validation with clear error messages
- **Consistency**: All handlers follow the same pattern
- **Maintainability**: Easy to update API without changing database schema
- **Documentation**: Clear request/response structure for API docs
