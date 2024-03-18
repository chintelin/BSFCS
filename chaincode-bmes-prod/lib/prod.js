/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const woindex = 'workorder';

//@region class definition

class WipId {
    SO_id = "";
    Term_id = "";
    WP_id = ""
    constructor(so_id, term_id, wp_id) {
        this.SO_id = so_id;
        this.Term_id = term_id;
        this.WP_id = wp_id;
    }

    ToArray=function() {
        return ['Wip', this.SO_id, this.Term_id, this.WP_id];
    }
}

class WipState {
    CurrentTransitionID = "10"; //first step is 10 in default
    BindingWithCarrier = null;
}

class CarrierState {
    Status = 'free'; //  free/busy
    CurrentWorkTermId = null; // record the current work term with Wip Id
}

class WorkTermId {
    SO_id = "";
    Term_id = "";
    WP_id = ""
    Tran_id = "";

    constructor(so_id, term_id, wp_id, tran_id) {
        this.SO_id = so_id;
        this.Term_id = term_id;
        this.WP_id = wp_id;
        this.Tran_id = tran_id;
    }
    ToArray = function () {
        return ['WorkTerm',this.SO_id, this.Term_id, this.WP_id, this.Tran_id];
    }
}

class WorkTermState {

    Start = ""; //toLocaleTimeString() 
    End = "";
    Tag = "";
}

class ProductionMessage {
    //index
    type = "none";
    // none, wo_start, wo_finish, proc_start, proc_end, proc_notify
    // if a machine is the receiver of the msg with type "proc_end", it will work based on transitionInfo.

    sendor = " ";
    receiver = " ";
    transitionInfo = {};

    constructor(sendor_str, receiver_str, type_str, transitionInfo_obj) {
        this.type = type_str;
        this.sendor = sendor_str;
        this.receiver = receiver_str;
        this.transitionInfo = transitionInfo_obj;
    }
}

class CheckInMessage {
    IsOnDuty = 'No'; //if not on duty, free carrier
    Function = '';
    Parameter = '';
    Message = '';
    constructor(on_duty, func, par, msg) {
        this.IsOnDuty = on_duty;
        this.Function = func;
        this.Parameter = par;
        this.Message = msg;
    }
}

class CheckOutMessage{
    NextMachine = '';
    Message = '';
    constructor(next,msg)
    {
        this.NextMachine = next;
        this.Message = msg;
    }
}

class BMES_PROD extends Contract {
    async InitCarrier(ctx) {
        const str_mspid = await ctx.stub.getMspID();
          console.info('============= START : InitCarrier =============');

        // carrier doc is designed to hold TransitionInfo 
        const carrierState = new CarrierState('free', null);
        for (let i = 1; i <= 10; i++) {
            let key = ctx.stub.createCompositeKey('bmes', ['carrier', i.toString()]);
            await ctx.stub.putState(key, JSON.stringify(carrierState));
            //  console.info(`Generate carrier doc # ${i}`);          
        }
        //  console.info('============= END : InitCarrier =============');
          console.info(`MspID: ${str_mspid} initialize Carrier ID`);
    }

