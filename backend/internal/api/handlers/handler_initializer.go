package handlers

import "github.com/kokweikhong/profilm_ewarranty/backend/internal/services"

type Handler struct {
	Warranty WarrantyHandler
	Product  ProductHandler
	Shop     ShopHandler
	Claim    ClaimsHandler
	Swagger  *SwaggerHandler
}

func NewHandler(services *services.Service) *Handler {
	return &Handler{
		Warranty: NewWarrantyHandler(services.Warranty),
		Product:  NewProductHandler(services.Product),
		Shop:     NewShopHandler(services.Shop),
		Claim:    NewClaimsHandler(services.Claim),
		Swagger:  NewSwaggerHandler(),
	}
}
