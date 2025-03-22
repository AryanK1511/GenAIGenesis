#!/bin/bash

cd "$(dirname "$0")/../containers" || exit

echo "Starting Qdrant container..."
docker compose -f qdrant-database.yml up 