    //start up a sales order with its id (string format)
    async StartSaleOrder(ctx, id_salesOrder_str) 
    {
          console.info(`=== Function StartSaleOrder is executed ===`); 

        //get sales order object by id from mgmt chaincode
        const buffer_so_response = await ctx.stub.invokeChaincode('bmes-mgmt',['GetSalesOrder',id_salesOrder_str],'channelmgmt');    
        if(buffer_so_response.status != 200) {    
            return JSON.stringify({status:buffer_so_response.status});
        }
          console.info("130");
        const obj_so_payload = JSON.parse(JSON.stringify(buffer_so_response.payload));
        const str_so_data = String.fromCharCode.apply(null, obj_so_payload.data);  
        const obj_so = JSON.parse(str_so_data);
          console.info(`obj_so type: ${typeof(obj_so)} and value: ${JSON.stringify(obj_so, null, 4)}`); //confirm in docker container if necessary
       /*   console.info(`Get SalesOrder ${obj_so} ,and content:`);
          console.info(obj_so);
        example of obj_so
            {
            "ID":"1000",
            "Release":"",
            "SalesTerms":
            	{
            		"1":{
            		"ID":"1",
            		"ProductName":"Product 1000",
            		"RefWorkPlan":"1000",
            		"State":"Waiting",
            		"Start":"",
            		"Stop":""},

            		"2":{
            		"ID":"2",
            		"ProductName":"Product 1000",
            		"RefWorkPlan":"1000",
            		"State":"Waiting",
            		"Start":"",
            		"Stop":""}
            	},
            	"Start":"",
            	"Stop":""
            }
        */
        
        const str_so_id = obj_so.ID.toString();  // get so_id for creating wip and work terms 
        //Start preparing  wip and transition ids, composed by so_id (ready), term_id, wp_id, tran_id

        //loop to find out salesterm id and its workplan id
        const keys_sales_term = Object.keys(obj_so.SalesTerms);
          console.info(`num of terms: ${keys_sales_term.length}`);
          console.info("170");
        for (let iter_st = 0; iter_st < keys_sales_term.length; iter_st++) {    
            let str_term_id = keys_sales_term[iter_st]; // it is a key
            const obj_salesTerms = obj_so.SalesTerms[str_term_id];
              console.info(`Sales term id ${str_term_id}: Ref work plan: ${obj_salesTerms.RefWorkPlan}`)

            // term_id (ready), wp_id (ready)
            const str_wp_id = obj_salesTerms.RefWorkPlan.toString();
            //Be preparing wip and transition ids, composed by so_id (ready), term_id (ready), wp_id (ready), tran_id (not yet)

              console.info("180");
            // create wip from its key and state, and then commit these to ledger
            const wip_id = new WipId(str_so_id, str_term_id, str_wp_id);
            const wip_id_info = wip_id.ToArray();
              console.info(`wip_id_info type: ${typeof (wip_id_info)} and value: ${JSON.stringify(wip_id_info, null, 4)}`); //confirm in docker container if necessary
            const key_wip = ctx.stub.createCompositeKey('bmes', wip_id_info); //generate composite key for wip key
            const state_wip = new WipState(); // initialized with default condition
            await ctx.stub.putState(key_wip, Buffer.from(JSON.stringify(state_wip))); // commit wip to prod ledger

            // decompose work plan object to find out tranistion info
              console.info("190");
            const buffer_wp_response = await ctx.stub.invokeChaincode('bmes-mgmt', ['GetWorkPlan', str_wp_id], 'channelmgmt');    
            if (buffer_wp_response.status != 200) {
                  console.info(JSON.stringify(buffer_wp_response));
                return JSON.stringify(buffer_wp_response);
            }
              console.info("195");
            const obj_wp_payload = JSON.parse(JSON.stringify(buffer_wp_response.payload)); 
            const str_wp_data = String.fromCharCode.apply(null, obj_wp_payload.data);
            const obj_wp = JSON.parse(str_wp_data);
              console.info(`\tGet Work Plan ${obj_wp} ,and content: ${JSON.stringify(obj_wp, null, 4)}`);
            /* example of obj_wp
               {
                 "ID": "1000",
                 "TransitionList": {
                   "10": {
                     "ID": "10",
                     "WorkStation": "ASRS",
                     "Function": "2",
                     "Parameter": "210",
                     "OK_To": "20",
                     "NOK_To": "99"
                   },
                   "20": {
                     "ID": "20",
                     "WorkStation": "Magazine",
                     "Function": "",
                     "Parameter": "",
                     "OK_To": "30",
                     "NOK_To": "99"
                   }
               }
            */

            // find tranisition definitions in work plan object
            const array_transition = Object.values(obj_wp.TransitionList);

            // loop to get transition ids to create work order terms
            // A work term is composed of transition id and its state


              console.info("230");
              console.info(`num of transition: ${array_transition.length}`);
            for (let iter_transition = 0; iter_transition < array_transition.length; iter_transition++) {
                  console.info(`\t\ttotal transiitions :${array_transition.length}, current index: ${iter_transition}`);
                const obj_tran = array_transition[iter_transition];
                //  console.info(`\t\tobj_tran content: ${JSON.stringify(obj_tran, null, 4)}`);
                // tran_id (ready)
                const str_tran_id = obj_tran.ID;

                // create work term with its key and state, and then commit these to ledger
                  console.info("240")
                const wt_id = new WorkTermId(str_so_id, str_term_id, str_wp_id, str_tran_id);
                const wt_id_info = wt_id.ToArray();
                const key_wt = ctx.stub.createCompositeKey('bmes', wt_id_info);
                const wt_state = new WorkTermState();
                await ctx.stub.putState(key_wt, Buffer.from(JSON.stringify(wt_state)));

            }//end of array_transition loop
        }//end of  obj_so.SalesTerms loop
        //return JSON.stringify({ status: OK });
    }




