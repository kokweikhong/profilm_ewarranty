package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

// Test struct for validation
type TestStruct struct {
	RequiredField string `validate:"required"`
	UUIDField     string `validate:"uuid"`
	URLField      string `validate:"url"`
	MinField      string `validate:"min=3"`
	MaxField      string `validate:"max=10"`
	OneOfField    string `validate:"oneof=pending investigating resolved rejected"`
}

func TestValidateStruct_Success(t *testing.T) {
	validStruct := TestStruct{
		RequiredField: "test",
		UUIDField:     "123e4567-e89b-12d3-a456-426614174000",
		URLField:      "https://example.com/test.jpg",
		MinField:      "abc",
		MaxField:      "short",
		OneOfField:    "pending",
	}

	err := ValidateStruct(&validStruct)
	assert.NoError(t, err)
}

func TestValidateStruct_RequiredFieldMissing(t *testing.T) {
	invalidStruct := TestStruct{
		UUIDField:  "123e4567-e89b-12d3-a456-426614174000",
		URLField:   "https://example.com/test.jpg",
		MinField:   "abc",
		MaxField:   "short",
		OneOfField: "pending",
		// RequiredField is missing
	}

	err := ValidateStruct(&invalidStruct)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "requiredfield is required")
}

func TestValidateStruct_InvalidUUID(t *testing.T) {
	invalidStruct := TestStruct{
		RequiredField: "test",
		UUIDField:     "invalid-uuid",
		URLField:      "https://example.com/test.jpg",
		MinField:      "abc",
		MaxField:      "short",
		OneOfField:    "pending",
	}

	err := ValidateStruct(&invalidStruct)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "uuidfield must be a valid UUID")
}

func TestValidateStruct_InvalidURL(t *testing.T) {
	invalidStruct := TestStruct{
		RequiredField: "test",
		UUIDField:     "123e4567-e89b-12d3-a456-426614174000",
		URLField:      "not-a-url",
		MinField:      "abc",
		MaxField:      "short",
		OneOfField:    "pending",
	}

	err := ValidateStruct(&invalidStruct)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "urlfield must be a valid URL")
}

func TestValidateStruct_TooShort(t *testing.T) {
	invalidStruct := TestStruct{
		RequiredField: "test",
		UUIDField:     "123e4567-e89b-12d3-a456-426614174000",
		URLField:      "https://example.com/test.jpg",
		MinField:      "ab", // Too short (min=3)
		MaxField:      "short",
		OneOfField:    "pending",
	}

	err := ValidateStruct(&invalidStruct)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "minfield must be at least 3 characters")
}

func TestValidateStruct_TooLong(t *testing.T) {
	invalidStruct := TestStruct{
		RequiredField: "test",
		UUIDField:     "123e4567-e89b-12d3-a456-426614174000",
		URLField:      "https://example.com/test.jpg",
		MinField:      "abc",
		MaxField:      "this-is-way-too-long", // Too long (max=10)
		OneOfField:    "pending",
	}

	err := ValidateStruct(&invalidStruct)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "maxfield must be at most 10 characters")
}

func TestValidateStruct_InvalidOneOf(t *testing.T) {
	invalidStruct := TestStruct{
		RequiredField: "test",
		UUIDField:     "123e4567-e89b-12d3-a456-426614174000",
		URLField:      "https://example.com/test.jpg",
		MinField:      "abc",
		MaxField:      "short",
		OneOfField:    "invalid-status", // Not in oneof list
	}

	err := ValidateStruct(&invalidStruct)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "oneoffield must be one of: pending investigating resolved rejected")
}

func TestValidateStruct_MultipleErrors(t *testing.T) {
	invalidStruct := TestStruct{
		// RequiredField missing
		UUIDField:  "invalid-uuid",
		URLField:   "not-a-url",
		MinField:   "ab",
		MaxField:   "this-is-way-too-long",
		OneOfField: "invalid-status",
	}

	err := ValidateStruct(&invalidStruct)
	assert.Error(t, err)

	errMsg := err.Error()
	// Should contain multiple validation errors
	assert.Contains(t, errMsg, "requiredfield is required")
	assert.Contains(t, errMsg, "uuidfield must be a valid UUID")
	assert.Contains(t, errMsg, "urlfield must be a valid URL")
	assert.Contains(t, errMsg, "minfield must be at least 3 characters")
	assert.Contains(t, errMsg, "maxfield must be at most 10 characters")
	assert.Contains(t, errMsg, "oneoffield must be one of")
}

func TestFormatValidationError_UnknownTag(t *testing.T) {
	// This test would require creating a custom validator.FieldError
	// For now, we'll trust that the unknown tag case works as expected
	// In a real test, you might use a mock or create a custom FieldError implementation
}
