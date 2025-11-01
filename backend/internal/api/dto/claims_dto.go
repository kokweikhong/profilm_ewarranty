package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/claims"
)

// ====================
// Claim DTOs
// ====================

// CreateClaimRequest represents the request payload for creating a claim
type CreateClaimRequest struct {
	WarrantyID         string  `json:"warranty_id" validate:"required,uuid"`
	ClaimNo            string  `json:"claim_no" validate:"required,min=1,max=50"`
	Status             string  `json:"status" validate:"required,oneof=pending approved rejected processing completed"`
	ClaimDate          string  `json:"claim_date" validate:"required"` // Format: YYYY-MM-DD
	DamagedImageUrl    string  `json:"damaged_image_url" validate:"required,url"`
	ResolutionImageUrl string  `json:"resolution_image_url" validate:"required,url"`
	Remarks            *string `json:"remarks,omitempty" validate:"omitempty,max=1000"`
}

// UpdateClaimRequest represents the request payload for updating a claim
type UpdateClaimRequest struct {
	WarrantyID         *string `json:"warranty_id,omitempty" validate:"omitempty,uuid"`
	ClaimNo            *string `json:"claim_no,omitempty" validate:"omitempty,min=1,max=50"`
	Status             *string `json:"status,omitempty" validate:"omitempty,oneof=pending approved rejected processing completed"`
	ClaimDate          *string `json:"claim_date,omitempty" validate:"omitempty"` // Format: YYYY-MM-DD
	DamagedImageUrl    *string `json:"damaged_image_url,omitempty" validate:"omitempty,url"`
	ResolutionImageUrl *string `json:"resolution_image_url,omitempty" validate:"omitempty,url"`
	Remarks            *string `json:"remarks,omitempty" validate:"omitempty,max=1000"`
}