    // when a carrier gets into a mahchine
    async CheckIn(ctx, str_carrier_id, str_workstation_name){

          console.info(`=== Function CheckIn() is executed ===`);

        // find carrier state recorded in ledger
        const key_carrier = ctx.stub.createCompositeKey('bmes', ['carrier',str_carrier_id]);
        const buf_workTerrmOfCarrier = await ctx.stub.getState(key_carrier);
        if (!buf_workTerrmOfCarrier || buf_workTerrmOfCarrier.length === 0) {
            return JSON.stringify(new CheckInMessage('No','','',`The carrier ${str_carrier_id} does not exist`));
        }

        //   console.info(`buf_workTerrmOfCarrier type: ${typeof(buf_workTerrmOfCarrier)} \n  and value: ${JSON.stringify(buf_workTerrmOfCarrier, null, 4)}`);
        // buf_workTerrmOfCarrier type: object and value: {"type": "Buffer","data": [ 123, 34, 83,....]}*/
        const obj_WoOfCarrier = JSON.parse(Buffer.from(buf_workTerrmOfCarrier));
 
        //   console.info(`obj_WoOfCarrier type: ${typeof(obj_WoOfCarrier)} \n  and value: ${JSON.stringify(obj_WoOfCarrier, null, 4)}`);
        //  obj_WoOfCarrier type: object  and value: {"Status": "free","TransitionInfo": null}         

        const carrierState = Object.assign(new CarrierState(null, null), obj_WoOfCarrier);        
        //   console.info(`carrierState type: ${typeof(carrierState)} \n  and value: ${JSON.stringify(carrierState, null, 4)}`);
        
        if (carrierState.Status == "free")//no task in the carrier => try to assign a task
        {
            //try to find possible wip
            const iterator = await ctx.stub.getStateByPartialCompositeKey('bmes', ['Wip']);
            let result = await iterator.next();
            /*   console.info(`result from "getStateByPartialCompositeKey('bmes',['wip'])" type: ${typeof (result)} \n  and value: ${JSON.stringify(result, null, 4)}`);
            content of result
            {   "value": {
                        "key": "\u0000bmes\u0000Wip\u00001000\u00001\u00001000\u0000",
                        "value": { "type": "Buffer", "data": [...]}
                        },
                "done": false
            }
            */

            let list_Wip_NotBindingToCarrier = {}; 
            while (!result.done) {
                // get value from result
                const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
                let obj_wipState = Object.assign(new WipState(null, null), JSON.parse(strValue));
                /*   console.info(`obj_wipState type: ${typeof (obj_wipState)} \n  and value: ${JSON.stringify(obj_wipState, null, 4)}`);
                   obj_wipState type: object and value: {"CurrentTransitionID":"10","BindingWithCarrier":null}
                */

                if (obj_wipState.BindingWithCarrier == null) {
                    const wip_key = result.value.key;
                    list_Wip_NotBindingToCarrier[wip_key] = obj_wipState;
                }
                result = await iterator.next();
            }       

            //if list_Wip_NoCarrier is empty, report a CheckInResponse with 'No' on_duty
            const keys = Object.keys(list_Wip_NotBindingToCarrier);
            if (keys.length == 0) {   
                return  JSON.stringify(new CheckInMessage("No",'','','The check-in carrier is free but no wip can be binded with it'));
            }

            //else select the index of the first wo if list_wo_waiting is not empty. 
            //wip.state += carrier id
            const binding_wip_key = keys[0];
            let binding_wip_state = list_Wip_NotBindingToCarrier[binding_wip_key];
            binding_wip_state.BindingWithCarrier = str_carrier_id;            
            await ctx.stub.putState(binding_wip_key, Buffer.from(JSON.stringify(binding_wip_state)));



            const splited_wip_key = ctx.stub.splitCompositeKey(binding_wip_key);
            /* 
              console.info(`splited_wip_key type: ${typeof (splited_wip_key)} \n  and value: ${JSON.stringify(splited_wip_key, null, 4)}`);
            splited_wip_key type: object and value: {
                "objectType": "bmes",
                    "attributes": [
                        "Wip",
                        "1000",
                        "1",
                        "1000"
                    ]
            }*/



            let work_term_info = splited_wip_key.attributes
            work_term_info.push('10'); 
            work_term_info[0] = "WorkTerm";
            
              console.info(`work_term_info type: ${typeof (work_term_info)} \n  and value: ${JSON.stringify(work_term_info, null, 4)}`);
            // work_term_info type: object and value: ["WorkTerm", "1000", "1", "1000", "10"]
            const wt_as_state = new WorkTermId(work_term_info[1], work_term_info[2], work_term_info[3], work_term_info[4]);

            //const work_term_key = await ctx.stub.getStateByPartialCompositeKey('bmes', work_term_info);
            //carrier.state += work term id
            carrierState.Status = "busy";
            carrierState.CurrentWorkTermId = wt_as_state;

            //update carrier state
            await ctx.stub.putState(key_carrier, JSON.stringify(carrierState));

            //carrierState.CurrentWorkTermId = await ctx.stub.getStateByPartialCompositeKey('bmes', ['Wip']);
        } //end if carrierState.Status == "free"


        // carrierState.status is busy

        // get workplan data
        const buffer_wp_response = await ctx.stub.invokeChaincode('bmes-mgmt', ['GetWorkPlan', carrierState.CurrentWorkTermId.WP_id], 'channelmgmt');
        if (buffer_wp_response.status != 200) {
              console.info(JSON.stringify(buffer_wp_response));
            return JSON.stringify(buffer_wp_response);
        }
        const obj_wp_payload = JSON.parse(JSON.stringify(buffer_wp_response.payload));
        const obj_wp = JSON.parse(String.fromCharCode.apply(null, obj_wp_payload.data));
          console.info(`\tGet Work Plan ${obj_wp} with ${carrierState.CurrentWorkTermId.WP_id} ,and content: ${JSON.stringify(obj_wp, null, 4)}`);
        /* example of obj_wp
           {
             "ID": "1000",
             "TransitionList": {
               "10": {
                 "ID": "10",
                 "WorkStation": "ASRS",
                 "Function": "2",
                 "Parameter": "210",
                 "OK_To": "20",
                 "NOK_To": "99"
               },
               "20": {
                 "ID": "20",
                 "WorkStation": "Magazine",
                 "Function": "",
                 "Parameter": "",
                 "OK_To": "30",
                 "NOK_To": "99"
               }
           }
        */

        // get transition data
        const used_transition = obj_wp.TransitionList[carrierState.CurrentWorkTermId.Tran_id];
        const planned_workstation = used_transition.WorkStation;

         // if start machine is not check-in machine, report a CheckInResponse with 'No' on_duty
        if (str_workstation_name != planned_workstation){
             return  JSON.stringify(new CheckInMessage("No",'','',`${str_workstation_name} does not serve the present transition of the carrier`));
        }

        // if all is ok, return recipe to slave Dapp
        const planned_function = used_transition.Function;
        const planned_parameter = used_transition.Parameter;

        let msg = new CheckInMessage('Yes', planned_function.toString(), planned_parameter.toString(), `Carrier ${str_carrier_id} checkin ${planned_workstation} to execute func ${planned_function} with parameters ${planned_parameter}` )
        return JSON.stringify(msg);     
    }
    


