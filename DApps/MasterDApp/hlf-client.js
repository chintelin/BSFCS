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
const channelProdName = 'channelprod';
const chaincodeProdName = 'bmes-prod';
const mspOrg1 = 'Org1MSP';
const mspOrg2 = 'Org2MSP';//<--�o�W�٭n���T

const ext_mgmt_id = Math.floor(Math.random() * 100000);
const walletMgmtPath = path.join(__dirname, 'wallet_' + ext_mgmt_id);
const org1UserId = 'appUserMgnt' + ext_mgmt_id;
const ext_prod_id = Math.floor(Math.random() * 100000 + 100000);
const walletProdPath = path.join(__dirname, 'wallet_' + ext_prod_id);
const org2UserId = 'appUserProd' + ext_prod_id;

const RED = '\x1b[31m\n';
const GREEN = '\x1b[32m\n';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

var ccpMgmt = null;
var caClientMgmt = null;
var walletMgmt = null;
var gatewayMgmt = null;
var networkMgmt = null;
var contractMgmt = null;

var ccpProd = null;
var caClientProd = null;
var walletProd = null;
var gatewayProd = null;
var networkProd = null;
var contractProd = null;

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function StartConnectingToHlfNetwork() {
	try {
		ccpMgmt = buildCCPOrg1();
		caClientMgmt = buildCAClient(FabricCAServices, ccpMgmt, 'ca.org1.example.com');
		walletMgmt = await buildWallet(Wallets, walletMgmtPath);
		await enrollAdmin(caClientMgmt, walletMgmt, mspOrg1);
		await registerAndEnrollUser(caClientMgmt, walletMgmt, mspOrg1, org1UserId, 'org1.department1');
		gatewayMgmt = new Gateway();

		ccpProd = buildCCPOrg2();
		caClientProd = buildCAClient(FabricCAServices, ccpProd, 'ca.org2.example.com');
		walletProd = await buildWallet(Wallets, walletProdPath);
		await enrollAdmin(caClientProd, walletProd, mspOrg2);
		await registerAndEnrollUser(caClientProd, walletProd, mspOrg2, org2UserId, 'org2.department1');
		gatewayProd = new Gateway();

		let oldnum = "0";
		//while (true) {
			try {

				await gatewayMgmt.connect(ccpMgmt, {
					wallet: walletMgmt,
					identity: org1UserId,
					discovery: { enabled: true, asLocalhost: true } 
				});
				networkMgmt = await gatewayMgmt.getNetwork(channelMgmtName);
				contractMgmt = networkMgmt.getContract(chaincodeMgmtName);

				await gatewayProd.connect(ccpProd, {
					wallet: walletProd,
					identity: org2UserId,
					discovery: { enabled: true, asLocalhost: true } 
				});
				networkProd = await gatewayProd.getNetwork(channelProdName);
				contractProd = networkProd.getContract(chaincodeProdName);

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
				await contractMgmt.addContractListener(listenner);
				//  --- Chaincode Event --- END ----
				await contractMgmt.evaluateTransaction('InitWorkStationDoc');

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
	let resultBuf = await contractMgmt.evaluateTransaction('GetAllWorkStation');
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

	const result = await contractMgmt.submitTransaction('PostWorkStation', name, func, parameters, ednpoint, protocol);
	return result.toString();
}

async function UpdateWorkStation(machine_jsObj) {

	let name = machine_jsObj.Name.toString();
	let func = machine_jsObj.Function.toString();
	let parameters = machine_jsObj.Parameters.toString();
	let ednpoint = machine_jsObj.Endpoint.toString();
	let protocol = machine_jsObj.Protocol.toString();

	const result = await contractMgmt.submitTransaction('UpdateWorkStation', name, func, parameters, ednpoint, protocol);
	return result.toString();
}


async function GetAllWP() {
	let result = await contractMgmt.evaluateTransaction('GetAllWorkPlan');
	let resultStr = result.toString();
	return resultStr;
}

async function GetWP(id) {
	const result = await contractMgmt.submitTransaction('GetWorkPlan', id);
	return result.toString();
}

//async function PostWP(wp_json) {
//	await contract.submitTransaction('PostWorkPlan', wp_json);
//}

async function UpdateWP(wp_json) {
	const result = await contractMgmt.submitTransaction('UpdateWorkPlan', wp_json);
	return result.toString();
}


async function GetAllSO() {
	let result = await contractMgmt.evaluateTransaction('GetAllOrder');
	let resultStr = result.toString();
	return resultStr;
}

async function GetSO(id) {
	let result = await contractMgmt.submitTransaction('GetSalesOrder', id);
	return result.toString();
}

async function GetSOState(id) {
	let result = await contractMgmt.submitTransaction('GetSalesOrderState', id);
	return result.toString();
}

async function StartSO(id) {
	let dt = new Date(Date.now());
	let result = await contractProd.submitTransaction('StartSaleOrder', id, dt.toISOString());
	return result.toString();
}
async function PendSO(id) {
	let result = await contractProd.submitTransaction('PendSalesOrder', id);
	return result.toString();
}
async function RestartSO(id) {
	let dt = new Date(Date.now());
	let result = await contractProd.submitTransaction('RestartSalesOrder', id);
	return result.toString();
}


//async function PostSO(so_json) {
//	await contract.submitTransaction('PostOrder', so_json);
//}

async function UpdateSO(so_json) {
	const res = await contractMgmt.submitTransaction('UpdateSalesOrder', so_json);
	return res.toString();
}


async function ApplyEngineeringChangeOrderToMgmt(salesOrderId, salesTermId, newWorkPlanId) {
	let dt = new Date(Date.now());
	const res = await contractMgmt.submitTransaction('ApplyEngineeringChangeOrder', salesOrderId, salesTermId, newWorkPlanId, dt.toISOString());
	return res.toString();
}

async function ApplyEngineeringChangeOrderToProd(salesOrderId, salesTermId, newWorkPlanId) {
	let dt = new Date(Date.now());
	const res = await contractProd.submitTransaction('ApplyEngineeringChangeOrder', salesOrderId, salesTermId, newWorkPlanId, dt.toISOString());
	return res.toString();
}

async function GetAllObjectFromMgmt() {
	let result = await contractMgmt.evaluateTransaction('GetAllObject');
	let resultStr = result.toString();
	return resultStr;
}

async function GetAllObjectFromProd() {
	let result = await contractProd.evaluateTransaction('GetAllObject');
	let resultStr = result.toString();
	return resultStr;
}


StartConnectingToHlfNetwork();
exports.GetAllWorkStation = GetAllWorkStation;
exports.PostWorkStation = PostWorkStation;
exports.UpdateWorkStation = UpdateWorkStation;

exports.GetAllWP = GetAllWP;
exports.UpdateWP = UpdateWP;
exports.GetWP = GetWP;

exports.GetAllSO = GetAllSO;
exports.GetSO = GetSO;
exports.GetSOState = GetSOState;
exports.UpdateSO = UpdateSO;

exports.StartSO = StartSO;
exports.PendSO = PendSO;
exports.RestartSO = RestartSO;

exports.GetAllObjectFromProd = GetAllObjectFromProd;
exports.ApplyEngineeringChangeOrderToProd = ApplyEngineeringChangeOrderToProd;

exports.GetAllObjectFromMgmt = GetAllObjectFromMgmt;
exports.ApplyEngineeringChangeOrderToMgmt = ApplyEngineeringChangeOrderToMgmt;


