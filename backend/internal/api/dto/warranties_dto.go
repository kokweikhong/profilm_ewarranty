package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/warranties"
)

// ====================
// CarPart DTOs
// ====================

// CreateCarPartRequest represents the request payload for creating a car part
type CreateCarPartRequest struct {
	PartName    string  `json:"partName" validate:"required,min=1,max=100"`
	Description *string `json:"description,omitempty" validate:"omitempty,max=500"`
}

// UpdateCarPartRequest represents the request payload for updating a car part
type UpdateCarPartRequest struct {
	PartName    *string `json:"partName,omitempty" validate:"omitempty,min=1,max=100"`
	Description *string `json:"description,omitempty" validate:"omitempty,max=500"`
}

// CarPartResponse represents the response payload for a car part
type CarPartResponse struct {
	ID          string    `json:"id"`
	PartName    string    `json:"partName"`
	Description *string   `json:"description,omitempty"`
	IsActive    bool      `json:"isActive"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// ====================
// Warranty DTOs
// ====================

// CreateWarrantyRequest represents the request payload for creating a warranty
type CreateWarrantyRequest struct {
	CustomerName      string `json:"customerName" validate:"required,min=1,max=100"`
	CustomerEmail     string `json:"customerEmail" validate:"required,email,max=255"`
	CustomerContact   string `json:"customerContact" validate:"required,min=1,max=20"`
	CarBrand          string `json:"carBrand" validate:"required,min=1,max=50"`
	CarModel          string `json:"carModel" validate:"required,min=1,max=50"`
	CarColor          string `json:"carColor" validate:"required,min=1,max=30"`
	CarPlateNo        string `json:"carPlateNo" validate:"required,min=1,max=20"`
	CarChassisNo      string `json:"carChassisNo" validate:"required,min=1,max=50"`
	ShopAllocationsID string `json:"shopAllocationsId" validate:"required,uuid"`
	CarPartsID        string `json:"carPartsId" validate:"required,uuid"`
	ImageUrl          string `json:"imageUrl" validate:"required,url"`
	InstallationDate  string `json:"installationDate" validate:"required"` // Format: YYYY-MM-DD
	ReferenceNo       string `json:"referenceNo" validate:"required,min=1,max=50"`
	WarrantyNo        string `json:"warrantyNo" validate:"required,min=1,max=50"`
}

// UpdateWarrantyRequest represents the request payload for updating a warranty
type UpdateWarrantyRequest struct {
	CustomerName      *string `json:"customerName,omitempty" validate:"omitempty,min=1,max=100"`
	CustomerEmail     *string `json:"customerEmail,omitempty" validate:"omitempty,email,max=255"`
	CustomerContact   *string `json:"customerContact,omitempty" validate:"omitempty,min=1,max=20"`
	CarBrand          *string `json:"carBrand,omitempty" validate:"omitempty,min=1,max=50"`
	CarModel          *string `json:"carModel,omitempty" validate:"omitempty,min=1,max=50"`
	CarColor          *string `json:"carColor,omitempty" validate:"omitempty,min=1,max=30"`
	CarPlateNo        *string `json:"carPlateNo,omitempty" validate:"omitempty,min=1,max=20"`
	CarChassisNo      *string `json:"carChassisNo,omitempty" validate:"omitempty,min=1,max=50"`
	ShopAllocationsID *string `json:"shopAllocationsId,omitempty" validate:"omitempty,uuid"`
	CarPartsID        *string `json:"carPartsId,omitempty" validate:"omitempty,uuid"`
	ImageUrl          *string `json:"imageUrl,omitempty" validate:"omitempty,url"`
	InstallationDate  *string `json:"installationDate,omitempty" validate:"omitempty"` // Format: YYYY-MM-DD
	ReferenceNo       *string `json:"referenceNo,omitempty" validate:"omitempty,min=1,max=50"`
	WarrantyNo        *string `json:"warrantyNo,omitempty" validate:"omitempty,min=1,max=50"`
}

// WarrantyResponse represents the response payload for a warranty
type WarrantyResponse struct {
	ID                string    `json:"id"`
	CustomerName      string    `json:"customerName"`
	CustomerEmail     string    `json:"customerEmail"`
	CustomerContact   string    `json:"customerContact"`
	CarBrand          string    `json:"carBrand"`
	CarModel          string    `json:"carModel"`
	CarColor          string    `json:"carColor"`
	CarPlateNo        string    `json:"carPlateNo"`
	CarChassisNo      string    `json:"carChassisNo"`
	ShopAllocationsID string    `json:"shopAllocationsId"`
	CarPartsID        string    `json:"carPartsId"`
	ImageUrl          string    `json:"imageUrl"`
	InstallationDate  *string   `json:"installationDate,omitempty"` // Format: YYYY-MM-DD
	ReferenceNo       string    `json:"referenceNo"`
	WarrantyNo        string    `json:"warrantyNo"`
	CreatedAt         time.Time `json:"createdAt"`
	UpdatedAt         time.Time `json:"updatedAt"`
}

// ====================
// Conversion Methods - CarPart
// ====================

// ToCreateCarPartParams converts CreateCarPartRequest to SQLC CreateCarPartParams
func (r *CreateCarPartRequest) ToCreateCarPartParams() *warranties.CreateCarPartParams {
	params := &warranties.CreateCarPartParams{
		PartName: r.PartName,
	}

	if r.Description != nil {
		params.Description = pgtype.Text{String: *r.Description, Valid: true}
	}

	return params
}

// ToUpdateCarPartParams converts UpdateCarPartRequest to SQLC UpdateCarPartParams
// Note: SQLC UpdateCarPartParams requires all fields, so this method needs the current car part data
func (r *UpdateCarPartRequest) ToUpdateCarPartParams(id uuid.UUID, currentPart *warranties.CarPart) *warranties.UpdateCarPartParams {
	params := &warranties.UpdateCarPartParams{
		ID:          id,
		PartName:    currentPart.PartName,
		Description: currentPart.Description,
	}

	// Override with provided values
	if r.PartName != nil {
		params.PartName = *r.PartName
	}

	if r.Description != nil {
		params.Description = pgtype.Text{String: *r.Description, Valid: true}
	}

	return params
}

// FromCarPart converts SQLC CarPart to CarPartResponse
func FromCarPart(carPart *warranties.CarPart) *CarPartResponse {
	response := &CarPartResponse{
		ID:        carPart.ID.String(),
		PartName:  carPart.PartName,
		IsActive:  carPart.IsActive.Bool,
		CreatedAt: carPart.CreatedAt,
		UpdatedAt: carPart.UpdatedAt,
	}

	if carPart.Description.Valid {
		response.Description = &carPart.Description.String
	}

	return response
}

// ====================
// Conversion Methods - Warranty
// ====================

// ToCreateWarrantyParams converts CreateWarrantyRequest to SQLC CreateWarrantyParams
func (r *CreateWarrantyRequest) ToCreateWarrantyParams() (*warranties.CreateWarrantyParams, error) {
	shopAllocationsID, err := uuid.Parse(r.ShopAllocationsID)
	if err != nil {
		return nil, err
	}

	carPartsID, err := uuid.Parse(r.CarPartsID)
	if err != nil {
		return nil, err
	}

	// Parse installation date
	installationDate, err := time.Parse("2006-01-02", r.InstallationDate)
	if err != nil {
		return nil, err
	}

	params := &warranties.CreateWarrantyParams{
		CustomerName:      r.CustomerName,
		CustomerEmail:     r.CustomerEmail,
		CustomerContact:   r.CustomerContact,
		CarBrand:          r.CarBrand,
		CarModel:          r.CarModel,
		CarColor:          r.CarColor,
		CarPlateNo:        r.CarPlateNo,
		CarChassisNo:      r.CarChassisNo,
		ShopAllocationsID: shopAllocationsID,
		CarPartsID:        carPartsID,
		ImageUrl:          r.ImageUrl,
		InstallationDate:  pgtype.Date{Time: installationDate, Valid: true},
		ReferenceNo:       r.ReferenceNo,
		WarrantyNo:        r.WarrantyNo,
	}

	return params, nil
}

// ToUpdateWarrantyParams converts UpdateWarrantyRequest to SQLC UpdateWarrantyParams
// Note: SQLC UpdateWarrantyParams requires all fields, so this method needs the current warranty data
func (r *UpdateWarrantyRequest) ToUpdateWarrantyParams(id uuid.UUID, currentWarranty *warranties.Warranty) (*warranties.UpdateWarrantyParams, error) {
	params := &warranties.UpdateWarrantyParams{
		ID:                id,
		CustomerName:      currentWarranty.CustomerName,
		CustomerEmail:     currentWarranty.CustomerEmail,
		CustomerContact:   currentWarranty.CustomerContact,
		CarBrand:          currentWarranty.CarBrand,
		CarModel:          currentWarranty.CarModel,
		CarColor:          currentWarranty.CarColor,
		CarPlateNo:        currentWarranty.CarPlateNo,
		CarChassisNo:      currentWarranty.CarChassisNo,
		ShopAllocationsID: currentWarranty.ShopAllocationsID,
		CarPartsID:        currentWarranty.CarPartsID,
		ImageUrl:          currentWarranty.ImageUrl,
		InstallationDate:  currentWarranty.InstallationDate,
		ReferenceNo:       currentWarranty.ReferenceNo,
		WarrantyNo:        currentWarranty.WarrantyNo,
	}

	// Override with provided values
	if r.CustomerName != nil {
		params.CustomerName = *r.CustomerName
	}

	if r.CustomerEmail != nil {
		params.CustomerEmail = *r.CustomerEmail
	}

	if r.CustomerContact != nil {
		params.CustomerContact = *r.CustomerContact
	}

	if r.CarBrand != nil {
		params.CarBrand = *r.CarBrand
	}

	if r.CarModel != nil {
		params.CarModel = *r.CarModel
	}

	if r.CarColor != nil {
		params.CarColor = *r.CarColor
	}

	if r.CarPlateNo != nil {
		params.CarPlateNo = *r.CarPlateNo
	}

	if r.CarChassisNo != nil {
		params.CarChassisNo = *r.CarChassisNo
	}

	if r.ShopAllocationsID != nil {
		shopAllocationsID, err := uuid.Parse(*r.ShopAllocationsID)
		if err != nil {
			return nil, err
		}
		params.ShopAllocationsID = shopAllocationsID
	}

	if r.CarPartsID != nil {
		carPartsID, err := uuid.Parse(*r.CarPartsID)
		if err != nil {
			return nil, err
		}
		params.CarPartsID = carPartsID
	}

	if r.ImageUrl != nil {
		params.ImageUrl = *r.ImageUrl
	}

	if r.InstallationDate != nil {
		installationDate, err := time.Parse("2006-01-02", *r.InstallationDate)
		if err != nil {
			return nil, err
		}
		params.InstallationDate = pgtype.Date{Time: installationDate, Valid: true}
	}

	if r.ReferenceNo != nil {
		params.ReferenceNo = *r.ReferenceNo
	}

	if r.WarrantyNo != nil {
		params.WarrantyNo = *r.WarrantyNo
	}

	return params, nil
}

// FromWarranty converts SQLC Warranty to WarrantyResponse
func FromWarranty(warranty *warranties.Warranty) *WarrantyResponse {
	response := &WarrantyResponse{
		ID:                warranty.ID.String(),
		CustomerName:      warranty.CustomerName,
		CustomerEmail:     warranty.CustomerEmail,
		CustomerContact:   warranty.CustomerContact,
		CarBrand:          warranty.CarBrand,
		CarModel:          warranty.CarModel,
		CarColor:          warranty.CarColor,
		CarPlateNo:        warranty.CarPlateNo,
		CarChassisNo:      warranty.CarChassisNo,
		ShopAllocationsID: warranty.ShopAllocationsID.String(),
		CarPartsID:        warranty.CarPartsID.String(),
		ImageUrl:          warranty.ImageUrl,
		ReferenceNo:       warranty.ReferenceNo,
		WarrantyNo:        warranty.WarrantyNo,
		CreatedAt:         warranty.CreatedAt,
		UpdatedAt:         warranty.UpdatedAt,
	}

	if warranty.InstallationDate.Valid {
		dateStr := warranty.InstallationDate.Time.Format("2006-01-02")
		response.InstallationDate = &dateStr
	}

	return response
}
