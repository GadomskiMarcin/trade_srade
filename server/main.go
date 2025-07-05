package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	_ "github.com/lib/pq"
)

var db *sql.DB
var jwtSecret []byte

func main() {
	// Load environment variables
	loadEnv()

	// Initialize database
	initDB()

	// Get port from environment or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Setup routes
	http.HandleFunc("/api/auth/signup", corsMiddleware(signupHandler))
	http.HandleFunc("/api/auth/login", corsMiddleware(loginHandler))
	http.HandleFunc("/api/auth/temporary", corsMiddleware(temporaryUserHandler))
	http.HandleFunc("/api/profile", corsMiddleware(authMiddleware(getProfileHandler)))

	// Handle preflight requests
	http.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			handleCORS(w, r)
			return
		}
		http.NotFound(w, r)
	})

	// Serve static files in production
	if os.Getenv("ENV") == "production" {
		http.HandleFunc("/", staticFileHandler)
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func staticFileHandler(w http.ResponseWriter, r *http.Request) {
	// Don't serve static files for API routes
	if strings.HasPrefix(r.URL.Path, "/api/") {
		http.NotFound(w, r)
		return
	}

	// Default to index.html for SPA routing
	path := r.URL.Path
	if path == "/" {
		path = "/index.html"
	}

	// Try to serve the file from static directory
	filePath := filepath.Join("static", path)
	http.ServeFile(w, r, filePath)
}

func loadEnv() {
	// Load JWT secret from environment
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "your-super-secret-jwt-key-change-this-in-production"
	}
	jwtSecret = []byte(secret)
}

func initDB() {
	// Get database connection string from environment
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}
	
	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "5432"
	}
	
	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "postgres"
	}
	
	dbPassword := os.Getenv("DB_PASSWORD")
	if dbPassword == "" {
		dbPassword = "password"
	}
	
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "auth_app"
	}

	// Create connection string
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)

	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	// Test the connection
	err = db.Ping()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Create users table
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		email VARCHAR(255) UNIQUE NOT NULL,
		password VARCHAR(255) NOT NULL,
		name VARCHAR(255) NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`

	_, err = db.Exec(createTableSQL)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Database initialized successfully")
} 