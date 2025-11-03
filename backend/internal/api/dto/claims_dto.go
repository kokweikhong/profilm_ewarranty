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
	WarrantyID         string  `json:"warrantyId" validate:"required,uuid"`
	ClaimNo            string  `json:"claimNo" validate:"required,min=1,max=50"`
	Status             string  `json:"status" validate:"required,oneof=pending approved rejected processing completed"`
	ClaimDate          string  `json:"claimDate" validate:"required"` // Format: YYYY-MM-DD
	DamagedImageUrl    string  `json:"damagedImageUrl" validate:"required,url"`
	ResolutionImageUrl string  `json:"resolutionImageUrl" validate:"required,url"`
	Remarks            *string `json:"remarks,omitempty" validate:"omitempty,max=1000"`
}

// UpdateClaimRequest represents the request payload for updating a claim
type UpdateClaimRequest struct {
	WarrantyID         *string `json:"warrantyId,omitempty" validate:"omitempty,uuid"`
	ClaimNo            *string `json:"claimNo,omitempty" validate:"omitempty,min=1,max=50"`
	Status             *string `json:"status,omitempty" validate:"omitempty,oneof=pending approved rejected processing completed"`
	ClaimDate          *string `json:"claimDate,omitempty" validate:"omitempty"` // Format: YYYY-MM-DD
	DamagedImageUrl    *string `json:"damagedImageUrl,omitempty" validate:"omitempty,url"`
	ResolutionImageUrl *string `json:"resolutionImageUrl,omitempty" validate:"omitempty,url"`
	Remarks            *string `json:"remarks,omitempty" validate:"omitempty,max=1000"`
}

// ClaimResponse represents the response payload for a claim
type ClaimResponse struct {
	ID                 string    `json:"id"`
	WarrantyID         string    `json:"warrantyId"`
	ClaimNo            string    `json:"claimNo"`
	Status             string    `json:"status"`
	ClaimDate          *string   `json:"claimDate,omitempty"` // Format: YYYY-MM-DD
	DamagedImageUrl    string    `json:"damagedImageUrl"`
	ResolutionImageUrl string    `json:"resolutionImageUrl"`
	Remarks            *string   `json:"remarks,omitempty"`
	CreatedAt          time.Time `json:"createdAt"`
	UpdatedAt          time.Time `json:"updatedAt"`
}

// ClaimDetailResponse represents the response payload for detailed claim information
type ClaimDetailResponse struct {
	// Claim information
	ClaimID            string    `json:"claimId"`
	ClaimNo            string    `json:"claimNo"`
	Status             string    `json:"status"`
	ClaimDate          *string   `json:"claimDate,omitempty"`
	DamagedImageUrl    string    `json:"damagedImageUrl"`
	ResolutionImageUrl string    `json:"resolutionImageUrl"`
	Remarks            *string   `json:"remarks,omitempty"`
	CreatedAt          time.Time `json:"createdAt"`
	UpdatedAt          time.Time `json:"updatedAt"`

	// Customer information
	CustomerName    string `json:"customerName"`
	CustomerEmail   string `json:"customerEmail"`
	CustomerContact string `json:"customerContact"`

	// Car information
	CarBrand     string `json:"carBrand"`
	CarModel     string `json:"carModel"`
	CarPlateNo   string `json:"carPlateNo"`
	CarChassisNo string `json:"carChassisNo"`

	// Warranty information
	WarrantyImageUrl string  `json:"warrantyImageUrl"`
	InstallationDate *string `json:"installationDate,omitempty"`
	ReferenceNo      string  `json:"referenceNo"`
	WarrantyNo       string  `json:"warrantyNo"`

	// Car part information
	CarPartName        string  `json:"carPartName"`
	CarPartDescription *string `json:"carPartDescription,omitempty"`

	// Film allocation information
	AllocatedFilmQuantity int32   `json:"allocatedFilmQuantity"`
	FilmAllocatedDate     *string `json:"filmAllocatedDate,omitempty"`

	// Shop information
	ShopState       string `json:"shopState"`
	ShopCompanyName string `json:"shopCompanyName"`
	ShopName        string `json:"shopName"`
	ShopAddress     string `json:"shopAddress"`
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
