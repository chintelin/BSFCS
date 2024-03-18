./network.sh down

echo "===== 網路清除完成 ====="

echo "===== 啟用新的網路 ====="
./network.sh up createChannel -c channeltstest -ca

echo "===== 部署typescript chaincode ====="
./network.sh deployCC -ccn tstest -ccl typescript -c channeltstest -ccp "../chaincode-typescript"

