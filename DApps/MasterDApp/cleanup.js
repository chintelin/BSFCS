'use strict';
var path = require('path');
const fs = require('fs');
const workDirPath = __dirname;
deleteWalletFolders(workDirPath);
function deleteWalletFolders(dirPath) {
	if (fs.existsSync(dirPath)) {
		fs.readdirSync(dirPath).forEach((file) => {
			const curPath = path.join(dirPath, file);
			if (fs.lstatSync(curPath).isDirectory() && file.startsWith('wallet')) { // �p�G�O��Ƨ��B�W�ٲŦX "wallet" �}�Y
				deleteFolder(curPath);
			}
		});
	}
}
// �R����Ƨ������
function deleteFolder(folderPath) {
	if (fs.existsSync(folderPath)) {
		fs.readdirSync(folderPath).forEach((file, index) => {
			const curPath = path.join(folderPath, file);
			if (fs.lstatSync(curPath).isDirectory()) { // �p�G�O��Ƨ��A���j�R��
				deleteFolder(curPath);
			} 
		});
		fs.rmdirSync(folderPath);
	}
}

deleteFolder(workDirPath);

//exports.deleteWalletFolders = deleteWalletFolders;
