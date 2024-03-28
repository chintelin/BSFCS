# 檢查是否需要重置版本記錄
if [ "$1" == "reset" ]; then
    # 刪除所有的版本記錄文件
    rm -f update_mgmt_ver.log update_prod_ver.log
    echo "Version records reset."
    exit 0
fi

# 讀取用戶輸入的合約名稱
read -p "contract name: " ctxname

# 定義版本記錄文件的路徑
MGMT_VERSION_RECORD_FILE="update_mgmt_ver.log"
PROD_VERSION_RECORD_FILE="update_prod_ver.log"

# 根據合約名稱獲取或設置版本號
case $ctxname in
    "mgmt")
        # 從文件中讀取mgmt合約的版本號，如果文件不存在或讀取失敗，則設置為2
        ctxver=$(grep -w "mgmt" $MGMT_VERSION_RECORD_FILE | awk '{print $2}')
        if [ -z "$ctxver" ]; then
            ctxver=2
        else
            ctxver=$((ctxver + 1))
        fi
        # 更新mgmt合約的版本號到文件中
        echo "mgmt $ctxver" > $MGMT_VERSION_RECORD_FILE
        ;;
    "prod")
        # 從文件中讀取prod合約的版本號，如果文件不存在或讀取失敗，則設置為2
        ctxver=$(grep -w "prod" $PROD_VERSION_RECORD_FILE | awk '{print $2}')
        if [ -z "$ctxver" ]; then
            ctxver=2
        else
            ctxver=$((ctxver + 1))
        fi
        # 更新prod合約的版本號到文件中
        echo "prod $ctxver" > $PROD_VERSION_RECORD_FILE
        ;;
    *)
        echo "please assign \"mgmt\" or \"prod\" "
        exit 1
esac

START_TIME=$(date +%s)
case $ctxname in
    "mgmt")
        echo "mgmt ver = $ctxver"
        #./network.sh deployCC -ccn bmes-mgmt -ccl javascript -c channelmgmt -ccv $ctxver -ccs $ctxver -ccp "../chaincode-bmes-mgmt"
        ;;
    "prod")
        echo "prod ver = $ctxver"
        #./network.sh deployCC -ccn bmes-prod -ccl javascript -c channelprod -ccv $ctxver -ccs $ctxver -ccp "../chaincode-bmes-prod"
        ;;
esac

END_TIME=$(date +%s)
echo "Updating Chaincode took $(($END_TIME - $START_TIME)) seconds"

# call system bell after complete
for i in {1..5}
do
    echo $'\a' 
    sleep 1s
done

# This script is developped with the Phind's assistance.