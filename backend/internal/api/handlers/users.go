package handlers

// import (
// 	"encoding/json"
// 	"net/http"

// 	"github.com/kokweikhong/profilm_ewarranty/backend/internal/database/sqlc"
// )

// type UserHandler struct {
// 	queries *sqlc.Queries
// }

// func NewUserHandler(queries *sqlc.Queries) *UserHandler {
// 	return &UserHandler{
// 		queries: queries,
// 	}
// }

// type CreateUserRequest struct {
// 	Email       string `json:"email"`
// 	Username    string `json:"username"`
// 	Password    string `json:"password"`
// 	FirstName   string `json:"first_name,omitempty"`
// 	LastName    string `json:"last_name,omitempty"`
// }

// type UserResponse struct {
// 	ID        string `json:"id"`
// 	Email     string `json:"email"`
// 	Username  string `json:"username"`
// 	FirstName string `json:"first_name,omitempty"`
// 	LastName  string `json:"last_name,omitempty"`
// 	IsActive  bool   `json:"is_active"`
// 	CreatedAt string `json:"created_at"`
// 	UpdatedAt string `json:"updated_at"`
// }

// func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
// 	var req CreateUserRequest
// 	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
// 		http.Error(w, "Invalid request body", http.StatusBadRequest)
// 		return
// 	}

// 	// TODO: Hash password before storing
// 	// For now, we'll store the password as-is (NOT RECOMMENDED for production)

// 	user, err := h.queries.CreateUser(r.Context(), sqlc.CreateUserParams{
// 		Email:        req.Email,
// 		Username:     req.Username,
// 		PasswordHash: req.Password, // TODO: Hash this
// 		FirstName:    &req.FirstName,
// 		LastName:     &req.LastName,
// 	})
// 	if err != nil {
// 		http.Error(w, "Failed to create user", http.StatusInternalServerError)
// 		return
// 	}

// 	response := UserResponse{
// 		ID:        user.ID.String(),
// 		Email:     user.Email,
// 		Username:  user.Username,
// 		FirstName: *user.FirstName,
// 		LastName:  *user.LastName,
// 		IsActive:  user.IsActive,
// 		CreatedAt: user.CreatedAt.Format("2006-01-02T15:04:05Z"),
// 		UpdatedAt: user.UpdatedAt.Format("2006-01-02T15:04:05Z"),
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(http.StatusCreated)
// 	json.NewEncoder(w).Encode(response)
// }

// func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
// 	// Extract user ID from URL path or query parameter
// 	// This is a simplified example - you'd typically use a router like gorilla/mux or chi
// 	userID := r.URL.Query().Get("id")
// 	if userID == "" {
// 		http.Error(w, "User ID required", http.StatusBadRequest)
// 		return
// 	}

// 	user, err := h.queries.GetUserByID(r.Context(), userID)
// 	if err != nil {
// 		http.Error(w, "User not found", http.StatusNotFound)
// 		return
// 	}

// 	response := UserResponse{
// 		ID:        user.ID.String(),
// 		Email:     user.Email,
// 		Username:  user.Username,
// 		FirstName: *user.FirstName,
// 		LastName:  *user.LastName,
// 		IsActive:  user.IsActive,
// 		CreatedAt: user.CreatedAt.Format("2006-01-02T15:04:05Z"),
// 		UpdatedAt: user.UpdatedAt.Format("2006-01-02T15:04:05Z"),
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(response)
// }