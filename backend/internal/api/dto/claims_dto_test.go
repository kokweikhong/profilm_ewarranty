package dto

import (
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/claims"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCreateClaimRequest_ToCreateClaimParams(t *testing.T) {
	tests := []struct {
		name    string
		request CreateClaimRequest
		wantErr bool
		errMsg  string
	}{
		{
			name: "valid request",
			request: CreateClaimRequest{
				WarrantyID:         "123e4567-e89b-12d3-a456-426614174000",
				ClaimNo:            "CLM-2024-001",
				Status:             "pending",
				ClaimDate:          "2024-11-01",
				DamagedImageURL:    "https://example.com/damaged.jpg",
				ResolutionImageURL: "https://example.com/resolution.jpg",
				Remarks:            "Customer reported scratches",
			},
			wantErr: false,
		},
		{
			name: "invalid UUID",
			request: CreateClaimRequest{
				WarrantyID:      "invalid-uuid",
				ClaimNo:         "CLM-2024-001",
				Status:          "pending",
				ClaimDate:       "2024-11-01",
				DamagedImageURL: "https://example.com/damaged.jpg",
			},
			wantErr: true,
			errMsg:  "invalid UUID",
		},
		{
			name: "invalid date format",
			request: CreateClaimRequest{
				WarrantyID:      "123e4567-e89b-12d3-a456-426614174000",
				ClaimNo:         "CLM-2024-001",
				Status:          "pending",
				ClaimDate:       "invalid-date",
				DamagedImageURL: "https://example.com/damaged.jpg",
			},
			wantErr: true,
		},
		{
			name: "empty remarks should work",
			request: CreateClaimRequest{
				WarrantyID:      "123e4567-e89b-12d3-a456-426614174000",
				ClaimNo:         "CLM-2024-001",
				Status:          "pending",
				ClaimDate:       "2024-11-01",
				DamagedImageURL: "https://example.com/damaged.jpg",
				Remarks:         "",
			},
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			params, err := tt.request.ToCreateClaimParams()

			if tt.wantErr {
				assert.Error(t, err)
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg)
				}
				return
			}

			require.NoError(t, err)
			require.NotNil(t, params)

			// Verify UUID conversion
			expectedUUID, _ := uuid.Parse(tt.request.WarrantyID)
			assert.Equal(t, expectedUUID, params.WarrantyID)

			// Verify other fields
			assert.Equal(t, tt.request.ClaimNo, params.ClaimNo)
			assert.Equal(t, tt.request.Status, params.Status)
			assert.Equal(t, tt.request.DamagedImageURL, params.DamagedImageUrl)
			assert.Equal(t, tt.request.ResolutionImageURL, params.ResolutionImageUrl)

			// Verify date conversion
			expectedDate, _ := time.Parse("2006-01-02", tt.request.ClaimDate)
			assert.Equal(t, expectedDate, params.ClaimDate.Time)
			assert.True(t, params.ClaimDate.Valid)

			// Verify remarks handling
			if tt.request.Remarks == "" {
				assert.False(t, params.Remarks.Valid)
			} else {
				assert.True(t, params.Remarks.Valid)
				assert.Equal(t, tt.request.Remarks, params.Remarks.String)
			}
		})
	}
}

