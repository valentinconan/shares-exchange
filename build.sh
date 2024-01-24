#!/bin/bash
# Usage :
#  - "bash build.sh"

source 'docker/scripts/context.sh'

run_help() {
  echo ""
  echo "Usage : $0 [-h] [-p]"
  echo ""
  echo "An utility script for build project"
  echo ""
  echo "Options : "
  echo -e "\t-h display this help"
  echo ""
  echo "Sample"
  echo -e "\t\"bash build-project.sh\" \t the solution will be generated"
  exit 0
}

while getopts ":h" option; do
   case $option in
      h) # display Help
         run_help
         exit;;
      \?) # help
         echo -e "${red}Error: Invalid option. Use -h for help${default}"
         exit;;
   esac
done

export excludes
export delete

echo "Building projects..."

if [[ $(node -v) != v18.16.* ]]; then
  echo -e "${red}ERROR : Node.js version 18.16.x required.${default}"
  exit 1
fi

pushd project/backend/api/ && bash build.sh -sn && popd
pushd project/backend/user/ && bash build.sh -sn && popd

echo "Create temporary folder $PACKAGE_PATH"
# clean package
mkdir -p "$PACKAGE_PATH"

#Make * pattern include hidden files (e.g. .env files)
shopt -s dotglob
cp "$SOURCE_PATH"/*.sh "$PACKAGE_PATH/"

rm -rf "$PACKAGE_PATH/scripts"
mkdir "$PACKAGE_PATH/scripts"
cp -r "$SOURCE_PATH/scripts"/* "$PACKAGE_PATH/scripts"

if [[ ! " ${excludes[*]} " =~ " proxy " ]]; then
  echo -e "${cyan}\nproxy:${default}"
  echo -e "\tBuild proxy project"

  echo -e "\tCopy proxy files"
  rm -rf "$PACKAGE_PATH/proxy"
  mkdir -p "$PACKAGE_PATH/proxy"
  cp -r "$SOURCE_PATH/proxy/"* "$PACKAGE_PATH/proxy/"
fi

if [[ ! " ${excludes[*]} " =~ " share-frontend " ]]; then
  echo -e "${cyan}\nshare-frontend:${default}"
  echo -e "\tCopy share-frontend files"
  rm -rf "$PACKAGE_PATH/frontend"
  mkdir -p "$PACKAGE_PATH/frontend"
  cp -r "$SOURCE_PATH/frontend/"* "$PACKAGE_PATH/frontend/"
fi


if [[ ! " ${excludes[*]} " =~ " share-backend " ]]; then
  echo -e "${cyan}\nshare-backend:${default}"
  echo -e "\tCopy share-backend files"
  rm -rf "$PACKAGE_PATH/backend"
  mkdir -p "$PACKAGE_PATH/backend"
  cp -r "$SOURCE_PATH/backend/"* "$PACKAGE_PATH/backend/"
fi

echo "Build project done"
