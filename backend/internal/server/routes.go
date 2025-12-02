package server

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/handlers"
)

type Routes struct {
	productHandler handlers.ProductsHandler
	shopsHandler   handlers.ShopsHandler
}

func NewRoutes(productHandler handlers.ProductsHandler, shopsHandler handlers.ShopsHandler) *Routes {
	return &Routes{
		productHandler: productHandler,
		shopsHandler:   shopsHandler,
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
		r.Route("/products", func(r chi.Router) {
			r.Get("/", rt.productHandler.ListProductsView)
			r.Get("/{id}", rt.productHandler.GetProductByID)
			r.Post("/", rt.productHandler.CreateProduct)
			r.Put("/{id}", rt.productHandler.UpdateProduct)

			r.Get("/brands", rt.productHandler.ListProductBrands)
			r.Get("/types", rt.productHandler.GetProductTypes)
			r.Get("/series", rt.productHandler.GetProductSeries)
			r.Get("/names", rt.productHandler.GetProductNames)
			r.Get("/warranty-periods", rt.productHandler.ListWarrantyPeriods)
		})

		r.Route("/shops", func(r chi.Router) {
			r.Get("/states", rt.shopsHandler.ListMsiaStates)
			r.Get("/", rt.shopsHandler.ListShopsView)
			r.Get("/{id}", rt.shopsHandler.GetShopByID)
			r.Post("/", rt.shopsHandler.CreateShop)
			r.Put("/{id}", rt.shopsHandler.UpdateShop)
			r.Put("/{id}/password", rt.shopsHandler.UpdateShopPassword)
		})
	})
}
