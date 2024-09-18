#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Color Codes for Enhanced Output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print error messages
error() {
  echo -e "${RED}Error: $1${NC}"
}

# Function to print success messages
success() {
  echo -e "${GREEN}$1${NC}"
}

# Function to print info messages
info() {
  echo -e "${YELLOW}$1${NC}"
}

# Function to prompt the user for a yes/no question
# Returns 0 for yes, 1 for no
prompt_yes_no() {
  local prompt_message="$1"
  local response
  while true; do
    read -rp "$prompt_message (y/n): " response
    case "$response" in
      [Yy]|[Yy][Ee][Ss]) return 0 ;;
      [Nn]|[Nn][Oo]) return 1 ;;
      *) echo "Please answer y or n." ;;
    esac
  done
}

# Function to check if a command exists
check_command() {
  if ! command -v "$1" &> /dev/null; then
    error "$1 could not be found. Please install it and try again."
    exit 1
  fi
}

# Check for required commands
check_command "npm"
check_command "npx"

# Check if .env file exists
if [ ! -f .env ]; then
  error ".env file not found in the current directory!"
  exit 1
fi
success ".env file found."

# Check if DATABASE_URL exists in .env
if ! grep -q "^DATABASE_URL=" .env; then
  error "DATABASE_URL is not set in the .env file!"
  exit 1
fi
success "DATABASE_URL is set in .env."

# Confirm to proceed with setup
if ! prompt_yes_no "This action will affect your database and project setup. Do you want to continue?"; then
  info "Setup aborted by the user."
  exit 0
fi

# Run npm install
info "Running npm install..."
if npm install; then
  success "npm install completed successfully."
else
  error "npm install failed."
  exit 1
fi

# Run Prisma generate
info "Running npx prisma generate..."
if npx prisma generate; then
  success "Prisma generate completed successfully."
else
  error "Prisma generate failed."
  exit 1
fi

# Run Prisma DB push
info "Running npx prisma db push..."
if npx prisma db push; then
  success "Prisma DB push completed successfully."
else
  error "Prisma DB push failed."
  exit 1
fi

# Ask if the user wants to seed the database
if prompt_yes_no "Do you want to seed the Prisma database now?"; then
  # Prompt for number of categories, tags, expenses
  read -rp "Enter number of categories (default 5): " input_categories
  categories=${input_categories:-5}

  read -rp "Enter number of tags (default 5): " input_tags
  tags=${input_tags:-5}

  read -rp "Enter number of expenses (default 10): " input_expenses
  expenses=${input_expenses:-10}

  # Ask if the user wants to reset the database
  if prompt_yes_no "Do you want to reset the database before seeding?"; then
    reset=true
  else
    reset=false
  fi

  # Construct seed command with arguments
  seed_command="npx prisma db seed -- --categories=${categories} --tags=${tags} --expenses=${expenses}"
  if [ "$reset" = true ]; then
    seed_command+=" --reset"
  fi

  info "Running Prisma DB seed with command: ${seed_command}"
  if eval "$seed_command"; then
    success "Prisma DB seeding completed successfully."
  else
    error "Prisma DB seeding failed."
    exit 1
  fi
else
  info "Skipping Prisma DB seeding."
fi

success "Setup completed successfully!"
