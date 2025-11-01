package middleware

// import (
// 	"context"
// 	"fmt"
// 	"net/http"
// 	"strings"

// 	"github.com/golang-jwt/jwt/v5"
// )

// type contextKey string

// const UserIDKey contextKey = "userID"

// func JWTAuth(jwtSecret string) func(http.Handler) http.Handler {
// 	return func(next http.Handler) http.Handler {
// 		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 			authHeader := r.Header.Get("Authorization")
// 			if authHeader == "" {
// 				http.Error(w, "Authorization header required", http.StatusUnauthorized)
// 				return
// 			}

// 			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
// 			if tokenString == authHeader {
// 				http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
// 				return
// 			}

// 			token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
// 				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
// 					return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
// 				}
// 				return []byte(jwtSecret), nil
// 			})

// 			if err != nil {
// 				http.Error(w, "Invalid token", http.StatusUnauthorized)
// 				return
// 			}

// 			if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
// 				userID, ok := claims["user_id"].(string)
// 				if !ok {
// 					http.Error(w, "Invalid token claims", http.StatusUnauthorized)
// 					return
// 				}

// 				ctx := context.WithValue(r.Context(), UserIDKey, userID)
// 				next.ServeHTTP(w, r.WithContext(ctx))
// 			} else {
// 				http.Error(w, "Invalid token", http.StatusUnauthorized)
// 			}
// 		})
// 	}
// }

// func GetUserIDFromContext(ctx context.Context) (string, bool) {
// 	userID, ok := ctx.Value(UserIDKey).(string)
// 	return userID, ok
// }
