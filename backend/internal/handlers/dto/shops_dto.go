package dto

import "github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/shops"

// CreateShopRequest represents the request body for creating a shop
type CreateShopRequest struct {
	CompanyName               string `json:"companyName" binding:"required"`
	CompanyRegistrationNumber string `json:"companyRegistrationNumber" binding:"required"`
	CompanyLicenseImageUrl    string `json:"companyLicenseImageUrl"`
	CompanyContactNumber      string `json:"companyContactNumber" binding:"required"`
	CompanyEmail              string `json:"companyEmail" binding:"required,email"`
	CompanyWebsiteUrl         string `json:"companyWebsiteUrl"`
	ShopName                  string `json:"shopName" binding:"required"`
	ShopAddress               string `json:"shopAddress" binding:"required"`
	MsiaStateID               int32  `json:"msiaStateId"`
	BranchCode                string `json:"branchCode" binding:"required"`
	ShopImageUrl              string `json:"shopImageUrl"`
	PicName                   string `json:"picName" binding:"required"`
	PicPosition               string `json:"picPosition"`
	PicContactNumber          string `json:"picContactNumber" binding:"required"`
	PicEmail                  string `json:"picEmail" binding:"required,email"`
}

// ToCreateShopParams converts CreateShopRequest to shops.CreateShopParams
func (r *CreateShopRequest) ToCreateShopParams() *shops.CreateShopParams {
	return &shops.CreateShopParams{
		CompanyName:               r.CompanyName,
		CompanyRegistrationNumber: r.CompanyRegistrationNumber,
		CompanyLicenseImageUrl:    r.CompanyLicenseImageUrl,
		CompanyContactNumber:      r.CompanyContactNumber,
		CompanyEmail:              r.CompanyEmail,
		CompanyWebsiteUrl:         r.CompanyWebsiteUrl,
		ShopName:                  r.ShopName,
		ShopAddress:               r.ShopAddress,
		MsiaStateID:               &r.MsiaStateID,
		BranchCode:                r.BranchCode,
		ShopImageUrl:              r.ShopImageUrl,
		PicName:                   r.PicName,
		PicPosition:               r.PicPosition,
		PicContactNumber:          r.PicContactNumber,
		PicEmail:                  r.PicEmail,
	}
}

// UpdateShopRequest represents the request body for updating a shop
type UpdateShopRequest struct {
	CompanyName               string `json:"companyName" binding:"required"`
	CompanyRegistrationNumber string `json:"companyRegistrationNumber" binding:"required"`
	CompanyLicenseImageUrl    string `json:"companyLicenseImageUrl"`
	CompanyContactNumber      string `json:"companyContactNumber" binding:"required"`
	CompanyEmail              string `json:"companyEmail" binding:"required,email"`
	CompanyWebsiteUrl         string `json:"companyWebsiteUrl"`
	ShopName                  string `json:"shopName" binding:"required"`
	ShopAddress               string `json:"shopAddress" binding:"required"`
	MsiaStateID               *int32 `json:"msiaStateId"`
	BranchCode                string `json:"branchCode" binding:"required"`
	ShopImageUrl              string `json:"shopImageUrl"`
	PicName                   string `json:"picName" binding:"required"`
	PicPosition               string `json:"picPosition"`
	PicContactNumber          string `json:"picContactNumber" binding:"required"`
	PicEmail                  string `json:"picEmail" binding:"required,email"`
	IsActive                  bool   `json:"isActive"`
}

// ToUpdateShopParams converts UpdateShopRequest to shops.UpdateShopParams
func (r *UpdateShopRequest) ToUpdateShopParams(id int32) *shops.UpdateShopParams {
	return &shops.UpdateShopParams{
		ID:                        id,
		CompanyName:               r.CompanyName,
		CompanyRegistrationNumber: r.CompanyRegistrationNumber,
		CompanyLicenseImageUrl:    r.CompanyLicenseImageUrl,
		CompanyContactNumber:      r.CompanyContactNumber,
		CompanyEmail:              r.CompanyEmail,
		CompanyWebsiteUrl:         r.CompanyWebsiteUrl,
		ShopName:                  r.ShopName,
		ShopAddress:               r.ShopAddress,
		MsiaStateID:               r.MsiaStateID,
		BranchCode:                r.BranchCode,
		ShopImageUrl:              r.ShopImageUrl,
		PicName:                   r.PicName,
		PicPosition:               r.PicPosition,
		PicContactNumber:          r.PicContactNumber,
		PicEmail:                  r.PicEmail,
		IsActive:                  r.IsActive,
	}
}

// ShopResponse wraps the shops.Shop model for API responses
type ShopResponse struct {
	*shops.Shop
}

// MsiaStateResponse wraps the shops.MsiaState model for API responses
type MsiaStateResponse struct {
	*shops.MsiaState
}