// ClaimResponse represents the response payload for a claim
type ClaimResponse struct {
	ID                 string    `json:"id"`
	WarrantyID         string    `json:"warranty_id"`
	ClaimNo            string    `json:"claim_no"`
	Status             string    `json:"status"`
	ClaimDate          *string   `json:"claim_date,omitempty"` // Format: YYYY-MM-DD
	DamagedImageUrl    string    `json:"damaged_image_url"`
	ResolutionImageUrl string    `json:"resolution_image_url"`
	Remarks            *string   `json:"remarks,omitempty"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

// ClaimDetailResponse represents the response payload for detailed claim information
type ClaimDetailResponse struct {
	// Claim information
	ClaimID            string    `json:"claim_id"`
	ClaimNo            string    `json:"claim_no"`
	Status             string    `json:"status"`
	ClaimDate          *string   `json:"claim_date,omitempty"`
	DamagedImageUrl    string    `json:"damaged_image_url"`
	ResolutionImageUrl string    `json:"resolution_image_url"`
	Remarks            *string   `json:"remarks,omitempty"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`

	// Customer information
	CustomerName    string `json:"customer_name"`
	CustomerEmail   string `json:"customer_email"`
	CustomerContact string `json:"customer_contact"`

	// Car information
	CarBrand     string `json:"car_brand"`
	CarModel     string `json:"car_model"`
	CarPlateNo   string `json:"car_plate_no"`
	CarChassisNo string `json:"car_chassis_no"`

	// Warranty information
	WarrantyImageUrl string  `json:"warranty_image_url"`
	InstallationDate *string `json:"installation_date,omitempty"`
	ReferenceNo      string  `json:"reference_no"`
	WarrantyNo       string  `json:"warranty_no"`

	// Car part information
	CarPartName        string  `json:"car_part_name"`
	CarPartDescription *string `json:"car_part_description,omitempty"`

	// Film allocation information
	AllocatedFilmQuantity int32   `json:"allocated_film_quantity"`
	FilmAllocatedDate     *string `json:"film_allocated_date,omitempty"`

	// Shop information
	ShopState       string `json:"shop_state"`
	ShopCompanyName string `json:"shop_company_name"`
	ShopName        string `json:"shop_name"`
	ShopAddress     string `json:"shop_address"`
}

// ====================
// Conversion Methods - Claim
// ====================

// ToCreateClaimParams converts CreateClaimRequest to SQLC CreateClaimParams
func (r *CreateClaimRequest) ToCreateClaimParams() (*claims.CreateClaimParams, error) {
	warrantyID, err := uuid.Parse(r.WarrantyID)
	if err != nil {
		return nil, err
	}

	// Parse claim date
	claimDate, err := time.Parse("2006-01-02", r.ClaimDate)
	if err != nil {
		return nil, err
	}

	params := &claims.CreateClaimParams{
		WarrantyID:         warrantyID,
		ClaimNo:            r.ClaimNo,
		Status:             r.Status,
		ClaimDate:          pgtype.Date{Time: claimDate, Valid: true},
		DamagedImageUrl:    r.DamagedImageUrl,
		ResolutionImageUrl: r.ResolutionImageUrl,
	}

	if r.Remarks != nil {
		params.Remarks = pgtype.Text{String: *r.Remarks, Valid: true}
	}

	return params, nil
}

// ToUpdateClaimParams converts UpdateClaimRequest to SQLC UpdateClaimParams
// Note: SQLC UpdateClaimParams requires all fields, so this method needs the current claim data
func (r *UpdateClaimRequest) ToUpdateClaimParams(id uuid.UUID, currentClaim *claims.Claim) (*claims.UpdateClaimParams, error) {
	params := &claims.UpdateClaimParams{
		ID:                 id,
		WarrantyID:         currentClaim.WarrantyID,
		ClaimNo:            currentClaim.ClaimNo,
		Status:             currentClaim.Status,
		ClaimDate:          currentClaim.ClaimDate,
		DamagedImageUrl:    currentClaim.DamagedImageUrl,
		ResolutionImageUrl: currentClaim.ResolutionImageUrl,
		Remarks:            currentClaim.Remarks,
	}

	// Override with provided values
	if r.WarrantyID != nil {
		warrantyID, err := uuid.Parse(*r.WarrantyID)
		if err != nil {
			return nil, err
		}
		params.WarrantyID = warrantyID
	}

	if r.ClaimNo != nil {
		params.ClaimNo = *r.ClaimNo
	}

	if r.Status != nil {
		params.Status = *r.Status
	}

	if r.ClaimDate != nil {
		claimDate, err := time.Parse("2006-01-02", *r.ClaimDate)
		if err != nil {
			return nil, err
		}
		params.ClaimDate = pgtype.Date{Time: claimDate, Valid: true}
	}

	if r.DamagedImageUrl != nil {
		params.DamagedImageUrl = *r.DamagedImageUrl
	}

	if r.ResolutionImageUrl != nil {
		params.ResolutionImageUrl = *r.ResolutionImageUrl
	}

	if r.Remarks != nil {
		params.Remarks = pgtype.Text{String: *r.Remarks, Valid: true}
	}

	return params, nil
}

// FromClaim converts SQLC Claim to ClaimResponse
func FromClaim(claim *claims.Claim) *ClaimResponse {
	response := &ClaimResponse{
		ID:                 claim.ID.String(),
		WarrantyID:         claim.WarrantyID.String(),
		ClaimNo:            claim.ClaimNo,
		Status:             claim.Status,
		DamagedImageUrl:    claim.DamagedImageUrl,
		ResolutionImageUrl: claim.ResolutionImageUrl,
		CreatedAt:          claim.CreatedAt,
		UpdatedAt:          claim.UpdatedAt,
	}

	if claim.ClaimDate.Valid {
		dateStr := claim.ClaimDate.Time.Format("2006-01-02")
		response.ClaimDate = &dateStr
	}

	if claim.Remarks.Valid {
		response.Remarks = &claim.Remarks.String
	}

	return response
}

// FromClaimDetail converts SQLC ClaimDetail to ClaimDetailResponse
func FromClaimDetail(detail *claims.ClaimDetail) *ClaimDetailResponse {
	response := &ClaimDetailResponse{
		// Claim information
		ClaimID:            detail.ClaimID.String(),
		ClaimNo:            detail.ClaimNo,
		Status:             detail.Status,
		DamagedImageUrl:    detail.DamagedImageUrl,
		ResolutionImageUrl: detail.ResolutionImageUrl,
		CreatedAt:          detail.CreatedAt,
		UpdatedAt:          detail.UpdatedAt,

		// Customer information
		CustomerName:    detail.CustomerName,
		CustomerEmail:   detail.CustomerEmail,
		CustomerContact: detail.CustomerContact,

		// Car information
		CarBrand:     detail.CarBrand,
		CarModel:     detail.CarModel,
		CarPlateNo:   detail.CarPlateNo,
		CarChassisNo: detail.CarChassisNo,

		// Warranty information
		WarrantyImageUrl: detail.WarrantyImageUrl,
		ReferenceNo:      detail.ReferenceNo,
		WarrantyNo:       detail.WarrantyNo,

		// Car part information
		CarPartName: detail.CarPartName,

		// Film allocation information
		AllocatedFilmQuantity: detail.AllocatedFilmQuantity,

		// Shop information
		ShopState:       detail.ShopState,
		ShopCompanyName: detail.ShopCompanyName,
		ShopName:        detail.ShopName,
		ShopAddress:     detail.ShopAddress,
	}

	if detail.ClaimDate.Valid {
		dateStr := detail.ClaimDate.Time.Format("2006-01-02")
		response.ClaimDate = &dateStr
	}

	if detail.Remarks.Valid {
		response.Remarks = &detail.Remarks.String
	}

	if detail.InstallationDate.Valid {
		dateStr := detail.InstallationDate.Time.Format("2006-01-02")
		response.InstallationDate = &dateStr
	}

	if detail.CarPartDescription.Valid {
		response.CarPartDescription = &detail.CarPartDescription.String
	}

	if detail.FilmAllocatedDate.Valid {
		dateStr := detail.FilmAllocatedDate.Time.Format("2006-01-02 15:04:05")
		response.FilmAllocatedDate = &dateStr
	}

	return response
}
