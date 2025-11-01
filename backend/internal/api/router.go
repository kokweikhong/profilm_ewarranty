package api

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/api/handlers"
)

// Router holds all the dependencies needed for routing
type Router struct {
	Handler *handlers.Handler
}

// NewRouter creates a new router instance
func NewRouter(handler *handlers.Handler) *Router {
	return &Router{
		Handler: handler,
	}
}

// SetupRoutes configures all the routes using Chi router
func (r *Router) SetupRoutes() http.Handler {
	router := chi.NewRouter()

	// Middleware
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))
	router.Use(middleware.Compress(5))

	// CORS middleware
	router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

			if req.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, req)
		})
	})

	// Health check route
	router.Get("/health", r.healthCheck)

	// Swagger documentation routes
	router.Handle("/docs", r.Handler.Swagger.ServeSwaggerUI())
	router.Handle("/swagger.yaml", r.Handler.Swagger.ServeSwaggerSpec())

	// API routes
	router.Route("/api", func(api chi.Router) {
		// Version 1 API
		api.Route("/v1", func(v1 chi.Router) {
			// Product routes
			r.setupProductRoutes(v1)

			// User routes (placeholder for future implementation)
			// r.setupUserRoutes(v1)

			// Warranty routes (placeholder for future implementation)
			// r.setupWarrantyRoutes(v1)
		})
	})

	// Serve static files (if needed)
	router.Handle("/static/*", http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))

	r.setupProductRoutes(router)
	r.setupShopRoutes(router)
	r.setupWarrantyRoutes(router)
	r.setupClaimRoutes(router)

	return router
}

// setupProductRoutes configures product-related routes
func (r *Router) setupProductRoutes(router chi.Router) {
	router.Route("/products", func(products chi.Router) {
		// Product Brand routes
		products.Route("/brands", func(brands chi.Router) {
			brands.Post("/", r.Handler.Product.CreateProductBrand)       // POST /api/v1/products/brands
			brands.Get("/", r.Handler.Product.ListProductBrands)         // GET /api/v1/products/brands
			brands.Get("/{id}", r.Handler.Product.GetProductBrandByID)   // GET /api/v1/products/brands/{id}
			brands.Put("/{id}", r.Handler.Product.UpdateProductBrand)    // PUT /api/v1/products/brands/{id}
			brands.Delete("/{id}", r.Handler.Product.DeleteProductBrand) // DELETE /api/v1/products/brands/{id}
		})

		// Product Type routes
		products.Route("/types", func(types chi.Router) {
			types.Post("/", r.Handler.Product.CreateProductType)       // POST /api/v1/products/types
			types.Get("/", r.Handler.Product.ListProductTypes)         // GET /api/v1/products/types
			types.Get("/{id}", r.Handler.Product.GetProductTypeByID)   // GET /api/v1/products/types/{id}
			types.Put("/{id}", r.Handler.Product.UpdateProductType)    // PUT /api/v1/products/types/{id}
			types.Delete("/{id}", r.Handler.Product.DeleteProductType) // DELETE /api/v1/products/types/{id}
		})

		// Product Series routes
		products.Route("/series", func(series chi.Router) {
			series.Post("/", r.Handler.Product.CreateProductSeries)       // POST /api/v1/products/series
			series.Get("/", r.Handler.Product.ListProductSeries)          // GET /api/v1/products/series
			series.Get("/{id}", r.Handler.Product.GetProductSeriesByID)   // GET /api/v1/products/series/{id}
			series.Put("/{id}", r.Handler.Product.UpdateProductSeries)    // PUT /api/v1/products/series/{id}
			series.Delete("/{id}", r.Handler.Product.DeleteProductSeries) // DELETE /api/v1/products/series/{id}

			// Nested route for series by type
			series.Get("/by-type/{typeId}", r.Handler.Product.ListProductSeriesByType) // GET /api/v1/products/series/by-type/{typeId}
		})

		// Product Model routes
		products.Route("/warranty-years", func(warrantyYears chi.Router) {
			warrantyYears.Post("/", r.Handler.Product.CreateWarrantyYear)       // POST /api/v1/products/warranty-years
			warrantyYears.Get("/", r.Handler.Product.ListWarrantyYears)         // GET /api/v1/products/warranty-years
			warrantyYears.Get("/{id}", r.Handler.Product.GetWarrantyYearByID)   // GET /api/v1/products/warranty-years/{id}
			warrantyYears.Put("/{id}", r.Handler.Product.UpdateWarrantyYear)    // PUT /api/v1/products/warranty-years/{id}
			warrantyYears.Delete("/{id}", r.Handler.Product.DeleteWarrantyYear) // DELETE /api/v1/products/warranty-years/{id}
		})

		// Main Product routes
		products.Post("/", r.Handler.Product.CreateProduct)       // POST /api/v1/products
		products.Get("/", r.Handler.Product.ListProducts)         // GET /api/v1/products
		products.Get("/{id}", r.Handler.Product.GetProductByID)   // GET /api/v1/products/{id}
		products.Put("/{id}", r.Handler.Product.UpdateProduct)    // PUT /api/v1/products/{id}
		products.Delete("/{id}", r.Handler.Product.DeleteProduct) // DELETE /api/v1/products/{id}

		// Additional product routes
		products.Get("/details", r.Handler.Product.ListProductsWithDetails)    // GET /api/v1/products/details
		products.Get("/details/{id}", r.Handler.Product.GetProductDetailsByID) // GET /api/v1/products/details/{id}
	})
}

