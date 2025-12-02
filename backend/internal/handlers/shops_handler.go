package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/dto"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/services"
	"github.com/kokweikhong/profilm_ewarranty/backend/pkg/utils"
)

type ShopsHandler interface {
	// ListMsiaStates returns a list of Malaysian states.
	ListMsiaStates(w http.ResponseWriter, r *http.Request)

	// ListShopsView returns a list of shops from the view.
	ListShopsView(w http.ResponseWriter, r *http.Request)

	// GetShopByID returns a single shop by ID.
	GetShopByID(w http.ResponseWriter, r *http.Request)

	// CreateShop creates a new shop.
	CreateShop(w http.ResponseWriter, r *http.Request)

	// UpdateShop updates an existing shop.
	UpdateShop(w http.ResponseWriter, r *http.Request)

	UpdateShopPassword(w http.ResponseWriter, r *http.Request)
}

type shopsHandler struct {
	shopsService services.ShopsService
}

func NewShopsHandler(shopsService services.ShopsService) ShopsHandler {
	return &shopsHandler{
		shopsService: shopsService,
	}
}

// ListMsiaStates returns a list of Malaysian states.
func (h *shopsHandler) ListMsiaStates(w http.ResponseWriter, r *http.Request) {
	states, err := h.shopsService.ListMsiaStates(r.Context())
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to list states")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, states)
}

// ListShopsView returns a list of shops from the view.
func (h *shopsHandler) ListShopsView(w http.ResponseWriter, r *http.Request) {
	shopViews, err := h.shopsService.ListShopsView(r.Context())
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to list shops")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, shopViews)
}

// GetShopByID returns a single shop by ID.
func (h *shopsHandler) GetShopByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := utils.ConvertParamToInt32(idParam)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid shop ID")
		return
	}

	shop, err := h.shopsService.GetShopByID(r.Context(), id)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to get shop")
		return
	}

	utils.NewHTTPSuccessResponse(w, http.StatusOK, shop)
}

// CreateShop creates a new shop.
func (h *shopsHandler) CreateShop(w http.ResponseWriter, r *http.Request) {
	var req *dto.CreateShopRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	hashedPassword, err := utils.HashPassword(req.LoginPassword)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to hash password")
		return
	}

	params := dto.ToCreateShopRequestParams(req, hashedPassword)

	// 1. Get the state by ID to get its code
	state, err := h.shopsService.GetMsiaStateByID(r.Context(), req.MsiaStateID)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to get state")
		return
	}

	// 2. Generate branch code
	branchCode, err := h.shopsService.GenerateNextBranchCode(r.Context(), state.Code)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to generate branch code")
		return
	}
	params.BranchCode = branchCode

	// 3. Create the shop
	shop, err := h.shopsService.CreateShop(r.Context(), params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to create shop")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusCreated, shop)
}

// UpdateShop updates an existing shop.
func (h *shopsHandler) UpdateShop(w http.ResponseWriter, r *http.Request) {
	var req *dto.UpdateShopRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	params := dto.ToUpdateShopRequestParams(req)

	shop, err := h.shopsService.UpdateShop(r.Context(), params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to update shop")
		return
	}

	utils.NewHTTPSuccessResponse(w, http.StatusOK, shop)
}

// UpdateShopPassword updates the password of an existing shop.
func (h *shopsHandler) UpdateShopPassword(w http.ResponseWriter, r *http.Request) {
	var req *dto.UpdateShopPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	hashedPassword, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to hash password")
		return
	}
	_, err = h.shopsService.UpdateShopPassword(r.Context(), req.ID, hashedPassword)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to update shop password")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, map[string]string{"message": "Password updated successfully"})
}
