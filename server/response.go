package main

import (
	"encoding/json"
	"net/http"
)

func respondWithJSON(w http.ResponseWriter, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

func respondWithError(w http.ResponseWriter, message string, statusCode int) {
	respondWithJSON(w, Response{Error: message}, statusCode)
} 