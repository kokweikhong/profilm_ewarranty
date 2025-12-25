package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/handlers/dto"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/services"
	"github.com/kokweikhong/profilm_ewarranty/backend/pkg/utils"
)

type ShopsHandler interface {
	// ListMsiaStates returns a list of Malaysian states.
	ListMsiaStates(w http.ResponseWriter, r *http.Request)

	// GetShops returns a list of shops.
	GetShops(w http.ResponseWriter, r *http.Request)

	// GetShopByID returns a single shop by ID.
	GetShopByID(w http.ResponseWriter, r *http.Request)

	// CreateShop creates a new shop.
	CreateShop(w http.ResponseWriter, r *http.Request)

	// UpdateShop updates an existing shop.
	UpdateShop(w http.ResponseWriter, r *http.Request)

	// GenerateNextBranchCode generates the next branch code for a given state code.
	GenerateNextBranchCode(w http.ResponseWriter, r *http.Request)
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

// GetShops returns a list of shops.
func (h *shopsHandler) GetShops(w http.ResponseWriter, r *http.Request) {
	shops, err := h.shopsService.GetShops(r.Context())
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to get shops")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, shops)
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

	params := req.ToCreateShopParams()

	shop, err := h.shopsService.CreateShop(r.Context(), params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to create shop")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusCreated, shop)
}

// UpdateShop updates an existing shop.
func (h *shopsHandler) UpdateShop(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := utils.ConvertParamToInt32(idParam)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid shop ID")
		return
	}
	var req *dto.UpdateShopRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	params := req.ToUpdateShopParams(id)

	shop, err := h.shopsService.UpdateShop(r.Context(), params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to update shop")
		return
	}

	utils.NewHTTPSuccessResponse(w, http.StatusOK, shop)
}

// GenerateNextBranchCode generates the next branch code for a given state code.
func (h *shopsHandler) GenerateNextBranchCode(w http.ResponseWriter, r *http.Request) {
	stateCode := chi.URLParam(r, "state_code")
	// capitalize the state code to ensure consistency
	stateCode = strings.ToUpper(stateCode)
	if stateCode == "" {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Missing state_code query parameter")
		return
	}
	branchCode, err := h.shopsService.GenerateNextBranchCode(r.Context(), stateCode)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to generate branch code")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, map[string]string{"branch_code": branchCode})
}
