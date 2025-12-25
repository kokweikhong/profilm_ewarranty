package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/handlers/dto"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/services"
	"github.com/kokweikhong/profilm_ewarranty/backend/pkg/utils"
)

type WarrantiesHandler interface {
	ListWarranties(w http.ResponseWriter, r *http.Request)
	GetWarrantyByID(w http.ResponseWriter, r *http.Request)
	CreateWarranty(w http.ResponseWriter, r *http.Request)
	UpdateWarranty(w http.ResponseWriter, r *http.Request)
	UpdateWarrantyApproval(w http.ResponseWriter, r *http.Request)

	GetWarrantyByWarrantyNo(w http.ResponseWriter, r *http.Request)
	GetWarrantiesByCarPlateNo(w http.ResponseWriter, r *http.Request)

	GetWarrantiesBySearchTerm(w http.ResponseWriter, r *http.Request)

	GetCarParts(w http.ResponseWriter, r *http.Request)

	CreateWarrantyPart(w http.ResponseWriter, r *http.Request)
	UpdateWarrantyPart(w http.ResponseWriter, r *http.Request)
	UpdateWarrantyPartApproval(w http.ResponseWriter, r *http.Request)
	GetWarrantyPartsByWarrantyID(w http.ResponseWriter, r *http.Request)

	CreateWarrantyWithParts(w http.ResponseWriter, r *http.Request)
	UpdateWarrantyWithParts(w http.ResponseWriter, r *http.Request)
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
func (h *warrantiesHandler) GetWarrantyByID(w http.ResponseWriter, r *http.Request) {
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
	utils.NewHTTPSuccessResponse(w, http.StatusOK, warranty)
}

// CreateWarranty creates a new warranty.
func (h *warrantiesHandler) CreateWarranty(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var req dto.CreateWarrantyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	params, err := req.ToCreateWarrantyParams()
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}
	warranty, err := h.warrantiesService.CreateWarranty(ctx, params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusCreated, warranty)
}

// UpdateWarranty updates an existing warranty.
func (h *warrantiesHandler) UpdateWarranty(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	// Get ID from URL path parameter
	idStr := chi.URLParam(r, "id")
	id, err := utils.ConvertParamToInt32(idStr)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid ID")
		return
	}

	var req dto.UpdateWarrantyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	params, err := req.ToUpdateWarrantyParams(id)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}
	warranty, err := h.warrantiesService.UpdateWarranty(ctx, params)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, warranty)
}

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

// GetWarrantyByWarrantyNo returns a warranty by warranty number.
func (h *warrantiesHandler) GetWarrantyByWarrantyNo(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	// Get warranty number from URL path parameter
	warrantyNo := chi.URLParam(r, "warranty_no")
	if warrantyNo == "" {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Warranty number is required")
		return
	}
	warranty, err := h.warrantiesService.GetWarrantyByWarrantyNo(ctx, warrantyNo)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, warranty)
}

// GetWarrantiesByCarPlateNo returns warranties by car plate number.
func (h *warrantiesHandler) GetWarrantiesByCarPlateNo(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	// Get car plate number from URL path parameter
	carPlateNo := chi.URLParam(r, "car_plate_no")
	if carPlateNo == "" {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Car plate number is required")
		return
	}

	warrantiesView, err := h.warrantiesService.GetWarrantiesByCarPlateNo(ctx, carPlateNo)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, warrantiesView)
}

// GetWarrantiesBySearchTerm returns warranties matching a search term.
func (h *warrantiesHandler) GetWarrantiesBySearchTerm(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	// Get search term from URL query parameter
	searchTerm := r.URL.Query().Get("q")
	if searchTerm == "" {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Search term is required")
		return
	}
	warrantiesView, err := h.warrantiesService.GetWarrantiesBySearchTerm(ctx, searchTerm)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, warrantiesView)
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

	var req dto.UpdateWarrantyPartApprovalRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	params := req.ToUpdateWarrantyPartApprovalParams()
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

	warrantyParam, warrantyPartsParam, err := req.ToCreateWarrantyWithPartsParams()
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	warranty, err := h.warrantiesService.CreateWarrantyWithParts(ctx, warrantyParam, warrantyPartsParam)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusCreated, warranty)
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
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	warrantyParam, warrantyPartsParam, err := req.ToUpdateWarrantyWithPartsParams(id)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	warranty, err := h.warrantiesService.UpdateWarrantyWithParts(ctx, warrantyParam, warrantyPartsParam)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, warranty)
}
