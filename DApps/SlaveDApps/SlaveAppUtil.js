'use strict';

const async = require("async");
const opcua = require("node-opcua");
const client = opcua.OPCUAClient.create({endpointMustExist: false});

var the_session = null;
var data = null;
var iOpMode = null;
var BG22 = null;
var carrierId = null;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

async function ConnectToOpcuaServer(endpointUrl) {
    console.log("Start Coneect")
    return new Promise(function(resolve, reject) {
        async.series([
            function(callback) {
                client.connect(endpointUrl, function(err) {
                    if (err) {
                        console.log("cannot connect to endpoint:", endpointUrl);
                    } else {
                        console.log("connected!");
                    }
                    callback(err);
                });
            }, function(callback) {
                client.createSession(function(err, session) {
                    if (err) {
                        console.log("cannot ctreate session");
                        return callback(err);
                    } else {
                        console.log("session created!");
                    }
                    the_session = session;
                    callback();
                });
            }
        ], function(err) {
            if (err) {
                console.log("failure", err);
            } else {
                console.log("connect and session done!");
            }
            resolve();
        });
        
    });
}

// Basic Read and Write Function
async function WriteValue(NodeId, Value, DataType) {
    //console.log("Start Write")
    return new Promise(function(resolve, reject) {
        async.series([
            function(callback) {
                var setPointTemperatureId = NodeId;
                var num = Value;
                var nodesToWrite = [{
                    nodeId: setPointTemperatureId,
                    attributeId: opcua.AttributeIds.Value,
                    value: {
                        value: {
                            dataType: DataType,
                            value: num
                        }
                    }
                }];
                the_session.write(nodesToWrite, function(err) {
                    if (err) {
                        //console.log("failure Write", err);
                    } else {
                        //console.log("Write done!");
                    }
                    callback(err);
                });
                
            }
        ], function(err) {
            if (err) {
                //console.log("failure", err);
            } else {
                //console.log("done!");
                sleep(100);
            }
            resolve();
        });
    });
};

async function ReadValue(NodeId) {
    //console.log("Start Read")
    return new Promise(function(resolve, reject) {
        async.series([
            function(callback) {
                const maxAge = 0;
                const nodeToRead = { nodeId: NodeId , attributeId: opcua.AttributeIds.Value };
                
                the_session.read(nodeToRead, maxAge, function(err, dataValue) {
                    if (!err) {
                        data = dataValue;
                    }
                    callback(err);
                });
            }
        ], function(err) {
            if (err) {
                //console.log("failure", err);
            } else {
                //console.log("done!");
            }
            resolve(data);
        });
    });
};

async function AddTransition(transitionIndex, startConditionValue, functionValue, partNumberValue, endConditionValue)
{
	
	await WriteValue('ns=3;s="dbRfidData"."ID1"."iCode"',startConditionValue,"Int16");//startConditionValue改成指定值
	await sleep(500);
	await WriteValue('ns=3;s="dbRfidCntr"."ID1"."xWrite"',true,"Boolean");//寫入小車
	await sleep(500);
	await WriteValue('ns=3;s="dbRfidCntr"."ID1"."xWrite"',false,"Boolean");
	await sleep(500);
	let Code = 0;
	console.info('Wait for Code turn to ',startConditionValue);
	while(Code != startConditionValue){
	await sleep(500);
	await WriteValue('ns=3;s="dbRfidCntr"."ID1"."xRead"',true,"Boolean");//CHECK小車
	await sleep(500);
	await WriteValue('ns=3;s="dbRfidCntr"."ID1"."xRead"',false,"Boolean");
	await sleep(500);
	await ReadValue('ns=3;s="dbRfidData"."ID1"."iCode"').then( res => {
	Code = res.value.value;
	if(Code == startConditionValue)  {
		console.log('Code is ',Code);
		}    
	});
	}
    await WriteValue('ns=3;s="dbAppPar"."Conditions"['+transitionIndex+']."iCondIn"', startConditionValue, "Int16");

    await WriteValue('ns=3;s="dbAppPar"."Conditions"['+transitionIndex+']."xAppEn"', true, "Boolean");

    await WriteValue('ns=3;s="dbAppPar"."Conditions"['+transitionIndex+']."adiPar"[0]', functionValue, "Int32");

    await WriteValue('ns=3;s="dbAppPar"."Conditions"['+transitionIndex+']."adiPar"[1]', partNumberValue, "Int32");

    await WriteValue('ns=3;s="dbAppPar"."Conditions"['+transitionIndex+']."iCondOut"', endConditionValue, "Int16");
};

