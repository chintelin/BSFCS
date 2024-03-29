'use strict';
var path = require('path');
const fs = require('fs');
const workDirPath = __dirname;
deleteWalletFolders(workDirPath);
function deleteWalletFolders(dirPath) {
	if (fs.existsSync(dirPath)) {
		fs.readdirSync(dirPath).forEach((file) => {
			const curPath = path.join(dirPath, file);
			if (fs.lstatSync(curPath).isDirectory() && file.startsWith('wallet')) { // 如果是資料夾且名稱符合 "wallet" 開頭
				deleteFolder(curPath);
			}
		});
	}
}
// 刪除資料夾的函數
function deleteFolder(folderPath) {
	if (fs.existsSync(folderPath)) {
		fs.readdirSync(folderPath).forEach((file, index) => {
			const curPath = path.join(folderPath, file);
			if (fs.lstatSync(curPath).isDirectory()) { // 如果是資料夾，遞迴刪除
				deleteFolder(curPath);
			} 
		});
		fs.rmdirSync(folderPath);
	}
}

deleteFolder(workDirPath);

//exports.deleteWalletFolders = deleteWalletFolders;
