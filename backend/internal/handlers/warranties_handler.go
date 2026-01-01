package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/handlers/dto"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/services"
	"github.com/kokweikhong/profilm_ewarranty/backend/pkg/utils"
)

type WarrantiesHandler interface {
	ListWarranties(w http.ResponseWriter, r *http.Request)
	// GetWarrantyByID(w http.ResponseWriter, r *http.Request)
	// CreateWarranty(w http.ResponseWriter, r *http.Request)
	UpdateWarrantyApproval(w http.ResponseWriter, r *http.Request)

	GetWarrantiesByExactSearch(w http.ResponseWriter, r *http.Request)
	GetWarrantyWithPartsByID(w http.ResponseWriter, r *http.Request)

	GetWarrantiesWithPartsByShopID(w http.ResponseWriter, r *http.Request)

	GetCarParts(w http.ResponseWriter, r *http.Request)

	CreateWarrantyPart(w http.ResponseWriter, r *http.Request)
	UpdateWarrantyPart(w http.ResponseWriter, r *http.Request)
	UpdateWarrantyPartApproval(w http.ResponseWriter, r *http.Request)
	GetWarrantyPartsByWarrantyID(w http.ResponseWriter, r *http.Request)

	GetWarrantyDetailsByID(w http.ResponseWriter, r *http.Request)

	CreateWarrantyWithParts(w http.ResponseWriter, r *http.Request)
	UpdateWarrantyWithParts(w http.ResponseWriter, r *http.Request)

	GenerateNextWarrantyNo(w http.ResponseWriter, r *http.Request)
}

type warrantiesHandler struct {
	warrantiesService services.WarrantiesService
}

func NewWarrantiesHandler(warrantiesService services.WarrantiesService) WarrantiesHandler {
	return &warrantiesHandler{
		warrantiesService: warrantiesService,
	}
}

// ListWarranties returns a list of warranties from the view.
func (h *warrantiesHandler) ListWarranties(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	warrantiesView, err := h.warrantiesService.ListWarranties(ctx)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, warrantiesView)
}

// GetWarrantyByID returns a single warranty by ID.
// func (h *warrantiesHandler) GetWarrantyByID(w http.ResponseWriter, r *http.Request) {
// 	ctx := r.Context()
// 	// Get ID from URL path parameter
// 	idStr := chi.URLParam(r, "id")
// 	id, err := utils.ConvertParamToInt32(idStr)
// 	if err != nil {
// 		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid ID")
// 		return
// 	}

// 	warranty, err := h.warrantiesService.GetWarrantyByID(ctx, id)
// 	if err != nil {
// 		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
// 		return
// 	}
// 	utils.NewHTTPSuccessResponse(w, http.StatusOK, warranty)
// }

// CreateWarranty creates a new warranty.
// func (h *warrantiesHandler) CreateWarranty(w http.ResponseWriter, r *http.Request) {
// 	ctx := r.Context()
// 	var req dto.CreateWarrantyRequest
// 	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
// 		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
// 		return
// 	}
// 	params, err := req.ToCreateWarrantyParams()
// 	if err != nil {
// 		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, err.Error())
// 		return
// 	}
// 	warranty, err := h.warrantiesService.CreateWarranty(ctx, params)
// 	if err != nil {
// 		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
// 		return
// 	}
// 	utils.NewHTTPSuccessResponse(w, http.StatusCreated, warranty)
// }

// UpdateWarrantyApproval updates the approval status of an existing warranty.
func (h *warrantiesHandler) UpdateWarrantyApproval(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	// Get ID from URL path parameter
	idStr := chi.URLParam(r, "id")
	id, err := utils.ConvertParamToInt32(idStr)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid ID")
		return
	}
	var req dto.UpdateWarrantyApprovalRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	params := req.ToUpdateWarrantyApprovalParams(id)
	warranty, err := h.warrantiesService.UpdateWarrantyApproval(ctx, params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, warranty)
}

// GetWarrantyWithPartsByID returns a warranty along with its parts by ID.
func (h *warrantiesHandler) GetWarrantyWithPartsByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	// Get ID from URL path parameter
	idStr := chi.URLParam(r, "id")
	id, err := utils.ConvertParamToInt32(idStr)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid ID")
		return
	}
	warranty, err := h.warrantiesService.GetWarrantyByID(ctx, id)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	parts, err := h.warrantiesService.GetWarrantyPartsByWarrantyID(ctx, id)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	response := dto.WarrantyWithPartsResponse{
		Warranty: warranty,
		Parts:    parts,
	}

	utils.NewHTTPSuccessResponse(w, http.StatusOK, response)
}

// GetWarrantiesByExactSearch returns warranties matching an exact search term.
func (h *warrantiesHandler) GetWarrantiesByExactSearch(w http.ResponseWriter, r *http.Request) {
	var result []dto.WarrantyByExactSearchResponse
	warrantyMap := make(map[int32]*dto.WarrantyByExactSearchResponse)
	ctx := r.Context()
	// Get search term from URL query parameter
	searchTerm := chi.URLParam(r, "search_term")
	if searchTerm == "" {
		// return empty list if search term is empty
		utils.NewHTTPSuccessResponse(w, http.StatusOK, result)
		return
	}
	warranties, err := h.warrantiesService.GetWarrantiesByExactSearch(ctx, searchTerm)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	// Return the warranties with parts
	for _, warranty := range warranties {
		warrantyResp, exists := warrantyMap[warranty.ID]
		if !exists {
			parts, err := h.warrantiesService.GetWarrantyPartsByWarrantyID(ctx, warranty.ID)
			if err != nil {
				utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
				return
			}
			warrantyResp = &dto.WarrantyByExactSearchResponse{
				Warranty: warranty,
				Parts:    parts,
			}
			warrantyMap[warranty.ID] = warrantyResp
			result = append(result, *warrantyResp)
		}
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, result)
}

