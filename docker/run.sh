#!/bin/bash

#Check if script is running throught /bin/sh (SHLVL=1) or /bin/bash (SHLVL=2)
if [ "$SHLVL" -lt "2" ] ; then
    echo "ERROR : Consider running this script using /bin/bash not /bin/sh. \"/bin/bash run.sh -h\" for help"
    exit 1
fi

declare -a stacks

#All known stacks declared
stacks=(proxy
  share-frontend
  share-backend)

run_help () {
   echo ""
   echo "Usage : bash run.sh [OPTION] COMMAND"
   echo ""
   echo "A stack management's utility script"
   echo ""
   echo "Commands : "
   echo -e "\tup\t up all docker stack"
   echo -e "\tdown\t down all docker stack"
   echo -e "\tps\t display all docker stack's container"
   echo ""
   echo "Options : "
   echo -e "\t-e exclude list of stack"
   echo -e "\t-o only specified stack"
   echo ""
   echo -e "Stacks: ${stacks[*]}"
   echo ""
   echo "Sample"
   echo -e "\t\"bash run.sh\" no parameter, help will be display"
   echo -e "\t\"bash run.sh up\" all docker stack will up"
   echo -e "\t\"bash run.sh -e \"share-frontend\" up\" all docker stack will up excepted frontend"
   echo -e "\t\"bash run.sh -o \"share-backend\" up\" only share-backend's docker's containers will up"
   exit 0
}

declare red='\033[0;31m'
declare yellow='\033[0;33m'
declare default='\033[0m'
declare cyan='\033[0;36m'
declare -a excludes

while getopts ":h:o:e:" option; do
   case $option in
      h) # display Help
         run_help
         exit;;
      o) # only
         echo -e "${yellow}Only run stack \""$OPTARG"\" from command : "${!#}${default}""
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
         echo -e "${yellow}Excluding stack \""$excludes"\" from command : "${!#}${default}""
         ;;
      e) # exclude
         echo -e "${yellow}Excluding stack \""$OPTARG"\" from command : "${!#}${default}""
         excludes=$OPTARG
         ;;
      \?) # exclude
         echo -e "${red}Error: Invalid option. Use -h for help${default}"
         exit;;
   esac
done

#get last parameter
declare command=${!#}

case $command in
	up)
	  echo -e "${cyan}Upping applications...${default}"
		./scripts/up.sh -e "$excludes"
		;;
	down)
	  echo -e "${cyan}Removing applications...${default}"
		./scripts/down.sh -e "$excludes"
		;;
	ps)
		./scripts/ps.sh -e "$excludes"
		;;
	*)
		run_help
		;;
esac