func TestUpdateClaimRequest_ToUpdateClaimParams(t *testing.T) {
	// Create a mock current claim
	currentClaimID := uuid.New()
	warrantyID := uuid.New()
	currentClaim := &claims.Claim{
		ID:                 currentClaimID,
		WarrantyID:         warrantyID,
		ClaimNo:            "CLM-2024-001",
		Status:             "pending",
		ClaimDate:          pgtype.Date{Time: time.Date(2024, 11, 1, 0, 0, 0, 0, time.UTC), Valid: true},
		DamagedImageUrl:    "https://example.com/old-damaged.jpg",
		ResolutionImageUrl: "https://example.com/old-resolution.jpg",
		Remarks:            pgtype.Text{String: "Old remarks", Valid: true},
	}

	tests := []struct {
		name        string
		request     UpdateClaimRequest
		wantErr     bool
		checkFields func(t *testing.T, params *claims.UpdateClaimParams)
	}{
		{
			name: "update status only",
			request: UpdateClaimRequest{
				Status: stringPtr("resolved"),
			},
			wantErr: false,
			checkFields: func(t *testing.T, params *claims.UpdateClaimParams) {
				assert.Equal(t, "resolved", params.Status)
				assert.Equal(t, currentClaim.ClaimNo, params.ClaimNo) // unchanged
			},
		},
		{
			name: "update multiple fields",
			request: UpdateClaimRequest{
				Status:             stringPtr("investigating"),
				ClaimDate:          stringPtr("2024-11-02"),
				ResolutionImageURL: stringPtr("https://example.com/new-resolution.jpg"),
				Remarks:            stringPtr("Updated remarks"),
			},
			wantErr: false,
			checkFields: func(t *testing.T, params *claims.UpdateClaimParams) {
				assert.Equal(t, "investigating", params.Status)
				expectedDate := time.Date(2024, 11, 2, 0, 0, 0, 0, time.UTC)
				assert.Equal(t, expectedDate, params.ClaimDate.Time)
				assert.Equal(t, "https://example.com/new-resolution.jpg", params.ResolutionImageUrl)
				assert.Equal(t, "Updated remarks", params.Remarks.String)
				assert.True(t, params.Remarks.Valid)
			},
		},
		{
			name: "invalid date format",
			request: UpdateClaimRequest{
				ClaimDate: stringPtr("invalid-date"),
			},
			wantErr: true,
		},
		{
			name: "empty remarks should set Valid to false",
			request: UpdateClaimRequest{
				Remarks: stringPtr(""),
			},
			wantErr: false,
			checkFields: func(t *testing.T, params *claims.UpdateClaimParams) {
				assert.False(t, params.Remarks.Valid)
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			params, err := tt.request.ToUpdateClaimParams(currentClaim)

			if tt.wantErr {
				assert.Error(t, err)
				return
			}

			require.NoError(t, err)
			require.NotNil(t, params)

			// Verify ID is preserved
			assert.Equal(t, currentClaimID, params.ID)
			assert.Equal(t, warrantyID, params.WarrantyID)

			if tt.checkFields != nil {
				tt.checkFields(t, params)
			}
		})
	}
}

func TestFromClaim(t *testing.T) {
	claimID := uuid.New()
	warrantyID := uuid.New()
	
	claim := &claims.Claim{
		ID:                 claimID,
		WarrantyID:         warrantyID,
		ClaimNo:            "CLM-2024-001",
		Status:             "pending",
		ClaimDate:          pgtype.Date{Time: time.Date(2024, 11, 1, 0, 0, 0, 0, time.UTC), Valid: true},
		DamagedImageUrl:    "https://example.com/damaged.jpg",
		ResolutionImageUrl: "https://example.com/resolution.jpg",
		Remarks:            pgtype.Text{String: "Test remarks", Valid: true},
		CreatedAt:          time.Date(2024, 11, 1, 10, 30, 0, 0, time.UTC),
		UpdatedAt:          time.Date(2024, 11, 1, 10, 30, 0, 0, time.UTC),
	}

	response := FromClaim(claim)

	assert.Equal(t, claimID.String(), response.ID)
	assert.Equal(t, warrantyID.String(), response.WarrantyID)
	assert.Equal(t, "CLM-2024-001", response.ClaimNo)
	assert.Equal(t, "pending", response.Status)
	assert.Equal(t, "2024-11-01", response.ClaimDate)
	assert.Equal(t, "https://example.com/damaged.jpg", response.DamagedImageURL)
	assert.Equal(t, "https://example.com/resolution.jpg", response.ResolutionImageURL)
	assert.Equal(t, "Test remarks", response.Remarks)
	assert.Equal(t, claim.CreatedAt, response.CreatedAt)
	assert.Equal(t, claim.UpdatedAt, response.UpdatedAt)
}

func TestFromClaim_WithInvalidDate(t *testing.T) {
	claim := &claims.Claim{
		ID:         uuid.New(),
		WarrantyID: uuid.New(),
		ClaimNo:    "CLM-2024-001",
		Status:     "pending",
		ClaimDate:  pgtype.Date{Valid: false}, // Invalid date
		Remarks:    pgtype.Text{Valid: false}, // Invalid remarks
	}

	response := FromClaim(claim)

	assert.Equal(t, "", response.ClaimDate) // Should be empty string
	assert.Equal(t, "", response.Remarks)   // Should be empty string
}

// Helper function to create string pointers for tests
func stringPtr(s string) *string {
	return &s
}