async function ClearTransition(transitionIndex)
{
    await WriteValue('ns=3;s="dbAppPar"."Conditions"['+transitionIndex+']."iCondIn"', 0, "Int16");

    await WriteValue('ns=3;s="dbAppPar"."Conditions"['+transitionIndex+']."xAppEn"', false, "Boolean");

    await WriteValue('ns=3;s="dbAppPar"."Conditions"['+transitionIndex+']."adiPar"[0]', 0, "Int32");

    await WriteValue('ns=3;s="dbAppPar"."Conditions"['+transitionIndex+']."adiPar"[1]', 0, "Int32");

    await WriteValue('ns=3;s="dbAppPar"."Conditions"['+transitionIndex+']."iCondOut"', 0, "Int16");
};

async function ConfigureDualConveyor()
{
    await WriteValue('ns=3;s="dbVar"."OpMode"."iMode"',0,"Int16");
    
    await WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."AutoMan"."xBit"',true,"Boolean");

    //Drive1往右
    await WriteValue('ns=3;s="dbActuatorCntr"."Drive1"."xQright"',true,"Boolean")
    await WriteValue('ns=3;s="dbActuatorCntr"."Drive1"."Hmi""xQA1_A1"',true,"Boolean")
    await WriteValue('ns=3;s="xQA1_A1"',true,"Boolean")

    //Drive1變慢
    await WriteValue('ns=3;s="dbActuatorCntr"."Drive1"."xQslow"',true,"Boolean")
    await WriteValue('ns=3;s="dbActuatorCntr"."Drive1"."Hmi""xQA1_A3"',true,"Boolean")
    await WriteValue('ns=3;s="xQA1_A3"',true,"Boolean")
    //Drive2往右
    await WriteValue('ns=3;s="dbActuatorCntr"."Drive2"."xQright"',true,"Boolean")
    await WriteValue('ns=3;s="dbActuatorCntr"."Drive2"."Hmi""xQA1_A1"',true,"Boolean")
    await WriteValue('ns=3;s="xQA2_A1"', true, "Boolean")

    //Drive2變慢
    await WriteValue('ns=3;s="dbActuatorCntr"."Drive2"."xQslow"',true,"Boolean")
    await WriteValue('ns=3;s="dbActuatorCntr"."Drive2"."Hmi""xQA1_A3"',true,"Boolean")
    await WriteValue('ns=3;s="xQA2_A3"',false,"Boolean")
    //Stoper 2降下
    await WriteValue('ns=3;s="xK1_MB30"', true, "Boolean")

};

async function ConfigureSingleConveyor()
{
    await WriteValue('ns=3;s="dbVar"."OpMode"."iMode"',0,"Int16");
    
    await WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."AutoMan"."xBit"',true,"Boolean");

    //Drive1往右
    await WriteValue('ns=3;s="dbActuatorCntr"."Drive1"."xQright"',true,"Boolean")
    await WriteValue('ns=3;s="dbActuatorCntr"."Drive1"."Hmi""xQA1_A1"',true,"Boolean")
    await WriteValue('ns=3;s="xQA1_A1"',true,"Boolean")
    await WriteValue('ns=3;s="dbActuatorCntr"."Drive1"."xQright"',true,"Boolean")
    await WriteValue('ns=3;s="dbActuatorCntr"."Drive1"."Hmi""xQA1_A1"',true,"Boolean")
    await WriteValue('ns=3;s="xQA1_A1"',true,"Boolean")
    //Drive1變慢
    await WriteValue('ns=3;s="dbActuatorCntr"."Drive1"."xQslow"',true,"Boolean")
    await WriteValue('ns=3;s="dbActuatorCntr"."Drive1"."Hmi""xQA1_A3"',true,"Boolean")
    await WriteValue('ns=3;s="xQA1_A3"',true,"Boolean")

};

