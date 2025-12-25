package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type ServiceInitializeParams struct {
	ShopsService              ShopsService
	ProductsService           ProductsService
	ProductAllocationsService ProductAllocationsService
	WarrantiesService         WarrantiesService
	ClaimsService             ClaimsService
	UploadsService            UploadsService
}

func NewServiceInitializeParams(ctx context.Context, db *pgxpool.Pool) (*ServiceInitializeParams, error) {
	uploadsService, err := NewUploadsService(ctx)
	if err != nil {
		return nil, err
	}

	return &ServiceInitializeParams{
		ShopsService:              NewShopsService(db),
		ProductsService:           NewProductsService(db),
		ProductAllocationsService: NewProductAllocationsService(db),
		WarrantiesService:         NewWarrantiesService(db),
		ClaimsService:             NewClaimsService(db),
		UploadsService:            uploadsService,
	}, nil
}
