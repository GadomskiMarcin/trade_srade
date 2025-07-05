#!/usr/bin/env bash

set -euo pipefail
LOGFILE="$(dirname "$0")/dev.log"
ERRFILE="$(dirname "$0")/dev.err"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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
  echo -e "${YELLOW}==== $(date) Starting dev environment ====${NC}"
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

  # Start all services
  $DC up --build 2> >(tee -a "$ERRFILE" >&2)

  echo -e "${GREEN}==== $(date) Dev environment stopped ====${NC}"
} 2>&1 | tee "$LOGFILE" 