package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/shops"
)

// ===========================================
// STATE DTOs
// ===========================================

// CreateStateRequest represents the request payload for creating a state
type CreateStateRequest struct {
	Name string `json:"name" validate:"required,min=1,max=100"`
}

// UpdateStateRequest represents the request payload for updating a state
type UpdateStateRequest struct {
	Name *string `json:"name,omitempty" validate:"omitempty,min=1,max=100"`
}

// StateResponse represents the response payload for a state
type StateResponse struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// ToUpdateStateParams converts UpdateStateRequest to SQLC UpdateStateParams
func (r *UpdateStateRequest) ToUpdateStateParams(id uuid.UUID) *shops.UpdateStateParams {
	params := &shops.UpdateStateParams{
		ID: id,
	}

	if r.Name != nil {
		params.Name = *r.Name
	}

	return params
}

// FromState converts SQLC State to StateResponse
func FromState(state *shops.State) *StateResponse {
	return &StateResponse{
		ID:        state.ID.String(),
		Name:      state.Name,
		CreatedAt: state.CreatedAt,
		UpdatedAt: state.UpdatedAt,
	}
}

// ===========================================
// SHOP DTOs
// ===========================================

// CreateShopRequest represents the request payload for creating a shop
type CreateShopRequest struct {
	StateID                string  `json:"state_id" validate:"required,uuid"`
	CompanyName            string  `json:"company_name" validate:"required,min=1,max=200"`
	CompanyRegistrationNo  string  `json:"company_registration_no" validate:"required,min=1,max=100"`
	CompanyLicenseImageURL string  `json:"company_license_image_url" validate:"required,url"`
	CompanyEmail           string  `json:"company_email" validate:"required,email"`
	CompanyContact         string  `json:"company_contact" validate:"required,min=1,max=20"`
	CompanyWebsite         *string `json:"company_website,omitempty" validate:"omitempty,url"`
	Name                   string  `json:"name" validate:"required,min=1,max=200"`
	Type                   string  `json:"type" validate:"required,min=1,max=50"`
	Address                string  `json:"address" validate:"required,min=1,max=500"`
	ImageURL               string  `json:"image_url" validate:"required,url"`
	PicName                string  `json:"pic_name" validate:"required,min=1,max=100"`
	PicContact             string  `json:"pic_contact" validate:"required,min=1,max=20"`
	PicEmail               string  `json:"pic_email" validate:"required,email"`
	PicPosition            string  `json:"pic_position" validate:"required,min=1,max=100"`
	LoginHashPassword      string  `json:"login_hash_password" validate:"required,min=8"`
	IsActive               *bool   `json:"is_active,omitempty"`
}

// UpdateShopRequest represents the request payload for updating a shop
type UpdateShopRequest struct {
	StateID                *string `json:"state_id,omitempty" validate:"omitempty,uuid"`
	CompanyName            *string `json:"company_name,omitempty" validate:"omitempty,min=1,max=200"`
	CompanyRegistrationNo  *string `json:"company_registration_no,omitempty" validate:"omitempty,min=1,max=100"`
	CompanyLicenseImageURL *string `json:"company_license_image_url,omitempty" validate:"omitempty,url"`
	CompanyEmail           *string `json:"company_email,omitempty" validate:"omitempty,email"`
	CompanyContact         *string `json:"company_contact,omitempty" validate:"omitempty,min=1,max=20"`
	CompanyWebsite         *string `json:"company_website,omitempty" validate:"omitempty,url"`
	Name                   *string `json:"name,omitempty" validate:"omitempty,min=1,max=200"`
	Type                   *string `json:"type,omitempty" validate:"omitempty,min=1,max=50"`
	Address                *string `json:"address,omitempty" validate:"omitempty,min=1,max=500"`
	ImageURL               *string `json:"image_url,omitempty" validate:"omitempty,url"`
	PicName                *string `json:"pic_name,omitempty" validate:"omitempty,min=1,max=100"`
	PicContact             *string `json:"pic_contact,omitempty" validate:"omitempty,min=1,max=20"`
	PicEmail               *string `json:"pic_email,omitempty" validate:"omitempty,email"`
	PicPosition            *string `json:"pic_position,omitempty" validate:"omitempty,min=1,max=100"`
	LoginHashPassword      *string `json:"login_hash_password,omitempty" validate:"omitempty,min=8"`
	IsActive               *bool   `json:"is_active,omitempty"`
}

