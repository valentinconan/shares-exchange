#!/bin/bash
set -e

declare default='\033[0m'
declare yellow='\033[0;33m'

declare -a excludes

while getopts ":e:" option; do
   case $option in
      e) # exclude
         excludes=$OPTARG
         ;;
   esac
done

if [[ ! " ${excludes[*]} " =~ " proxy " ]]; then
  echo -e "\r${yellow}==============================Proxy's containers==============================${default}"
  docker-compose -f proxy/docker-compose.proxy.yml ps -a
fi

if [[ ! " ${excludes[*]} " =~ " share-frontend " ]]; then
  echo -e "\r${yellow}==============================Frontend's containers==============================${default}"
  docker-compose -f frontend/docker-compose.yml ps -a
fi

if [[ ! " ${excludes[*]} " =~ " share-backend " ]]; then
  echo -e "\r${yellow}==============================Backend's containers==============================${default}"
  docker-compose -f backend/docker-compose.yml ps -a
fi
