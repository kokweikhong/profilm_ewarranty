package server

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/handlers"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/middlewares"
)

type Routes struct {
	handler handlers.HandlerInitializeParams
}

func NewRoutes(handler handlers.HandlerInitializeParams) *Routes {
	return &Routes{
		handler: handler,
	}
}

func (rt *Routes) RegisterRoutes(router chi.Router) {
	// Cors, Authentication, and other middlewares can be added here
	router.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	router.Route("/api/v1", func(r chi.Router) {
		// Public routes (no authentication required)
		r.Route("/auth", func(r chi.Router) {
			r.Post("/login", rt.handler.UsersHandler.Login)
			r.Post("/refresh", rt.handler.UsersHandler.RefreshToken)
		})

		// Public warranty search routes (for home page)
		r.Get("/warranties/search", rt.handler.WarrantiesHandler.GetWarrantiesBySearchTerm)
		r.Get("/warranties/by-warranty-no/{warranty_no}", rt.handler.WarrantiesHandler.GetWarrantyByWarrantyNo)
		r.Get("/warranties/by-car-plate-no/{car_plate_no}", rt.handler.WarrantiesHandler.GetWarrantiesByCarPlateNo)

		// Protected routes (require JWT authentication)
		r.Group(func(r chi.Router) {
			r.Use(middlewares.JWTMiddleware)

			r.Route("/users", func(r chi.Router) {
				r.Get("/{id}", rt.handler.UsersHandler.GetUserByID)
				r.Get("/by-username/{username}", rt.handler.UsersHandler.GetUserByUsername)
				r.Post("/", rt.handler.UsersHandler.CreateUser)
				r.Put("/{id}/password", rt.handler.UsersHandler.UpdateUserPassword)
			})

			r.Route("/products", func(r chi.Router) {
				r.Get("/", rt.handler.ProductsHandler.ListProductsView)
				r.Get("/{id}", rt.handler.ProductsHandler.GetProductByID)
				r.Post("/", rt.handler.ProductsHandler.CreateProduct)
				r.Put("/{id}", rt.handler.ProductsHandler.UpdateProduct)

				r.Get("/brands", rt.handler.ProductsHandler.ListProductBrands)
				r.Get("/types", rt.handler.ProductsHandler.GetProductTypes)
				r.Get("/series", rt.handler.ProductsHandler.GetProductSeries)
				r.Get("/names", rt.handler.ProductsHandler.GetProductNames)
			})

			r.Route("/shops", func(r chi.Router) {
				r.Get("/states", rt.handler.ShopsHandler.ListMsiaStates)
				// r.Get("/", rt.handler.ShopsHandler.ListShopsView)
				r.Get("/", rt.handler.ShopsHandler.GetShops)
				r.Get("/{id}", rt.handler.ShopsHandler.GetShopByID)
				r.Post("/", rt.handler.ShopsHandler.CreateShop)
				r.Put("/{id}", rt.handler.ShopsHandler.UpdateShop)

				r.Get("/generate-branch-code/{state_code}", rt.handler.ShopsHandler.GenerateNextBranchCode)
			})

			r.Route("/product-allocations", func(r chi.Router) {
				r.Get("/", rt.handler.ProductAllocationsHandler.ListProductAllocations)
				r.Get("/{id}", rt.handler.ProductAllocationsHandler.GetProductAllocationByID)
				r.Post("/", rt.handler.ProductAllocationsHandler.CreateProductAllocation)
				r.Put("/{id}", rt.handler.ProductAllocationsHandler.UpdateProductAllocation)

				r.Get("/products-by-shop/{shop_id}", rt.handler.ProductAllocationsHandler.GetProductsFromProductAllocationsByShopID)
			})

			r.Route("/warranties", func(r chi.Router) {
				r.Get("/", rt.handler.WarrantiesHandler.ListWarranties)
				r.Get("/{id}", rt.handler.WarrantiesHandler.GetWarrantyByID)
				r.Post("/", rt.handler.WarrantiesHandler.CreateWarranty)
				r.Put("/{id}", rt.handler.WarrantiesHandler.UpdateWarranty)
				r.Put("/{id}/approve", rt.handler.WarrantiesHandler.UpdateWarrantyApproval)

				r.Get("/car-parts", rt.handler.WarrantiesHandler.GetCarParts)

				r.Route("/warranty-parts", func(r chi.Router) {
					r.Post("/", rt.handler.WarrantiesHandler.CreateWarrantyPart)
					r.Put("/{id}", rt.handler.WarrantiesHandler.UpdateWarrantyPart)
					r.Put("/{id}/approve", rt.handler.WarrantiesHandler.UpdateWarrantyPartApproval)
					r.Get("/{id}", rt.handler.WarrantiesHandler.GetWarrantyPartsByWarrantyID)

					r.Post("/batch-create", rt.handler.WarrantiesHandler.CreateWarrantyWithParts)
					r.Put("/batch-update", rt.handler.WarrantiesHandler.UpdateWarrantyWithParts)
				})
			})

			r.Route("/claims", func(r chi.Router) {
				r.Get("/", rt.handler.ClaimsHandler.ListClaims)
				r.Get("/{id}", rt.handler.ClaimsHandler.GetClaimByID)
				r.Post("/", rt.handler.ClaimsHandler.CreateClaim)
				r.Put("/{id}", rt.handler.ClaimsHandler.UpdateClaim)
				r.Put("/{id}/approve", rt.handler.ClaimsHandler.UpdateClaimApproval)

				r.Route("/claim-warranty-parts", func(r chi.Router) {
					r.Get("/{id}", rt.handler.ClaimsHandler.ListClaimWarrantyPartsByClaimID)
					r.Post("/", rt.handler.ClaimsHandler.CreateClaimWarrantyPart)
					r.Put("/{id}", rt.handler.ClaimsHandler.UpdateClaimWarrantyPart)
					r.Put("/{id}/approve", rt.handler.ClaimsHandler.UpdateClaimWarrantyPartApproval)
				})
			})

			r.Route("/uploads", func(r chi.Router) {
				r.Post("/file", rt.handler.UploadsHandler.UploadFile)
				r.Post("/files", rt.handler.UploadsHandler.UploadMultipleFiles)
			})
		})
	})
}
