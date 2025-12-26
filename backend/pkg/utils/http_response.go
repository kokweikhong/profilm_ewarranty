package utils

import (
	"encoding/json"
	"net/http"
)

// NewHTTPSuccessResponse creates a successful response with data.
func NewHTTPSuccessResponse(w http.ResponseWriter, code int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)

	json.NewEncoder(w).Encode(data)
}

// NewHTTPErrorResponse creates an error response with an error message.
func NewHTTPErrorResponse(w http.ResponseWriter, code int, errMsg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	resp := map[string]string{"error": errMsg}
	json.NewEncoder(w).Encode(resp)
}

// ParseJSONRequestBody parses the JSON request body into the provided struct.
func ParseJSONRequestBody(r *http.Request, dst any) error {
	decoder := json.NewDecoder(r.Body)
	return decoder.Decode(dst)
}