    async ReportTransitionStart(ctx, str_carrier_id, str_machine_name){

          console.info(`=== Function ReportTransitionStart() is executed ===`);

        //find transition data from carrier state
        const key_carrier = ctx.stub.createCompositeKey('bmes', ['carrier',str_carrier_id]);
        let buf_state_carrier = await ctx.stub.getState(key_carrier);
            if (!buf_state_carrier || buf_state_carrier.length === 0) {
                return JSON.stringify(new CheckInMessage('No','','',`The carrier ${str_carrier_id} does not exist`));
            }
        let str_state_carrier = Buffer.from(buf_state_carrier);
          console.info(`str_state_carrier type: ${typeof(str_state_carrier)} \n  and value: ${JSON.stringify(str_state_carrier, null, 4)}`);
        let obj_state_carrier = JSON.parse(str_state_carrier);
          console.info(`obj_state_carrier type: ${typeof(obj_state_carrier)} \n  and value: ${JSON.stringify(obj_state_carrier, null, 4)}`);
        //obj_WoOfCarrier type: object  and value: {"Status": "free","TransitionInfo": null}

        const curWorkTermId = Object.assign(new WorkTermId(), obj_state_carrier.CurrentWorkTermId); 
          console.info(`curWorkTermId type: ${typeof (curWorkTermId)} \n  and value: ${JSON.stringify(curWorkTermId, null, 4)}`);

        const wt_id_info = curWorkTermId.ToArray();
        const key_curWorkTermId = ctx.stub.createCompositeKey('bmes', wt_id_info);

        let buf_state_workTerm = await ctx.stub.getState(key_curWorkTermId);
          console.info(`buf_state_workTerm type: ${typeof (buf_state_workTerm)} \n  and value: ${JSON.stringify(buf_state_workTerm, null, 4)}`);
        let str_state_workTerm = Buffer.from(buf_state_workTerm);
          console.info(`str_state_workTerm type: ${typeof (str_state_workTerm)} \n  and value: ${JSON.stringify(str_state_workTerm, null, 4)}`);
        let obj_state_workTerm = JSON.parse(str_state_workTerm);
          console.info(`obj_state_workTerm type: ${typeof (obj_state_workTerm)} \n  and value: ${JSON.stringify(obj_state_workTerm, null, 4)}`);

        //update starting 
        obj_state_workTerm.Start = new Date().toISOString();
          console.info(`444`);

        let res = await ctx.stub.putState(key_curWorkTermId, Buffer.from(JSON.stringify(obj_state_workTerm)));
          console.info(`447`);
        let message = new ProductionMessage(str_machine_name, "contract", "proc_start", curWorkTermId );
        await ctx.stub.setEvent('StartEvent', Buffer.from(JSON.stringify(message)));
          console.info(`=== Function ReportTransitionStart() is done ===`);
    }
    

