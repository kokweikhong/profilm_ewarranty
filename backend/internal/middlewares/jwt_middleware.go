package middlewares

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"
)

// JWT claims structure
type Claims struct {
	UserID    int32  `json:"userId"`
	Username  string `json:"username"`
	ShopID    *int32 `json:"shopId,omitempty"`
	TokenType string `json:"tokenType"` // "access" or "refresh"
	Exp       int64  `json:"exp"`
	Iat       int64  `json:"iat"`
}

type contextKey string

const UserContextKey contextKey = "user"

var jwtSecret []byte
var refreshSecret []byte

func init() {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "your-secret-key-change-this-in-production"
	}
	jwtSecret = []byte(secret)

	refSecret := os.Getenv("JWT_REFRESH_SECRET")
	if refSecret == "" {
		refSecret = "your-refresh-secret-key-change-this-in-production"
	}
	refreshSecret = []byte(refSecret)
}

// GenerateAccessToken generates an access token for a user (expires in 15 minutes)
func GenerateAccessToken(userID int32, username string, shopID *int32) (string, error) {
	now := time.Now()
	claims := Claims{
		UserID:    userID,
		Username:  username,
		ShopID:    shopID,
		TokenType: "access",
		Iat:       now.Unix(),
		Exp:       now.Add(15 * time.Minute).Unix(), // Access token expires in 15 minutes
	}
	return generateToken(claims, jwtSecret)
}

// GenerateRefreshToken generates a refresh token for a user (expires in 7 days)
func GenerateRefreshToken(userID int32, username string, shopID *int32) (string, error) {
	now := time.Now()
	claims := Claims{
		UserID:    userID,
		Username:  username,
		ShopID:    shopID,
		TokenType: "refresh",
		Iat:       now.Unix(),
		Exp:       now.Add(7 * 24 * time.Hour).Unix(), // Refresh token expires in 7 days
	}
	return generateToken(claims, refreshSecret)
}

// GenerateJWT generates a JWT token for a user (for backward compatibility)
// Deprecated: Use GenerateAccessToken instead
func GenerateJWT(userID int32, username string, shopID *int32) (string, error) {
	return GenerateAccessToken(userID, username, shopID)
}

// generateToken is a helper function to generate tokens
func generateToken(claims Claims, secret []byte) (string, error) {

	// Create header
	header := map[string]string{
		"alg": "HS256",
		"typ": "JWT",
	}

	headerJSON, err := json.Marshal(header)
	if err != nil {
		return "", err
	}

	claimsJSON, err := json.Marshal(claims)
	if err != nil {
		return "", err
	}

	// Encode header and claims
	headerEncoded := base64.RawURLEncoding.EncodeToString(headerJSON)
	claimsEncoded := base64.RawURLEncoding.EncodeToString(claimsJSON)

	// Create signature
	message := headerEncoded + "." + claimsEncoded
	signature := createSignatureWithSecret(message, secret)

	// Return complete JWT
	return message + "." + signature, nil
}

// ValidateAccessToken validates an access token
func ValidateAccessToken(tokenString string) (*Claims, error) {
	return validateToken(tokenString, jwtSecret, "access")
}

// ValidateRefreshToken validates a refresh token
func ValidateRefreshToken(tokenString string) (*Claims, error) {
	return validateToken(tokenString, refreshSecret, "refresh")
}

// ValidateJWT validates a JWT token and returns the claims (for backward compatibility)
// Deprecated: Use ValidateAccessToken or ValidateRefreshToken instead
func ValidateJWT(tokenString string) (*Claims, error) {
	return ValidateAccessToken(tokenString)
}

// validateToken is a helper function to validate tokens
func validateToken(tokenString string, secret []byte, expectedType string) (*Claims, error) {
	parts := strings.Split(tokenString, ".")
	if len(parts) != 3 {
		return nil, fmt.Errorf("invalid token format")
	}

	headerEncoded := parts[0]
	claimsEncoded := parts[1]
	signature := parts[2]

	// Verify signature
	message := headerEncoded + "." + claimsEncoded
	expectedSignature := createSignatureWithSecret(message, secret)

	if signature != expectedSignature {
		return nil, fmt.Errorf("invalid token signature")
	}

	// Decode claims
	claimsJSON, err := base64.RawURLEncoding.DecodeString(claimsEncoded)
	if err != nil {
		return nil, fmt.Errorf("failed to decode claims: %w", err)
	}

	var claims Claims
	if err := json.Unmarshal(claimsJSON, &claims); err != nil {
		return nil, fmt.Errorf("failed to unmarshal claims: %w", err)
	}

	// Check token type
	if claims.TokenType != expectedType {
		return nil, fmt.Errorf("invalid token type: expected %s, got %s", expectedType, claims.TokenType)
	}

	// Check expiration
	if time.Now().Unix() > claims.Exp {
		return nil, fmt.Errorf("token has expired")
	}

	return &claims, nil
}

// createSignatureWithSecret creates HMAC-SHA256 signature with custom secret
func createSignatureWithSecret(message string, secret []byte) string {
	h := hmac.New(sha256.New, secret)
	h.Write([]byte(message))
	return base64.RawURLEncoding.EncodeToString(h.Sum(nil))
}

// JWTMiddleware is a middleware that validates JWT tokens
func JWTMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get token from Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, `{"error":"Missing authorization header"}`, http.StatusUnauthorized)
			return
		}

		// Check if it's a Bearer token
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, `{"error":"Invalid authorization header format"}`, http.StatusUnauthorized)
			return
		}

		token := parts[1]

		// Validate access token
		claims, err := ValidateAccessToken(token)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error":"Invalid token: %s"}`, err.Error()), http.StatusUnauthorized)
			return
		}

		// Add claims to request context
		ctx := context.WithValue(r.Context(), UserContextKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetUserFromContext retrieves user claims from request context
func GetUserFromContext(ctx context.Context) (*Claims, bool) {
	claims, ok := ctx.Value(UserContextKey).(*Claims)
	return claims, ok
}
