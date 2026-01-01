package dto

import (
	"fmt"
	"time"

	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/warranties"
)

// CreateWarrantyRequest represents the request body for creating a warranty
type CreateWarrantyRequest struct {
	ShopID               int32   `json:"shopId" binding:"required"`
	ClientName           string  `json:"clientName" binding:"required"`
	ClientContact        string  `json:"clientContact" binding:"required"`
	ClientEmail          string  `json:"clientEmail" binding:"required,email"`
	CarBrand             string  `json:"carBrand" binding:"required"`
	CarModel             string  `json:"carModel" binding:"required"`
	CarColour            string  `json:"carColour" binding:"required"`
	CarPlateNo           string  `json:"carPlateNo" binding:"required"`
	CarChassisNo         string  `json:"carChassisNo" binding:"required"`
	InstallationDate     string  `json:"installationDate" binding:"required"` // Format: YYYY-MM-DD
	ReferenceNo          *string `json:"referenceNo"`
	WarrantyNo           string  `json:"warrantyNo" binding:"required"`
	InvoiceAttachmentUrl string  `json:"invoiceAttachmentUrl"`
}

// ToCreateWarrantyParams converts CreateWarrantyRequest to warranties.CreateWarrantyParams
func (r *CreateWarrantyRequest) ToCreateWarrantyParams() (*warranties.CreateWarrantyParams, error) {
	installationDate, err := time.Parse("2006-01-02", r.InstallationDate)
	if err != nil {
		return nil, fmt.Errorf("invalid installation date format: %w", err)
	}

	return &warranties.CreateWarrantyParams{
		ShopID:               r.ShopID,
		ClientName:           r.ClientName,
		ClientContact:        r.ClientContact,
		ClientEmail:          r.ClientEmail,
		CarBrand:             r.CarBrand,
		CarModel:             r.CarModel,
		CarColour:            r.CarColour,
		CarPlateNo:           r.CarPlateNo,
		CarChassisNo:         r.CarChassisNo,
		InstallationDate:     installationDate,
		ReferenceNo:          r.ReferenceNo,
		WarrantyNo:           r.WarrantyNo,
		InvoiceAttachmentUrl: r.InvoiceAttachmentUrl,
	}, nil
}

// UpdateWarrantyRequest represents the request body for updating a warranty
type UpdateWarrantyRequest struct {
	ClientName           string  `json:"clientName" binding:"required"`
	ClientContact        string  `json:"clientContact" binding:"required"`
	ClientEmail          string  `json:"clientEmail" binding:"required,email"`
	CarBrand             string  `json:"carBrand" binding:"required"`
	CarModel             string  `json:"carModel" binding:"required"`
	CarColour            string  `json:"carColour" binding:"required"`
	CarPlateNo           string  `json:"carPlateNo" binding:"required"`
	CarChassisNo         string  `json:"carChassisNo" binding:"required"`
	InstallationDate     string  `json:"installationDate" binding:"required"` // Format: YYYY-MM-DD
	ReferenceNo          *string `json:"referenceNo"`
	InvoiceAttachmentUrl string  `json:"invoiceAttachmentUrl"`
}

// ToUpdateWarrantyParams converts UpdateWarrantyRequest to warranties.UpdateWarrantyParams
func (r *UpdateWarrantyRequest) ToUpdateWarrantyParams(id int32) (*warranties.UpdateWarrantyParams, error) {
	installationDate, err := time.Parse("2006-01-02", r.InstallationDate)
	if err != nil {
		return nil, fmt.Errorf("invalid installation date format: %w", err)
	}

	return &warranties.UpdateWarrantyParams{
		ID:                   id,
		ClientName:           r.ClientName,
		ClientContact:        r.ClientContact,
		ClientEmail:          r.ClientEmail,
		CarBrand:             r.CarBrand,
		CarModel:             r.CarModel,
		CarColour:            r.CarColour,
		CarPlateNo:           r.CarPlateNo,
		CarChassisNo:         r.CarChassisNo,
		InstallationDate:     installationDate,
		ReferenceNo:          r.ReferenceNo,
		InvoiceAttachmentUrl: r.InvoiceAttachmentUrl,
	}, nil
}

// UpdateWarrantyApprovalRequest represents the request body for updating warranty approval
type UpdateWarrantyApprovalRequest struct {
	ID         int32 `json:"id" binding:"required"`
	IsApproved bool  `json:"isApproved"`
}

// ToUpdateWarrantyApprovalParams converts UpdateWarrantyApprovalRequest to warranties.UpdateWarrantyApprovalParams
func (r *UpdateWarrantyApprovalRequest) ToUpdateWarrantyApprovalParams(id int32) *warranties.UpdateWarrantyApprovalParams {
	return &warranties.UpdateWarrantyApprovalParams{
		ID:         id,
		IsApproved: r.IsApproved,
	}
}

// CreateWarrantyPartRequest represents the request body for creating a warranty part
type CreateWarrantyPartRequest struct {
	WarrantyID           int32  `json:"warrantyId" binding:"required"`
	ProductAllocationID  int32  `json:"productAllocationId" binding:"required"`
	CarPartID            int32  `json:"carPartId" binding:"required"`
	InstallationImageUrl string `json:"installationImageUrl"`
}

// ToCreateWarrantyPartParams converts CreateWarrantyPartRequest to warranties.CreateWarrantyPartParams
func (r *CreateWarrantyPartRequest) ToCreateWarrantyPartParams() *warranties.CreateWarrantyPartParams {
	return &warranties.CreateWarrantyPartParams{
		WarrantyID:           r.WarrantyID,
		ProductAllocationID:  r.ProductAllocationID,
		CarPartID:            r.CarPartID,
		InstallationImageUrl: r.InstallationImageUrl,
	}
}

