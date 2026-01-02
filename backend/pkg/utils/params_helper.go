package utils

import (
	"fmt"
	"time"
)

// ConvertParamToInt32 converts a string parameter to int32.
func ConvertParamToInt32(param string) (int32, error) {
	var intValue int32
	_, err := fmt.Sscanf(param, "%d", &intValue)
	return intValue, err
}

// ConvertDateStringToStandardFormat converts a date string to standard golang format.
func ConvertDateStringToStandardFormat(dateString string) (time.Time, error) {
	// Assuming the input dateString is in "YYYY-MM-DD" format
	date, err := time.Parse("2006-01-02", dateString)
	if err != nil {
		return time.Time{}, err
	}
	return date, nil
}
