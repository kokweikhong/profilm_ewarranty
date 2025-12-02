package dto

import (
	"time"

	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/shops"
)

// Requests

type CreateShopRequest struct {
	CompanyName               string  `json:"companyName"`
	CompanyRegistrationNumber string  `json:"companyRegistrationNumber"`
	CompanyLicenseImageURL    *string `json:"companyLicenseImageUrl"`
	CompanyContactNumber      string  `json:"companyContactNumber"`
	CompanyEmail              string  `json:"companyEmail"`
	CompanyWebsiteURL         string  `json:"companyWebsiteUrl"`
	ShopName                  string  `json:"shopName"`
	ShopAddress               string  `json:"shopAddress"`
	MsiaStateID               int32   `json:"msiaStateId"`
	BranchCode                string  `json:"branchCode"`
	ShopImageURL              *string `json:"shopImageUrl"`
	PicName                   string  `json:"picName"`
	PicPosition               string  `json:"picPosition"`
	PicContactNumber          string  `json:"picContactNumber"`
	PicEmail                  string  `json:"picEmail"`
	LoginUsername             string  `json:"loginUsername"`
	LoginPassword             string  `json:"loginPassword"` // Plain text password for creation
}

func ToCreateShopRequestParams(dto *CreateShopRequest, hashedPassword string) *shops.CreateShopParams {
	var companyLicenseImageUrl string
	if dto.CompanyLicenseImageURL != nil {
		companyLicenseImageUrl = *dto.CompanyLicenseImageURL
	}

	var shopImageURL string
	if dto.ShopImageURL != nil {
		shopImageURL = *dto.ShopImageURL
	}

	return &shops.CreateShopParams{
		CompanyName:               dto.CompanyName,
		CompanyRegistrationNumber: dto.CompanyRegistrationNumber,
		CompanyLicenseImageUrl:    companyLicenseImageUrl,
		CompanyContactNumber:      dto.CompanyContactNumber,
		CompanyEmail:              dto.CompanyEmail,
		CompanyWebsiteUrl:         dto.CompanyWebsiteURL,
		ShopName:                  dto.ShopName,
		ShopAddress:               dto.ShopAddress,
		MsiaStateID:               &dto.MsiaStateID,
		BranchCode:                dto.BranchCode,
		ShopImageUrl:              shopImageURL,
		PicName:                   dto.PicName,
		PicPosition:               dto.PicPosition,
		PicContactNumber:          dto.PicContactNumber,
		PicEmail:                  dto.PicEmail,
		LoginUsername:             dto.LoginUsername,
		LoginPasswordHash:         hashedPassword,
	}
}

type UpdateShopRequest struct {
	ID                        int32   `json:"id"`
	CompanyName               string  `json:"companyName"`
	CompanyRegistrationNumber string  `json:"companyRegistrationNumber"`
	CompanyLicenseImageURL    *string `json:"companyLicenseImageUrl"`
	CompanyContactNumber      string  `json:"companyContactNumber"`
	CompanyEmail              string  `json:"companyEmail"`
	CompanyWebsiteURL         string  `json:"companyWebsiteUrl"`
	ShopName                  string  `json:"shopName"`
	ShopAddress               string  `json:"shopAddress"`
	MsiaStateID               int32   `json:"msiaStateId"`
	BranchCode                string  `json:"branchCode"`
	ShopImageURL              *string `json:"shopImageUrl"`
	PicName                   string  `json:"picName"`
	PicPosition               string  `json:"picPosition"`
	PicContactNumber          string  `json:"picContactNumber"`
	PicEmail                  string  `json:"picEmail"`
	LoginUsername             string  `json:"loginUsername"`
	IsActive                  bool    `json:"isActive"`
}

