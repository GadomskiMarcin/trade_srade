package main

import "net/http"

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		handleCORS(w, r)
		if r.Method == "OPTIONS" {
			return
		}
		next(w, r)
	}
}

func handleCORS(w http.ResponseWriter, r *http.Request) {
	// Allow requests from both development and production origins
	origin := r.Header.Get("Origin")
	if origin == "http://localhost:3000" || origin == "http://localhost" || origin == "" {
		w.Header().Set("Access-Control-Allow-Origin", origin)
	}
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Content-Type", "application/json")
} 