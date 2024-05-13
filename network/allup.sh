#!/bin/bash 

# clear up solution
./network.sh down
./clean_temp.sh

# create channels and deploy constracts
./network.sh up createChannel -c channelmgmt  -ca
./network.sh deployCC -ccn bmes-mgmt -ccl javascript -c channelmgmt -ccp "../chaincode-bmes-mgmt"

./network.sh up createChannel -c channelprod  -ca
./network.sh deployCC -ccn bmes-prod -ccl javascript -c channelprod -ccp "../chaincode-bmes-prod"

# call system bell after complete to inform me
for i in {1..5}
do
	echo $'\a' 
done