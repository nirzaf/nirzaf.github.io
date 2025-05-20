#!/bin/bash

# Script to synchronize package.json and package-lock.json

echo "Synchronizing package.json and package-lock.json..."

# Remove node_modules and package-lock.json
echo "Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

# First generate a clean package-lock.json without installing modules
echo "Generating a clean package-lock.json..."
npm install --package-lock-only --ignore-scripts

# Then install dependencies properly
echo "Installing dependencies..."
npm ci || npm install

echo "Done! package-lock.json has been regenerated and is now in sync with package.json."
echo "Please commit the updated package-lock.json file."
