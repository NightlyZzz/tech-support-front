#!/bin/bash
set -e

COMPOSE="docker-compose"
DEV="-f docker-compose.dev.yml"
PROD="-f docker-compose.prod.yml"

usage() {
  echo "Usage: ./deploy.sh [dev|dev-down|prod|prod-down|rebuild]"
}

case "$1" in
  dev)
    $COMPOSE $DEV up -d --build
    ;;
  dev-down)
    $COMPOSE $DEV down
    ;;
  prod)
    $COMPOSE $PROD up -d --build
    ;;
  prod-down)
    $COMPOSE $PROD down
    ;;
  rebuild)
    $COMPOSE $PROD down -v --remove-orphans
    $COMPOSE $PROD up -d --build
    ;;
  *)
    usage
    exit 1
    ;;
esac
