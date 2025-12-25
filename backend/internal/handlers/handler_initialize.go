package handlers

import "github.com/kokweikhong/profilm_ewarranty/backend/internal/services"

type HandlerInitializeParams struct {
	ProductsHandler           ProductsHandler
	ShopsHandler              ShopsHandler
	ProductAllocationsHandler ProductAllocationsHandler
	WarrantiesHandler         WarrantiesHandler
	ClaimsHandler             ClaimsHandler
	UploadsHandler            UploadsHandler
}

func NewHandlerInitializeParams(service *services.ServiceInitializeParams) *HandlerInitializeParams {
	return &HandlerInitializeParams{
		ProductsHandler:           NewProductsHandler(service.ProductsService),
		ShopsHandler:              NewShopsHandler(service.ShopsService),
		ProductAllocationsHandler: NewProductAllocationsHandler(service.ProductAllocationsService),
		WarrantiesHandler:         NewWarrantiesHandler(service.WarrantiesService),
		ClaimsHandler:             NewClaimsHandler(service.ClaimsService),
		UploadsHandler:            NewUploadsHandler(service.UploadsService),
	}
}