func ToUpdateShopRequestParams(dto *UpdateShopRequest) *shops.UpdateShopParams {
	var companyLicenseImageUrl string
	if dto.CompanyLicenseImageURL != nil {
		companyLicenseImageUrl = *dto.CompanyLicenseImageURL
	}
	var shopImageURL string
	if dto.ShopImageURL != nil {
		shopImageURL = *dto.ShopImageURL
	}
	return &shops.UpdateShopParams{
		ID:                        dto.ID,
		CompanyName:               dto.CompanyName,
		CompanyRegistrationNumber: dto.CompanyRegistrationNumber,
		CompanyLicenseImageUrl:    companyLicenseImageUrl,
		CompanyContactNumber:      dto.CompanyContactNumber,
		CompanyEmail:              dto.CompanyEmail,
		CompanyWebsiteUrl:         dto.CompanyWebsiteURL,
		ShopName:                  dto.ShopName,
		ShopAddress:               dto.ShopAddress,
		MsiaStateID:               &dto.MsiaStateID,
		BranchCode:                dto.BranchCode,
		ShopImageUrl:              shopImageURL,
		PicName:                   dto.PicName,
		PicPosition:               dto.PicPosition,
		PicContactNumber:          dto.PicContactNumber,
		PicEmail:                  dto.PicEmail,
		LoginUsername:             dto.LoginUsername,
		IsActive:                  dto.IsActive,
	}
}

type UpdateShopPasswordRequest struct {
	ID              int32  `json:"id"`
	CurrentPassword string `json:"currentPassword"`
	NewPassword     string `json:"newPassword"`
}

// Responses

type ShopView struct {
	ShopID                    int32     `json:"shopId"`
	CompanyName               string    `json:"companyName"`
	CompanyRegistrationNumber string    `json:"companyRegistrationNumber"`
	CompanyContactNumber      string    `json:"companyContactNumber"`
	CompanyEmail              string    `json:"companyEmail"`
	CompanyWebsiteURL         string    `json:"companyWebsiteUrl"`
	ShopName                  string    `json:"shopName"`
	ShopAddress               string    `json:"shopAddress"`
	MsiaStateName             string    `json:"msiaStateName"`
	BranchCode                string    `json:"branchCode"`
	ShopImageURL              *string   `json:"shopImageUrl"`
	PicName                   string    `json:"picName"`
	PicPosition               string    `json:"picPosition"`
	PicContactNumber          string    `json:"picContactNumber"`
	PicEmail                  string    `json:"picEmail"`
	LoginUsername             string    `json:"loginUsername"`
	IsActive                  bool      `json:"isActive"`
	CreatedAt                 time.Time `json:"createdAt"`
	UpdatedAt                 time.Time `json:"updatedAt"`
}

type Shop struct {
	ID                        int32     `json:"id"`
	CompanyName               string    `json:"companyName"`
	CompanyRegistrationNumber string    `json:"companyRegistrationNumber"`
	CompanyLicenseImageURL    *string   `json:"companyLicenseImageUrl"`
	CompanyContactNumber      string    `json:"companyContactNumber"`
	CompanyEmail              string    `json:"companyEmail"`
	CompanyWebsiteURL         string    `json:"companyWebsiteUrl"`
	ShopName                  string    `json:"shopName"`
	ShopAddress               string    `json:"shopAddress"`
	MsiaStateID               int32     `json:"msiaStateId"`
	BranchCode                string    `json:"branchCode"`
	ShopImageURL              *string   `json:"shopImageUrl"`
	PicName                   string    `json:"picName"`
	PicPosition               string    `json:"picPosition"`
	PicContactNumber          string    `json:"picContactNumber"`
	PicEmail                  string    `json:"picEmail"`
	LoginUsername             string    `json:"loginUsername"`
	IsActive                  bool      `json:"isActive"`
	CreatedAt                 time.Time `json:"createdAt"`
	UpdatedAt                 time.Time `json:"updatedAt"`
}

type MsiaState struct {
	ID        int32     `json:"id"`
	Name      string    `json:"name"`
	Code      string    `json:"code"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