// setupShopRoutes configures shop-related routes
func (r *Router) setupShopRoutes(router chi.Router) {
	router.Route("/states", func(states chi.Router) {
		states.Post("/", r.Handler.Shop.CreateState)
		states.Get("/", r.Handler.Shop.ListStates)
		states.Get("/{id}", r.Handler.Shop.GetStateByID)
		states.Put("/{id}", r.Handler.Shop.UpdateState)
		states.Delete("/{id}", r.Handler.Shop.DeleteState)
	})

	router.Route("/shops", func(shops chi.Router) {
		shops.Post("/", r.Handler.Shop.CreateShop) // POST /api/v1/shops
		shops.Get("/", r.Handler.Shop.ListShops)
		shops.Get("/{id}", r.Handler.Shop.GetShopByID) // GET /api/v1/shops/{id}
		shops.Put("/{id}", r.Handler.Shop.UpdateShop)
		shops.Delete("/{id}", r.Handler.Shop.DeleteShop)

		shops.Get("/details", r.Handler.Shop.ListShopDetails)         // GET /api/v1/shops/details
		shops.Get("/details/{id}", r.Handler.Shop.GetShopDetailsByID) // GET /api/v1/shops/details/{id}
	})

	router.Route("/allocations", func(allocations chi.Router) {
		allocations.Post("/", r.Handler.Shop.CreateProductAllocation)
		allocations.Get("/", r.Handler.Shop.ListProductAllocations)
		allocations.Get("/{id}", r.Handler.Shop.GetProductAllocationByID)
		allocations.Put("/{id}", r.Handler.Shop.UpdateProductAllocation)
		allocations.Delete("/{id}", r.Handler.Shop.DeleteProductAllocation)
	})
}

func (r *Router) setupWarrantyRoutes(router chi.Router) {
	router.Route("/car-parts", func(carParts chi.Router) {
		carParts.Post("/", r.Handler.Warranty.CreateCarPart)
		carParts.Get("/", r.Handler.Warranty.ListCarParts)
		carParts.Get("/{id}", r.Handler.Warranty.GetCarPartByID)
		carParts.Put("/{id}", r.Handler.Warranty.UpdateCarPart)
		carParts.Delete("/{id}", r.Handler.Warranty.DeleteCarPart)
	})

	router.Route("/warranties", func(warranties chi.Router) {
		warranties.Post("/", r.Handler.Warranty.CreateWarranty)
		warranties.Get("/", r.Handler.Warranty.ListWarranties)
		warranties.Get("/{id}", r.Handler.Warranty.GetWarrantyByID)
		warranties.Put("/{id}", r.Handler.Warranty.UpdateWarranty)
		warranties.Delete("/{id}", r.Handler.Warranty.DeleteWarranty)
	})
}

// setupClaimRoutes configures claim-related routes
func (r *Router) setupClaimRoutes(router chi.Router) {
	router.Route("/claims", func(claims chi.Router) {
		claims.Post("/", r.Handler.Claim.CreateClaim)
		claims.Get("/", r.Handler.Claim.ListClaims)
		claims.Get("/{id}", r.Handler.Claim.GetClaimByID)
		claims.Put("/{id}", r.Handler.Claim.UpdateClaim)
		claims.Delete("/{id}", r.Handler.Claim.DeleteClaim)
	})
}

// healthCheck handles the health check endpoint
func (r *Router) healthCheck(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": "ok", "message": "Server is running"}`))
}
