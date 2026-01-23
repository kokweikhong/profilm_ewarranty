package dto

import (
	"fmt"
	"time"

	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/claims"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/models"
	"github.com/kokweikhong/profilm_ewarranty/backend/pkg/utils"
)

// CreateClaimRequest represents the request body for creating a claim
type CreateClaimRequest struct {
	WarrantyID int32  `json:"warrantyId" binding:"required"`
	ClaimNo    string `json:"claimNo" binding:"required"`
	ClaimDate  string `json:"claimDate" binding:"required"` // Format: YYYY-MM-DD
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

// CreateClaimWithPartsRequest represents the request body for creating a claim with its associated parts
type CreateClaimWithPartsRequest struct {
	Claim CreateClaimRequest               `json:"claim" binding:"required"`
	Parts []CreateClaimWarrantyPartRequest `json:"parts" binding:"required,dive"`
}

// ToCreateClaimParams converts CreateClaimWithPartsRequest to claims.CreateClaimParams and a slice of claims.CreateClaimWarrantyPartParams
func (r *CreateClaimWithPartsRequest) ToCreateClaimParamsAndParts() (*claims.CreateClaimParams, []*claims.CreateClaimWarrantyPartParams, error) {
	claimDate, err := utils.ConvertDateStringToStandardFormat(r.Claim.ClaimDate)
	if err != nil {
		return nil, nil, fmt.Errorf("invalid claim date format: %w", err)
	}
	claimParams := &claims.CreateClaimParams{
		WarrantyID: r.Claim.WarrantyID,
		ClaimNo:    r.Claim.ClaimNo,
		ClaimDate:  claimDate,
	}
	var partsParams []*claims.CreateClaimWarrantyPartParams
	for _, part := range r.Parts {
		var resolutionDate *time.Time
		if part.ResolutionDate != nil && *part.ResolutionDate != "" {
			parsedDate, err := utils.ConvertDateStringToStandardFormat(*part.ResolutionDate)
			if err != nil {
				return nil, nil, fmt.Errorf("invalid resolution date format: %w", err)
			}
			resolutionDate = &parsedDate
		}
		partParam := &claims.CreateClaimWarrantyPartParams{
			ClaimID:            part.ClaimID,
			WarrantyPartID:     part.WarrantyPartID,
			DamagedImageUrl:    part.DamagedImageUrl,
			Remarks:            part.Remarks,
			ResolutionDate:     resolutionDate,
			ResolutionImageUrl: part.ResolutionImageUrl,
		}
		partsParams = append(partsParams, partParam)
	}
	return claimParams, partsParams, nil
}

// UpdateClaimRequest represents the request body for updating a claim
type UpdateClaimRequest struct {
	WarrantyID int32  `json:"warrantyId" binding:"required"`
	ClaimNo    string `json:"claimNo" binding:"required"`
	ClaimDate  string `json:"claimDate" binding:"required"` // Format: YYYY-MM-DD
}

// UpdateClaimWarrantyPartRequest represents the request body for updating a claim warranty part
type UpdateClaimWarrantyPartRequest struct {
	ID                 int32   `json:"id" binding:"required"`
	WarrantyPartID     int32   `json:"warrantyPartId" binding:"required"`
	DamagedImageUrl    *string `json:"damagedImageUrl"`
	Status             *string `json:"status"`
	Remarks            *string `json:"remarks"`
	ResolutionDate     *string `json:"resolutionDate"` // Format: YYYY-MM-DD, optional
	ResolutionImageUrl *string `json:"resolutionImageUrl"`
}

// UpdateClaimWithPartsRequest represents the request body for updating a claim with its associated parts
type UpdateClaimWithPartsRequest struct {
	Claim UpdateClaimRequest               `json:"claim" binding:"required"`
	Parts []UpdateClaimWarrantyPartRequest `json:"parts" binding:"required,dive"`
}

// ToUpdateClaimParamsAndParts converts UpdateClaimWithPartsRequest to claims.UpdateClaimParams and a slice of claims.UpdateClaimWarrantyPartParams
func (r *UpdateClaimWithPartsRequest) ToUpdateClaimParamsAndParts(id int32) (*claims.UpdateClaimParams, []*claims.UpdateClaimWarrantyPartParams, error) {
	claimDate, err := utils.ConvertDateStringToStandardFormat(r.Claim.ClaimDate)
	if err != nil {
		return nil, nil, fmt.Errorf("invalid claim date format: %w", err)
	}
	claimParams := &claims.UpdateClaimParams{
		ID:         id,
		WarrantyID: r.Claim.WarrantyID,
		ClaimNo:    r.Claim.ClaimNo,
		ClaimDate:  claimDate,
	}
	var partsParams []*claims.UpdateClaimWarrantyPartParams
	for _, part := range r.Parts {
		var resolutionDate *time.Time
		if part.ResolutionDate != nil && *part.ResolutionDate != "" {
			parsedDate, err := utils.ConvertDateStringToStandardFormat(*part.ResolutionDate)
			if err != nil {
				return nil, nil, fmt.Errorf("invalid resolution date format: %w", err)
			}
			resolutionDate = &parsedDate
		}
		var damagedImageUrl string
		if part.DamagedImageUrl != nil {
			damagedImageUrl = *part.DamagedImageUrl
		}
		var status string
		if part.Status != nil {
			status = *part.Status
		}
		partParam := &claims.UpdateClaimWarrantyPartParams{
			ID:                 part.ID,
			WarrantyPartID:     part.WarrantyPartID,
			DamagedImageUrl:    damagedImageUrl,
			Status:             status,
			Remarks:            part.Remarks,
			ResolutionDate:     resolutionDate,
			ResolutionImageUrl: part.ResolutionImageUrl,
		}
		partsParams = append(partsParams, partParam)
	}
	return claimParams, partsParams, nil
}

// ToUpdateClaimParams converts UpdateClaimRequest to claims.UpdateClaimParams
// func (r *UpdateClaimRequest) ToUpdateClaimParams(id int32) (*claims.UpdateClaimParams, error) {
// 	claimDate, err := time.Parse("2006-01-02", r.ClaimDate)
// 	if err != nil {
// 		return nil, fmt.Errorf("invalid claim date format: %w", err)
// 	}

// 	return &claims.UpdateClaimParams{
// 		ID:         id,
// 		WarrantyID: r.WarrantyID,
// 		ClaimNo:    r.ClaimNo,
// 		ClaimDate:  claimDate,
// 	}, nil
// }

// UpdateClaimApprovalRequest represents the request body for updating claim approval
type UpdateClaimApprovalRequest struct {
	ID             int32  `json:"id" binding:"required"`
	ApprovalStatus string `json:"approvalStatus" binding:"required"`
}

// ToUpdateClaimApprovalParams converts UpdateClaimApprovalRequest to claims.UpdateClaimApprovalParams
func (r *UpdateClaimApprovalRequest) ToUpdateClaimApprovalParams() *claims.UpdateClaimApprovalParams {
	return &claims.UpdateClaimApprovalParams{
		ID:             r.ID,
		ApprovalStatus: models.ApprovalStatus(r.ApprovalStatus),
	}
}

// ToCreateClaimWarrantyPartParams converts CreateClaimWarrantyPartRequest to claims.CreateClaimWarrantyPartParams
// func (r *CreateClaimWarrantyPartRequest) ToCreateClaimWarrantyPartParams() (*claims.CreateClaimWarrantyPartParams, error) {
// 	var resolutionDate *time.Time
// 	if r.ResolutionDate != nil && *r.ResolutionDate != "" {
// 		parsedDate, err := time.Parse("2006-01-02", *r.ResolutionDate)
// 		if err != nil {
// 			return nil, fmt.Errorf("invalid resolution date format: %w", err)
// 		}
// 		resolutionDate = &parsedDate
// 	}

// 	return &claims.CreateClaimWarrantyPartParams{
// 		ClaimID:            r.ClaimID,
// 		WarrantyPartID:     r.WarrantyPartID,
// 		DamagedImageUrl:    r.DamagedImageUrl,
// 		Remarks:            r.Remarks,
// 		ResolutionDate:     resolutionDate,
// 		ResolutionImageUrl: r.ResolutionImageUrl,
// 	}, nil
// }

// UpdateClaimWarrantyPartRequest represents the request body for updating a claim warranty part
// type UpdateClaimWarrantyPartRequest struct {
// 	WarrantyPartID     int32   `json:"warrantyPartId" binding:"required"`
// 	DamagedImageUrl    *string `json:"damagedImageUrl"`
// 	Status             *string `json:"status"`
// 	Remarks            *string `json:"remarks"`
// 	ResolutionDate     *string `json:"resolutionDate"` // Format: YYYY-MM-DD, optional
// 	ResolutionImageUrl *string `json:"resolutionImageUrl"`
// }

// ToUpdateClaimWarrantyPartParams converts UpdateClaimWarrantyPartRequest to claims.UpdateClaimWarrantyPartParams
// func (r *UpdateClaimWarrantyPartRequest) ToUpdateClaimWarrantyPartParams(id int32) (*claims.UpdateClaimWarrantyPartParams, error) {
// 	var resolutionDate *time.Time
// 	if r.ResolutionDate != nil && *r.ResolutionDate != "" {
// 		parsedDate, err := time.Parse("2006-01-02", *r.ResolutionDate)
// 		if err != nil {
// 			return nil, fmt.Errorf("invalid resolution date format: %w", err)
// 		}
// 		resolutionDate = &parsedDate
// 	}

// 	var damagedImageUrl string
// 	if r.DamagedImageUrl != nil {
// 		damagedImageUrl = *r.DamagedImageUrl
// 	}

// 	var status string
// 	if r.Status != nil {
// 		status = *r.Status
// 	}

// 	return &claims.UpdateClaimWarrantyPartParams{
// 		ID:                 id,
// 		WarrantyPartID:     r.WarrantyPartID,
// 		DamagedImageUrl:    damagedImageUrl,
// 		Status:             status,
// 		Remarks:            r.Remarks,
// 		ResolutionDate:     resolutionDate,
// 		ResolutionImageUrl: r.ResolutionImageUrl,
// 	}, nil
// }

// UpdateClaimWarrantyPartApprovalRequest represents the request body for updating claim warranty part approval
type UpdateClaimWarrantyPartApprovalRequest struct {
	ID             int32  `json:"id" binding:"required"`
	ApprovalStatus string `json:"approvalStatus" binding:"required"`
}

// ToUpdateClaimWarrantyPartApprovalParams converts UpdateClaimWarrantyPartApprovalRequest to claims.UpdateClaimWarrantyPartApprovalParams
func (r *UpdateClaimWarrantyPartApprovalRequest) ToUpdateClaimWarrantyPartApprovalParams() *claims.UpdateClaimWarrantyPartApprovalParams {
	return &claims.UpdateClaimWarrantyPartApprovalParams{
		ID:             r.ID,
		ApprovalStatus: models.ApprovalStatus(r.ApprovalStatus),
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

type ClaimWithPartsResponse struct {
	Claim *claims.ClaimView                `json:"claim"`
	Parts []*claims.ClaimWarrantyPartsView `json:"parts"`
}
