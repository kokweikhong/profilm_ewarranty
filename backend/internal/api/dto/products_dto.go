package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/products"
)

// ===========================================
// PRODUCT BRAND DTOs
// ===========================================

// CreateProductBrandRequest represents the request payload for creating a product brand
type CreateProductBrandRequest struct {
	Name string `json:"name" validate:"required,min=1,max=100"`
}

// UpdateProductBrandRequest represents the request payload for updating a product brand
type UpdateProductBrandRequest struct {
	Name *string `json:"name,omitempty" validate:"omitempty,min=1,max=100"`
}

// ProductBrandResponse represents the response payload for a product brand
type ProductBrandResponse struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	IsActive  bool      `json:"isActive"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// ToUpdateProductBrandParams converts UpdateProductBrandRequest to SQLC UpdateProductBrandParams
func (r *UpdateProductBrandRequest) ToUpdateProductBrandParams(id uuid.UUID) *products.UpdateProductBrandParams {
	params := &products.UpdateProductBrandParams{
		ID: id,
	}

	if r.Name != nil {
		params.Name = *r.Name
	}

	return params
}

// FromProductBrand converts SQLC ProductBrand to ProductBrandResponse
func FromProductBrand(brand *products.ProductBrand) *ProductBrandResponse {
	var isActive bool
	if brand.IsActive.Valid {
		isActive = brand.IsActive.Bool
	}

	return &ProductBrandResponse{
		ID:        brand.ID.String(),
		Name:      brand.Name,
		IsActive:  isActive,
		CreatedAt: brand.CreatedAt,
		UpdatedAt: brand.UpdatedAt,
	}
}

// ===========================================
// PRODUCT TYPE DTOs
// ===========================================

// CreateProductTypeRequest represents the request payload for creating a product type
type CreateProductTypeRequest struct {
	BrandID string `json:"brandId" validate:"required,uuid"`
	Name    string `json:"name" validate:"required,min=1,max=100"`
}

// UpdateProductTypeRequest represents the request payload for updating a product type
type UpdateProductTypeRequest struct {
	BrandID *string `json:"brandId,omitempty" validate:"omitempty,uuid"`
	Name    *string `json:"name,omitempty" validate:"omitempty,min=1,max=100"`
}

// ProductTypeResponse represents the response payload for a product type
type ProductTypeResponse struct {
	ID        string    `json:"id"`
	BrandID   string    `json:"brandId"`
	Name      string    `json:"name"`
	IsActive  bool      `json:"isActive"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// ToCreateProductTypeParams converts CreateProductTypeRequest to SQLC CreateProductTypeParams
func (r *CreateProductTypeRequest) ToCreateProductTypeParams() (*products.CreateProductTypeParams, error) {
	brandID, err := uuid.Parse(r.BrandID)
	if err != nil {
		return nil, err
	}

	return &products.CreateProductTypeParams{
		BrandID: brandID,
		Name:    r.Name,
	}, nil
}

// ToUpdateProductTypeParams converts UpdateProductTypeRequest to SQLC UpdateProductTypeParams
func (r *UpdateProductTypeRequest) ToUpdateProductTypeParams(currentType *products.ProductType) (*products.UpdateProductTypeParams, error) {
	params := &products.UpdateProductTypeParams{
		ID:      currentType.ID,
		BrandID: currentType.BrandID,
		Name:    currentType.Name,
	}

	if r.BrandID != nil {
		brandID, err := uuid.Parse(*r.BrandID)
		if err != nil {
			return nil, err
		}
		params.BrandID = brandID
	}
	if r.Name != nil {
		params.Name = *r.Name
	}

	return params, nil
}

// FromProductType converts SQLC ProductType to ProductTypeResponse
func FromProductType(productType *products.ProductType) *ProductTypeResponse {
	var isActive bool
	if productType.IsActive.Valid {
		isActive = productType.IsActive.Bool
	}

	return &ProductTypeResponse{
		ID:        productType.ID.String(),
		BrandID:   productType.BrandID.String(),
		Name:      productType.Name,
		IsActive:  isActive,
		CreatedAt: productType.CreatedAt,
		UpdatedAt: productType.UpdatedAt,
	}
}

// ===========================================
// PRODUCT SERIES DTOs
// ===========================================

// CreateProductSeriesRequest represents the request payload for creating a product series
type CreateProductSeriesRequest struct {
	ProductTypeID string `json:"productTypeId" validate:"required,uuid"`
	Name          string `json:"name" validate:"required,min=1,max=100"`
}

