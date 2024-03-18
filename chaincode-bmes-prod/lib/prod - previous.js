/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const woindex = 'workorder';

//@region class definition
class TransitionInfo{
    sales_order = " ";
    sales_term = " ";
    quantity_index = " ";
    transition_index = "";
    constructor(so_id,term_id, quan_id,tran_id){
        this.sales_order = so_id;
        this.sales_term=term_id;
        this.quantity_index=quan_id;
        this.transition_index = tran_id;
    }
}

class CarrierState{
    Status = 'free'; //  free/busy
    TransitionInfo = '' ; // TransitionInfo object
    constructor(status, transitionInfo) {
        this.Status = status;
        this.TransitionInfo = transitionInfo;
    }
}

class ProductionMessage{
    //index
    type = "none"; 
    // none, wo_start, wo_finish, proc_start, proc_end, proc_notify
    // if a machine is the receiver of the msg with type "proc_end", it will work based on transitionInfo.
    
    sendor= " ";
    receiver= " ";
    transitionInfo = {};    

    constructor(sendor_str, receiver_str, type_str, transitionInfo_obj){
        this.type = type_str;
        this.sendor=sendor_str;
        this.receiver=receiver_str;
        this.transitionInfo=transitionInfo_obj;
    }
}

class CheckInResponse{
    IsOnDuty = 'No'; //if not on duty, free carrier
    Function = '';
    Parameter ='';
    Message = '';
    constructor(on_duty,func,par,msg){
        this.IsOnDuty =on_duty;
        this.Function=func;
        this.Parameter=par;
        this.Message=msg;
    }
}

class CheckOutResponse{
    NextMachine = '';
    Message = '';
    constructor(next,msg)
    {
        this.NextMachine = next;
        this.Message = msg;
    }
}

/*
Title: ManufacturingOrder
BindingWith: SalesOrder.ID
WorkOrders, where
    WorkOrder[index]
        CorrespondingTo: index of SalesTerm, index of Quantity
        BindingWith: Carrier.ID
        ProcessRoutes, where
            Process[Index]
                AssignTo: Machine.Name
                Start: “Undo” -> TimeStamp
                End: “Undo” -> TimeStamp

					let key_transition_machine   = ctx.stub.createCompositeKey('wo', ["Machine"  ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
                    let key_transition_function  = ctx.stub.createCompositeKey('wo', ["Function" ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
                    let key_transition_parameter = ctx.stub.createCompositeKey('wo', ["Parameter",str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
                    let key_transition_ok_to     = ctx.stub.createCompositeKey('wo', ["OK_To"    ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
                    let key_transition_nok_to    = ctx.stub.createCompositeKey('wo', ["NOK_To"   ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
                    let key_transition_start     = ctx.stub.createCompositeKey('wo', ["Start"    ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
                    let key_transition_end       = ctx.stub.createCompositeKey('wo', ["End"      ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
                    let key_transition_status    = ctx.stub.createCompositeKey('wo', ["Status"   ,str_so_id, str_idxTerm, str_idxQuantity]);
                    let key_transition_tag       = ctx.stub.createCompositeKey('wo', ["Tag"      ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
    init value is undo, Time format : YYYY-MM-DD-hh-mm-ss
*/

//#endregion

class BMES_PROD extends Contract {
    async InitCarrier(ctx)
    {
        const str_mspid = await ctx.stub.getMspID();

            //console.info('============= START : Init =============');

            // carrier doc is designed to hold TransitionInfo 
            let carrierState = new CarrierState('free',null);
            for(let i=1 ; i<=10 ; i++){
                let key = ctx.stub.createCompositeKey('bmes', ['carrier',i.toString()]);
                await ctx.stub.putState(key,JSON.stringify(carrierState));      
                //console.info(`Generate carrier doc # ${i}`);          
            }
            //console.info('============= END : Init =============');
            console.info(`MspID: ${str_mspid} initialize Carrier ID`);
    }


