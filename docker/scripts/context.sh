#!/bin/bash

set -e

#Check if script is running through /bin/sh (SHLVL=1) or /bin/bash (SHLVL=2)
if [ "$SHLVL" -lt "2" ] ; then
  echo "ERROR : Consider running this script using /bin/bash not /bin/sh. \"/bin/bash loadContext.sh -h\" for help"
  exit 1
fi

export red='\033[0;31m'    # Error
export yellow='\033[0;33m' # Warning
export cyan='\033[0;36m'   # Info
export green='\e[32m'      # Changes
export default='\033[0m'   # Default

PACKAGE_PATH=package
export PACKAGE_PATH

SOURCE_PATH=docker
export SOURCE_PATH

declare -a stacks

#All known stacks declared
stacks=(proxy 
  share-frontend
  share-api)

export stacks

export SCRIPT_CONTEXT_LOADED=true
