package dto

import "github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/products"

// CreateProductRequest represents the request body for creating a product
type CreateProductRequest struct {
	BrandID          int32  `json:"brandId" binding:"required"`
	TypeID           int32  `json:"typeId" binding:"required"`
	SeriesID         int32  `json:"seriesId" binding:"required"`
	NameID           int32  `json:"nameId" binding:"required"`
	WarrantyInMonths int32  `json:"warrantyInMonths" binding:"required"`
	FilmSerialNumber string `json:"filmSerialNumber" binding:"required"`
	FilmQuantity     int32  `json:"filmQuantity" binding:"required"`
	ShipmentNumber   string `json:"shipmentNumber" binding:"required"`
	Description      string `json:"description"`
}

// ToCreateProductParams converts CreateProductRequest to products.CreateProductParams
func (r *CreateProductRequest) ToCreateProductParams() *products.CreateProductParams {
	return &products.CreateProductParams{
		BrandID:          r.BrandID,
		TypeID:           r.TypeID,
		SeriesID:         r.SeriesID,
		NameID:           r.NameID,
		WarrantyInMonths: r.WarrantyInMonths,
		FilmSerialNumber: r.FilmSerialNumber,
		FilmQuantity:     r.FilmQuantity,
		ShipmentNumber:   r.ShipmentNumber,
		Description:      r.Description,
	}
}

// UpdateProductRequest represents the request body for updating a product
type UpdateProductRequest struct {
	BrandID          int32  `json:"brandId" binding:"required"`
	TypeID           int32  `json:"typeId" binding:"required"`
	SeriesID         int32  `json:"seriesId" binding:"required"`
	NameID           int32  `json:"nameId" binding:"required"`
	WarrantyInMonths int32  `json:"warrantyInMonths" binding:"required"`
	FilmSerialNumber string `json:"filmSerialNumber" binding:"required"`
	FilmQuantity     int32  `json:"filmQuantity" binding:"required"`
	ShipmentNumber   string `json:"shipmentNumber" binding:"required"`
	Description      string `json:"description"`
	IsActive         bool   `json:"isActive"`
}

// ToUpdateProductParams converts UpdateProductRequest to products.UpdateProductParams
func (r *UpdateProductRequest) ToUpdateProductParams(id int32) *products.UpdateProductParams {
	return &products.UpdateProductParams{
		ID:               id,
		BrandID:          r.BrandID,
		TypeID:           r.TypeID,
		SeriesID:         r.SeriesID,
		NameID:           r.NameID,
		WarrantyInMonths: r.WarrantyInMonths,
		FilmSerialNumber: r.FilmSerialNumber,
		FilmQuantity:     r.FilmQuantity,
		ShipmentNumber:   r.ShipmentNumber,
		Description:      r.Description,
		IsActive:         r.IsActive,
	}
}

// ProductResponse wraps the products.Product model for API responses
type ProductResponse struct {
	*products.Product
}

// ProductViewResponse wraps the products.ProductsView model for API responses
type ProductViewResponse struct {
	*products.ProductsView
}

// ProductBrandResponse wraps the products.ProductBrand model for API responses
type ProductBrandResponse struct {
	*products.ProductBrand
}

// ProductTypeResponse wraps the products.ProductType model for API responses
type ProductTypeResponse struct {
	*products.ProductType
}

// ProductSeriesResponse wraps the products.ProductSeries model for API responses
type ProductSeriesResponse struct {
	*products.ProductSeries
}

// ProductNameResponse wraps the products.ProductName model for API responses
type ProductNameResponse struct {
	*products.ProductName
}