// ShopResponse represents the response payload for a shop
type ShopResponse struct {
	ID                     string    `json:"id"`
	StateID                string    `json:"state_id"`
	CompanyName            string    `json:"company_name"`
	CompanyRegistrationNo  string    `json:"company_registration_no"`
	CompanyLicenseImageURL string    `json:"company_license_image_url"`
	CompanyEmail           string    `json:"company_email"`
	CompanyContact         string    `json:"company_contact"`
	CompanyWebsite         *string   `json:"company_website"`
	Name                   string    `json:"name"`
	Type                   string    `json:"type"`
	Address                string    `json:"address"`
	ImageURL               string    `json:"image_url"`
	PicName                string    `json:"pic_name"`
	PicContact             string    `json:"pic_contact"`
	PicEmail               string    `json:"pic_email"`
	PicPosition            string    `json:"pic_position"`
	Username               string    `json:"username"`
	IsActive               bool      `json:"is_active"`
	CreatedAt              time.Time `json:"created_at"`
	UpdatedAt              time.Time `json:"updated_at"`
}

// ShopDetailResponse represents the response payload for shop details with state information
type ShopDetailResponse struct {
	ShopID                 string    `json:"shop_id"`
	CompanyName            string    `json:"company_name"`
	CompanyRegistrationNo  string    `json:"company_registration_no"`
	CompanyLicenseImageURL string    `json:"company_license_image_url"`
	CompanyEmail           string    `json:"company_email"`
	CompanyContact         string    `json:"company_contact"`
	CompanyWebsite         *string   `json:"company_website"`
	Name                   string    `json:"name"`
	Type                   string    `json:"type"`
	Address                string    `json:"address"`
	ImageURL               string    `json:"image_url"`
	PicName                string    `json:"pic_name"`
	PicContact             string    `json:"pic_contact"`
	PicEmail               string    `json:"pic_email"`
	PicPosition            string    `json:"pic_position"`
	IsActive               bool      `json:"is_active"`
	CreatedAt              time.Time `json:"created_at"`
	UpdatedAt              time.Time `json:"updated_at"`
	StateID                string    `json:"state_id"`
	StateName              string    `json:"state_name"`
}

// ToCreateShopParams converts CreateShopRequest to SQLC CreateShopParams
func (r *CreateShopRequest) ToCreateShopParams() (*shops.CreateShopParams, error) {
	stateID, err := uuid.Parse(r.StateID)
	if err != nil {
		return nil, err
	}

	params := &shops.CreateShopParams{
		StateID:                stateID,
		CompanyName:            r.CompanyName,
		CompanyRegistrationNo:  r.CompanyRegistrationNo,
		CompanyLicenseImageUrl: r.CompanyLicenseImageURL,
		CompanyEmail:           r.CompanyEmail,
		CompanyContact:         r.CompanyContact,
		Name:                   r.Name,
		Type:                   r.Type,
		Address:                r.Address,
		ImageUrl:               r.ImageURL,
		PicName:                r.PicName,
		PicContact:             r.PicContact,
		PicEmail:               r.PicEmail,
		PicPosition:            r.PicPosition,
		LoginHashPassword:      r.LoginHashPassword,
	}

	// Handle optional company website
	if r.CompanyWebsite != nil {
		params.CompanyWebsite.String = *r.CompanyWebsite
		params.CompanyWebsite.Valid = true
	}

	// Handle optional is_active field
	if r.IsActive != nil {
		params.IsActive.Bool = *r.IsActive
		params.IsActive.Valid = true
	} else {
		params.IsActive.Bool = true // Default to active
		params.IsActive.Valid = true
	}

	return params, nil
}

