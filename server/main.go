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
	"github.com/lib/pq"
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
	http.HandleFunc("/api/furniture", corsMiddleware(furnitureHandler))

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

	// Create furniture table
	createFurnitureTableSQL := `
	CREATE TABLE IF NOT EXISTS furniture (
		id SERIAL PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		url TEXT NOT NULL,
		tags TEXT[] NOT NULL,
		seller VARCHAR(255) NOT NULL,
		location VARCHAR(255) NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`

	_, err = db.Exec(createFurnitureTableSQL)
	if err != nil {
		log.Fatal(err)
	}

	// Insert sample furniture data if table is empty
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM furniture").Scan(&count)
	if err != nil {
		log.Printf("Error checking furniture count: %v", err)
	} else if count == 0 {
		insertSampleFurniture()
	}

	log.Println("Database initialized successfully")
}

func insertSampleFurniture() {
	sampleFurniture := []struct {
		title    string
		url      string
		tags     []string
		seller   string
		location string
	}{
		{
			title:    "Modern Leather Sofa",
			url:      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
			tags:     []string{"Sofa", "Modern"},
			seller:   "Meblowa Galeria",
			location: "Warszawa, Mazowieckie",
		},
		{
			title:    "Vintage Wooden Chair",
			url:      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop",
			tags:     []string{"Chair", "Vintage"},
			seller:   "Antykwariat Stary",
			location: "Kraków, Małopolskie",
		},
		{
			title:    "Glass Coffee Table",
			url:      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=300&fit=crop",
			tags:     []string{"Table", "Modern"},
			seller:   "Nowoczesne Meblarstwo",
			location: "Wrocław, Dolnośląskie",
		},
		{
			title:    "Queen Size Bed Frame",
			url:      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop",
			tags:     []string{"Bed", "Modern"},
			seller:   "Sypialnia Plus",
			location: "Poznań, Wielkopolskie",
		},
		{
			title:    "Classic Wardrobe",
			url:      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
			tags:     []string{"Wardrobe", "Classic"},
			seller:   "Szafa i Komoda",
			location: "Gdańsk, Pomorskie",
		},
		{
			title:    "Office Desk",
			url:      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop",
			tags:     []string{"Desk", "Office"},
			seller:   "Biuro Mebli",
			location: "Łódź, Łódzkie",
		},
		{
			title:    "Kitchen Cabinet Set",
			url:      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
			tags:     []string{"Cabinet", "Kitchen"},
			seller:   "Kuchnia i Jadalnia",
			location: "Katowice, Śląskie",
		},
		{
			title:    "Modern Pendant Light",
			url:      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
			tags:     []string{"Lighting", "Modern"},
			seller:   "Oświetlenie Nowoczesne",
			location: "Szczecin, Zachodniopomorskie",
		},
		{
			title:    "Dining Room Table",
			url:      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=400&h=300&fit=crop",
			tags:     []string{"Table", "Dining"},
			seller:   "Jadalnia Premium",
			location: "Lublin, Lubelskie",
		},
		{
			title:    "Accent Armchair",
			url:      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop",
			tags:     []string{"Chair", "Accent"},
			seller:   "Fotel i Kanapa",
			location: "Białystok, Podlaskie",
		},
		{
			title:    "Bookshelf Unit",
			url:      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
			tags:     []string{"Cabinet", "Storage"},
			seller:   "Regały i Szafki",
			location: "Kielce, Świętokrzyskie",
		},
		{
			title:    "Bedside Table",
			url:      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=300&fit=crop",
			tags:     []string{"Table", "Bedroom"},
			seller:   "Sypialnia Komplet",
			location: "Rzeszów, Podkarpackie",
		},
	}

	for _, item := range sampleFurniture {
		_, err := db.Exec("INSERT INTO furniture (title, url, tags, seller, location) VALUES ($1, $2, $3, $4, $5)",
			item.title, item.url, pq.Array(item.tags), item.seller, item.location)
		if err != nil {
			log.Printf("Error inserting furniture item: %v", err)
		}
	}

	log.Println("Sample furniture data inserted successfully")
} 