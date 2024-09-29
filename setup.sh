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

# Function to check if node_modules is installed
check_node_modules() {
  if [ -d "node_modules" ]; then
    info "node_modules directory found."
    # Check if @prisma/client is installed
    if [ ! -d "node_modules/@prisma/client" ]; then
      info "@prisma/client is missing in node_modules."
      if prompt_yes_no "Do you want to run 'npm install' to install missing dependencies?"; then
        run_npm_install
      else
        error "Required dependencies are missing. Please run 'npm install' manually."
        exit 1
      fi
    else
      success "All required dependencies are installed."
    fi
  else
    info "node_modules directory not found."
    if prompt_yes_no "Do you want to run 'npm install' to install dependencies?"; then
      run_npm_install
    else
      error "Dependencies are not installed. Exiting."
      exit 1
    fi
  fi
}

# Function to run npm install
run_npm_install() {
  info "Running npm install..."
  if npm install; then
    success "npm install completed successfully."
  else
    error "npm install failed."
    exit 1
  fi
}

# Function to synchronize Prisma schema with the database
sync_prisma_schema() {
  info "Synchronizing Prisma schema with the database using 'npx prisma db push'..."
  if npx prisma db push; then
    success "Prisma schema synchronized successfully."
  else
    error "Prisma schema synchronization failed."
    exit 1
  fi
}

# Function to check if an environment variable exists in .env or environment
# Arguments:
#   $1 - Variable name
#   $2 - Prompt message if variable is missing
#   $3 - (Optional) Default value
check_env_variable() {
  local var_name="$1"
  local prompt_message="$2"
  local default_value="$3"
  
  # Check if the variable is set in the environment
  if [ -z "${!var_name}" ]; then
    # Check if the variable is set in the .env file
    if grep -q "^${var_name}=" .env; then
      # Export the variable from .env to the environment
      export "${var_name}=$(grep "^${var_name}=" .env | cut -d '=' -f2-)"
      success "${var_name} is set in .env."
    else
      # Prompt the user to enter the variable
      if [ -n "$default_value" ]; then
        read_var_with_default "$var_name" "$prompt_message" "$default_value"
      else
        read_var_no_default "$var_name" "$prompt_message"
      fi
    fi
  else
    success "${var_name} is already set in the environment."
  fi
}

# Function to read a variable with a default value and ensure it's not empty
read_var_with_default() {
  local var_name="$1"
  local prompt_message="$2"
  local default_value="$3"
  local user_input=""
  
  while true; do
    read -rp "$prompt_message (Press enter to use default: '${default_value}'): " user_input
    user_input=${user_input:-$default_value}
    # Trim leading/trailing whitespace
    user_input="$(echo -e "${user_input}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
    
    if [ -n "$user_input" ]; then
      break
    else
      echo "Input cannot be empty. Please enter a valid value."
    fi
  done
  
  # Ensure there is a newline before appending to .env
  if [ -s .env ]; then
    last_char=$(tail -c 1 .env)
    if [ "$last_char" != $'\n' ]; then
      echo "" >> .env
    fi
  fi
  
  # Append the variable to .env with double quotes
  echo "${var_name}=\"${user_input}\"" >> .env
  export "${var_name}=${user_input}"
  success "${var_name} has been set and added to .env."
}

# Function to read a variable without a default value and ensure it's not empty
read_var_no_default() {
  local var_name="$1"
  local prompt_message="$2"
  local user_input=""
  
  while true; do
    read -rp "$prompt_message: " user_input
    # Trim leading/trailing whitespace
    user_input="$(echo -e "${user_input}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
    
    if [ -n "$user_input" ]; then
      break
    else
      echo "Input cannot be empty. Please enter a valid value."
    fi
  done
  
  # Ensure there is a newline before appending to .env
  if [ -s .env ]; then
    last_char=$(tail -c 1 .env)
    if [ "$last_char" != $'\n' ]; then
      echo "" >> .env
    fi
  fi
  
  # Append the variable to .env with double quotes
  echo "${var_name}=\"${user_input}\"" >> .env
  export "${var_name}=${user_input}"
  success "${var_name} has been set and added to .env."
}

# Function to verify .env file integrity
verify_env_file() {
  if [ ! -f .env ]; then
    error ".env file not found in the current directory!"
    exit 1
  fi
  success ".env file found."
}

# Function to verify required environment variables
verify_required_env_variables() {
  # Check if DATABASE_URL exists in .env or environment
  if ! grep -q "^DATABASE_URL=" .env && [ -z "${DATABASE_URL}" ]; then
    error "DATABASE_URL is not set in the environment or .env file!"
    exit 1
  fi
  success "DATABASE_URL is set."
  
  # Check for SEEDING_USERNAME and SEEDING_PASSWORD in .env or environment
  check_env_variable "SEEDING_USERNAME" "Enter SEEDING_USERNAME"
  check_env_variable "SEEDING_PASSWORD" "Enter SEEDING_PASSWORD" "test12345"
}

# Check for required commands
check_command "npm"
check_command "npx"

# Verify .env file
verify_env_file

# Verify required environment variables
verify_required_env_variables

# Confirm to proceed with setup
if ! prompt_yes_no "This action will affect your database and project setup. Do you want to continue?"; then
  info "Setup aborted by the user."
  exit 0
fi

# Check if node_modules is installed
check_node_modules

# Synchronize Prisma schema with the database
sync_prisma_schema

# Run Prisma generate
info "Running 'npx prisma generate'..."
if npx prisma generate; then
  success "Prisma generate completed successfully."
else
  error "Prisma generate failed."
  exit 1
fi

# Ask if the user wants to seed the database
if prompt_yes_no "Do you want to seed the Prisma database now?"; then
  # Prompt for number of category groups, categories, tags, and expenses
  read -rp "Enter number of category groups to create (default 3): " input_category_groups
  category_groups=${input_category_groups:-3}

  read -rp "Enter number of categories to create (default 5): " input_categories
  categories=${input_categories:-5}
  info "Note: Categories will be randomly assigned to the created category groups."

  read -rp "Enter number of tags to create (default 5): " input_tags
  tags=${input_tags:-5}

  read -rp "Enter number of expenses to create (default 10): " input_expenses
  expenses=${input_expenses:-10}

  # Ask if the user wants to reset the database
  if prompt_yes_no "Do you want to reset the database before seeding? This will delete all existing data!"; then
    reset=true
  else
    reset=false
  fi

  # Construct seed command with arguments
  seed_command="npx prisma db seed -- --categoryGroups=${category_groups} --categories=${categories} --tags=${tags} --expenses=${expenses}"
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
