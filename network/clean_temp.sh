#!/bin/bash

# 定義要清除的資料夾路徑
DAPPS_DIR="../DApps"

# 使用find命令找到所有名稱開頭為wallet的資料夾
# 並使用-exec參數來執行rm -rf命令來刪除這些資料夾
find "$DAPPS_DIR" -type d -name "wallet_*" -exec rm -rf {} +
echo "所有名稱開頭為wallet的資料夾已被清除。"

rm update_mgmt_ver.log
rm update_prod_ver.log

echo "所有update log 已被清除。"