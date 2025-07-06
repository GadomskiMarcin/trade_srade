package main

import (
	"fmt"
	"net/http"
	"strings"
)

type Furniture struct {
	ID        int      `json:"id"`
	Title     string   `json:"title"`
	URL       string   `json:"url"`
	Tags      []string `json:"tags"`
	Seller    string   `json:"seller"`
	Location  string   `json:"location"`
	OfferType string   `json:"offerType"`
	Latitude  *float64 `json:"latitude,omitempty"`
	Longitude *float64 `json:"longitude,omitempty"`
}

type FurnitureResponse struct {
	Furniture []Furniture `json:"furniture"`
	Total     int         `json:"total"`
}

func furnitureHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get tags and offer type from query parameters
	tags := r.URL.Query()["tags"]
	offerType := r.URL.Query().Get("offerType")
	
	// Build the query
	query := `
		SELECT id, title, url, tags, seller, location, offer_type, latitude, longitude
		FROM furniture 
		WHERE 1=1
	`
	
	var args []interface{}
	argIndex := 1
	
	// Add tag filtering if tags are provided
	if len(tags) > 0 {
		// Create placeholders for the IN clause
		placeholders := make([]string, len(tags))
		for i := range tags {
			placeholders[i] = fmt.Sprintf("$%d", argIndex)
			args = append(args, tags[i])
			argIndex++
		}
		
		// Use array overlap operator to check if any of the furniture tags match the requested tags
		query += fmt.Sprintf(" AND tags && ARRAY[%s]", strings.Join(placeholders, ","))
	}
	
	// Add offer type filtering if provided
	if offerType != "" {
		query += fmt.Sprintf(" AND offer_type = $%d", argIndex)
		args = append(args, offerType)
		argIndex++
	}
	
	query += " ORDER BY id"
	
	// Execute the query
	rows, err := db.Query(query, args...)
	if err != nil {
		respondWithError(w, "Error fetching furniture", http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	
	var furniture []Furniture
	for rows.Next() {
		var item Furniture
		var tagsStr string
		var lat, lng *float64
		err := rows.Scan(&item.ID, &item.Title, &item.URL, &tagsStr, &item.Seller, &item.Location, &item.OfferType, &lat, &lng)
		if err != nil {
			respondWithError(w, "Error scanning furniture data", http.StatusInternalServerError)
			return
		}
		
		// Parse tags string to array
		item.Tags = parseTags(tagsStr)
		
		// Set coordinates if they exist
		if lat != nil {
			item.Latitude = lat
		}
		if lng != nil {
			item.Longitude = lng
		}
		
		furniture = append(furniture, item)
	}
	
	if err = rows.Err(); err != nil {
		respondWithError(w, "Error iterating furniture data", http.StatusInternalServerError)
		return
	}
	
	respondWithJSON(w, FurnitureResponse{
		Furniture: furniture,
		Total:     len(furniture),
	}, http.StatusOK)
}

func parseTags(tagsStr string) []string {
	// Remove curly braces and split by comma
	tagsStr = strings.Trim(tagsStr, "{}")
	if tagsStr == "" {
		return []string{}
	}
	return strings.Split(tagsStr, ",")
} 