// ToUpdateShopParams converts UpdateShopRequest to SQLC UpdateShopParams
// Note: SQLC UpdateShopParams requires all fields, so this method needs the current shop data
func (r *UpdateShopRequest) ToUpdateShopParams(id uuid.UUID, currentShop *shops.Shop) (*shops.UpdateShopParams, error) {
	params := &shops.UpdateShopParams{
		ID:                     id,
		StateID:                currentShop.StateID,
		CompanyName:            currentShop.CompanyName,
		CompanyRegistrationNo:  currentShop.CompanyRegistrationNo,
		CompanyLicenseImageUrl: currentShop.CompanyLicenseImageUrl,
		CompanyEmail:           currentShop.CompanyEmail,
		CompanyContact:         currentShop.CompanyContact,
		CompanyWebsite:         currentShop.CompanyWebsite,
		Name:                   currentShop.Name,
		Type:                   currentShop.Type,
		Address:                currentShop.Address,
		ImageUrl:               currentShop.ImageUrl,
		PicName:                currentShop.PicName,
		PicContact:             currentShop.PicContact,
		PicEmail:               currentShop.PicEmail,
		PicPosition:            currentShop.PicPosition,
		LoginHashPassword:      currentShop.LoginHashPassword,
		IsActive:               currentShop.IsActive,
	}

	// Override with provided values
	if r.StateID != nil {
		stateID, err := uuid.Parse(*r.StateID)
		if err != nil {
			return nil, err
		}
		params.StateID = stateID
	}

	if r.CompanyName != nil {
		params.CompanyName = *r.CompanyName
	}

	if r.CompanyRegistrationNo != nil {
		params.CompanyRegistrationNo = *r.CompanyRegistrationNo
	}

	if r.CompanyLicenseImageURL != nil {
		params.CompanyLicenseImageUrl = *r.CompanyLicenseImageURL
	}

	if r.CompanyEmail != nil {
		params.CompanyEmail = *r.CompanyEmail
	}

	if r.CompanyContact != nil {
		params.CompanyContact = *r.CompanyContact
	}

	if r.CompanyWebsite != nil {
		params.CompanyWebsite.String = *r.CompanyWebsite
		params.CompanyWebsite.Valid = true
	}

	if r.Name != nil {
		params.Name = *r.Name
	}

	if r.Type != nil {
		params.Type = *r.Type
	}

	if r.Address != nil {
		params.Address = *r.Address
	}

	if r.ImageURL != nil {
		params.ImageUrl = *r.ImageURL
	}

	if r.PicName != nil {
		params.PicName = *r.PicName
	}

	if r.PicContact != nil {
		params.PicContact = *r.PicContact
	}

	if r.PicEmail != nil {
		params.PicEmail = *r.PicEmail
	}

	if r.PicPosition != nil {
		params.PicPosition = *r.PicPosition
	}

	if r.LoginHashPassword != nil {
		params.LoginHashPassword = *r.LoginHashPassword
	}

	if r.IsActive != nil {
		params.IsActive.Bool = *r.IsActive
		params.IsActive.Valid = true
	}

	return params, nil
}

// FromShop converts SQLC Shop to ShopResponse
func FromShop(shop *shops.Shop) *ShopResponse {
	var companyWebsite *string
	if shop.CompanyWebsite.Valid {
		companyWebsite = &shop.CompanyWebsite.String
	}

	var isActive bool
	if shop.IsActive.Valid {
		isActive = shop.IsActive.Bool
	}

	return &ShopResponse{
		ID:                     shop.ID.String(),
		StateID:                shop.StateID.String(),
		CompanyName:            shop.CompanyName,
		CompanyRegistrationNo:  shop.CompanyRegistrationNo,
		CompanyLicenseImageURL: shop.CompanyLicenseImageUrl,
		CompanyEmail:           shop.CompanyEmail,
		CompanyContact:         shop.CompanyContact,
		CompanyWebsite:         companyWebsite,
		Name:                   shop.Name,
		Type:                   shop.Type,
		Address:                shop.Address,
		ImageURL:               shop.ImageUrl,
		PicName:                shop.PicName,
		PicContact:             shop.PicContact,
		PicEmail:               shop.PicEmail,
		PicPosition:            shop.PicPosition,
		Username:               shop.Username,
		IsActive:               isActive,
		CreatedAt:              shop.CreatedAt,
		UpdatedAt:              shop.UpdatedAt,
	}
}

// FromShopDetail converts SQLC ShopDetail to ShopDetailResponse
func FromShopDetail(detail *shops.ShopDetail) *ShopDetailResponse {
	var companyWebsite *string
	if detail.CompanyWebsite.Valid {
		companyWebsite = &detail.CompanyWebsite.String
	}

	var isActive bool
	if detail.IsActive.Valid {
		isActive = detail.IsActive.Bool
	}

	return &ShopDetailResponse{
		ShopID:                 detail.ShopID.String(),
		CompanyName:            detail.CompanyName,
		CompanyRegistrationNo:  detail.CompanyRegistrationNo,
		CompanyLicenseImageURL: detail.CompanyLicenseImageUrl,
		CompanyEmail:           detail.CompanyEmail,
		CompanyContact:         detail.CompanyContact,
		CompanyWebsite:         companyWebsite,
		Name:                   detail.Name,
		Type:                   detail.Type,
		Address:                detail.Address,
		ImageURL:               detail.ImageUrl,
		PicName:                detail.PicName,
		PicContact:             detail.PicContact,
		PicEmail:               detail.PicEmail,
		PicPosition:            detail.PicPosition,
		IsActive:               isActive,
		CreatedAt:              detail.CreatedAt,
		UpdatedAt:              detail.UpdatedAt,
		StateID:                detail.StateID.String(),
		StateName:              detail.StateName,
	}
}

