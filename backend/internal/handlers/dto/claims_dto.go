package dto

import (
	"fmt"
	"time"

	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/claims"
)

// CreateClaimRequest represents the request body for creating a claim
type CreateClaimRequest struct {
	WarrantyID int32  `json:"warrantyId" binding:"required"`
	ClaimNo    string `json:"claimNo" binding:"required"`
	ClaimDate  string `json:"claimDate" binding:"required"` // Format: YYYY-MM-DD
}

// ToCreateClaimParams converts CreateClaimRequest to claims.CreateClaimParams
func (r *CreateClaimRequest) ToCreateClaimParams() (*claims.CreateClaimParams, error) {
	claimDate, err := time.Parse("2006-01-02", r.ClaimDate)
	if err != nil {
		return nil, fmt.Errorf("invalid claim date format: %w", err)
	}

	return &claims.CreateClaimParams{
		WarrantyID: r.WarrantyID,
		ClaimNo:    r.ClaimNo,
		ClaimDate:  claimDate,
	}, nil
}

// UpdateClaimRequest represents the request body for updating a claim
type UpdateClaimRequest struct {
	WarrantyID int32  `json:"warrantyId" binding:"required"`
	ClaimNo    string `json:"claimNo" binding:"required"`
	ClaimDate  string `json:"claimDate" binding:"required"` // Format: YYYY-MM-DD
}

// ToUpdateClaimParams converts UpdateClaimRequest to claims.UpdateClaimParams
func (r *UpdateClaimRequest) ToUpdateClaimParams(id int32) (*claims.UpdateClaimParams, error) {
	claimDate, err := time.Parse("2006-01-02", r.ClaimDate)
	if err != nil {
		return nil, fmt.Errorf("invalid claim date format: %w", err)
	}

	return &claims.UpdateClaimParams{
		ID:         id,
		WarrantyID: r.WarrantyID,
		ClaimNo:    r.ClaimNo,
		ClaimDate:  claimDate,
	}, nil
}

// UpdateClaimApprovalRequest represents the request body for updating claim approval
type UpdateClaimApprovalRequest struct {
	ID         int32 `json:"id" binding:"required"`
	IsApproved bool  `json:"isApproved"`
}

// ToUpdateClaimApprovalParams converts UpdateClaimApprovalRequest to claims.UpdateClaimApprovalParams
func (r *UpdateClaimApprovalRequest) ToUpdateClaimApprovalParams() *claims.UpdateClaimApprovalParams {
	return &claims.UpdateClaimApprovalParams{
		ID:         r.ID,
		IsApproved: r.IsApproved,
	}
}

// CreateClaimWarrantyPartRequest represents the request body for creating a claim warranty part
type CreateClaimWarrantyPartRequest struct {
	ClaimID            int32   `json:"claimId" binding:"required"`
	WarrantyPartID     int32   `json:"warrantyPartId" binding:"required"`
	DamagedImageUrl    string  `json:"damagedImageUrl" binding:"required"`
	Remarks            *string `json:"remarks"`
	ResolutionDate     *string `json:"resolutionDate"` // Format: YYYY-MM-DD, optional
	ResolutionImageUrl *string `json:"resolutionImageUrl"`
}

// ToCreateClaimWarrantyPartParams converts CreateClaimWarrantyPartRequest to claims.CreateClaimWarrantyPartParams
func (r *CreateClaimWarrantyPartRequest) ToCreateClaimWarrantyPartParams() (*claims.CreateClaimWarrantyPartParams, error) {
	var resolutionDate *time.Time
	if r.ResolutionDate != nil && *r.ResolutionDate != "" {
		parsedDate, err := time.Parse("2006-01-02", *r.ResolutionDate)
		if err != nil {
			return nil, fmt.Errorf("invalid resolution date format: %w", err)
		}
		resolutionDate = &parsedDate
	}

	return &claims.CreateClaimWarrantyPartParams{
		ClaimID:            r.ClaimID,
		WarrantyPartID:     r.WarrantyPartID,
		DamagedImageUrl:    r.DamagedImageUrl,
		Remarks:            r.Remarks,
		ResolutionDate:     resolutionDate,
		ResolutionImageUrl: r.ResolutionImageUrl,
	}, nil
}

// UpdateClaimWarrantyPartRequest represents the request body for updating a claim warranty part
type UpdateClaimWarrantyPartRequest struct {
	WarrantyPartID     int32   `json:"warrantyPartId" binding:"required"`
	DamagedImageUrl    *string `json:"damagedImageUrl"`
	Status             *string `json:"status"`
	Remarks            *string `json:"remarks"`
	ResolutionDate     *string `json:"resolutionDate"` // Format: YYYY-MM-DD, optional
	ResolutionImageUrl *string `json:"resolutionImageUrl"`
}

// ToUpdateClaimWarrantyPartParams converts UpdateClaimWarrantyPartRequest to claims.UpdateClaimWarrantyPartParams
func (r *UpdateClaimWarrantyPartRequest) ToUpdateClaimWarrantyPartParams(id int32) (*claims.UpdateClaimWarrantyPartParams, error) {
	var resolutionDate *time.Time
	if r.ResolutionDate != nil && *r.ResolutionDate != "" {
		parsedDate, err := time.Parse("2006-01-02", *r.ResolutionDate)
		if err != nil {
			return nil, fmt.Errorf("invalid resolution date format: %w", err)
		}
		resolutionDate = &parsedDate
	}

	var damagedImageUrl string
	if r.DamagedImageUrl != nil {
		damagedImageUrl = *r.DamagedImageUrl
	}

	var status string
	if r.Status != nil {
		status = *r.Status
	}

	return &claims.UpdateClaimWarrantyPartParams{
		ID:                 id,
		WarrantyPartID:     r.WarrantyPartID,
		DamagedImageUrl:    damagedImageUrl,
		Status:             status,
		Remarks:            r.Remarks,
		ResolutionDate:     resolutionDate,
		ResolutionImageUrl: r.ResolutionImageUrl,
	}, nil
}

// UpdateClaimWarrantyPartApprovalRequest represents the request body for updating claim warranty part approval
type UpdateClaimWarrantyPartApprovalRequest struct {
	ID         int32 `json:"id" binding:"required"`
	IsApproved bool  `json:"isApproved"`
}

// ToUpdateClaimWarrantyPartApprovalParams converts UpdateClaimWarrantyPartApprovalRequest to claims.UpdateClaimWarrantyPartApprovalParams
func (r *UpdateClaimWarrantyPartApprovalRequest) ToUpdateClaimWarrantyPartApprovalParams() *claims.UpdateClaimWarrantyPartApprovalParams {
	return &claims.UpdateClaimWarrantyPartApprovalParams{
		ID:         r.ID,
		IsApproved: r.IsApproved,
	}
}

// ClaimResponse wraps the claims.Claim model for API responses
type ClaimResponse struct {
	*claims.Claim
}

// ClaimWarrantyPartResponse wraps the claims.ClaimWarrantyPart model for API responses
type ClaimWarrantyPartResponse struct {
	*claims.ClaimWarrantyPart
}
