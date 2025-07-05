package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type SignupRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Claims struct {
	UserID int    `json:"user_id"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

type Response struct {
	Message string      `json:"message,omitempty"`
	Error   string      `json:"error,omitempty"`
	Token   string      `json:"token,omitempty"`
	User    interface{} `json:"user,omitempty"`
}

type TemporaryUserRequest struct {
	Name string `json:"name"`
}

func signupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Name == "" || req.Email == "" || req.Password == "" {
		respondWithError(w, "Name, email, and password are required", http.StatusBadRequest)
		return
	}

	if len(req.Password) < 6 {
		respondWithError(w, "Password must be at least 6 characters", http.StatusBadRequest)
		return
	}

	// Check if user already exists
	var existingID int
	err := db.QueryRow("SELECT id FROM users WHERE email = $1", req.Email).Scan(&existingID)
	if err == nil {
		respondWithError(w, "User already exists", http.StatusBadRequest)
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		respondWithError(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

	// Insert new user
	var userID int
	err = db.QueryRow("INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id", 
		req.Email, string(hashedPassword), req.Name).Scan(&userID)
	if err != nil {
		respondWithError(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	// Generate JWT token
	token, err := generateToken(userID, req.Email)
	if err != nil {
		respondWithError(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	respondWithJSON(w, Response{
		Message: "User created successfully",
		Token:   token,
		User: map[string]interface{}{
			"id":    userID,
			"email": req.Email,
			"name":  req.Name,
		},
	}, http.StatusCreated)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Email == "" || req.Password == "" {
		respondWithError(w, "Email and password are required", http.StatusBadRequest)
		return
	}

	// Find user
	var user User
	var hashedPassword string
	err := db.QueryRow("SELECT id, email, password, name, created_at FROM users WHERE email = $1", 
		req.Email).Scan(&user.ID, &user.Email, &hashedPassword, &user.Name, &user.CreatedAt)
	if err != nil {
		respondWithError(w, "Invalid credentials", http.StatusBadRequest)
		return
	}

	// Check password
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(req.Password))
	if err != nil {
		respondWithError(w, "Invalid credentials", http.StatusBadRequest)
		return
	}

	// Generate JWT token
	token, err := generateToken(user.ID, user.Email)
	if err != nil {
		respondWithError(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	respondWithJSON(w, Response{
		Message: "Login successful",
		Token:   token,
		User: map[string]interface{}{
			"id":    user.ID,
			"email": user.Email,
			"name":  user.Name,
		},
	}, http.StatusOK)
}

func temporaryUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req TemporaryUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Name == "" {
		respondWithError(w, "Name is required", http.StatusBadRequest)
		return
	}

	// Generate a unique temporary email
	tempEmail := fmt.Sprintf("temp_%d@temporary.local", time.Now().UnixNano())

	// Create temporary user with a random password
	randomPassword := fmt.Sprintf("temp_%d", time.Now().UnixNano())
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(randomPassword), bcrypt.DefaultCost)
	if err != nil {
		respondWithError(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

	// Insert temporary user
	var userID int
	err = db.QueryRow("INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id", 
		tempEmail, string(hashedPassword), req.Name).Scan(&userID)
	if err != nil {
		respondWithError(w, "Error creating temporary user", http.StatusInternalServerError)
		return
	}

	// Generate JWT token
	token, err := generateToken(userID, tempEmail)
	if err != nil {
		respondWithError(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	respondWithJSON(w, Response{
		Message: "Temporary user created successfully",
		Token:   token,
		User: map[string]interface{}{
			"id":    userID,
			"email": tempEmail,
			"name":  req.Name,
		},
	}, http.StatusCreated)
}

func generateToken(userID int, email string) (string, error) {
	claims := Claims{
		UserID: userID,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
} 