    async StartSaleOrder(ctx, id_salesOrder_str) 
    {
        console.info(`=== Function StartSaleOrder is executed ===`);
        //get sales order by id
        const buffer_so_response = await ctx.stub.invokeChaincode('bmes-mgmt',['GetSalesOrder',id_salesOrder_str],'channelmgmt');    
        if(buffer_so_response.status != 200) {    
            return JSON.stringify({status:buffer_so_response.status});
        }
        const obj_so_payload = JSON.parse(JSON.stringify(buffer_so_response.payload));
        const str_so_data = String.fromCharCode.apply(null, obj_so_payload.data);  
        let obj_so = JSON.parse(str_so_data);

        console.info(`obj_so type: ${typeof(obj_so)} and value: ${JSON.stringify(obj_so, null, 4)}`);
       /* console.info(`Get SalesOrder ${obj_so} ,and content:`);
        console.info(obj_so);
        example of obj_so
        {
            ID: '1000',
            State: 'Pending',
            SalesTerms: [
              { ProductName: 'Product 1000', Quantity: 2, RefWorkPlanId: '1000' }
            ],
            Start: 'undo',
            Stop: 'undo'
        }*/

        let str_so_id = obj_so.ID.toString();    
        let response = '';             
        for(let num_idxTerm = 0; num_idxTerm < obj_so.SalesTerms.length; num_idxTerm++){

            let obj_salesTerms = obj_so.SalesTerms[num_idxTerm];
            let str_idxTerm = num_idxTerm.toString();
            console.info(`Sales order id ${id_salesOrder_str}: Ref work plan: ${obj_salesTerms.RefWorkPlanId} x ${obj_salesTerms.Quantity}`)       
            
            for(let num_idxQuantity = 0; num_idxQuantity < obj_salesTerms.Quantity; num_idxQuantity++)
            {
                console.info(`\ttotal quantity:${obj_salesTerms.Quantity}, current index: ${num_idxQuantity}`);
                let str_idxQuantity = num_idxQuantity.toString();                

                // generate carrier key
                //console.info(`Start to createCompositeKey key_carrier with ${so_obj.ID} ${idx_term} ${idx_quantity} `);
                //let key_carrier = ctx.stub.createCompositeKey('wo', [str_so_id, str_idxTerm, str_idxQuantity, "BindToCarrier"]);

                // generate work plan key
                // console.info(`Start to get work plan id=${obj_salesTerms.RefWorkPlanId}`);
                //let content_workplan = GetWorkPlan(ctx, salesTerms.RefWorkPlanId.toString());
                const buffer_wp_response = await ctx.stub.invokeChaincode('bmes-mgmt',['GetWorkPlan',obj_salesTerms.RefWorkPlanId.toString()],'channelmgmt');    
                // console.info(`GetWorkPlan::responseBuffer: ${buffer_wp_response}`);
                 if(buffer_wp_response.status != 200)
                 {    
                     return JSON.stringify({status:buffer_wp_response.status});
                 }
                 let obj_wp_payload = JSON.parse(JSON.stringify(buffer_wp_response.payload)); 
                 const str_wp_data = String.fromCharCode.apply(null, obj_wp_payload.data);   
                 let obj_wp = JSON.parse(str_wp_data);
             
                 let key_workplan = ctx.stub.createCompositeKey('wo', ["WorkPlan",str_so_id, str_idxTerm, str_idxQuantity]);
                 console.info(`\tGet Work Plan ${obj_wp} ,and content: ${JSON.stringify(obj_wp, null, 4)}`);
                 /* example of obj_wp
                 {
                   ID: '1000',
                   TransitionList: {
                     '10': {
                       ID: '10',
                       Machine: 'ASRS',
                       Function: '2',
                       Parameter: '210',
                       OK_To: '20',
                       NOK_To: '99'
                     },....
                   }
                 }
                 */
                 //generate related doc for work order
                 //await ctx.stub.putState(key_carrier, "none");
                 await ctx.stub.putState(key_workplan, Buffer.from(JSON.stringify(obj_wp)));

                // generate transition doc       
                const array_transition = Object.values(obj_wp.TransitionList);

                for(let i=0; i<array_transition.length;i++)
                {
                    console.info(`\t\ttotal transiitions :${array_transition.length}, current index: ${i}`);
                    let obj_tran = array_transition[i];
                    console.info(`\t\tobj_tran content: ${JSON.stringify(obj_tran, null, 4)}`);
          
                    let str_idxTransition = obj_tran.ID;
                    let str_machine       = obj_tran.Machine;
                    let str_function      = obj_tran.Function;
                    let str_parameter     = obj_tran.Parameter;
                    let str_ok_to         = obj_tran.OK_To;
                    let str_nok_to        = obj_tran.NOK_To;            
                
                    let key_transition_machine   = ctx.stub.createCompositeKey('wo', ["Machine"  ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
                    let key_transition_function  = ctx.stub.createCompositeKey('wo', ["Function" ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
                    let key_transition_parameter = ctx.stub.createCompositeKey('wo', ["Parameter",str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
                    let key_transition_ok_to     = ctx.stub.createCompositeKey('wo', ["OK_To"    ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
                    let key_transition_nok_to    = ctx.stub.createCompositeKey('wo', ["NOK_To"   ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
                    let key_transition_start     = ctx.stub.createCompositeKey('wo', ["Start"    ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
                    let key_transition_end       = ctx.stub.createCompositeKey('wo', ["End"      ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
                    let key_transition_status    = ctx.stub.createCompositeKey('wo', ["Status"   ,str_so_id, str_idxTerm, str_idxQuantity]);
                    let key_transition_tag       = ctx.stub.createCompositeKey('wo', ["Tag"      ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
                
                    //console.info(`put transition keys with init values`);            
                    await ctx.stub.putState(key_transition_machine  ,str_machine  );
                    await ctx.stub.putState(key_transition_function ,str_function );
                    await ctx.stub.putState(key_transition_parameter,str_parameter);
                    await ctx.stub.putState(key_transition_ok_to    ,str_ok_to    );
                    await ctx.stub.putState(key_transition_nok_to   ,str_nok_to   );
                    await ctx.stub.putState(key_transition_start    ,"undo");
                    await ctx.stub.putState(key_transition_end      ,"undo");  
                    await ctx.stub.putState(key_transition_status   ,"Waiting");
                    await ctx.stub.putState(key_transition_tag      ,"nothing");
                }

                // generate wo_start event to notify the first machine
                let start_machine_name = obj_wp.TransitionList['10'].Machine;
                let transitionInfo = new TransitionInfo(str_so_id,str_idxTerm,str_idxQuantity,"10");
                let message = new ProductionMessage("contract",start_machine_name,"wo_start", transitionInfo);
                await ctx.stub.setEvent('StartEvent', Buffer.from(JSON.stringify(message)));

                // generate present transition key and return
                let key_present_transition = ctx.stub.createCompositeKey('wo', [str_so_id, str_idxTerm, str_idxQuantity,"CurrentTransition"]);
                response = await ctx.stub.putState(key_present_transition, "10");
            }
        }
        return response;
    }





    // when a carrier gets into a mahchine
    async CheckIn(ctx, str_carrier_id, str_machine_name){

        console.info(`=== Function CheckIn() is executed ===`);

        const key_carrier = ctx.stub.createCompositeKey('bmes', ['carrier',str_carrier_id]);
        let buf_WoOfCarrier = await ctx.stub.getState(key_carrier);

        if (!buf_WoOfCarrier || buf_WoOfCarrier.length === 0) {
            return JSON.stringify(new CheckInResponse('No','','',`The carrier ${str_carrier_id} does not exist`));
        }
             /* console.info(`buf_WoOfCarrier type: ${typeof(buf_WoOfCarrier)} \n  and value: ${JSON.stringify(buf_WoOfCarrier, null, 4)}`);
        buf_WoOfCarrier type: object and value: {"type": "Buffer","data": [ 123, 34, 83,....]}*/

        let obj_WoOfCarrier = JSON.parse(Buffer.from(buf_WoOfCarrier));
            /* console.info(`obj_WoOfCarrier type: ${typeof(obj_WoOfCarrier)} \n  and value: ${JSON.stringify(obj_WoOfCarrier, null, 4)}`);
         obj_WoOfCarrier type: object  and value: {"Status": "free","TransitionInfo": null}*/

        let carrierState = new CarrierState(null,null);
        Object.assign(carrierState,obj_WoOfCarrier);
            //console.info(`carrierState type: ${typeof(carrierState)} \n  and value: ${JSON.stringify(carrierState, null, 4)}`);
        
        if(carrierState.Status == "free")//no task in the carrier => try to assign a task
        {
            //try to find possible tasks
            const iterator = await ctx.stub.getStateByPartialCompositeKey('wo',['Status']);
            let result = await iterator.next();
                /* content of resuls
                print out by console.info(JSON.stringify(result, null, 4))
                {
                    "value": {
                            "namespace": "bmes-prod",
                            "key": "\u0000wo\u0000Status\u00001000\u00000\u00000\u000010\u0000",
                            "value": "eyJzYWxlc19vcmRlciI6IjEwMDAiLCJzYWxlc190ZXJtIjoiMCIsInF1YW50aXR5X2luZGV4IjoiMCIsInN0YXR1cyI6IldhaXRpbmcifQ=="
                            },
                    "done": false
                }
                */

            // collect tasks
            let list_wo_waiting = [];
            while(!result.done){    
                
                const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
                    /* console.info(`strValue type: ${typeof(strValue)} and value: ${strValue}`);
                    output: strValue type: string and value: Waiting */

                const obj_splited = ctx.stub.splitCompositeKey(result.value.key);
                    /* console.info(`obj_splited type: ${typeof(obj_splited)} and value: ${JSON.stringify(obj_splited, null, 4)}`);
                       obj_splited type: object and value: {
                        "objectType": "wo",
                        "attributes": [ "Status","1000","0","0" ]
                    }
                */

                let array_wo_attributes = obj_splited.attributes;
                    /* console.info(`key_attributes type: ${typeof(array_wo_attributes)} and value: ${JSON.stringify(array_wo_attributes, null, 4)}`);
                        key_attributes type: object and value: ["Status","1000", "0","0"] */

                if(strValue == "Waiting"){
                    list_wo_waiting.push(array_wo_attributes);
                }
                result = await iterator.next();
            }  
            

            //if list_wo_waiting is empty, report a CheckInResponse with 'No' on_duty
            if(list_wo_waiting.length == 0){   
                return  JSON.stringify(new CheckInResponse("No",'','','No waiting order'));
            }
            //else select the index of the first wo if list_wo_waiting is not empty. THIS MAY BE Optimized by Scheduling
            let wo_activating = list_wo_waiting[0];
            //console.info(`wo_activating type: ${typeof(wo_activating)} and value: ${JSON.stringify(wo_activating, null, 4)}`);
            wo_activating[0]="Machine";
            wo_activating.push('10');  // First Step is '10' in default

            //check machine name
            const key_transition_machine = ctx.stub.createCompositeKey('wo', wo_activating);
            const machine_for_first_tran = await ctx.stub.getState(key_transition_machine);
            //console.info(`machine_for_first_tran type: ${typeof(machine_for_first_tran)} \n  and value: ${machine_for_first_tran}`);
            const str_machine_for_first_tran = machine_for_first_tran.toString();

            // if start machine is not check-in machine, report a CheckInResponse with 'No' on_duty
            if(str_machine_name != str_machine_for_first_tran){
                return  JSON.stringify(new CheckInResponse("No",'','',`${str_machine_name} does not serve the present transition of the carrier`));
            }

            // if everything is ok, bind carrier and wo
            //console.info(`modified wo_activating type: ${typeof(wo_activating)} and value: ${JSON.stringify(wo_activating, null, 4)}`);
            //modified wo_activating type: object and value: [ "Machine","1000","0","0", "10"]
            let traninfo = new TransitionInfo(wo_activating[1], wo_activating[2], wo_activating[3], wo_activating[4]);
            //console.info(`traninfo type: ${typeof(traninfo)} and value: ${JSON.stringify(traninfo, null, 4)}`);   
            Object.assign(carrierState,new CarrierState('busy', traninfo));
            let res=  await ctx.stub.putState(key_carrier, JSON.stringify(carrierState));    
            //console.info(`updating carrier's wo reports: ${res}`);

            // Due to the delay of endorsement, the next line will get non-updated value before binding carrier and wo
            // res=  await ctx.stub.getState(key_carrier);
        }//end carrier's work order = "none"
        
        console.info(`carrierState type: ${typeof(carrierState)} \n  and value: ${JSON.stringify(carrierState, null, 4)}`);        

        let traninfo = carrierState.TransitionInfo;        
        
        //get function, parameters
        let array_Func = ["Function",traninfo.sales_order,traninfo.sales_term,traninfo.quantity_index,traninfo.transition_index];
        let array_Para = ["Parameter",traninfo.sales_order,traninfo.sales_term,traninfo.quantity_index,traninfo.transition_index];
        let array_State = ["Status",traninfo.sales_order,traninfo.sales_term,traninfo.quantity_index];
        const key_transition_function  = ctx.stub.createCompositeKey('wo', array_Func);
        const key_transition_parameter = ctx.stub.createCompositeKey('wo', array_Para);
        const key_transition_status = ctx.stub.createCompositeKey('wo', array_State);

        const str_func = await ctx.stub.getState(key_transition_function);
        const str_para = await ctx.stub.getState(key_transition_parameter);
        await ctx.stub.putState(key_transition_status   ,"Running");

        let msg = new CheckInResponse('Yes',str_func.toString(),str_para.toString(),`Carrier ${str_carrier_id} checkin ${str_machine_name} to execute func ${str_func} with parameters ${str_para}` )
        return JSON.stringify(msg);     
    }






    async ReportTransitionStart(ctx, str_carrier_id, str_machine_name){

        console.info(`=== Function ReportTransitionStart() is executed ===`);

        //Collect transition data 
        const key_carrier = ctx.stub.createCompositeKey('bmes', ['carrier',str_carrier_id]);
        let buf_WoOfCarrier = await ctx.stub.getState(key_carrier);
            if (!buf_WoOfCarrier || buf_WoOfCarrier.length === 0) {
                return JSON.stringify(new CheckInResponse('No','','',`The carrier ${str_carrier_id} does not exist`));
            }
            //console.info(`buf_WoOfCarrier type: ${typeof(buf_WoOfCarrier)} \n  and value: ${JSON.stringify(buf_WoOfCarrier, null, 4)}`);
            //buf_WoOfCarrier type: object and value: {"type": "Buffer","data": [ 123, 34, 83,....]}
        let str_WoOfCarrier = Buffer.from(buf_WoOfCarrier);
            //console.info(`str_WoOfCarrier type: ${typeof(str_WoOfCarrier)} \n  and value: ${JSON.stringify(str_WoOfCarrier, null, 4)}`);

        let obj_WoOfCarrier = JSON.parse(str_WoOfCarrier);
            //console.info(`obj_WoOfCarrier type: ${typeof(obj_WoOfCarrier)} \n  and value: ${JSON.stringify(obj_WoOfCarrier, null, 4)}`);
            //obj_WoOfCarrier type: object  and value: {"Status": "free","TransitionInfo": null}

        let carrierState = new CarrierState(null,null);
        Object.assign(carrierState,obj_WoOfCarrier);

        console.info(`carrierState type: ${typeof(carrierState)} \n  and value: ${JSON.stringify(carrierState, null, 4)}`);

        //check carrier
        if(carrierState.Status == "free"){
            return JSON.stringify(new CheckInResponse('No','','',`The carrier ${str_carrier_id} does not perform any work order.`));         
        }

        let str_so_id = carrierState.TransitionInfo.sales_order;
        let str_idxTerm = carrierState.TransitionInfo.sales_term;
        let str_idxQuantity = carrierState.TransitionInfo.quantity_index;
        let str_idxTransition = carrierState.TransitionInfo.transition_index;

        //check state
        let key_transition_status = ctx.stub.createCompositeKey('wo', ["Status"   ,str_so_id, str_idxTerm, str_idxQuantity]);
        let str_transition_state = await ctx.stub.getState(key_transition_status);
        if(str_transition_state != "Running")  {
            return JSON.stringify(new CheckInResponse('No','','',`The trainsition sale_order ${str_so_id}, term_idx ${str_idxTerm}, quantity_idx ${str_idxQuantity} is not in "Running" state.`));
        }

        //check mahine
        let key_transition_machine   = ctx.stub.createCompositeKey('wo', ["Machine"  ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
        let str_transition_machine = await ctx.stub.getState(key_transition_machine);
        if(str_transition_machine != str_machine_name) {
            return JSON.stringify(new CheckInResponse('No','','',`The machine ${str_machine_name} cannot perform this transition.`));      
        }

        //update start timestamp
        let key_transition_start     = ctx.stub.createCompositeKey('wo', ["Start"    ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
        let str_state = await ctx.stub.getState(key_transition_start);
        if(str_state != "undo"){
            let msg = new CheckInResponse('No','','',`The start time of the trainsition sale_order ${str_so_id}, term_idx ${str_idxTerm}, quantity_idx ${str_idxQuantity} is already updated`);
            return JSON.stringify(msg);
        }

        let timestamp = new Date().toLocaleTimeString();
        await ctx.stub.putState(key_transition_start,timestamp);

        let message = new ProductionMessage(str_machine_name, "contract" ,"proc_start", carrierState.TransitionInfo );
        await ctx.stub.setEvent('StartEvent', Buffer.from(JSON.stringify(message)));

    }






    async ReportTransitionEnd(ctx, str_carrier_id, str_machine_name){

        console.info(`=== Function ReportTransitionEnd() is executed ===`);

        const key_carrier = ctx.stub.createCompositeKey('bmes', ['carrier',str_carrier_id]);
        let buf_WoOfCarrier = await ctx.stub.getState(key_carrier);
            if (!buf_WoOfCarrier || buf_WoOfCarrier.length === 0) {
                let msg = new CheckInResponse('No','','',`The carrier ${str_carrier_id} does not exist`);
                return JSON.stringify(msg);
            }
            //console.info(`buf_WoOfCarrier type: ${typeof(buf_WoOfCarrier)} \n  and value: ${JSON.stringify(buf_WoOfCarrier, null, 4)}`);
            //buf_WoOfCarrier type: object and value: {"type": "Buffer","data": [ 123, 34, 83,....]}
        let obj_WoOfCarrier = JSON.parse(Buffer.from(buf_WoOfCarrier));
        console.info(`obj_WoOfCarrier type: ${typeof(obj_WoOfCarrier)} \n  and value: ${JSON.stringify(obj_WoOfCarrier, null, 4)}`);
            // obj_WoOfCarrier type: object  and value: {"Status": "free","TransitionInfo": null}

        let carrierState = new CarrierState(null,null);
        Object.assign(carrierState,obj_WoOfCarrier);
        //console.info(`carrierState type: ${typeof(carrierState)} \n  and value: ${JSON.stringify(carrierState, null, 4)}`);

        //check carrier
        if(carrierState.Status == "free") {
            let msg = new CheckInResponse('No','','',`The carrier ${str_carrier_id} does not perform any work order.`);
            return JSON.stringify(msg);       
        }

        let str_so_id = carrierState.TransitionInfo.sales_order;
        let str_idxTerm = carrierState.TransitionInfo.sales_term;
        let str_idxQuantity = carrierState.TransitionInfo.quantity_index;
        let str_idxTransition = carrierState.TransitionInfo.transition_index;

        //check state
        let key_transition_status    = ctx.stub.createCompositeKey('wo', ["Status"   ,str_so_id, str_idxTerm, str_idxQuantity]);
        let str_transition_state = await ctx.stub.getState(key_transition_status);
        if(str_transition_state != "Running") {
            let msg = new CheckInResponse('No','','',`The trainsition sale_order ${str_so_id}, term_idx ${str_idxTerm}, quantity_idx ${str_idxQuantity} is not in "Running" state.`);
            return JSON.stringify(msg);
        }

        //check mahine
        let key_transition_machine   = ctx.stub.createCompositeKey('wo', ["Machine"  ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
        let str_transition_machine = await ctx.stub.getState(key_transition_machine);
        if(str_transition_machine != str_machine_name) {
            let msg = new CheckInResponse('No','','',`The machine ${str_machine_name} cannot perform this transition.`);
            return JSON.stringify(msg);  
        }

        //update start timestamp
        let key_transition_end     = ctx.stub.createCompositeKey('wo', ["End"    ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
        let str_state = await ctx.stub.getState(key_transition_end);
        if(str_state != "undo") {
            let msg= new CheckInResponse('No','','',`The end time of the trainsition sale_order ${str_so_id}, term_idx ${str_idxTerm}, quantity_idx ${str_idxQuantity} is already updated`);
            return JSON.stringify(msg);
        }

        let timestamp = new Date().toLocaleTimeString();
        await ctx.stub.putState(key_transition_end, timestamp);

        let message = new ProductionMessage(str_machine_name, "contract" ,"proc_end", carrierState.TransitionInfo );
        await ctx.stub.setEvent('StartEvent', Buffer.from(JSON.stringify(message)));
    }





    async ChectOut(ctx, str_carrier_id, str_machine_name){

        console.info(`=== Function ChectOut() is executed ===`);

        const key_carrier = ctx.stub.createCompositeKey('bmes', ['carrier',str_carrier_id]);
        let buf_WoOfCarrier = await ctx.stub.getState(key_carrier);
            if (!buf_WoOfCarrier || buf_WoOfCarrier.length === 0) {
                let msg = new CheckInResponse('No','','',`The carrier ${str_carrier_id} does not exist`);
                return JSON.stringify(msg);
            }
        let obj_WoOfCarrier = JSON.parse(Buffer.from(buf_WoOfCarrier));
        console.info(`obj_WoOfCarrier type: ${typeof(obj_WoOfCarrier)} \n  and value: ${JSON.stringify(obj_WoOfCarrier, null, 4)}`);
        // obj_WoOfCarrier type: object  and value: {"Status": "free","TransitionInfo": null}

        let carrierState = new CarrierState(null,null);
        Object.assign(carrierState,obj_WoOfCarrier);

        //check carrier
        if(carrierState.Status == "free")
        {
            let msg = new CheckInResponse('No','','',`The carrier ${str_carrier_id} does not perform any work order.`);        
            return JSON.stringify(msg);
        }

        let str_so_id = carrierState.TransitionInfo.sales_order;
        let str_idxTerm = carrierState.TransitionInfo.sales_term;
        let str_idxQuantity = carrierState.TransitionInfo.quantity_index;
        let str_idxTransition = carrierState.TransitionInfo.transition_index;

        //check state
        let key_transition_status    = ctx.stub.createCompositeKey('wo', ["Status"   ,str_so_id, str_idxTerm, str_idxQuantity]);
        let str_transition_state = await ctx.stub.getState(key_transition_status);
        if(str_transition_state != "Running")
        {
            let msg= new CheckInResponse('No','','',`The trainsition sale_order ${str_so_id}, term_idx ${str_idxTerm}, quantity_idx ${str_idxQuantity} is not in "Running" state.`);
            return JSON.stringify(msg);
        }

        //check mahine
        let key_transition_machine   = ctx.stub.createCompositeKey('wo', ["Machine"  ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
        let str_transition_machine = await ctx.stub.getState(key_transition_machine);
        if(str_transition_machine != str_machine_name){
            let msg = new CheckInResponse('No','','',`The machine ${str_machine_name} cannot perform this transition.`);
            return JSON.stringify(msg);       
        }
        let key_transition_start     = ctx.stub.createCompositeKey('wo', ["Start"    ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
        let str_startTime = await ctx.stub.getState(key_transition_start);
        let key_transition_end     = ctx.stub.createCompositeKey('wo', ["End"    ,str_so_id, str_idxTerm, str_idxQuantity,str_idxTransition]);
        let str_endTime = await ctx.stub.getState(key_transition_end);

        if(str_startTime == "undo") {
            let msg = new CheckInResponse('No','','',`The trainsition sale_order ${str_so_id}, term_idx ${str_idxTerm}, quantity_idx ${str_idxQuantity} is not started, so cannot check out.`);
            return JSON.stringify(msg);          
        }        
        
        if(str_endTime == "undo") {
            let msg = new CheckInResponse('No','','',`The trainsition sale_order ${str_so_id}, term_idx ${str_idxTerm}, quantity_idx ${str_idxQuantity} is not finished, so cannot check out.`);
            return JSON.stringify(msg);          
        }
        
        console.info(`The trainsition sale_order ${str_so_id}, term_idx ${str_idxTerm}, quantity_idx ${str_idxQuantity} is started at ${str_startTime} aned ended at ${str_endTime}.`)

        //prepare to update carrier's next state       
        let key_workplan = ctx.stub.createCompositeKey('wo', [str_so_id, str_idxTerm, str_idxQuantity,"WorkPlan"]);
        const buf_workplan = await ctx.stub.getState(key_workplan);
        const obj_workplan = JSON.parse(Buffer.from(buf_workplan));       

        console.info(`\tGet Work Plan ${obj_workplan} ,and content: ${JSON.stringify(obj_workplan, null, 4)}`);
        /* example of obj_wp
        {
          ID: '1000',
          TransitionList: {
            '10': {
              ID: '10',
              Machine: 'ASRS',
              Function: '2',
              Parameter: '210',
              OK_To: '20',
              NOK_To: '99'
            },....
          }
        }
        */         

        //find current transition info
        let currentTransition = obj_workplan.TransitionList[str_idxTransition];
        console.info(`\tGet currentTransition ${currentTransition} ,and content: ${JSON.stringify(currentTransition, null, 4)}`);

        let str_nextTransitionId = currentTransition.OK_To;
        let nextTransition = obj_workplan.TransitionList[str_nextTransitionId];
        console.info(`\tGet nextTransition ${nextTransition} ,and content: ${JSON.stringify(nextTransition, null, 4)}`);
        let nextMachine = nextTransition.Machine;

        //update tranisiton state
        carrierState.TransitionInfo = new TransitionInfo(str_so_id, str_idxTerm, str_idxQuantity, str_nextTransitionId)
        let res=  await ctx.stub.putState(key_carrier, JSON.stringify(carrierState)); 

        let message = new ProductionMessage(str_machine_name, nextMachine,"proc_notify", carrierState.TransitionInfo );
        await ctx.stub.setEvent('StartEvent', Buffer.from(JSON.stringify(message)));

        let msg = new CheckOutResponse(nextMachine,`The transition ${str_idxTransition} of sale_order ${str_so_id}, term_idx ${str_idxTerm}, quantity_idx ${str_idxQuantity} is done. The next transition ${str_nextTransitionId} will be performed at Machine ${nextMachine}` );
        return msg;
    }




   async TestClientCheck(ctx){
        const proposalCreator = await ctx.stub.getCreator();
        console.info(`\tGet ProposalCreator ${proposalCreator} ,and content: ${JSON.stringify(proposalCreator, null, 4)}`);
        console.info(`\tits MSPID ${proposalCreator.mspid} `);

        const str_mspid = await ctx.stub.getMspID();
        console.info(`\tGet MSPID ${str_mspid} `);
   }

   async TestEventPerformance(ctx, timestamp_ms)   {
    const proposalCreator = await ctx.stub.getCreator();
    console.info(`\tGet ProposalCreator ${proposalCreator} ,and content: ${JSON.stringify(proposalCreator, null, 4)}`);
    console.info(`\tits MSPID ${proposalCreator.mspid} `);
    const str_mspid = await ctx.stub.getMspID();
    console.info(`\tGet MSPID ${str_mspid} `);

        const d = new Date();
        let mid_ms = d.getTime().toString();
        let res = {start: timestamp_ms, mid: mid_ms, end: 0}
        let buf = Buffer.from(JSON.stringify(res));
        console.info(`\tGet timestamp_ms ${timestamp_ms} ,and content: ${JSON.stringify(res, null, 4)}`);
        await ctx.stub.putState("event", JSON.stringify(res)); 
        let err = await ctx.stub.setEvent('EventTest', Buffer.from(JSON.stringify(res)));

        return JSON.stringify(err);
   }

}

module.exports = BMES_PROD;