// GetWarrantiesWithPartsByShopID returns warranties by shop ID.
func (h *warrantiesHandler) GetWarrantiesWithPartsByShopID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	// Get shop ID from URL path parameter
	shopIDStr := chi.URLParam(r, "shop_id")
	shopID, err := utils.ConvertParamToInt32(shopIDStr)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid shop ID")
		return
	}
	warranties, err := h.warrantiesService.GetWarrantiesByShopID(ctx, shopID)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	var result []dto.WarrantyWithPartsAndShopInfoResponse
	for _, warranty := range warranties {
		parts, err := h.warrantiesService.GetWarrantyPartsByWarrantyID(ctx, warranty.ID)
		if err != nil {
			utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
			return
		}
		warrantyWithParts := dto.WarrantyWithPartsAndShopInfoResponse{
			Warranty: warranty,
			Parts:    parts,
		}
		result = append(result, warrantyWithParts)
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, result)
}

// GetCarParts returns a list of car parts.
func (h *warrantiesHandler) GetCarParts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	carParts, err := h.warrantiesService.GetCarParts(ctx)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, carParts)
}

// CreateWarrantyPart creates a new warranty part.
func (h *warrantiesHandler) CreateWarrantyPart(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var req dto.CreateWarrantyPartRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	params := req.ToCreateWarrantyPartParams()
	warrantyPart, err := h.warrantiesService.CreateWarrantyPart(ctx, params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusCreated, warrantyPart)
}

// UpdateWarrantyPart updates an existing warranty part.
func (h *warrantiesHandler) UpdateWarrantyPart(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var req dto.UpdateWarrantyPartRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	params := req.ToUpdateWarrantyPartParams(req.WarrantyID)
	warrantyPart, err := h.warrantiesService.UpdateWarrantyPart(ctx, params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, warrantyPart)
}

// UpdateWarrantyPartApproval updates the approval status of an existing warranty part.
func (h *warrantiesHandler) UpdateWarrantyPartApproval(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Get warranty part ID from URL path parameter
	warrantyPartIDStr := chi.URLParam(r, "id")
	warrantyPartID, err := utils.ConvertParamToInt32(warrantyPartIDStr)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid warranty part ID")
		return
	}

	var req dto.UpdateWarrantyPartApprovalRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	params := req.ToUpdateWarrantyPartApprovalParams(warrantyPartID)
	warrantyPart, err := h.warrantiesService.UpdateWarrantyPartApproval(ctx, params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, warrantyPart)
}

// GetWarrantyPartsByWarrantyID returns warranty parts by warranty ID.
func (h *warrantiesHandler) GetWarrantyPartsByWarrantyID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	// Get warranty ID from URL path parameter
	warrantyIDStr := chi.URLParam(r, "warranty_id")
	warrantyID, err := utils.ConvertParamToInt32(warrantyIDStr)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid warranty ID")
		return
	}

	warrantyParts, err := h.warrantiesService.GetWarrantyPartsByWarrantyID(ctx, warrantyID)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, warrantyParts)
}

// CreateWarrantyWithParts creates a new warranty along with its parts.
func (h *warrantiesHandler) CreateWarrantyWithParts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var req dto.CreateWarrantyWithPartsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// warrantyParam, warrantyPartsParam, err := req.ToCreateWarrantyWithPartsParams()
	// if err != nil {
	// 	utils.NewHTTPErrorResponse(w, http.StatusBadRequest, err.Error())
	// 	return
	// }

	warranty, err := h.warrantiesService.CreateWarrantyWithParts(ctx, req.Warranty, req.Parts)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusCreated, warranty)
}

// GetWarrantyDetailsByID returns detailed warranty information including its parts.
func (h *warrantiesHandler) GetWarrantyDetailsByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	// Get ID from URL path parameter
	idStr := chi.URLParam(r, "id")
	id, err := utils.ConvertParamToInt32(idStr)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid ID")
		return
	}
	warranty, err := h.warrantiesService.GetWarrantyByID(ctx, id)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	warrantyParts, err := h.warrantiesService.GetWarrantyPartsByWarrantyID(ctx, id)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	response := dto.WarrantyDetailsResponse{
		Warranty: warranty,
		Parts:    warrantyParts,
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, response)
}

// UpdateWarrantyWithParts updates an existing warranty along with its parts.
func (h *warrantiesHandler) UpdateWarrantyWithParts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	// Get ID from URL path parameter
	idStr := chi.URLParam(r, "id")
	id, err := utils.ConvertParamToInt32(idStr)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid ID")
		return
	}
	var req dto.UpdateWarrantyWithPartsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, fmt.Sprintf("Invalid request body: %v", err))
		return
	}

	req.Warranty.ID = id

	warranty, err := h.warrantiesService.UpdateWarrantyWithParts(ctx, req.Warranty, req.Parts)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, warranty)
}

// GenerateNextWarrantyNo generates the next warranty number.
func (h *warrantiesHandler) GenerateNextWarrantyNo(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	branchCode := chi.URLParam(r, "branch_code")
	installationDate := chi.URLParam(r, "installation_date") // expected format: YYYYMMDD
	if branchCode == "" {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Branch code is required")
		return
	}
	if installationDate == "" {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Installation date is required")
		return
	}
	warrantyNo, err := h.warrantiesService.GenerateNextWarrantyNo(ctx, branchCode, installationDate)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	type GenerateWarrantyNoResponse struct {
		WarrantyNo string `json:"warrantyNo"`
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, GenerateWarrantyNoResponse{WarrantyNo: warrantyNo})
}
