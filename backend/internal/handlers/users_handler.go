package handlers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/middlewares"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/services"
	"github.com/kokweikhong/profilm_ewarranty/backend/pkg/utils"
	"golang.org/x/crypto/bcrypt"
)

type UsersHandler interface {
	GetUserByID(w http.ResponseWriter, r *http.Request)
	GetUserByUsername(w http.ResponseWriter, r *http.Request)
	CreateUser(w http.ResponseWriter, r *http.Request)
	UpdateUserPassword(w http.ResponseWriter, r *http.Request)
	Login(w http.ResponseWriter, r *http.Request)
	RefreshToken(w http.ResponseWriter, r *http.Request)
}

type usersHandler struct {
	usersService services.UsersService
}

func NewUsersHandler(usersService services.UsersService) UsersHandler {
	return &usersHandler{
		usersService: usersService,
	}
}

// Implementations of the handler methods would go here

// GetUserByID handles the HTTP request to get a user by ID.
func (h *usersHandler) GetUserByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	idParam := chi.URLParam(r, "id")
	// Convert idParam to int32 and handle error (omitted for brevity)
	userID, err := utils.ConvertParamToInt32(idParam)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid user ID")
		return
	}

	user, err := h.usersService.GetUserByID(ctx, userID)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to get user")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, user)
}

// GetUserByUsername handles the HTTP request to get a user by username.
func (h *usersHandler) GetUserByUsername(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	username := chi.URLParam(r, "username")

	user, err := h.usersService.GetUserByUsername(ctx, username)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to get user")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, user)
}

// CreateUser handles the HTTP request to create a new user.
func (h *usersHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var req struct {
		ShopID   *int32 `json:"shopId"`
		Role     string `json:"role"`
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := utils.ParseJSONRequestBody(r, &req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	user, err := h.usersService.CreateUser(ctx, req.ShopID, req.Role, req.Username, req.Password)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to create user")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusCreated, user)
}

// UpdateUserPassword handles the HTTP request to update a user's password.
func (h *usersHandler) UpdateUserPassword(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idParam := chi.URLParam(r, "id")
	// Convert idParam to int32 and handle error (omitted for brevity)
	userID, err := utils.ConvertParamToInt32(idParam)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid user ID")
		return
	}
	var req struct {
		NewPassword string `json:"newPassword"`
	}
	if err := utils.ParseJSONRequestBody(r, &req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	user, err := h.usersService.UpdateUserPassword(ctx, userID, req.NewPassword)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to update password")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, user)
}

// Login handles user authentication and returns a JWT token
func (h *usersHandler) Login(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := utils.ParseJSONRequestBody(r, &req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Validate input
	if req.Username == "" || req.Password == "" {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Username and password are required")
		return
	}

	// Get user by username
	user, err := h.usersService.GetUserByUsername(ctx, req.Username)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	// Generate access token
	accessToken, err := middlewares.GenerateAccessToken(user.ID, user.Username, user.ShopID)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to generate access token")
		return
	}

	// Generate refresh token
	refreshToken, err := middlewares.GenerateRefreshToken(user.ID, user.Username, user.ShopID)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to generate refresh token")
		return
	}

	// Return tokens and user info
	response := map[string]any{
		"accessToken":  accessToken,
		"refreshToken": refreshToken,
		"user": map[string]any{
			"id":       user.ID,
			"username": user.Username,
			"shopId":   user.ShopID,
			"role":     user.Role,
		},
	}

	utils.NewHTTPSuccessResponse(w, http.StatusOK, response)
}

// RefreshToken handles refresh token requests and returns a new access token
func (h *usersHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	var req struct {
		RefreshToken string `json:"refreshToken"`
	}

	if err := utils.ParseJSONRequestBody(r, &req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.RefreshToken == "" {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Refresh token is required")
		return
	}

	// Validate refresh token
	claims, err := middlewares.ValidateRefreshToken(req.RefreshToken)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusUnauthorized, "Invalid or expired refresh token")
		return
	}

	// Generate new access token
	accessToken, err := middlewares.GenerateAccessToken(claims.UserID, claims.Username, claims.ShopID)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to generate access token")
		return
	}

	// Return new access token
	response := map[string]any{
		"accessToken": accessToken,
	}

	utils.NewHTTPSuccessResponse(w, http.StatusOK, response)
}
