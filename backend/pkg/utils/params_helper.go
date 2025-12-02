package utils

import "fmt"

// ConvertParamToInt32 converts a string parameter to int32.
func ConvertParamToInt32(param string) (int32, error) {
	var intValue int32
	_, err := fmt.Sscanf(param, "%d", &intValue)
	return intValue, err
}
