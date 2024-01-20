#!/bin/bash

declare -a excludes

while getopts ":e:" option; do
   case $option in
      e) # exclude
         excludes=$OPTARG
         ;;
   esac
done

docker network create share-exchange
set -e

if [[ ! " ${excludes[*]} " =~ " proxy " ]]; then
  docker-compose -f proxy/docker-compose.proxy.yml up -d
fi

if [[ ! " ${excludes[*]} " =~ " share-frontend " ]]; then
  docker-compose -f frontend/docker-compose.yml up -d
fi

if [[ ! " ${excludes[*]} " =~ " share-backend " ]]; then
  docker-compose -f backend/docker-compose.yml up -d
fi