// ===========================================
// PRODUCT ALLOCATION DTOs
// ===========================================

// CreateProductAllocationRequest represents the request payload for creating a product allocation
type CreateProductAllocationRequest struct {
	ProductID    string `json:"product_id" validate:"required,uuid"`
	ShopID       string `json:"shop_id" validate:"required,uuid"`
	FilmQuantity int32  `json:"film_quantity" validate:"required,min=1"`
}

// UpdateProductAllocationRequest represents the request payload for updating a product allocation
type UpdateProductAllocationRequest struct {
	ProductID    *string `json:"product_id,omitempty" validate:"omitempty,uuid"`
	ShopID       *string `json:"shop_id,omitempty" validate:"omitempty,uuid"`
	FilmQuantity *int32  `json:"film_quantity,omitempty" validate:"omitempty,min=1"`
}

// ProductAllocationResponse represents the response payload for a product allocation
type ProductAllocationResponse struct {
	ID            string     `json:"id"`
	ProductID     string     `json:"product_id"`
	ShopID        string     `json:"shop_id"`
	FilmQuantity  int32      `json:"film_quantity"`
	AllocatedDate *time.Time `json:"allocated_date"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

// ToCreateProductAllocationParams converts CreateProductAllocationRequest to SQLC CreateProductAllocationParams
func (r *CreateProductAllocationRequest) ToCreateProductAllocationParams() (*shops.CreateProductAllocationParams, error) {
	productID, err := uuid.Parse(r.ProductID)
	if err != nil {
		return nil, err
	}

	shopID, err := uuid.Parse(r.ShopID)
	if err != nil {
		return nil, err
	}

	return &shops.CreateProductAllocationParams{
		ProductID:    productID,
		ShopID:       shopID,
		FilmQuantity: r.FilmQuantity,
	}, nil
}

// ToUpdateProductAllocationParams converts UpdateProductAllocationRequest to SQLC UpdateProductAllocationParams
// Note: SQLC UpdateProductAllocationParams requires all fields, so this method needs the current allocation data
func (r *UpdateProductAllocationRequest) ToUpdateProductAllocationParams(id uuid.UUID, currentAllocation *shops.ProductAllocation) (*shops.UpdateProductAllocationParams, error) {
	params := &shops.UpdateProductAllocationParams{
		ID:           id,
		ProductID:    currentAllocation.ProductID,
		ShopID:       currentAllocation.ShopID,
		FilmQuantity: currentAllocation.FilmQuantity,
	}

	// Override with provided values
	if r.ProductID != nil {
		productID, err := uuid.Parse(*r.ProductID)
		if err != nil {
			return nil, err
		}
		params.ProductID = productID
	}

	if r.ShopID != nil {
		shopID, err := uuid.Parse(*r.ShopID)
		if err != nil {
			return nil, err
		}
		params.ShopID = shopID
	}

	if r.FilmQuantity != nil {
		params.FilmQuantity = *r.FilmQuantity
	}

	return params, nil
}

// FromProductAllocation converts SQLC ProductAllocation to ProductAllocationResponse
func FromProductAllocation(allocation *shops.ProductAllocation) *ProductAllocationResponse {
	var allocatedDate *time.Time
	if allocation.AllocatedDate.Valid {
		allocatedDate = &allocation.AllocatedDate.Time
	}

	return &ProductAllocationResponse{
		ID:            allocation.ID.String(),
		ProductID:     allocation.ProductID.String(),
		ShopID:        allocation.ShopID.String(),
		FilmQuantity:  allocation.FilmQuantity,
		AllocatedDate: allocatedDate,
		CreatedAt:     allocation.CreatedAt,
		UpdatedAt:     allocation.UpdatedAt,
	}
}