// UpdateProductSeriesRequest represents the request payload for updating a product series
type UpdateProductSeriesRequest struct {
	ProductTypeID *string `json:"productTypeId,omitempty" validate:"omitempty,uuid"`
	Name          *string `json:"name,omitempty" validate:"omitempty,min=1,max=100"`
}

// ProductSeriesResponse represents the response payload for a product series
type ProductSeriesResponse struct {
	ID            string    `json:"id"`
	ProductTypeID string    `json:"productTypeId"`
	Name          string    `json:"name"`
	IsActive      bool      `json:"isActive"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

// ToCreateProductSeriesParams converts CreateProductSeriesRequest to SQLC CreateProductSeriesParams
func (r *CreateProductSeriesRequest) ToCreateProductSeriesParams() (*products.CreateProductSeriesParams, error) {
	productTypeID, err := uuid.Parse(r.ProductTypeID)
	if err != nil {
		return nil, err
	}

	return &products.CreateProductSeriesParams{
		ProductTypeID: productTypeID,
		Name:          r.Name,
	}, nil
}

// ToUpdateProductSeriesParams converts UpdateProductSeriesRequest to SQLC UpdateProductSeriesParams
func (r *UpdateProductSeriesRequest) ToUpdateProductSeriesParams(currentSeries *products.ProductSeries) (*products.UpdateProductSeriesParams, error) {
	params := &products.UpdateProductSeriesParams{
		ID:            currentSeries.ID,
		ProductTypeID: currentSeries.ProductTypeID,
		Name:          currentSeries.Name,
	}

	if r.ProductTypeID != nil {
		productTypeID, err := uuid.Parse(*r.ProductTypeID)
		if err != nil {
			return nil, err
		}
		params.ProductTypeID = productTypeID
	}
	if r.Name != nil {
		params.Name = *r.Name
	}

	return params, nil
}

// FromProductSeries converts SQLC ProductSeries to ProductSeriesResponse
func FromProductSeries(series *products.ProductSeries) *ProductSeriesResponse {
	var isActive bool
	if series.IsActive.Valid {
		isActive = series.IsActive.Bool
	}

	return &ProductSeriesResponse{
		ID:            series.ID.String(),
		ProductTypeID: series.ProductTypeID.String(),
		Name:          series.Name,
		IsActive:      isActive,
		CreatedAt:     series.CreatedAt,
		UpdatedAt:     series.UpdatedAt,
	}
}

// ===========================================
// PRODUCT NAME DTOs
// ===========================================

// CreateProductNameRequest represents the request payload for creating a product name
type CreateProductNameRequest struct {
	ProductSeriesID string `json:"productSeriesId" validate:"required,uuid"`
	Name            string `json:"name" validate:"required,min=1,max=100"`
}

// UpdateProductNameRequest represents the request payload for updating a product name
type UpdateProductNameRequest struct {
	ProductSeriesID *string `json:"productSeriesId,omitempty" validate:"omitempty,uuid"`
	Name            *string `json:"name,omitempty" validate:"omitempty,min=1,max=100"`
}

// ProductNameResponse represents the response payload for a product name
type ProductNameResponse struct {
	ID              string    `json:"id"`
	ProductSeriesID string    `json:"productSeriesId"`
	Name            string    `json:"name"`
	IsActive        bool      `json:"isActive"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

// ToCreateProductNameParams converts CreateProductNameRequest to SQLC CreateProductNameParams
func (r *CreateProductNameRequest) ToCreateProductNameParams() (*products.CreateProductNameParams, error) {
	productSeriesID, err := uuid.Parse(r.ProductSeriesID)
	if err != nil {
		return nil, err
	}

	return &products.CreateProductNameParams{
		ProductSeriesID: productSeriesID,
		Name:            r.Name,
	}, nil
}

// ToUpdateProductNameParams converts UpdateProductNameRequest to SQLC UpdateProductNameParams
func (r *UpdateProductNameRequest) ToUpdateProductNameParams(currentName *products.ProductName) (*products.UpdateProductNameParams, error) {
	params := &products.UpdateProductNameParams{
		ID:              currentName.ID,
		ProductSeriesID: currentName.ProductSeriesID,
		Name:            currentName.Name,
	}

	if r.ProductSeriesID != nil {
		productSeriesID, err := uuid.Parse(*r.ProductSeriesID)
		if err != nil {
			return nil, err
		}
		params.ProductSeriesID = productSeriesID
	}
	if r.Name != nil {
		params.Name = *r.Name
	}

	return params, nil
}

// FromProductName converts SQLC ProductName to ProductNameResponse
func FromProductName(name *products.ProductName) *ProductNameResponse {
	var isActive bool
	if name.IsActive.Valid {
		isActive = name.IsActive.Bool
	}

	return &ProductNameResponse{
		ID:              name.ID.String(),
		ProductSeriesID: name.ProductSeriesID.String(),
		Name:            name.Name,
		IsActive:        isActive,
		CreatedAt:       name.CreatedAt,
		UpdatedAt:       name.UpdatedAt,
	}
}

// ===========================================
// WARRANTY YEAR DTOs
// ===========================================

// CreateWarrantyYearRequest represents the request payload for creating warranty years
type CreateWarrantyYearRequest struct {
	Years int32 `json:"years" validate:"required,min=1,max=100"`
}

// UpdateWarrantyYearRequest represents the request payload for updating warranty years
type UpdateWarrantyYearRequest struct {
	Years *int32 `json:"years,omitempty" validate:"omitempty,min=1,max=100"`
}

// WarrantyYearResponse represents the response payload for warranty years
type WarrantyYearResponse struct {
	ID        string    `json:"id"`
	Years     int32     `json:"years"`
	IsActive  bool      `json:"isActive"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// ToUpdateWarrantyYearParams converts UpdateWarrantyYearRequest to SQLC UpdateWarrantyYearParams
func (r *UpdateWarrantyYearRequest) ToUpdateWarrantyYearParams(currentWarrantyYear *products.WarrantyYear) *products.UpdateWarrantyYearParams {
	params := &products.UpdateWarrantyYearParams{
		ID:    currentWarrantyYear.ID,
		Years: currentWarrantyYear.Years,
	}

	if r.Years != nil {
		params.Years = *r.Years
	}

	return params
}

// FromWarrantyYear converts SQLC WarrantyYear to WarrantyYearResponse
func FromWarrantyYear(warrantyYear *products.WarrantyYear) *WarrantyYearResponse {
	var isActive bool
	if warrantyYear.IsActive.Valid {
		isActive = warrantyYear.IsActive.Bool
	}

	return &WarrantyYearResponse{
		ID:        warrantyYear.ID.String(),
		Years:     warrantyYear.Years,
		IsActive:  isActive,
		CreatedAt: warrantyYear.CreatedAt,
		UpdatedAt: warrantyYear.UpdatedAt,
	}
}

// ===========================================
// PRODUCT DTOs
// ===========================================

// CreateProductRequest represents the request payload for creating a product
type CreateProductRequest struct {
	ProductNameID  string `json:"productNameId" validate:"required,uuid"`
	ProductBrandID string `json:"productBrandId" validate:"required,uuid"`
	WarrantyYears  int32  `json:"warrantyYears" validate:"required,min=1"`
	FilmSerialNo   string `json:"filmSerialNo" validate:"required,min=1,max=100"`
	FilmQuantity   int32  `json:"filmQuantity" validate:"required,min=1"`
	FilmShipmentNo string `json:"filmShipmentNo" validate:"required,min=1,max=100"`
}

// UpdateProductRequest represents the request payload for updating a product
type UpdateProductRequest struct {
	ProductNameID  *string `json:"productNameId,omitempty" validate:"omitempty,uuid"`
	ProductBrandID *string `json:"productBrandId,omitempty" validate:"omitempty,uuid"`
	WarrantyYears  *int32  `json:"warrantyYears,omitempty" validate:"omitempty,min=1"`
	FilmSerialNo   *string `json:"filmSerialNo,omitempty" validate:"omitempty,min=1,max=100"`
	FilmQuantity   *int32  `json:"filmQuantity,omitempty" validate:"omitempty,min=1"`
	FilmShipmentNo *string `json:"filmShipmentNo,omitempty" validate:"omitempty,min=1,max=100"`
}

// ProductResponse represents the response payload for a product
type ProductResponse struct {
	ID             string    `json:"id"`
	ProductNameID  string    `json:"productNameId"`
	ProductBrandID string    `json:"productBrandId"`
	WarrantyYears  int32     `json:"warrantyYears"`
	FilmSerialNo   string    `json:"filmSerialNo"`
	FilmQuantity   int32     `json:"filmQuantity"`
	FilmShipmentNo string    `json:"filmShipmentNo"`
	IsActive       bool      `json:"isActive"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

// ToCreateProductParams converts CreateProductRequest to SQLC CreateProductParams
func (r *CreateProductRequest) ToCreateProductParams() (*products.CreateProductParams, error) {
	productNameID, err := uuid.Parse(r.ProductNameID)
	if err != nil {
		return nil, err
	}

	productBrandID, err := uuid.Parse(r.ProductBrandID)
	if err != nil {
		return nil, err
	}

	return &products.CreateProductParams{
		ProductNameID:  productNameID,
		ProductBrandID: productBrandID,
		WarrantyYears:  r.WarrantyYears,
		FilmSerialNo:   r.FilmSerialNo,
		FilmQuantity:   r.FilmQuantity,
		FilmShipmentNo: r.FilmShipmentNo,
	}, nil
}

// ToUpdateProductParams converts UpdateProductRequest to SQLC UpdateProductParams
func (r *UpdateProductRequest) ToUpdateProductParams(currentProduct *products.Product) (*products.UpdateProductParams, error) {
	params := &products.UpdateProductParams{
		ID:             currentProduct.ID,
		ProductNameID:  currentProduct.ProductNameID,
		ProductBrandID: currentProduct.ProductBrandID,
		WarrantyYears:  currentProduct.WarrantyYears,
		FilmSerialNo:   currentProduct.FilmSerialNo,
		FilmQuantity:   currentProduct.FilmQuantity,
		FilmShipmentNo: currentProduct.FilmShipmentNo,
	}

	if r.ProductNameID != nil {
		productNameID, err := uuid.Parse(*r.ProductNameID)
		if err != nil {
			return nil, err
		}
		params.ProductNameID = productNameID
	}
	if r.ProductBrandID != nil {
		productBrandID, err := uuid.Parse(*r.ProductBrandID)
		if err != nil {
			return nil, err
		}
		params.ProductBrandID = productBrandID
	}
	if r.WarrantyYears != nil {
		params.WarrantyYears = *r.WarrantyYears
	}
	if r.FilmSerialNo != nil {
		params.FilmSerialNo = *r.FilmSerialNo
	}
	if r.FilmQuantity != nil {
		params.FilmQuantity = *r.FilmQuantity
	}
	if r.FilmShipmentNo != nil {
		params.FilmShipmentNo = *r.FilmShipmentNo
	}

	return params, nil
}

// FromProduct converts SQLC Product to ProductResponse
func FromProduct(product *products.Product) *ProductResponse {
	var isActive bool
	if product.IsActive.Valid {
		isActive = product.IsActive.Bool
	}

	return &ProductResponse{
		ID:             product.ID.String(),
		ProductNameID:  product.ProductNameID.String(),
		ProductBrandID: product.ProductBrandID.String(),
		WarrantyYears:  product.WarrantyYears,
		FilmSerialNo:   product.FilmSerialNo,
		FilmQuantity:   product.FilmQuantity,
		FilmShipmentNo: product.FilmShipmentNo,
		IsActive:       isActive,
		CreatedAt:      product.CreatedAt,
		UpdatedAt:      product.UpdatedAt,
	}
}

// ProductDetailsResponse represents the detailed response payload for a product
type ProductDetailsResponse struct {
	ProductID      uuid.UUID `json:"id"`
	ProductName    string    `json:"name"`
	ProductSeries  string    `json:"series"`
	ProductType    string    `json:"type"`
	ProductBrand   string    `json:"brand"`
	WarrantyYears  int32     `json:"warrantyYears"`
	FilmSerialNo   string    `json:"filmSerialNo"`
	FilmQuantity   int32     `json:"filmQuantity"`
	FilmShipmentNo string    `json:"filmShipmentNo"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

// FromProductDetails converts SQLC ProductDetails to ProductDetailsResponse
func FromProductDetails(details *products.VwProductDetail) *ProductDetailsResponse {
	return &ProductDetailsResponse{
		ProductID:      details.ProductID,
		ProductName:    details.ProductName,
		ProductSeries:  details.ProductSeries,
		ProductType:    details.ProductType,
		ProductBrand:   details.ProductBrand,
		WarrantyYears:  details.WarrantyYears,
		FilmSerialNo:   details.FilmSerialNo,
		FilmQuantity:   details.FilmQuantity,
		FilmShipmentNo: details.FilmShipmentNo,
		CreatedAt:      details.CreatedAt,
		UpdatedAt:      details.UpdatedAt,
	}
}