async function CarrierCheckIn()
{
    BG22 = false;
    console.info('Wait for BG22: 0 > 1');
    while(BG22 != true){
        await ReadValue('ns=3;s="xG1_BG22"').then( res => {
            BG22 = res.value.value;
            if(BG22 == true)  {
            	console.log(`BG22 is true`);
            }
        });
    }
	
	await WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."Stop"."xBit"',true,"Boolean");
	//讀值得要重抓
	await sleep(100);
	await WriteValue('ns=3;s="dbRfidCntr"."ID1"."xRead"',true,"Boolean");//讀入小車
	await sleep(100);

    await WriteValue('ns=3;s="dbRfidCntr"."ID1"."xRead"',false,"Boolean");
    await sleep(100);

    await WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."AutoMan"."xBit"',false,"Boolean");

    await WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."Stop"."xBit"',false,"Boolean");
	
	await ReadValue('ns=3;s="dbRfidData"."ID1"."iCarrierID"').then( res => {
            carrierId = res.value.value;
            console.log(carrierId)
        });
		return carrierId;
    //await WriteValue('ns=3;s="dbRfidData"."ID1"."iCode"',52,"Int16");//軌道一讀到的值改成52

    //await WriteValue('ns=3;s="dbRfidCntr"."ID1"."xWrite"',true,"Boolean");//寫入小車

    //await WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."AutoMan"."xBit"',false,"Boolean");

    //await WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."Stop"."xBit"',false,"Boolean");

};

async function Reset()
{
    await WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."Reset"."xBit"',true,"Boolean");

    console.info('Wait for iOpMode turn to 20');
    while(iOpMode != 20){
        await ReadValue('ns=3;s="dbVar"."OpMode"."iOpMode"').then( res => {
            iOpMode = res.value.value;
            if (iOpMode == 20){
            	console.log(iOpMode)
            }
        });
    }

    await WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."Reset"."xBit"',false,"Boolean");

    await WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."Start"."xBit"',true,"Boolean");

};

async function AutoMode()
{
    await WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."Start"."xBit"',false,"Boolean");
    await WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."Start"."xBit"',true,"Boolean");

};

async function InitializeSetting()
{
    await WriteValue('ns=3;s="dbVar"."OpMode"."Auto"."xAct"',false,"Boolean");
    await WriteValue('ns=3;s="dbVar"."OpMode"."CycleEnd"."xAct"',false,"Boolean");
    await WriteValue('ns=3;s="dbVar"."OpMode"."Man"."xAct"',false,"Boolean");
    await WriteValue('ns=3;s="dbVar"."OpMode"."Reset"."xAct"',false,"Boolean");
	//await WriteValue('ns=3;s="dbVar"."OpMode"."iOpMode"',20,"Boolean");
};

async function WorkDown()
{
    while(BG21 != false){
        await ReadValue('ns=3;s="xG1_BG21"').then( res => {
            BG21 = res.value.value;
            console.log(BG21)
        });
    }

};


/************************Main Test Function*****************************/

// async function main(){
//     await Connect("opc.tcp://172.21.3.1:4840")
//     // await ReadValue('ns=3;s="dbVar"."OpMode"."iOpMode"').then( res => {
//     //     Danny = res.value.value;
//     //     console.log(Danny)
//     // });
//     // if (Danny == 3) {
//     //     console.log("Finally Successful")
//     // }
//     //await ASRS32SetUpMode()
//     await CycleEnd()
//     await Reset()
//     /*await WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."Reset"."xBit"',true,"Boolean");

//     while(Danny !== 20){
//         await ReadValue('ns=3;s="dbVar"."OpMode"."iOpMode"').then( res => {
//             Danny = res.value.value;
//             console.log(Danny)
//         });
//     }

//     await WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."Reset"."xBit"',false,"Boolean");*/

//     //await WriteValue('ns=3;s="dbVar"."Hmi"."Btn"."Start"."xBit"',true,"Boolean");

//     //await Reset()
//     await AutoMode()
//     //await deleteTransition(5);
//     //console.log("main func finished")
//     //await ASRS32SetUpMode();
//     //await CycleEnd()
// }

//main();

exports.ConnectToOpcuaServer = ConnectToOpcuaServer;
exports.WriteValue = WriteValue;
exports.ReadValue = ReadValue;
//exports.DisconnectASRS32 = DisconnectASRS32;
exports.AddTransition = AddTransition;
exports.ClearTransition = ClearTransition;
exports.ConfigureDualConveyor = ConfigureDualConveyor;
exports.ConfigureSingleConveyor = ConfigureSingleConveyor;
exports.CarrierCheckIn = CarrierCheckIn;
exports.Reset = Reset;
exports.AutoMode = AutoMode;
exports.InitializeSetting = InitializeSetting;
exports.WorkDown = WorkDown;






