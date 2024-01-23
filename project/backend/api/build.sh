#!/bin/bash

help(){
    echo "Usage : bash build.sh [OPTIONS]"
    echo ""
    echo "Build the project"
    echo ""
    echo "Options: "
    echo -e "\t-h display help"
    echo -e "\t-d generate docker image"
    echo -e "\t-n generate native build"
    echo -e "\t-s build without running test"
    echo ""
    echo "Sample : bash build.sh -d"
    exit 0
}

#Check if script is running throught /bin/sh (SHLVL=1) or /bin/bash (SHLVL=2)
if [ "$SHLVL" -lt "2" ] ; then
    echo "ERROR : Consider running this script using /bin/bash not /bin/sh. \"/bin/bash build.sh -h\" for help"
    exit 1
fi

declare docker=false
declare native=false
declare skip_tests=false

declare red='\033[0;31m'
declare yellow='\033[0;33m'
declare default='\033[0m'
declare cyan='\033[0;36m'

while getopts ":hdns" option; do
   case $option in
      h) # display Help
         help
         exit;;
      d) # docker
         echo -e "${yellow}App and Docker image will be generated"${default}""
         docker=true
         ;;
      n) # native
         echo -e "${yellow}Native Docker image will be generated locally"${default}""
         native=true
         ;;
      s) #skip test
        echo -e "${yellow}Using skip tests mode.${default}"
        skip_tests=true
        ;;
      \?) # exclude
         echo -e "${red}Error: Invalid option. Use -h for help${default}"
         exit;;
   esac
done

echo -e "${cyan}Building project...${default}"

if [[ $(node -v) != v18.16.* ]]; then
  echo -e "${red}ERROR : Node.js version 18.16.x required.${default}"
  exit 1
fi

npm i
npm run build

if [ "$skip_tests" = false ]; then
    npm test
fi

if [ "$docker" = true ]; then
    echo -e "${yellow}Building docker image...${default}"
    docker build --no-cache --build-arg VERSION=0.1.0 -t valentinconan/share-backend-api:master .
fi

if [ "$native" = true ]; then
    echo -e "${yellow}Building native docker image...${default}"
    npm run native
    docker build --no-cache --build-arg VERSION=0.1.0  -f Dockerfile.native -t valentinconan/share-backend-api-native:master .
fi

echo -e "${cyan}Build project done${default}"