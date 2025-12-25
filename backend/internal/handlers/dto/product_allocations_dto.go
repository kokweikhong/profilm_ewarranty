package dto

import (
	"fmt"
	"time"

	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/productallocations"
)

// CreateProductAllocationRequest represents the request body for creating a product allocation
type CreateProductAllocationRequest struct {
	ProductID      int32  `json:"productId" binding:"required"`
	ShopID         int32  `json:"shopId" binding:"required"`
	FilmQuantity   int32  `json:"filmQuantity" binding:"required"`
	AllocationDate string `json:"allocationDate" binding:"required"` // Format: YYYY-MM-DD
}

// ToCreateProductAllocationParams converts CreateProductAllocationRequest to productallocations.CreateProductAllocationParams
func (r *CreateProductAllocationRequest) ToCreateProductAllocationParams() (*productallocations.CreateProductAllocationParams, error) {
	allocationDate, err := time.Parse("2006-01-02", r.AllocationDate)
	if err != nil {
		return nil, fmt.Errorf("invalid allocation date format: %w", err)
	}

	return &productallocations.CreateProductAllocationParams{
		ProductID:      r.ProductID,
		ShopID:         r.ShopID,
		FilmQuantity:   r.FilmQuantity,
		AllocationDate: allocationDate,
	}, nil
}

// UpdateProductAllocationRequest represents the request body for updating a product allocation
type UpdateProductAllocationRequest struct {
	ProductID      int32  `json:"productId" binding:"required"`
	ShopID         int32  `json:"shopId" binding:"required"`
	FilmQuantity   int32  `json:"filmQuantity" binding:"required"`
	AllocationDate string `json:"allocationDate" binding:"required"` // Format: YYYY-MM-DD
}

// ToUpdateProductAllocationParams converts UpdateProductAllocationRequest to productallocations.UpdateProductAllocationParams
func (r *UpdateProductAllocationRequest) ToUpdateProductAllocationParams(id int32) (*productallocations.UpdateProductAllocationParams, error) {
	allocationDate, err := time.Parse("2006-01-02", r.AllocationDate)
	if err != nil {
		return nil, fmt.Errorf("invalid allocation date format: %w", err)
	}

	return &productallocations.UpdateProductAllocationParams{
		ID:             id,
		ProductID:      r.ProductID,
		ShopID:         r.ShopID,
		FilmQuantity:   r.FilmQuantity,
		AllocationDate: allocationDate,
	}, nil
}

// ProductAllocationResponse wraps the productallocations.ProductAllocation model for API responses
type ProductAllocationResponse struct {
	*productallocations.ProductAllocation
}

// ProductAllocationViewResponse wraps the productallocations.ListProductAllocationsViewRow model for API responses
type ProductAllocationViewResponse struct {
	*productallocations.ListProductAllocationsViewRow
}
