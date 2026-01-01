package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/handlers/dto"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/services"
	"github.com/kokweikhong/profilm_ewarranty/backend/pkg/utils"
)

// ClaimsHandler defines the HTTP contract for claim-related endpoints.
type ClaimsHandler interface {
	// ListClaimsView returns a list of claims from the view.
	ListClaims(w http.ResponseWriter, r *http.Request)
	// GetClaimsByShopID returns claims associated with a specific shop ID.
	GetClaimsByShopID(w http.ResponseWriter, r *http.Request)
	// GetClaimByID returns a single claim by ID.
	GetClaimByID(w http.ResponseWriter, r *http.Request)
	// GenerateNextClaimNo returns the next claim number based on warranty number and claim date.
	GenerateNextClaimNo(w http.ResponseWriter, r *http.Request)
	// CreateClaim creates a new claim.
	CreateClaim(w http.ResponseWriter, r *http.Request)
	// UpdateClaim updates an existing claim.
	UpdateClaim(w http.ResponseWriter, r *http.Request)
	// UpdateClaimApproval updates the approval status of an existing claim.
	UpdateClaimApproval(w http.ResponseWriter, r *http.Request)
	// ListClaimWarrantyPartsByClaimID returns a list of claim warranty parts by claim ID.
	ListClaimWarrantyPartsByClaimID(w http.ResponseWriter, r *http.Request)
	// CreateClaimWarrantyPart creates a new claim warranty part.
	CreateClaimWarrantyPart(w http.ResponseWriter, r *http.Request)
	// UpdateClaimWarrantyPart updates an existing claim warranty part.
	UpdateClaimWarrantyPart(w http.ResponseWriter, r *http.Request)
	// UpdateClaimWarrantyPartApproval updates the approval status of an existing claim warranty part.
	UpdateClaimWarrantyPartApproval(w http.ResponseWriter, r *http.Request)
}

type claimsHandler struct {
	claimsService services.ClaimsService
}

// NewClaimsHandler creates a new ClaimsHandler instance.
func NewClaimsHandler(claimsService services.ClaimsService) ClaimsHandler {
	return &claimsHandler{
		claimsService: claimsService,
	}
}

// GetClaimsByShopID returns claims associated with a specific shop ID.
func (h *claimsHandler) GetClaimsByShopID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	shopIDStr := chi.URLParam(r, "shop_id")
	shopID, err := utils.ConvertParamToInt32(shopIDStr)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid shop ID")
		return
	}
	claimsList, err := h.claimsService.GetClaimsByShopID(ctx, shopID)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to get claims by shop ID")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, claimsList)
}

// ListClaims returns a list of claims from the view.
func (h *claimsHandler) ListClaims(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	claimsList, err := h.claimsService.ListClaims(ctx)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to list claims")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, claimsList)
}

// GetClaimByID returns a single claim by ID.
func (h *claimsHandler) GetClaimByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := chi.URLParam(r, "id")
	id, err := utils.ConvertParamToInt32(idStr)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid claim ID")
		return
	}
	claim, err := h.claimsService.GetClaimByID(ctx, id)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to get claim")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, claim)
}

// GenerateNextClaimNo returns the next claim number based on warranty number and claim date.
func (h *claimsHandler) GenerateNextClaimNo(w http.ResponseWriter, r *http.Request) {
	type requestBody struct {
		WarrantyNo string `json:"warrantyNo"`
		ClaimDate  string `json:"claimDate"`
	}

	ctx := r.Context()
	var req requestBody
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	nextClaimNo, err := h.claimsService.GenerateNextClaimNo(ctx, req.WarrantyNo, req.ClaimDate)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to generate next claim number")
		return
	}
	response := map[string]string{
		"claimNo": nextClaimNo,
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, response)
}

// CreateClaim creates a new claim.
func (h *claimsHandler) CreateClaim(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var req dto.CreateClaimRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	params, err := req.ToCreateClaimParams()
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}
	claim, err := h.claimsService.CreateClaim(ctx, params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to create claim")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusCreated, claim)
}

// UpdateClaim updates an existing claim.
func (h *claimsHandler) UpdateClaim(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := chi.URLParam(r, "id")
	id, err := utils.ConvertParamToInt32(idStr)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid claim ID")
		return
	}
	var req dto.UpdateClaimRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	params, err := req.ToUpdateClaimParams(id)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}
	claim, err := h.claimsService.UpdateClaim(ctx, params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to update claim")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, claim)
}

// UpdateClaimApproval updates the approval status of an existing claim.
func (h *claimsHandler) UpdateClaimApproval(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := chi.URLParam(r, "id")
	id, err := utils.ConvertParamToInt32(idStr)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid claim ID")
		return
	}
	var req dto.UpdateClaimApprovalRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	params := req.ToUpdateClaimApprovalParams()
	params.ID = id
	claim, err := h.claimsService.UpdateClaimApproval(ctx, params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to update claim approval")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, claim)
}

// ListClaimWarrantyPartsByClaimID returns a list of claim warranty parts by claim ID.
func (h *claimsHandler) ListClaimWarrantyPartsByClaimID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	claimIDStr := chi.URLParam(r, "claimId")
	claimID, err := utils.ConvertParamToInt32(claimIDStr)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid claim ID")
		return
	}
	parts, err := h.claimsService.ListClaimWarrantyPartsByClaimID(ctx, claimID)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to list claim warranty parts")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, parts)
}

// CreateClaimWarrantyPart creates a new claim warranty part.
func (h *claimsHandler) CreateClaimWarrantyPart(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var req dto.CreateClaimWarrantyPartRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	params, err := req.ToCreateClaimWarrantyPartParams()
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}
	part, err := h.claimsService.CreateClaimWarrantyPart(ctx, params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to create claim warranty part")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusCreated, part)
}

// UpdateClaimWarrantyPart updates an existing claim warranty part.
func (h *claimsHandler) UpdateClaimWarrantyPart(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := chi.URLParam(r, "id")
	id, err := utils.ConvertParamToInt32(idStr)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid claim warranty part ID")
		return
	}
	var req dto.UpdateClaimWarrantyPartRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	params, err := req.ToUpdateClaimWarrantyPartParams(id)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}
	part, err := h.claimsService.UpdateClaimWarrantyPart(ctx, params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to update claim warranty part")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, part)
}

// UpdateClaimWarrantyPartApproval updates the approval status of an existing claim warranty part.
func (h *claimsHandler) UpdateClaimWarrantyPartApproval(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := chi.URLParam(r, "id")
	id, err := utils.ConvertParamToInt32(idStr)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid claim warranty part ID")
		return
	}
	var req dto.UpdateClaimWarrantyPartApprovalRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	params := req.ToUpdateClaimWarrantyPartApprovalParams()
	params.ID = id
	part, err := h.claimsService.UpdateClaimWarrantyPartApproval(ctx, params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to update claim warranty part approval")
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, part)
}
