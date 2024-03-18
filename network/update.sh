
read -p "contract name: " ctxname
read -p "version: " ctxver

START_TIME=$(date +%s)
case $ctxname in
    "mgmt")
        ./network.sh deployCC -ccn bmes-mgmt -ccl javascript -c channelmgmt -ccv $ctxver -ccs $ctxver -ccp "../chaincode-bmes-mgmt"
        ;;
    "prod")
        ./network.sh deployCC -ccn bmes-prod -ccl javascript -c channelprod -ccv $ctxver -ccs $ctxver -ccp "../chaincode-bmes-prod"
        ;;
    *)
        echo "please assign \"mgmt\" or \"prod\" "
esac

END_TIME=$(date +%s)
echo "Updating Chaincode took $(($END_TIME - $START_TIME)) seconds"

# call system bell after complete
for i in {1..5}
do
	echo $'\a' 
	sleep 1s
done
