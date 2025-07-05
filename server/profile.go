package main

import (
	"context"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const userIDKey contextKey = "userID"

func getProfileHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	var user User
	err := db.QueryRow("SELECT id, email, name, created_at FROM users WHERE id = $1", 
		userID).Scan(&user.ID, &user.Email, &user.Name, &user.CreatedAt)
	if err != nil {
		respondWithError(w, "User not found", http.StatusNotFound)
		return
	}

	respondWithJSON(w, Response{User: user}, http.StatusOK)
}

func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			respondWithError(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		// Extract token from "Bearer <token>"
		if len(authHeader) < 7 || authHeader[:7] != "Bearer " {
			respondWithError(w, "Invalid authorization header format", http.StatusUnauthorized)
			return
		}

		tokenString := authHeader[7:]

		// Parse and validate token
		token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			respondWithError(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Extract claims
		if claims, ok := token.Claims.(*Claims); ok {
			// Create new context with user info
			ctx := context.WithValue(r.Context(), userIDKey, claims.UserID)
			next(w, r.WithContext(ctx))
		} else {
			respondWithError(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}
	}
} 