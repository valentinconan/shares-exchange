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
  echo -e "\t-o only build specified stack"
  echo -e "\t-e exclude specified stack from build"
  echo ""
  echo "Sample"
  echo -e "\t\"bash build-project.sh\" \tproject will be build"
  echo -e "\t\"bash build-project.sh -p\" \tproject will be build with CI env var"
  exit 0
}

while getopts ":h:o:e:" option; do
   case $option in
      h) # display Help
         run_help
         exit;;
      o) # only
         echo -e "${yellow}Only build stack \""$OPTARG"\" from command : "${!#}${default}""
         #base list of all stacks
         excludes=stacks
         #exclude parameter from exclude list
         delete=($OPTARG)
         for target in "${delete[@]}"; do
           for i in "${!stacks[@]}"; do
             if [[ ${stacks[i]} = $target ]]; then
               unset 'stacks[i]'
             fi
           done
         done
         #format to flatData
         excludes=${stacks[*]}
         echo -e "${yellow}Excluding stack \""$excludes"\"${default}"
         ;;
      e) # exclude
         echo -e "${yellow}Excluding stack \""$OPTARG"\"${!#}${default}"
         excludes=$OPTARG
         ;;
      \?) # help
         echo -e "${red}Error: Invalid option. Use -h for help${default}"
         exit;;
   esac
done

export excludes
export delete

echo "Building projects..."

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
