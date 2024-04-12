
'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../lib/CAUtil.js');
const { buildCCPOrg1, buildCCPOrg2, buildWallet } = require('../lib/AppUtil.js');
const { listenerCount } = require('process');
const { Console } = require('console');
const channelMgmtName = 'channelmgmt';
const channelProdName = 'channelprod';
const chaincodeMgmtName = 'bmes-mgmt';
const chaincodeProdName = 'bmes-prod';
const mspOrg1 = 'Org1MSP';
const mspOrg2 = 'Org2MSP';

const ext_mgmt_id = Math.floor(Math.random() * 100000);
const ext_prod_id = Math.floor(Math.random() * 100000 + 100000);
const walletMgmtPath = path.join(__dirname,'wallet_' + ext_mgmt_id );
const walletProdPath = path.join(__dirname,'wallet_' + ext_prod_id );
const org1UserId = 'appUserMgnt' + ext_mgmt_id;
const org2UserId = 'appUserProd' + ext_prod_id;

const RED = '\x1b[31m\n';
const GREEN = '\x1b[32m\n';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

const EnableMgmtDocInit = false;


function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


async function InitializeProdContract()
{
    // build an in memory object with the network configuration (also known as a connection profile)
		const ccpMgmt = buildCCPOrg1();
		// build an instance of the fabric ca services client based on the information in the network configuration
		const caClientMgmt = buildCAClient(FabricCAServices, ccpMgmt, 'ca.org1.example.com');
		// setup the wallet to hold the credentials of the application user
		const walletMgmt = await buildWallet(Wallets, walletMgmtPath);
		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClientMgmt, walletMgmt, mspOrg1);
		// in a real application this would be done only when a new user was required to be added and would be part of an administrative flow
		await registerAndEnrollUser(caClientMgmt, walletMgmt, mspOrg1, org1UserId, 'org1.department1');
		const gatewayMgmt = new Gateway();

		const ccpProd = buildCCPOrg2();
		const caClientProd = buildCAClient(FabricCAServices, ccpProd, 'ca.org2.example.com');	
		const walletProd = await buildWallet(Wallets, walletProdPath);
		await enrollAdmin(caClientProd, walletProd, mspOrg2);
		await registerAndEnrollUser(caClientProd, walletProd, mspOrg2, org2UserId, 'org2.department1');
		const gatewayProd = new Gateway();

        let interfaces =null;

		console.info(`try connect to BMES network`);
		try {
			
			await gatewayMgmt.connect(ccpMgmt, {
				wallet: walletMgmt,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			console.info(`try to get network`);
			const networkMgmt = await gatewayMgmt.getNetwork(channelMgmtName);
			console.info(`try to get contract`);
			const contractMgmt = networkMgmt.getContract(chaincodeMgmtName);
			console.info(`mgmt contract is obtained`);
			

			await gatewayProd.connect(ccpProd, {
				wallet: walletProd,
				identity: org2UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});		
			const networkProd = await gatewayProd.getNetwork(channelProdName);
			const contractProd = networkProd.getContract(chaincodeProdName);

            interfaces = {status: "OK", mgmt: contractMgmt, prod: contractProd };
        }
        catch(err){
            console.info(err);
        }
    
    return interfaces;
}

exports.InitializeProdContract = InitializeProdContract;
