#!/bin/bash

cd "$(dirname "$0")/../containers" || exit

echo "Stopping Qdrant container..."
docker compose -f qdrant-database.yml down 
