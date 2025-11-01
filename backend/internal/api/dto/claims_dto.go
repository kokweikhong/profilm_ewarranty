package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/claims"
)

// CreateClaimRequest represents the request payload for creating a claim
type CreateClaimRequest struct {
	WarrantyID         string    `json:"warranty_id" validate:"required,uuid"`
	ClaimNo            string    `json:"claim_no" validate:"required,min=1,max=100"`
	Status             string    `json:"status" validate:"required,oneof=pending investigating resolved rejected"`
	ClaimDate          string    `json:"claim_date" validate:"required"` // Format: "2006-01-02"
	DamagedImageURL    string    `json:"damaged_image_url" validate:"required,url"`
	ResolutionImageURL string    `json:"resolution_image_url,omitempty" validate:"omitempty,url"`
	Remarks            string    `json:"remarks,omitempty" validate:"omitempty,max=1000"`
}

// UpdateClaimRequest represents the request payload for updating a claim
type UpdateClaimRequest struct {
	Status             *string `json:"status,omitempty" validate:"omitempty,oneof=pending investigating resolved rejected"`
	ClaimDate          *string `json:"claim_date,omitempty" validate:"omitempty"` // Format: "2006-01-02"
	DamagedImageURL    *string `json:"damaged_image_url,omitempty" validate:"omitempty,url"`
	ResolutionImageURL *string `json:"resolution_image_url,omitempty" validate:"omitempty,url"`
	Remarks            *string `json:"remarks,omitempty" validate:"omitempty,max=1000"`
}

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
		DamagedImageUrl:    r.DamagedImageURL,
		ResolutionImageUrl: r.ResolutionImageURL,
		Remarks:            pgtype.Text{String: r.Remarks, Valid: r.Remarks != ""},
	}

	return params, nil
}

// ToUpdateClaimParams converts UpdateClaimRequest to SQLC UpdateClaimParams
// Note: This requires getting the current claim first to merge with updates
func (r *UpdateClaimRequest) ToUpdateClaimParams(currentClaim *claims.Claim) (*claims.UpdateClaimParams, error) {
	params := &claims.UpdateClaimParams{
		ID:                 currentClaim.ID,
		WarrantyID:         currentClaim.WarrantyID,
		ClaimNo:            currentClaim.ClaimNo,
		Status:             currentClaim.Status,
		ClaimDate:          currentClaim.ClaimDate,
		DamagedImageUrl:    currentClaim.DamagedImageUrl,
		ResolutionImageUrl: currentClaim.ResolutionImageUrl,
		Remarks:            currentClaim.Remarks,
	}

	// Apply updates where provided
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

	if r.DamagedImageURL != nil {
		params.DamagedImageUrl = *r.DamagedImageURL
	}

	if r.ResolutionImageURL != nil {
		params.ResolutionImageUrl = *r.ResolutionImageURL
	}

	if r.Remarks != nil {
		params.Remarks = pgtype.Text{String: *r.Remarks, Valid: *r.Remarks != ""}
	}

	return params, nil
}

// ClaimResponse represents the response payload for a claim
type ClaimResponse struct {
	ID                 string    `json:"id"`
	WarrantyID         string    `json:"warranty_id"`
	ClaimNo            string    `json:"claim_no"`
	Status             string    `json:"status"`
	ClaimDate          string    `json:"claim_date"`
	DamagedImageURL    string    `json:"damaged_image_url"`
	ResolutionImageURL string    `json:"resolution_image_url"`
	Remarks            string    `json:"remarks"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

// FromClaim converts SQLC Claim to ClaimResponse
func FromClaim(claim *claims.Claim) *ClaimResponse {
	var claimDate string
	if claim.ClaimDate.Valid {
		claimDate = claim.ClaimDate.Time.Format("2006-01-02")
	}

	var remarks string
	if claim.Remarks.Valid {
		remarks = claim.Remarks.String
	}

	return &ClaimResponse{
		ID:                 claim.ID.String(),
		WarrantyID:         claim.WarrantyID.String(),
		ClaimNo:            claim.ClaimNo,
		Status:             claim.Status,
		ClaimDate:          claimDate,
		DamagedImageURL:    claim.DamagedImageUrl,
		ResolutionImageURL: claim.ResolutionImageUrl,
		Remarks:            remarks,
		CreatedAt:          claim.CreatedAt,
		UpdatedAt:          claim.UpdatedAt,
	}
}