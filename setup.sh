#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
  echo ".env file not found!"
  exit 1
fi

# Check if DATABASE_URL exists in .env
if ! grep -q "DATABASE_URL" .env; then
  echo "DATABASE_URL is not set in .env file!"
  exit 1
fi

# Ask the user for confirmation
read -p "This action will affect your database and project setup. Do you want to continue? (yes/no): " response
if [[ "$response" != "yes" ]]; then
  echo "Setup aborted!"
  exit 0
fi

# Run npm install
echo "Running npm install..."
npm install

# Run npx prisma generate
echo "Running npx prisma generate..."
npx prisma generate

# Run npx prisma db push
echo "Running npx prisma db push..."
npx prisma db push

echo "Setup completed successfully!"
