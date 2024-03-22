'use strict';

const opcua = require("node-opcua");
const async = require("async");
const AppCon = require('./SlaveAppUtil');
const BMES = require('./BMESUtil');
const IsConnectToBMES = true;


var iOpMode = null;
var BG22 = null;
var carrierId = null;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


async function main(){
    let endpointUrl = "opc.tcp://172.21.1.1:4840";
    let conveyorType = "1"; 
    let machineName = "Magazine";
    let contractProd = null;
    let contractMgmt = null;
    let func =0;
    let par = 0;
    let result= 0;
	//var ASRA = ["ASRA","opc.tcp://172.21.3.1:4840","2"]
	//var Magazine = ["Magazine","opc.tcp://172.21.1.1:4840","1"]
	//var Press = ["Press","opc.tcp://172.21.2.1:4840",""]

  if(IsConnectToBMES) {
    let res = await BMES.InitializeProdContract();
    if(res.status != "OK")  {
      console.info(`obj_so type: ${typeof(res)} and value: ${JSON.stringify(res, null, 4)}`);
      return;
    }
    contractProd = res.prod;
    contractMgmt = res.mgmt;
    console.info(`contract interfaces are OK`);
/*
    console.log('\n--> Submit Transaction: InitMachineDoc, function creates the initial set of assets on the ledger');
    await contractMgmt.submitTransaction('InitMachineDoc');
    //console.log('\n-------> Submit Transaction: GetAllMachine....');
    //result = await contractMgmt.evaluateTransaction('GetAllMachine');
    //console.log(`*** Result: ${prettyJSONString(result.toString())}`);;

    console.log('\n--> Submit Transaction: InitWorkPlanDoc, function creates the initial set of assets on the ledger');
    await contractMgmt.submitTransaction('InitWorkPlanDoc');
    // 	//console.log('\n--> Submit Transaction: GetWorkPlan....');		 
    // 	result = await contractMgmt.submitTransaction('GetWorkPlan', '1000');
    // 	//console.log(`*** Result: ${prettyJSONString(result.toString())}`);;
    console.log('\n--> Submit Transaction: InitSalesOrderDoc, function creates the initial set of assets on the ledger');
    await contractMgmt.submitTransaction('InitSalesOrderDoc');

    console.log('\n--> Submit Transaction: InitCarrier....');		
    result = await contractProd.submitTransaction('InitCarrier');	
    console.log('\n--> Submit Transaction: StartSaleOrder....');		
    result = await contractProd.submitTransaction('StartSaleOrder','1000');

*/
    console.log('BMES is initialized');
  }

    if(process.argv[2]){
        machineName = process.argv[2];
    }
    if(process.argv[3]){
      conveyorType = process.argv[3];
    } 
	  if(process.argv[4]){
		endpointUrl = process.argv[4];
    } 

    await AppCon.ConnectToOpcuaServer(endpointUrl);
    //await AppCon.InitializeSetting();

    if(conveyorType == "1"){
      await AppCon.ConfigureSingleConveyor();
    }
    else if(conveyorType == "2"){
      await AppCon.ConfigureDualConveyor();
    }

    await AppCon.ClearTransition(1);

    console.log('Initialized '+machineName);    
      
      

      while(true){

      var carrierId = await AppCon.CarrierCheckIn();
      console.log('Get carrier id='+carrierId);
      let IsOnDuty = "No";
      //report to BMES  
      let obj_checkInResult =null;
      if(IsConnectToBMES) {
        console.log('\n--> Submit Transaction: Checkin to '+machineName);		
        let checkInResult = await contractProd.submitTransaction('CheckIn',carrierId.toString(),machineName);
        obj_checkInResult = JSON.parse(checkInResult);
        console.log(`*** Invoke Result: ${prettyJSONString(checkInResult.toString())}`);;  
        IsOnDuty = obj_checkInResult.IsOnDuty ;
      }

    if(IsOnDuty == "Yes" || !IsConnectToBMES) 
    {
      //check in 成功寫小車 stats = 52, set transition table
      if(IsConnectToBMES) {
        func = obj_checkInResult.Function;
        par = obj_checkInResult.Parameter;
        console.log(`BMES report recipt ${func} ${par}`);	
      }
      else{
        func =0;
        par = 0;
      }
      await sleep(1000);
      await AppCon.AddTransition(1,52,func,par,0);
      console.log('AddTransition to ='+machineName);
    }
    
    //Switch to Reset 
    await AppCon.WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."Reset"."xBit"',true,"Boolean");
    await sleep(100);
    await AppCon.WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."Reset"."xBit"',false,"Boolean");
    iOpMode = null;
    console.info('Wait for iOpMode turn to 20');
    while(iOpMode != 20){
        await AppCon.ReadValue('ns=3;s="dbVar"."OpMode"."iOpMode"').then( res => {
            iOpMode = res.value.value;
            if (iOpMode == 20){
            	console.log(iOpMode)
            }
        });
    }
    await sleep(500);
    
    
    //Switch to Auto Mode
    //await AppCon.WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."Start"."xBit"',true,"Boolean");
    await AppCon.WriteValue('ns=3;s="dbVar"."OpMode"."Auto"."xAct"',true,"Boolean");
    await sleep(100);
     
    if(IsOnDuty == "Yes" || !IsConnectToBMES) 
    {

    console.log('Start transition at '+machineName);

    if(IsConnectToBMES) {
      console.log('\n--> Submit Transaction: ReportTransitionStart @Magazine....');		
       result = await contractProd.submitTransaction('ReportTransitionStart',carrierId.toString(),machineName);
    }

    await sleep(5000);

    var xBusy = true;
    console.info('Wait for xBusy turn to false....');
    while(xBusy != false){
      await AppCon.ReadValue('ns=3;s="dbAppIF"."Out"."xBusy"').then( res => {
        xBusy = res.value.value;
        if(xBusy == false){
             console.log(xBusy)
        }
      });
    }
    console.log('End transition at '+machineName);

      if(IsConnectToBMES) {
        console.log(`ASRS is complete the transition using function:${func} and parameter:${par} `);
        console.log('\n--> Submit Transaction: ReportTransitionEnd @Magazine....');		
        result = await contractProd.submitTransaction('ReportTransitionEnd',carrierId.toString(),machineName);
        
        console.log(`ASRS is executing "check out" process `);
        console.log('\n--> Submit Transaction: ChectOut @Magazine....');		
        result = await contractProd.submitTransaction('ChectOut',carrierId.toString(),machineName);
        console.log(`*** Invoke Result: ${prettyJSONString(result.toString())}`);;
      }
      
    }//end if(IsOnDuty == "Yes" || !IsConnectToBMES) 

    await AppCon.ClearTransition(1);
    await AppCon.ClearTransition(2);
    console.log('Clear transition data at '+machineName);
    await sleep(2000);
    await AppCon.InitializeSetting();

    if(conveyorType == "1"){
      await AppCon.ConfigureSingleConveyor();
    }
    else if(conveyorType == "2"){
      await AppCon.ConfigureDualConveyor();
    }

    console.log('restore status of '+machineName);

    
  }

}

main();
