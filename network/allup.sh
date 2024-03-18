#!/bin/bash 
./network.sh down
./network.sh up createChannel -c channelmgmt  -ca
./network.sh deployCC -ccn bmes-mgmt -ccl javascript -c channelmgmt -ccp "../chaincode-bmes-mgmt"

./network.sh up createChannel -c channelprod  -ca
./network.sh deployCC -ccn bmes-prod -ccl javascript -c channelprod -ccp "../chaincode-bmes-prod"

# call system bell after complete
for i in {1..10}
do
	echo $'\a' 
done