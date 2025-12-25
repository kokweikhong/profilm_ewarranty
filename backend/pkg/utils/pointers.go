package utils

// DerefInt32 safely dereferences an int32 pointer, returning 0 if nil.
func DerefInt32(p *int32) int32 {
	if p == nil {
		return 0
	}
	return *p
}

// DerefString safely dereferences a string pointer, returning empty string if nil.
func DerefString(p *string) string {
	if p == nil {
		return ""
	}
	return *p
}

// DerefBool safely dereferences a bool pointer, returning false if nil.
func DerefBool(p *bool) bool {
	if p == nil {
		return false
	}
	return *p
}

// ToInt32Ptr converts an int32 value to a pointer.
func ToInt32Ptr(v int32) *int32 {
	return &v
}

// ToStringPtr converts a string value to a pointer.
func ToStringPtr(v string) *string {
	return &v
}

// ToBoolPtr converts a bool value to a pointer.
func ToBoolPtr(v bool) *bool {
	return &v
}
