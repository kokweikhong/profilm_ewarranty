package services

import (
	"bytes"
	"context"
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
)

// UploadFolder represents different upload categories
type UploadFolder string

const (
	FolderShopImages         UploadFolder = "shop_images"
	FolderCompanyLicenses    UploadFolder = "company_licenses"
	FolderInstallationImages UploadFolder = "installation_images"
	FolderDamagedImages      UploadFolder = "damaged_images"
	FolderResolutionImages   UploadFolder = "resolution_images"
	FolderInvoices           UploadFolder = "invoices"
	FolderOther              UploadFolder = "other"
)

type UploadsService interface {
	UploadFile(ctx context.Context, fileBytes []byte, fileName string, folder UploadFolder) (string, error)
}

type uploadsService struct {
	s3Client   *s3.Client
	bucketName string
	endpoint   string
}

func NewUploadsService(ctx context.Context) (UploadsService, error) {
	// Configure DigitalOcean Spaces credentials
	spacesKey := os.Getenv("DO_SPACES_KEY")
	spacesSecret := os.Getenv("DO_SPACES_SECRET")
	region := os.Getenv("DO_SPACES_REGION") // e.g., "nyc3"
	bucketName := os.Getenv("DO_SPACES_BUCKET")
	endpoint := fmt.Sprintf("https://%s.digitaloceanspaces.com", region)

	// Load AWS SDK v2 config with custom credentials
	cfg, err := config.LoadDefaultConfig(ctx,
		config.WithRegion(region),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(spacesKey, spacesSecret, "")),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to load AWS config: %w", err)
	}

	// Create S3 client with custom endpoint
	s3Client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(endpoint)
	})

	return &uploadsService{
		s3Client:   s3Client,
		bucketName: bucketName,
		endpoint:   endpoint,
	}, nil
}

// UploadFile uploads a file to DigitalOcean Spaces in the specified folder and returns its URL or an error.
func (s *uploadsService) UploadFile(ctx context.Context, fileBytes []byte, fileName string, folder UploadFolder) (string, error) {
	// Construct the full path with folder
	fullPath := fmt.Sprintf("%s/%s", folder, fileName)

	// Upload file
	_, err := s.s3Client.PutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(s.bucketName),
		Key:    aws.String(fullPath),
		Body:   bytes.NewReader(fileBytes),
		ACL:    types.ObjectCannedACLPublicRead,
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload file: %w", err)
	}

	// Return the public URL
	fileURL := fmt.Sprintf("%s/%s/%s", s.endpoint, s.bucketName, fullPath)
	return fileURL, nil
}
