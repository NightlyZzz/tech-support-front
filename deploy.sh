#!/usr/bin/env bash
set -e

COMPOSE="docker compose"
DEV_FILE="-f docker-compose.dev.yml"
PROD_FILE="-f docker-compose.prod.yml"

usage() {
  echo "Usage: ./deploy.sh [dev|dev-down|prod|prod-down|rebuild]"
}

case "$1" in
  dev)
    $COMPOSE $DEV_FILE up -d --build
    ;;
  dev-down)
    $COMPOSE $DEV_FILE down -v --remove-orphans
    ;;
  prod)
    $COMPOSE $PROD_FILE up -d --build
    ;;
  prod-down)
    $COMPOSE $PROD_FILE down -v --remove-orphans
    ;;
  rebuild)
    $COMPOSE $PROD_FILE down -v --remove-orphans
    $COMPOSE $PROD_FILE up -d --build
    ;;
  *)
    usage
    exit 1
    ;;
esac