// UpdateWarrantyPartRequest represents the request body for updating a warranty part
type UpdateWarrantyPartRequest struct {
	ID                   int32  `json:"id" binding:"required"`
	WarrantyID           int32  `json:"warrantyId" binding:"required"`
	CarPartID            int32  `json:"carPartId" binding:"required"`
	ProductAllocationID  int32  `json:"productAllocationId" binding:"required"`
	InstallationImageUrl string `json:"installationImageUrl"`
}

// ToUpdateWarrantyPartParams converts UpdateWarrantyPartRequest to warranties.UpdateWarrantyPartParams
func (r *UpdateWarrantyPartRequest) ToUpdateWarrantyPartParams(id int32) *warranties.UpdateWarrantyPartParams {
	return &warranties.UpdateWarrantyPartParams{
		ID:                   id,
		WarrantyID:           r.WarrantyID,
		CarPartID:            r.CarPartID,
		ProductAllocationID:  r.ProductAllocationID,
		InstallationImageUrl: r.InstallationImageUrl,
	}
}

// UpdateWarrantyPartApprovalRequest represents the request body for updating warranty part approval
type UpdateWarrantyPartApprovalRequest struct {
	IsApproved bool `json:"isApproved"`
}

// ToUpdateWarrantyPartApprovalParams converts UpdateWarrantyPartApprovalRequest to warranties.UpdateWarrantyPartApprovalParams
func (r *UpdateWarrantyPartApprovalRequest) ToUpdateWarrantyPartApprovalParams(id int32) *warranties.UpdateWarrantyPartApprovalParams {
	return &warranties.UpdateWarrantyPartApprovalParams{
		ID:         id,
		IsApproved: r.IsApproved,
	}
}

// CreateWarrantyWithPartsRequest represents the request body for creating a warranty with parts
type CreateWarrantyWithPartsRequest struct {
	Warranty CreateWarrantyRequest       `json:"warranty" binding:"required"`
	Parts    []CreateWarrantyPartRequest `json:"parts" binding:"required,dive"`
}

// ToCreateWarrantyWithPartsParams converts CreateWarrantyWithPartsRequest to warranties.CreateWarrantyParams and a slice of warranties.CreateWarrantyPartParams
func (r *CreateWarrantyWithPartsRequest) ToCreateWarrantyWithPartsParams() (*warranties.CreateWarrantyParams, []*warranties.CreateWarrantyPartParams, error) {
	warrantyParams, err := r.Warranty.ToCreateWarrantyParams()
	if err != nil {
		return nil, nil, err
	}
	var partsParams []*warranties.CreateWarrantyPartParams
	for _, part := range r.Parts {
		partsParams = append(partsParams, part.ToCreateWarrantyPartParams())
	}
	return warrantyParams, partsParams, nil
}

// UpdateWarrantyWithPartsRequest represents the request body for updating a warranty with parts
type UpdateWarrantyWithPartsRequest struct {
	Warranty UpdateWarrantyRequest       `json:"warranty" binding:"required"`
	Parts    []UpdateWarrantyPartRequest `json:"parts" binding:"required,dive"`
}

// ToUpdateWarrantyWithPartsParams converts UpdateWarrantyWithPartsRequest to warranties.UpdateWarrantyParams and a slice of warranties.UpdateWarrantyPartParams
func (r *UpdateWarrantyWithPartsRequest) ToUpdateWarrantyWithPartsParams(id int32) (*warranties.UpdateWarrantyParams, []*warranties.UpdateWarrantyPartParams, error) {
	warrantyParams, err := r.Warranty.ToUpdateWarrantyParams(id)
	if err != nil {
		return nil, nil, err
	}
	var partsParams []*warranties.UpdateWarrantyPartParams
	for _, part := range r.Parts {
		partsParams = append(partsParams, part.ToUpdateWarrantyPartParams(part.ID))
	}
	return warrantyParams, partsParams, nil
}

// WarrantyResponse wraps the warranties.Warranty model for API responses
type WarrantyResponse struct {
	*warranties.Warranty
}

// WarrantyPartResponse wraps the warranties.WarrantyPart model for API responses
type WarrantyPartResponse struct {
	*warranties.WarrantyPart
}

// CarPartResponse wraps the warranties.CarPart model for API responses
type CarPartResponse struct {
	*warranties.CarPart
}

// WarrantyDetailsResponse represents the detailed warranty response including parts
type WarrantyDetailsResponse struct {
	Warranty *warranties.Warranty                          `json:"warranty"`
	Parts    []*warranties.GetWarrantyPartsByWarrantyIDRow `json:"parts"`
}

type WarrantyByExactSearchResponse struct {
	Warranty *warranties.GetWarrantiesByExactSearchRow     `json:"warranty"`
	Parts    []*warranties.GetWarrantyPartsByWarrantyIDRow `json:"parts"`
}

type WarrantyWithPartsResponse struct {
	Warranty *warranties.Warranty                          `json:"warranty"`
	Parts    []*warranties.GetWarrantyPartsByWarrantyIDRow `json:"parts"`
}

// type WarrantyWithShopInfoResponse struct {
// 	warranties.GetWarrantiesByShopIDRow
// 	ShopID     int32  `json:"shopId"`
// 	ShopName   string `json:"shopName"`
// 	BranchCode string `json:"branchCode"`
// }

type WarrantyWithPartsAndShopInfoResponse struct {
	Warranty *warranties.GetWarrantiesByShopIDRow          `json:"warranty"`
	Parts    []*warranties.GetWarrantyPartsByWarrantyIDRow `json:"parts"`
}
