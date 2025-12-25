package handlers

import (
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/services"
	"github.com/kokweikhong/profilm_ewarranty/backend/pkg/utils"
)

// UploadsHandler defines the HTTP contract for upload-related endpoints.
type UploadsHandler interface {
	// UploadFile handles single file upload
	UploadFile(w http.ResponseWriter, r *http.Request)

	// UploadMultipleFiles handles multiple file uploads
	UploadMultipleFiles(w http.ResponseWriter, r *http.Request)
}

type uploadsHandler struct {
	uploadsService services.UploadsService
}

func NewUploadsHandler(uploadsService services.UploadsService) UploadsHandler {
	return &uploadsHandler{
		uploadsService: uploadsService,
	}
}

// UploadFileResponse represents the response for a single file upload
type UploadFileResponse struct {
	URL      string `json:"url"`
	FileName string `json:"fileName"`
	Size     int64  `json:"size"`
}

// UploadMultipleFilesResponse represents the response for multiple file uploads
type UploadMultipleFilesResponse struct {
	Files []UploadFileResponse `json:"files"`
	Count int                  `json:"count"`
}

// UploadFile handles single file upload
func (h *uploadsHandler) UploadFile(w http.ResponseWriter, r *http.Request) {
	// Parse multipart form with 10MB max memory
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Failed to parse multipart form")
		return
	}

	// Get folder parameter from form or query (optional, defaults to "other")
	folderParam := r.FormValue("folder")
	if folderParam == "" {
		folderParam = string(services.FolderOther)
	}
	folder := services.UploadFolder(folderParam)

	// Get file from form
	file, header, err := r.FormFile("file")
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Failed to get file from form")
		return
	}
	defer file.Close()

	// Validate file size (10MB max)
	if header.Size > 10<<20 {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "File size exceeds 10MB limit")
		return
	}

	// Validate file extension
	ext := strings.ToLower(filepath.Ext(header.Filename))
	allowedExts := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
		".pdf":  true,
		".doc":  true,
		".docx": true,
	}
	if !allowedExts[ext] {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "File type not allowed")
		return
	}

	// Read file bytes
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to read file")
		return
	}

	// Generate unique filename
	uniqueFileName := generateUniqueFileName(header.Filename)

	// Upload file
	fileURL, err := h.uploadsService.UploadFile(r.Context(), fileBytes, uniqueFileName, folder)
	if err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to upload file")
		return
	}

	// Return response
	response := UploadFileResponse{
		URL:      fileURL,
		FileName: uniqueFileName,
		Size:     header.Size,
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, response)
}

// UploadMultipleFiles handles multiple file uploads
func (h *uploadsHandler) UploadMultipleFiles(w http.ResponseWriter, r *http.Request) {
	// Parse multipart form with 50MB max memory
	if err := r.ParseMultipartForm(50 << 20); err != nil {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Failed to parse multipart form")
		return
	}

	// Get folder parameter from form or query (optional, defaults to "other")
	folderParam := r.FormValue("folder")
	if folderParam == "" {
		folderParam = string(services.FolderOther)
	}
	folder := services.UploadFolder(folderParam)

	// Get files from form
	files := r.MultipartForm.File["files"]
	if len(files) == 0 {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "No files provided")
		return
	}

	// Limit number of files
	if len(files) > 10 {
		utils.NewHTTPErrorResponse(w, http.StatusBadRequest, "Maximum 10 files allowed")
		return
	}

	var uploadedFiles []UploadFileResponse
	allowedExts := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
		".pdf":  true,
		".doc":  true,
		".docx": true,
	}

	// Process each file
	for _, fileHeader := range files {
		// Validate file size (10MB max per file)
		if fileHeader.Size > 10<<20 {
			utils.NewHTTPErrorResponse(w, http.StatusBadRequest, fmt.Sprintf("File %s exceeds 10MB limit", fileHeader.Filename))
			return
		}

		// Validate file extension
		ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
		if !allowedExts[ext] {
			utils.NewHTTPErrorResponse(w, http.StatusBadRequest, fmt.Sprintf("File type not allowed for %s", fileHeader.Filename))
			return
		}

		// Open file
		file, err := fileHeader.Open()
		if err != nil {
			utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to open file")
			return
		}

		// Read file bytes
		fileBytes, err := io.ReadAll(file)
		if err != nil {
			file.Close()
			utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to read file")
			return
		}
		file.Close()

		// Generate unique filename
		uniqueFileName := generateUniqueFileName(fileHeader.Filename)

		// Upload file
		fileURL, err := h.uploadsService.UploadFile(r.Context(), fileBytes, uniqueFileName, folder)
		if err != nil {
			utils.NewHTTPErrorResponse(w, http.StatusInternalServerError, "Failed to upload file")
			return
		}

		uploadedFiles = append(uploadedFiles, UploadFileResponse{
			URL:      fileURL,
			FileName: uniqueFileName,
			Size:     fileHeader.Size,
		})
	}

	// Return response
	response := UploadMultipleFilesResponse{
		Files: uploadedFiles,
		Count: len(uploadedFiles),
	}
	utils.NewHTTPSuccessResponse(w, http.StatusOK, response)
}

// generateUniqueFileName generates a unique filename with timestamp and UUID
func generateUniqueFileName(originalFilename string) string {
	ext := filepath.Ext(originalFilename)
	timestamp := time.Now().Format("20060102150405")
	uniqueID := uuid.New().String()[:8]
	return fmt.Sprintf("%s_%s%s", timestamp, uniqueID, ext)
}
