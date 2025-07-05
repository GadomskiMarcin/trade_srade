#!/usr/bin/env bash

set -euo pipefail
LOGFILE="$(dirname "$0")/clean.log"
ERRFILE="$(dirname "$0")/clean.err"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print error and log location
fail() {
  echo -e "\n${RED}[ERROR] Something went wrong. Check the logs for details: $LOGFILE, $ERRFILE${NC}" | tee -a "$ERRFILE" >&2
  exit 1
}

# Trap errors
trap fail ERR

# Start logging
{
  echo -e "${YELLOW}==== $(date) Starting Docker cleanup ====${NC}"
  echo -e "${YELLOW}Project root: $(pwd)${NC}"

  # Check Docker
  if ! command -v docker &>/dev/null; then
    echo -e "${RED}Docker is not installed!${NC}" | tee -a "$ERRFILE" >&2
    exit 1
  fi
  if ! docker info &>/dev/null; then
    echo -e "${RED}Docker daemon is not running!${NC}" | tee -a "$ERRFILE" >&2
    exit 1
  fi

  # Check docker-compose
  if docker compose version &>/dev/null; then
    DC="docker compose"
  elif command -v docker-compose &>/dev/null; then
    DC="docker-compose"
  else
    echo -e "${RED}docker-compose is not installed!${NC}" | tee -a "$ERRFILE" >&2
    exit 1
  fi

  echo -e "${GREEN}Using: $DC${NC}"

  # Check if containers are running
  echo -e "${BLUE}Checking for running containers...${NC}"
  
  # Get list of running containers
  RUNNING_CONTAINERS=$(docker ps --format "table {{.Names}}\t{{.Status}}" 2>/dev/null | tail -n +2 || true)
  
  if [ -n "$RUNNING_CONTAINERS" ]; then
    echo -e "${YELLOW}Found running containers:${NC}"
    echo "$RUNNING_CONTAINERS"
    echo ""
    
    # Stop all running containers
    echo -e "${BLUE}Stopping all running containers...${NC}"
    docker stop $(docker ps -q) 2>/dev/null || echo -e "${YELLOW}No containers to stop${NC}"
    
    # Remove all containers
    echo -e "${BLUE}Removing all containers...${NC}"
    docker rm $(docker ps -aq) 2>/dev/null || echo -e "${YELLOW}No containers to remove${NC}"
  else
    echo -e "${GREEN}No running containers found${NC}"
  fi

  # Check for project-specific containers
  echo -e "${BLUE}Checking for project-specific containers...${NC}"
  PROJECT_CONTAINERS=$(docker ps -a --filter "name=auth_" --format "table {{.Names}}\t{{.Status}}" 2>/dev/null | tail -n +2 || true)
  
  if [ -n "$PROJECT_CONTAINERS" ]; then
    echo -e "${YELLOW}Found project containers:${NC}"
    echo "$PROJECT_CONTAINERS"
    echo ""
    
    # Stop and remove project containers
    echo -e "${BLUE}Stopping and removing project containers...${NC}"
    docker stop $(docker ps -aq --filter "name=auth_") 2>/dev/null || echo -e "${YELLOW}No project containers to stop${NC}"
    docker rm $(docker ps -aq --filter "name=auth_") 2>/dev/null || echo -e "${YELLOW}No project containers to remove${NC}"
  else
    echo -e "${GREEN}No project containers found${NC}"
  fi

  # Clean up docker-compose
  echo -e "${BLUE}Cleaning up docker-compose...${NC}"
  $DC down -v --remove-orphans 2>/dev/null || echo -e "${YELLOW}No docker-compose project to clean${NC}"

  # Remove unused networks
  echo -e "${BLUE}Removing unused networks...${NC}"
  docker network prune -f 2>/dev/null || echo -e "${YELLOW}No unused networks to remove${NC}"

  # Remove unused volumes
  echo -e "${BLUE}Removing unused volumes...${NC}"
  docker volume prune -f 2>/dev/null || echo -e "${YELLOW}No unused volumes to remove${NC}"

  # Remove unused images (optional - commented out for safety)
  # echo -e "${BLUE}Removing unused images...${NC}"
  # docker image prune -f 2>/dev/null || echo -e "${YELLOW}No unused images to remove${NC}"

  # Final status
  echo -e "${BLUE}Final container status:${NC}"
  REMAINING_CONTAINERS=$(docker ps -a --format "table {{.Names}}\t{{.Status}}" 2>/dev/null | tail -n +2 || true)
  if [ -n "$REMAINING_CONTAINERS" ]; then
    echo -e "${YELLOW}Remaining containers:${NC}"
    echo "$REMAINING_CONTAINERS"
  else
    echo -e "${GREEN}No containers remaining${NC}"
  fi

  echo -e "${GREEN}==== $(date) Docker cleanup completed ====${NC}"
} 2>&1 | tee "$LOGFILE" 