package services

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/claims"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/products"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/shops"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/warranties"
)	


type Service struct {
	Claim    ClaimService
	Product  ProductService
	Shop     ShopService
	Warranty WarrantyService
}

type Queries struct {
	Claim    *claims.Queries
	Product *products.Queries
	Shop   *shops.Queries
	Warranty *warranties.Queries
}

func NewService(db *pgxpool.Pool, queries *Queries) *Service {
	return &Service{
		Claim:    NewClaimService(db, queries.Claim),
		Product:  NewProductService(db, queries.Product),
		Shop:    NewShopService(db, queries.Shop),
		Warranty: NewWarrantyService(db, queries.Warranty),
	}
}