    async ReportTransitionEnd(ctx, str_carrier_id, str_machine_name){

          console.info(`=== Function ReportTransitionEnd() is executed ===`);

        //find transition data from carrier state
        const key_carrier = ctx.stub.createCompositeKey('bmes', ['carrier', str_carrier_id]);
        let buf_state_carrier = await ctx.stub.getState(key_carrier);
        if (!buf_state_carrier || buf_state_carrier.length === 0) {
            return JSON.stringify(new CheckInMessage('No', '', '', `The carrier ${str_carrier_id} does not exist`));
        }
        let str_state_carrier = Buffer.from(buf_state_carrier);
          console.info(`str_state_carrier type: ${typeof (str_state_carrier)} \n  and value: ${JSON.stringify(str_state_carrier, null, 4)}`);

        let obj_state_carrier = JSON.parse(str_state_carrier);
          console.info(`obj_state_carrier type: ${typeof (obj_state_carrier)} \n  and value: ${JSON.stringify(obj_state_carrier, null, 4)}`);
        //obj_WoOfCarrier type: object  and value: {"Status": "free","TransitionInfo": null}

        const curWorkTermId = Object.assign(new WorkTermId(), obj_state_carrier.CurrentWorkTermId);
          console.info(`curWorkTermId type: ${typeof (curWorkTermId)} \n  and value: ${JSON.stringify(curWorkTermId, null, 4)}`);

        const wt_id_info = curWorkTermId.ToArray();
        const key_curWorkTermId = ctx.stub.createCompositeKey('bmes', wt_id_info);

        let buf_state_workTerm = await ctx.stub.getState(key_curWorkTermId);
          console.info(`buf_state_workTerm type: ${typeof (buf_state_workTerm)} \n  and value: ${JSON.stringify(buf_state_workTerm, null, 4)}`);
        let str_state_workTerm = Buffer.from(buf_state_workTerm);
          console.info(`str_state_workTerm type: ${typeof (str_state_workTerm)} \n  and value: ${JSON.stringify(str_state_workTerm, null, 4)}`);
        let obj_state_workTerm = JSON.parse(str_state_workTerm);
          console.info(`obj_state_workTerm type: ${typeof (obj_state_workTerm)} \n  and value: ${JSON.stringify(obj_state_workTerm, null, 4)}`);

        //update starting 
        obj_state_workTerm.End = new Date().toISOString();

        let res = await ctx.stub.putState(key_curWorkTermId, Buffer.from(JSON.stringify(obj_state_workTerm)));
        let message = new ProductionMessage(str_machine_name, "contract", "proc_start", curWorkTermId);
        await ctx.stub.setEvent('StartEvent', Buffer.from(JSON.stringify(message)));
          console.info(`=== Function ReportTransitionEnd() is done ===`);
    }





