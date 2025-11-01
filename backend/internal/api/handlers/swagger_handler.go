package handlers

import (
	"net/http"
)

// SwaggerHandler serves the Swagger documentation
type SwaggerHandler struct{}

// NewSwaggerHandler creates a new SwaggerHandler
func NewSwaggerHandler() *SwaggerHandler {
	return &SwaggerHandler{}
}

// ServeSwaggerUI serves a simple HTML page with Swagger UI
func (h *SwaggerHandler) ServeSwaggerUI() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		html := `<!DOCTYPE html>
<html>
<head>
    <title>ProFilm eWarranty API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
    <script>
        SwaggerUIBundle({
            url: '/swagger.yaml',
            dom_id: '#swagger-ui',
            presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIBundle.presets.standalone
            ]
        });
    </script>
</body>
</html>`
		w.Header().Set("Content-Type", "text/html")
		w.Write([]byte(html))
	})
}

// ServeSwaggerSpec serves the Swagger specification file
func (h *SwaggerHandler) ServeSwaggerSpec() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/x-yaml")
		http.ServeFile(w, r, "./swagger.yaml")
	})
}