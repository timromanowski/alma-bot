#!/bin/bash
# Stop all
docker stop $(docker ps -a -q)
# Delete all containers
docker rm $(docker ps -a -q)
# Delete all images
docker rmi -f $(docker images -q)
#remove all volumes
docker volume rm $(docker volume ls -f dangling=true -q)