/* eslint-env es6 */
/* eslint-disable no-console */
'use strict';

const { Gateway, Wallets } = require('fabric-network');
const { Machine, Transition, WorkPlan, SalesTerm, SalesOrder } = require('./../../lib/classes')
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./../lib/CAUtil.js');
const { buildCCPOrg1, buildCCPOrg2, buildWallet } = require('./../lib/AppUtil.js');
const channelMgmtName = 'channelmgmt';
const chaincodeMgmtName = 'bmes-mgmt';
const mspOrg1 = 'Org1MSP';
const mspOrg2 = 'Org2MSP';//<--�o�W�٭n���T

const ext_mgmt_id = Math.floor(Math.random() * 100000);
const walletMgmtPath = path.join(__dirname, 'wallet_' + ext_mgmt_id);
const org1UserId = 'appUserMgnt' + ext_mgmt_id;

const RED = '\x1b[31m\n';
const GREEN = '\x1b[32m\n';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

var ccp = null;
var caClient = null;
var wallet = null;
var gateway = null;
var network = null;
var contract = null;

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


async function StartMgmt() {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		ccp = buildCCPOrg1();
		// build an instance of the fabric ca services client based on the information in the network configuration
		caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
		// setup the wallet to hold the credentials of the application user
		wallet = await buildWallet(Wallets, walletMgmtPath);
		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);
		// in a real application this would be done only when a new user was required to be added and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
		gateway = new Gateway();

		let oldnum = "0";
		//while (true) {
			try {

				await gateway.connect(ccp, {
					wallet: wallet,
					identity: org1UserId,
					discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
				});
				network = await gateway.getNetwork(channelMgmtName);
				contract = network.getContract(chaincodeMgmtName);

				let result;
				//  --- Chaincode Event --- INIT ----
				let listenner = async (event) => {
					const asset = JSON.parse(event.payload.toString());
					const eventTransaction = event.getTransactionEvent();
					const eventBlock = eventTransaction.getBlockEvent();
					console.log(`${GREEN}<-- Contract Event Received: ${event.eventName} - ${JSON.stringify(asset)}${RESET}`);

					if (oldnum != eventBlock.blockNumber.toString()) {
						console.log(oldnum)
						console.log(event);
						console.log(`chaincodeId == ${event.chaincodeId}`);
						console.log(`EventName == ${event.eventName}`);
						console.log(`payload == ${event.payload}`);						
						console.log(`state == ${event.state}`);
						console.log(eventTransaction.transactionData.actions);
						console.log(`*** transaction: ${eventTransaction.transactionId} status:${eventTransaction.status}`);
						showTransactionData(eventTransaction.transactionData);
						console.log(`*** block: ${eventBlock.blockNumber.toString()}`);
						oldnum = eventBlock.blockNumber.toString();
						console.log(oldnum)
					}
				}
				await contract.addContractListener(listenner);
				//  --- Chaincode Event --- END ----
				await contract.evaluateTransaction('InitWorkStationDoc');

			} finally {
				// Disconnect from the gateway when the application is closing
				// This will close all connections to the network
				//gatewayMgmt.disconnect();
			}

		} catch (error) {
			console.error(`******** FAILED to run the application: ${error}`);
		}
	//}
}



async function GetAllWorkStation() {
	//console.log('\n-------> Submit Transaction: GetAllMachine....');
	let resultBuf = await contract.evaluateTransaction('GetAllWorkStation');
	let resultStr = resultBuf.toString();
	//console.log(`*** Result: ${resultStr}`);
	return resultStr;
}

//async function GetWorkStation(name) {
//	let result = await contract.submitTransaction('GetWorkStation', name).toString();
//	return resultStr;
//}

async function PostWorkStation(machine_jsObj) {

	let name      = machine_jsObj.Name.toString();
	let func = machine_jsObj.Function.toString();
	let parameters = machine_jsObj.Parameters.toString();
	let ednpoint  = machine_jsObj.Endpoint.toString();
	let protocol = machine_jsObj.Protocol.toString();

	await contract.submitTransaction('PostWorkStation', name, func, parameters, ednpoint, protocol);
}

async function UpdateWorkStation(machine_jsObj) {

	let name = machine_jsObj.Name.toString();
	let func = machine_jsObj.Function.toString();
	let parameters = machine_jsObj.Parameters.toString();
	let ednpoint = machine_jsObj.Endpoint.toString();
	let protocol = machine_jsObj.Protocol.toString();

	await contract.submitTransaction('UpdateWorkStation', name, func, parameters, ednpoint, protocol);
}


async function GetAllWP() {
	let result = await contract.evaluateTransaction('GetAllWorkPlan');
	let resultStr = result.toString();
	return resultStr;
}

async function GetWP(id) {
	let result = await contract.submitTransaction('GetWorkPlan', id).toString();
}

//async function PostWP(wp_json) {
//	await contract.submitTransaction('PostWorkPlan', wp_json);
//}

async function UpdateWP(wp_json) {

	await contract.submitTransaction('UpdateWorkPlan', wp_json);
}



async function GetAllSO() {
	let result = await contract.evaluateTransaction('GetAllOrder');
	let resultStr = result.toString();
	return resultStr;
}

//async function GetSO(id) {
//	let result = await contract.submitTransaction('GetSalesOrder', id).toString();
//}

//async function PostSO(so_json) {
//	await contract.submitTransaction('PostOrder', so_json);
//}

async function UpdateSO(so_json) {
	await contract.submitTransaction('UpdateSalesOrder', so_json);
}


async function GetAllObject() {
	let result = await contract.evaluateTransaction('GetAllObject');
	let resultStr = result.toString();
	return resultStr;
}


StartMgmt();
exports.GetAllWorkStation = GetAllWorkStation;
exports.PostWorkStation = PostWorkStation;
exports.UpdateWorkStation = UpdateWorkStation;

exports.GetAllWP = GetAllWP;
exports.UpdateWP = UpdateWP;


exports.GetAllSO = GetAllSO;
//exports.GetSO = GetSO;
//exports.PostSO = PostSO;
exports.UpdateSO = UpdateSO;

exports.GetAllObject = GetAllObject;


