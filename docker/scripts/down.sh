#!/bin/bash


declare -a excludes

while getopts ":e:" option; do
   case $option in
      e) # exclude
         excludes=$OPTARG
         ;;
   esac
done


if [[ ! " ${excludes[*]} " =~ " proxy " ]]; then
  docker-compose -f proxy/docker-compose.proxy.yml down
fi

if [[ ! " ${excludes[*]} " =~ " share-frontend " ]]; then
  docker-compose -f frontend/docker-compose.yml down
fi

if [[ ! " ${excludes[*]} " =~ " share-backend " ]]; then
  docker-compose -f backend/docker-compose.yml down
fi


docker network rm share-exchange