    async ChectOut(ctx, str_carrier_id, str_machine_name){

          console.info(`=== Function ChectOut() is executed ===`);

        //find carrier state
        const key_carrier = ctx.stub.createCompositeKey('bmes', ['carrier', str_carrier_id]);
        let buf_state_carrier = await ctx.stub.getState(key_carrier);
        if (!buf_state_carrier || buf_state_carrier.length === 0) {
            return JSON.stringify(new CheckInMessage('No', '', '', `The carrier ${str_carrier_id} does not exist`));
        }
        let str_state_carrier = Buffer.from(buf_state_carrier);
              console.info(`str_state_carrier type: ${typeof (str_state_carrier)} \n  and value: ${JSON.stringify(str_state_carrier, null, 4)}`);
        let obj_state_carrier = JSON.parse(str_state_carrier);
              console.info(`obj_state_carrier type: ${typeof (obj_state_carrier)} \n  and value: ${JSON.stringify(obj_state_carrier, null, 4)}`);

        //find workterm state
        const curWorkTermId = Object.assign(new WorkTermId(), obj_state_carrier.CurrentWorkTermId);
              console.info(`curWorkTermId type: ${typeof (curWorkTermId)} \n  and value: ${JSON.stringify(curWorkTermId, null, 4)}`);
        const wt_id_info = curWorkTermId.ToArray();
        const key_curWorkTermId = ctx.stub.createCompositeKey('bmes', wt_id_info);
        let buf_state_workTerm = await ctx.stub.getState(key_curWorkTermId);
              console.info(`buf_state_workTerm type: ${typeof (buf_state_workTerm)} \n  and value: ${JSON.stringify(buf_state_workTerm, null, 4)}`);
        let str_state_workTerm = Buffer.from(buf_state_workTerm);
              console.info(`str_state_workTerm type: ${typeof (str_state_workTerm)} \n  and value: ${JSON.stringify(str_state_workTerm, null, 4)}`);
        let obj_state_workTerm = JSON.parse(str_state_workTerm);
              console.info(`obj_state_workTerm type: ${typeof (obj_state_workTerm)} \n  and value: ${JSON.stringify(obj_state_workTerm, null, 4)}`);

        //get work plan
        const buffer_workpla_response = await ctx.stub.invokeChaincode('bmes-mgmt', ['GetWorkPlan', curWorkTermId.WP_id], 'channelmgmt');  
        if (buffer_workpla_response.status != 200) {
              console.info(JSON.stringify(buffer_workpla_response));
            return JSON.stringify(buffer_workpla_response);
        }
        const obj_wp_payload = JSON.parse(JSON.stringify(buffer_workpla_response.payload));
        const str_wp_data = String.fromCharCode.apply(null, obj_wp_payload.data);
        const obj_wp = JSON.parse(str_wp_data);        

        //next state
        const next_tran_id = obj_wp.TransitionList[curWorkTermId.Tran_id].OK_To;
          console.info(`next_tran_id type: ${typeof (next_tran_id)}  and value: ${JSON.stringify(next_tran_id, null, 4)}`);

        // update carrier state
        let nextWorkTermId = curWorkTermId;
        nextWorkTermId.Tran_id = next_tran_id;
        obj_state_carrier.CurrentWorkTermId = nextWorkTermId;
        let buffer_state_carrier_response = await ctx.stub.putState(key_carrier, Buffer.from(JSON.stringify(obj_state_carrier)));
        if (buffer_state_carrier_response.status != 200) {
              console.info(JSON.stringify(buffer_state_carrier_response));
            return JSON.stringify(buffer_state_carrier_response);
        }

        // update wip state
        const wip_id = new WipId(nextWorkTermId.SO_id, nextWorkTermId.Term_id, nextWorkTermId.WP_id);
        const wip_id_info = wip_id.ToArray();
        const key_wip = ctx.stub.createCompositeKey('bmes', wip_id_info); //generate composite key for wip key
        let buf_state_wip = await ctx.stub.getState(key_wip);
          console.info(`buf_state_wip type: ${typeof (buf_state_wip)} \n  and value: ${JSON.stringify(buf_state_wip, null, 4)}`);
        let str_state_wip = Buffer.from(buf_state_wwi);
          console.info(`str_state_wi type: ${typeof (str_state_wip)} \n  and value: ${JSON.stringify(str_state_wip, null, 4)}`);
        let obj_state_wip = JSON.parse(str_state_wip);
          console.info(`obj_state_workTerm type: ${typeof (obj_state_wip)} \n  and value: ${JSON.stringify(obj_state_wip, null, 4)}`);

        obj_state_wip.CurrentTransitionID = next_tran_id;
        let buffer_state_wip_response = await ctx.stub.putState(key_wip, Buffer.from(JSON.stringify(obj_state_wip)));
        if (buffer_state_wip_response.status != 200) {
              console.info(JSON.stringify(buffer_state_wip_response));
            return JSON.stringify(buffer_state_wip_response);
        }

        let nextMachine = obj_wp.TransitionList[next_tran_id];

        let msg = new CheckOutMessage(nextMachine,`The transition is done. The next transition will be performed at Machine ${nextMachine}` );
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

    async GetAllObject(ctx) {
        // prepare a buffer
        const allResults = [];

        // get all states by keys composited with 'workplan'
        const iterator = await ctx.stub.getStateByPartialCompositeKey('bmes', []);

        // get first results
        let result = await iterator.next();
        while (!result.done) {
            // get value from result
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');

            // try parse value
            let Value;
            try {
                Value = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                Value = strValue;
            }

            // get key from result
            const key = result.value.key;

            // create an object that includes both the key and the value
            const resultObject = {
                key: key,
                value: Value
            };

            //put value into buffer
            allResults.push(resultObject);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

}

module.exports = BMES_PROD;