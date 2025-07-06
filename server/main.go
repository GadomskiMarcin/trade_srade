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
	if err := loadEnv(); err != nil {
		log.Fatal("Failed to load environment variables:", err)
	}

	// Initialize database
	if err := initDB(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	// Get port from environment
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT environment variable is required")
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

func loadEnv() error {
	// Load JWT secret from environment
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return fmt.Errorf("JWT_SECRET environment variable is required")
	}
	jwtSecret = []byte(secret)
	return nil
}

func initDB() error {
	// Get database connection string from environment
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		return fmt.Errorf("DB_HOST environment variable is required")
	}
	
	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		return fmt.Errorf("DB_PORT environment variable is required")
	}
	
	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		return fmt.Errorf("DB_USER environment variable is required")
	}
	
	dbPassword := os.Getenv("DB_PASSWORD")
	if dbPassword == "" {
		return fmt.Errorf("DB_PASSWORD environment variable is required")
	}
	
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		return fmt.Errorf("DB_NAME environment variable is required")
	}

	// Create connection string
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)

	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		return fmt.Errorf("failed to open database connection: %w", err)
	}

	// Test the connection
	err = db.Ping()
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
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
		return fmt.Errorf("failed to create users table: %w", err)
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
		offer_type VARCHAR(50) NOT NULL DEFAULT 'Sell',
		latitude DECIMAL(10, 8),
		longitude DECIMAL(11, 8),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`

	_, err = db.Exec(createFurnitureTableSQL)
	if err != nil {
		return fmt.Errorf("failed to create furniture table: %w", err)
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
	return nil
}

func insertSampleFurniture() {
	sampleFurniture := []struct {
		title     string
		url       string
		tags      []string
		seller    string
		location  string
		offerType string
		latitude  float64
		longitude float64
	}{
		{
			title:     "Modern Leather Sofa",
			url:       "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
			tags:      []string{"Sofa", "Modern"},
			seller:    "Meblowa Galeria",
			location:  "Warszawa, Mazowieckie",
			offerType: "Sell",
			latitude:  52.2297,
			longitude: 21.0122,
		},
		{
			title:     "Vintage Wooden Chair",
			url:       "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop",
			tags:      []string{"Chair", "Vintage"},
			seller:    "Antykwariat Stary",
			location:  "Kraków, Małopolskie",
			offerType: "Giveaway",
			latitude:  50.0647,
			longitude: 19.9450,
		},
		{
			title:     "Glass Coffee Table",
			url:       "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=300&fit=crop",
			tags:      []string{"Table", "Modern"},
			seller:    "Nowoczesne Meblarstwo",
			location:  "Wrocław, Dolnośląskie",
			offerType: "Sell",
			latitude:  51.1079,
			longitude: 17.0385,
		},
		{
			title:     "Queen Size Bed Frame",
			url:       "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop",
			tags:      []string{"Bed", "Modern"},
			seller:    "Sypialnia Plus",
			location:  "Poznań, Wielkopolskie",
			offerType: "Free",
			latitude:  52.4064,
			longitude: 16.9252,
		},
		{
			title:     "Classic Wardrobe",
			url:       "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
			tags:      []string{"Wardrobe", "Classic"},
			seller:    "Szafa i Komoda",
			location:  "Gdańsk, Pomorskie",
			offerType: "Sell",
			latitude:  54.3521,
			longitude: 18.6466,
		},
		{
			title:     "Office Desk",
			url:       "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop",
			tags:      []string{"Desk", "Office"},
			seller:    "Biuro Mebli",
			location:  "Łódź, Łódzkie",
			offerType: "Giveaway",
			latitude:  51.7592,
			longitude: 19.4559,
		},
		{
			title:     "Kitchen Cabinet Set",
			url:       "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
			tags:      []string{"Cabinet", "Kitchen"},
			seller:    "Kuchnia i Jadalnia",
			location:  "Katowice, Śląskie",
			offerType: "Sell",
			latitude:  50.2613,
			longitude: 19.0233,
		},
		{
			title:     "Modern Pendant Light",
			url:       "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
			tags:      []string{"Lighting", "Modern"},
			seller:    "Oświetlenie Nowoczesne",
			location:  "Szczecin, Zachodniopomorskie",
			offerType: "Free",
			latitude:  53.4285,
			longitude: 14.5528,
		},
		{
			title:     "Dining Room Table",
			url:       "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=400&h=300&fit=crop",
			tags:      []string{"Table", "Dining"},
			seller:    "Jadalnia Premium",
			location:  "Lublin, Lubelskie",
			offerType: "Sell",
			latitude:  51.2465,
			longitude: 22.5684,
		},
		{
			title:     "Accent Armchair",
			url:       "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop",
			tags:      []string{"Chair", "Accent"},
			seller:    "Fotel i Kanapa",
			location:  "Białystok, Podlaskie",
			offerType: "Giveaway",
			latitude:  53.1325,
			longitude: 23.1688,
		},
		{
			title:     "Bookshelf Unit",
			url:       "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
			tags:      []string{"Cabinet", "Storage"},
			seller:    "Regały i Szafki",
			location:  "Kielce, Świętokrzyskie",
			offerType: "Free",
			latitude:  50.8661,
			longitude: 20.6286,
		},
		{
			title:     "Bedside Table",
			url:       "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=300&fit=crop",
			tags:      []string{"Table", "Bedroom"},
			seller:    "Sypialnia Komplet",
			location:  "Rzeszów, Podkarpackie",
			offerType: "Sell",
			latitude:  50.0409,
			longitude: 21.9992,
		},
	}

	for _, item := range sampleFurniture {
		_, err := db.Exec("INSERT INTO furniture (title, url, tags, seller, location, offer_type, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
			item.title, item.url, pq.Array(item.tags), item.seller, item.location, item.offerType, item.latitude, item.longitude)
		if err != nil {
			log.Printf("Error inserting furniture item: %v", err)
		}
	}

	log.Println("Sample furniture data inserted successfully")
} 