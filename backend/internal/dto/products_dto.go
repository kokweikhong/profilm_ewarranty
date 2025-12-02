package dto

import (
	"time"

	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/products"
)

// Requests
type CreateProductRequest struct {
	BrandID          int32  `json:"brandId"`
	TypeID           int32  `json:"typeId"`
	SeriesID         int32  `json:"seriesId"`
	NameID           int32  `json:"nameId"`
	WarrantyInMonths int32  `json:"warrantyInMonths"`
	FilmSerialNumber string `json:"filmSerialNumber"`
	FilmQuantity     int32  `json:"filmQuantity"`
	ShipmentNumber   string `json:"shipmentNumber"`
	Description      string `json:"description"`
}

func ToCreateProductRequestParams(dto *CreateProductRequest) *products.CreateProductParams {
	return &products.CreateProductParams{
		BrandID:          dto.BrandID,
		TypeID:           dto.TypeID,
		SeriesID:         dto.SeriesID,
		NameID:           dto.NameID,
		WarrantyInMonths: dto.WarrantyInMonths,
		FilmSerialNumber: dto.FilmSerialNumber,
		FilmQuantity:     dto.FilmQuantity,
		ShipmentNumber:   dto.ShipmentNumber,
		Description:      dto.Description,
	}
}

type UpdateProductRequest struct {
	ID               int32  `json:"id"`
	BrandID          int32  `json:"brandId"`
	TypeID           int32  `json:"typeId"`
	SeriesID         int32  `json:"seriesId"`
	NameID           int32  `json:"nameId"`
	WarrantyInMonths int32  `json:"warrantyInMonths"`
	FilmSerialNumber string `json:"filmSerialNumber"`
	FilmQuantity     int32  `json:"filmQuantity"`
	ShipmentNumber   string `json:"shipmentNumber"`
	Description      string `json:"description"`
	IsActive         bool   `json:"isActive"`
}

func ToUpdateProductRequestParams(dto *UpdateProductRequest) *products.UpdateProductParams {
	return &products.UpdateProductParams{
		ID:               dto.ID,
		BrandID:          dto.BrandID,
		TypeID:           dto.TypeID,
		SeriesID:         dto.SeriesID,
		NameID:           dto.NameID,
		WarrantyInMonths: dto.WarrantyInMonths,
		FilmSerialNumber: dto.FilmSerialNumber,
		FilmQuantity:     dto.FilmQuantity,
		ShipmentNumber:   dto.ShipmentNumber,
		Description:      dto.Description,
		IsActive:         dto.IsActive,
	}
}

// Responses (flattened for API stability)

type ProductView struct {
	ProductID        int32     `json:"productId"`
	BrandName        string    `json:"brandName"`
	TypeName         string    `json:"typeName"`
	SeriesName       string    `json:"seriesName"`
	ProductName      string    `json:"productName"`
	WarrantyPeriod   int32     `json:"warrantyPeriod"`
	FilmSerialNumber string    `json:"filmSerialNumber"`
	FilmQuantity     int32     `json:"filmQuantity"`
	ShipmentNumber   string    `json:"shipmentNumber"`
	Description      string    `json:"description"`
	IsActive         bool      `json:"isActive"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
}

type Product struct {
	ID               int32     `json:"id"`
	BrandID          int32     `json:"brandId"`
	TypeID           int32     `json:"typeId"`
	SeriesID         int32     `json:"seriesId"`
	NameID           int32     `json:"nameId"`
	WarrantyPeriodID int32     `json:"warrantyPeriodId"`
	FilmSerialNumber string    `json:"filmSerialNumber"`
	FilmQuantity     int32     `json:"filmQuantity"`
	ShipmentNumber   string    `json:"shipmentNumber"`
	Description      string    `json:"description"`
	IsActive         bool      `json:"isActive"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
}

type ProductBrand struct {
	ID          int32     `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type ProductType struct {
	ID          int32     `json:"id"`
	BrandID     int32     `json:"brandId"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type ProductSeries struct {
	ID          int32     `json:"id"`
	TypeID      int32     `json:"typeId"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type ProductName struct {
	ID          int32     `json:"id"`
	SeriesID    int32     `json:"seriesId"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type WarrantyPeriod struct {
	ID          int32     `json:"id"`
	PeriodYears int32     `json:"periodYears"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}
