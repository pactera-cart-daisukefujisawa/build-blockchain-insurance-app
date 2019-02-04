#!/bin/bash
cp ./binary_mac/* .
export FABRIC_CFG_PATH=$PWD
sh ./generate-certs.sh
sh ./docker-images.sh
sleep 5
docker-compose up --no-start
sleep 60
docker-compose up -d