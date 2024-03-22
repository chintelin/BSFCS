/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./../lib/CAUtil.js');
const { buildCCPOrg1, buildCCPOrg2, buildWallet } = require('./../lib/AppUtil.js');
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

const RED = '\x1b[35m\n';
const GREEN = '\x1b[32m\n';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

const EnableMgmtDocInit = false;


function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}
function showTransactionData(transactionData) {
	const creator = transactionData.actions[0].header.creator;
	console.log(`    - submitted by: ${creator.mspid}-${creator.id_bytes.toString('hex')}`);
	for (const endorsement of transactionData.actions[0].payload.action.endorsements) {
		console.log(`    - endorsed by: ${endorsement.endorser.mspid}-${endorsement.endorser.id_bytes.toString('hex')}`);
	}
	const chaincode = transactionData.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec;
	console.log(`    - chaincode:${chaincode.chaincode_id.name}`);
	console.log(`    - function:${chaincode.input.args[0].toString()}`);
	for (let x = 1; x < chaincode.input.args.length; x++) {
		console.log(`    - arg:${chaincode.input.args[x].toString()}`);
	}
}

async function main() {
	try {
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

		try {
			
			await gatewayMgmt.connect(ccpMgmt, {
				wallet: walletMgmt,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			const networkMgmt = await gatewayMgmt.getNetwork(channelMgmtName);
			const contractMgmt = networkMgmt.getContract(chaincodeMgmtName);
			
			

			await gatewayProd.connect(ccpProd, {
				wallet: walletProd,
				identity: org2UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});		
			const networkProd = await gatewayProd.getNetwork(channelProdName);
			const contractProd = networkProd.getContract(chaincodeProdName);

			let result;


			//  --- Chaincode Event --- INIT ----
			let listenner = async (event) => {
							// The payload of the chaincode event is the value place there by the
					// chaincode. Notice it is a byte data and the application will have
					// to know how to deserialize.
					// In this case we know that the chaincode will always place the asset
					// being worked with as the payload for all events produced.
					const asset = JSON.parse(event.payload.toString());
					console.log(`${RED}<-- Contract Event Received: ${event.eventName} - ${JSON.stringify(asset)}${RESET}`);
					// show the information available with the event
					console.log(`*** Event: ${event.eventName}:${asset.ID}`);
					// notice how we have access to the transaction information that produced this chaincode event
					const eventTransaction = event.getTransactionEvent();
					console.log(`*** transaction: ${eventTransaction.transactionId} status:${eventTransaction.status}`);
					showTransactionData(eventTransaction.transactionData);
					// notice how we have access to the full block that contains this transaction
					const eventBlock = eventTransaction.getBlockEvent();
					console.log(`*** block: ${eventBlock.blockNumber.toString()}`);		
			}

			await contractProd.addContractListener(listenner);
			//  --- Chaincode Event --- END ----
			
			// if(EnableMgmtDocInit)//set true to test machine doc
			// {
			console.log('\n--> Submit Transaction: InitMachineDoc, function creates the initial set of assets on the ledger');
			await contractMgmt.submitTransaction('InitWorkStationDoc');
			console.log('\n-------> Submit Transaction: GetAllMachine....');

			//result = await contractMgmt.evaluateTransaction('GetAllMachine');
			//console.log(`*** Result: ${prettyJSONString(result.toString())}`);;

			console.log('\n--> Submit Transaction: InitWorkPlanDoc, function creates the initial set of assets on the ledger');
			await contractMgmt.submitTransaction('InitWorkPlanDoc');

			console.log('\n--> Submit Transaction: GetWorkPlan....');		 
			result = await contractMgmt.submitTransaction('GetWorkPlan', '1000');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);;

			console.log('\n--> Submit Transaction: InitSalesOrderDoc, function creates the initial set of assets on the ledger');
			await contractMgmt.submitTransaction('InitSalesOrderDoc');

			console.log('\n--> Submit Transaction: GetSalesOrder....');		 
			result = await contractMgmt.submitTransaction('GetSalesOrder', '1000');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);;
	
			console.log('\n--> Submit Transaction: InitCarrier....');		
			result = await contractProd.submitTransaction('InitCarrier');	
			
			console.log('\n--> Submit Transaction: StartSaleOrder with id=1000....');	
			let dt = new Date(Date.now());
			await contractProd.submitTransaction('StartSaleOrder','1000', dt.toISOString());
			//console.log(`*** Invoke Result: ${prettyJSONString(result.toString())}`);;

			console.log('\n--> Submit Transaction: GetAllObject....');		 
			result = await contractProd.submitTransaction('GetAllObject');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);;
			
			console.log('\n--> Submit Transaction: Checkin @ASRS....');	
			dt = new Date(Date.now());		
			let checkInResult = await contractProd.submitTransaction('CheckIn','1',"ASRS", dt.toISOString());
			let obj_checkInResult_ASRS = JSON.parse(checkInResult);
			console.log(`*** Invoke Result: ${prettyJSONString(checkInResult.toString())}`);;

			
			if(obj_checkInResult_ASRS.IsOnDuty == "Yes")
			{
				let func = obj_checkInResult_ASRS.Function;
				let par = obj_checkInResult_ASRS.Parameter;
				dt = new Date(Date.now());	
				console.log(`${GREEN} ASRS is starting the transition using function:${func} and parameter:${par} at ${dt.toISOString()} `);
				console.log('\n--> Submit Transaction: ReportTransitionStart @ASRS....');		
				
				result = await contractProd.submitTransaction('ReportTransitionStart','1',"ASRS", dt.toISOString());

				let runTransition = async (function_name,parameterlist) => {
					new Promise((resolve) => setTimeout(resolve, 3000));//replace this segment with machine control function
				}

				let result_after_transition = await runTransition();
				dt = new Date(Date.now());	
				console.log(`${GREEN} ASRS is complete the transition using function:${func} and parameter:${par} at ${dt.toISOString()}`);
				console.log('\n--> Submit Transaction: ReportTransitionEnd @ASRS....');		
				result = await contractProd.submitTransaction('ReportTransitionEnd','1',"ASRS", dt.toISOString());

				console.log(`${GREEN} ASRS is executing "check out" process `);
				console.log('\n--> Submit Transaction: ChectOut @ASRS....');		
				result = await contractProd.submitTransaction('ChectOut','1',"ASRS");
				console.log(`*** Invoke Result: ${prettyJSONString(result.toString())}`);;
			}
			

			console.log('\n--> Submit PROD Transaction: GetAllObject....');		 
			result = await contractProd.submitTransaction('GetAllObject');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);;

			console.log('\n--> Submit MGMT Transaction: GetAllObject....');		 
			result = await contractMgmt.submitTransaction('GetAllObject');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);;

		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gatewayMgmt.disconnect();
		}

	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

main();



