'use strict';

const { Contract } = require('fabric-contract-api');
const { SalesOrderStateAtProd, WorkOrderId, WorkOrderState, CarrierState, WorkTermId, WorkTermState, ProductionMessage, CheckInMessage, CheckOutMessage } = require('./prod_util');
const { PromisePayloadToObject, BufferToObject } = require('./tool_util');

const woindex = 'workorder';

const DEBUG_MODE = true;
function showMsg(key) {
    if (DEBUG_MODE) {
        console.info(key.toString());
    }
}

class BMES_PROD extends Contract {
    async InitCarrier(ctx) {
        const str_mspid = await ctx.stub.getMspID();
        showMsg('============= START : InitCarrier =============');
        // carrier doc is designed to hold TransitionInfo 
        const carrierState = new CarrierState('free', null);
        for (let i = 1; i <= 10; i++) {
            let key = ctx.stub.createCompositeKey('bmes', ['carrier', i.toString()]);
            await ctx.stub.putState(key, JSON.stringify(carrierState));
            //  showMsg(`Generate carrier doc # ${i}`);          
        }
        showMsg(`MspID: ${str_mspid} initialize Carrier ID`);
        showMsg('============= END : InitCarrier =============');
    }

    //start up a sales order with its id (string format)
    async StartSaleOrder(ctx, so_id, str_ISO8601_timestamp) {
        showMsg('============= START : StartSaleOrder =============');

        //從bmes-mgmt通道取出so ( get sales order object by id from mgmt chaincode)
        const buffer_so_response = await ctx.stub.invokeChaincode('bmes-mgmt', ['GetSalesOrder', so_id], 'channelmgmt');
        if (buffer_so_response.status != 200) {
            return JSON.stringify({ status: buffer_so_response.status });
        }

        const obj_so = PromisePayloadToObject(buffer_so_response, "StartSaleOrder-41");
        showMsg(`obj_so type: ${typeof (obj_so)} and value: ${JSON.stringify(obj_so, null, 4)}`); //confirm in docker container if necessary
        /*  example of obj_so
             {  "ID":"1000", 
                "SalesTerms":
                 { "1":{ "ID":"1", "ProductName":"Product 1000", "RefWorkPlan":"1000",}, 
                   "2":{ "ID":"2", "ProductName":"Product 1000", "RefWorkPlan":"1000",}  },
             } */
  
        //Start preparing  wip and transition ids, composed by so_id (ready), term_id, wp_id, tran_id

        //創造SalesOrderStateAtProd，並給予開工時間
        let so_state = new SalesOrderStateAtProd();
        so_state.Start = str_ISO8601_timestamp;
        so_state.Condition = "Started";
        const so_key = ctx.stub.createCompositeKey('bmes', ["salesorderstateatprod", so_id]);
        await ctx.stub.putState(so_key, Buffer.from(JSON.stringify(so_state)));

        //loop to find out salesterm id and its workplan id
        const keys_sales_term = Object.keys(obj_so.SalesTerms);
        showMsg(`num of terms: ${keys_sales_term.length}`);
        for (let iter_st = 0; iter_st < keys_sales_term.length; iter_st++) {
            let str_sales_term_id = keys_sales_term[iter_st]; // it is a key
            const obj_salesTerms = obj_so.SalesTerms[str_sales_term_id];
            showMsg(`Sales term id ${str_sales_term_id}: Ref work plan: ${obj_salesTerms.RefWorkPlan}`)

            // term_id (ready), wp_id (ready)
            const str_wp_id = obj_salesTerms.RefWorkPlan.toString();
            //Be preparing wip and transition ids, composed by so_id (ready), term_id (ready), wp_id (ready), tran_id (not yet)

            // 創建 work order 並上傳到ledger
            const wo_id = new WorkOrderId(so_id, str_sales_term_id);
            const wo_id_partialkey = wo_id.ToArray();
            showMsg(`wo_id_partialkey type: ${typeof (wo_id_partialkey)} and value: ${JSON.stringify(wo_id_partialkey, null, 4)}`); //confirm in docker container if necessary
            const wo_key = ctx.stub.createCompositeKey('bmes', wo_id_partialkey); //generate composite key for wip key
            const wo_state = new WorkOrderState(); // initialized with default condition
            wo_state.Condition = "Started";
            wo_state.CurrentTransitionID = "init"; //assign first step
            wo_state.ReferedWorkPlan = str_wp_id;
            showMsg(`wo_state type: ${typeof (wo_state)} and value: ${JSON.stringify(wo_state, null, 4)}`); 
            await ctx.stub.putState(wo_key, Buffer.from(JSON.stringify(wo_state))); 

            // decompose work plan object to find out tranistion info
            showMsg("97");
            const buffer_wp_response = await ctx.stub.invokeChaincode('bmes-mgmt', ['GetWorkPlan', str_wp_id], 'channelmgmt');
            if (buffer_wp_response.status != 200) {
                showMsg(JSON.stringify(buffer_wp_response));
                return JSON.stringify(buffer_wp_response);
            }
            const obj_wp = PromisePayloadToObject(buffer_wp_response, "StartSaleOrder-103");
            showMsg(`\tGet Work Plan ${obj_wp} ,and content: ${JSON.stringify(obj_wp, null, 4)}`);
            /* example of obj_wp
               { "ID": "1000",
                 "TransitionList": {
                   "10": { "ID": "10", "WorkStation": "ASRS",    "Function": "2", "Parameter": "210", "OK_To": "20","NOK_To": "99"  },
                   "20": { "ID": "20", "WorkStation": "Magazine", "Function": "", "Parameter": "",    "OK_To": "30","NOK_To": "99"  }
               } */

            // find tranisition definitions in work plan object
            const array_transition = Object.values(obj_wp.TransitionList);

            // loop to get transition ids to create work order terms
            // A work term is composed of transition id and its state

            showMsg(`num of transition: ${array_transition.length}`);
            for (let iter_transition = 0; iter_transition < array_transition.length; iter_transition++) {
                showMsg(`\t\ttotal transiitions :${array_transition.length}, current index: ${iter_transition}`);
                const obj_tran = array_transition[iter_transition];
                //  showMsg(`\t\tobj_tran content: ${JSON.stringify(obj_tran, null, 4)}`);
                // tran_id (ready)
                const str_tran_id = obj_tran.ID;

                // create work term with its key and state, and then commit these to ledger
                showMsg("114 create work term with its key and state, and then commit these to ledger")
                const wt_id = new WorkTermId(so_id, str_sales_term_id, str_tran_id);
                const wt_id_info = wt_id.ToArray();
                const key_wt = ctx.stub.createCompositeKey('bmes', wt_id_info);
                const wt_state = new WorkTermState();
                await ctx.stub.putState(key_wt, Buffer.from(JSON.stringify(wt_state)));

            }//end of array_transition loop                    
        }//end of  obj_so.SalesTerms loop
        showMsg('============= END : StartSaleOrder =============');
    }

    async PendSalesOrder(ctx, so_id) {
        showMsg('============= START : PendSalesOrder =============');

        // 檢查銷售訂單是否存在
        const so_key = ctx.stub.createCompositeKey('bmes', ["salesorderstateatprod", so_id]);
        const so_json = await ctx.stub.getState(so_key);
        if (!so_json || so_json.length === 0) {
            throw new Error(`The sales order ${so_id} does not exist`);
        }

        // 將銷售訂單的狀態設置為'Pending'
        let so_state = JSON.parse(so_json.toString());
        so_state.Condition = "Pending";

        // 更新銷售訂單的狀態到分布式账本
        await ctx.stub.putState(so_key, Buffer.from(JSON.stringify(so_state)));

        // 檢查所有相關的工作訂單並將其狀態設置為'Pending'
        const iterator = await ctx.stub.getStateByPartialCompositeKey('bmes', ['workorder']);
        let result = await iterator.next();
        while (!result.done) {
            const wo_key = result.value.key;
            const splited_wo_key = ctx.stub.splitCompositeKey(wo_key);
            const wo_json = result.value.value.toString();
            let wo_state = JSON.parse(wo_json);
            showMsg(`wo_state type: ${typeof (wo_state)} \n  and value: ${JSON.stringify(wo_state, null, 4)}`);
            if (splited_wo_key.attributes[1] == so_id) {
                wo_state.Condition = "Pending";
                await ctx.stub.putState(wo_key, Buffer.from(JSON.stringify(wo_state)));
                showMsg(`wo_state.Condition is changed to "Pending"`);
            }
            result = await iterator.next();
        }

        showMsg('============= END : PendSalesOrder =============');
    }

    async CommitEngineeringChangeOrder(ctx, salesOrderId, salesTermId, newWorkPlanId) {
        showMsg('============= START : CommitEngineeringChangeOrder =============');


        showMsg('============= END : CommitEngineeringChangeOrder =============');
    }
    


    async GetSaleOrderStateAtProd(ctx, so_id) {
        showMsg('============= START : GetSaleOrderStateAtProd =============');

        const so_key = await ctx.stub.createCompositeKey('bmes', ["salesorderstateatprod", so_id]);
        const so_json = await ctx.stub.getState(so_key);
        showMsg(`so_json type: ${typeof (so_json)} \n  and value: ${JSON.stringify(so_json, null, 4)}`);
        return so_json.toString();
        showMsg('============= END : GetSaleOrderStateAtProd =============');
    }

    // when a carrier gets into a mahchine
    async CheckIn(ctx, str_carrier_id, str_workstation_name, str_ISO8601_timestamp) {
        showMsg('============= START : CheckIn =============');

        // 檢查搬運車是否存在
        const key_carrier = ctx.stub.createCompositeKey('bmes', ['carrier', str_carrier_id]);
        const buf_carrierState = await ctx.stub.getState(key_carrier);
        if (!buf_carrierState || buf_carrierState.length === 0) {
            return JSON.stringify(new CheckInMessage('No', '', '', `The carrier ${str_carrier_id} does not exist`));
        }
        const obj_carrierState = BufferToObject(buf_carrierState);
        const carrierState = Object.assign(new CarrierState(null, null), obj_carrierState);

        showMsg(`153 init carrierState type: ${typeof (carrierState)} \n  and value: ${JSON.stringify(carrierState, null, 4)}`);

        if (carrierState.Condition == "free")//no task in the carrier => try to assign a task
        {
            showMsg(" ** Try to assign a task to carrier ** ")
            //try to find possible wip
            const iterator = await ctx.stub.getStateByPartialCompositeKey('bmes', ['workorder']);
            let result = await iterator.next();
            /*   showMsg(`result from "getStateByPartialCompositeKey('bmes',['workorder'])" type: ${typeof (result)} \n  and value: ${JSON.stringify(result, null, 4)}`);
            content of result
            {   "value": {
                        "key": "\u0000bmes\u0000Wip\u00001000\u00001\u00001000\u0000",
                        "value": { "type": "Buffer", "data": [...]}
                        },
                "done": false
            }
            */

            //取出所有沒有綁定的WO
            let list_Wo_NotBindingToCarrier = {};
            while (!result.done) {
                // get value from result
                const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
                let wo_state = Object.assign(new WorkOrderState(null, null), JSON.parse(strValue));
                /*   showMsg(`obj_wipState type: ${typeof (obj_wipState)} \n  and value: ${JSON.stringify(obj_wipState, null, 4)}`);
                   obj_wipState type: object and value: {"CurrentTransitionID":"10","BindingWithCarrier":null}
                */

                if (wo_state.BindingWithCarrier == null && wo_state.Condition == "Started") {
                    const wo_key = result.value.key;
                    list_Wo_NotBindingToCarrier[wo_key] = wo_state;
                }
                result = await iterator.next();
            }

            //if list_Wo_NotBindingToCarrier is empty, report a CheckInResponse with 'No' on_duty
            const keys = Object.keys(list_Wo_NotBindingToCarrier);
            if (keys.length == 0) {
                return JSON.stringify(new CheckInMessage("No", '', '', 'The check-in carrier is free but no suitable work order can be binded with it'));
            }

            //else select the index of the first wo if list_wo_waiting is not empty. 
            //initialize work order state
            const binding_wo_key = keys[0];
            let binding_wo_state = list_Wo_NotBindingToCarrier[binding_wo_key];
            binding_wo_state.BindingWithCarrier = str_carrier_id;
            binding_wo_state.Start = str_ISO8601_timestamp;

            //檢查
            //1. init 的transition是否完成?
            //2. 順著找出workterm，看看是否有re開頭的transition

            //binding_wo_state.CurrentTransitionID = "init";  //這行應該有值
            showMsg(`binding_wo_state CurrentTransitionID = ${binding_wo_state.CurrentTransitionID}`);

            // update work order state
            await ctx.stub.putState(binding_wo_key, Buffer.from(JSON.stringify(binding_wo_state)));
            showMsg(`work order ${binding_wo_key} is binded to carrier ${str_carrier_id}`);

            //initialize work terms in the work order
            const splited_wo_key = ctx.stub.splitCompositeKey(binding_wo_key);
            /* 
              showMsg(`splited_wip_key type: ${typeof (splited_wip_key)} \n  and value: ${JSON.stringify(splited_wip_key, null, 4)}`);
            splited_wip_key type: object and value: {
                "objectType": "bmes",
                    "attributes": [ "workorder","1000", "1", "1000"   ]
            }*/

            let cur_transition_id = binding_wo_state.CurrentTransitionID;
            let work_term_info = splited_wo_key.attributes
            //work_term_info.push('init'); 
            work_term_info.push(cur_transition_id);
            work_term_info[0] = "WorkTerm";

            showMsg(`work_term_info type: ${typeof (work_term_info)} \n  and value: ${JSON.stringify(work_term_info, null, 4)}`);
            // work_term_info type: object and value: ["WorkTerm", "1000", "1", "1000", "10"]
            const worktermid = new WorkTermId(work_term_info[1], work_term_info[2], work_term_info[3], work_term_info[4]);

            //update carrier state
            carrierState.Condition = "busy";
            carrierState.CurrentWorkTermId = worktermid;
            showMsg(`updated carrierState type: ${typeof (carrierState)} \n  and value: ${JSON.stringify(carrierState, null, 4)}`);
            await ctx.stub.putState(key_carrier, JSON.stringify(carrierState));

        }//end if carrierState.Status == "free"

        if (carrierState.Condition == "busy") {
            // 檢查工作訂單的狀態
            const wo_id = new WorkOrderId(carrierState.CurrentWorkTermId.SO_id, carrierState.CurrentWorkTermId.Term_id);
            const wo_partialkey = wo_id.ToArray();
            const wo_key = ctx.stub.createCompositeKey('bmes', wo_partialkey);
            const buf_wo_state = await ctx.stub.getState(wo_key);
            const obj_wo_state = BufferToObject(buf_wo_state);
            const wo_state = Object.assign(new WorkOrderState(null, null), obj_wo_state);

            // 如果工作訂單的狀態是'Pending'，則回傳暫停訊息
            if (wo_state.Condition == "Pending") {
                return JSON.stringify(new CheckInMessage('No', '', '', `The work order on carrier ${str_carrier_id} is pending and does not need to perform any action`));
            }

            // carrierState.status is busy
            // get workplan data
            const refer_wp = wo_state.ReferedWorkPlan;
            const buffer_wp_response = await ctx.stub.invokeChaincode('bmes-mgmt', ['GetWorkPlan', refer_wp], 'channelmgmt');
            if (buffer_wp_response.status != 200) {
                showMsg(JSON.stringify(buffer_wp_response));
                return JSON.stringify(buffer_wp_response);
            }
            const obj_wp = PromisePayloadToObject(buffer_wp_response, "CheckIn-258");
            showMsg(`obj_wp type: ${typeof (obj_wp)} \n  and value: ${JSON.stringify(obj_wp, null, 4)}`);

            /* example of obj_wp
             { "ID": "1000",
               "TransitionList": {
                 "10": { "ID": "10", "WorkStation": "ASRS", "Function": "2", "Parameter": "210", "OK_To": "20", "NOK_To": "99" },
                 "20": { "ID": "20", "WorkStation": "Magazine",  "Function": "",   "Parameter": "", "OK_To": "30", "NOK_To": "99" }  }
            */

            // get transition data
            const used_transition = obj_wp.TransitionList[carrierState.CurrentWorkTermId.Tran_id];
            showMsg(`used_transition type: ${typeof (used_transition)} \n  and value: ${JSON.stringify(used_transition, null, 4)}`);
            const planned_workstation = used_transition.WorkStation;

            // if start machine is not check-in machine, report a CheckInResponse with 'No' on_duty
            if (str_workstation_name != planned_workstation) {
                return JSON.stringify(new CheckInMessage("No", '', '', `${str_workstation_name} does not serve the present transition of the carrier`));
            }

            // if all is ok, return recipe to slave Dapp
            const planned_function = used_transition.Function;
            const planned_parameter = used_transition.Parameter;

            let msg = new CheckInMessage('Yes', planned_function.toString(), planned_parameter.toString(), `Carrier ${str_carrier_id} checkin ${planned_workstation} to execute func ${planned_function} with parameters ${planned_parameter}`)
            showMsg('============= END : CheckIn =============');
            return JSON.stringify(msg);
        }
    }



    async ReportTransitionStart(ctx, str_carrier_id, str_machine_name, str_ISO8601_timestamp) {
        showMsg('============= START : ReportTransitionStart =============');

        //find transition data from carrier state
        const key_carrier = ctx.stub.createCompositeKey('bmes', ['carrier', str_carrier_id]);
        let buf_state_carrier = await ctx.stub.getState(key_carrier);
        if (!buf_state_carrier || buf_state_carrier.length === 0) {
            return JSON.stringify(new CheckInMessage('No', '', '', `The carrier ${str_carrier_id} does not exist`));
        }
        let obj_state_carrier = BufferToObject(buf_state_carrier, "ReportTransitionStart-310");
        //obj_state_carrier type: object  and value: {"Status": "free","TransitionInfo": null}

        const curWorkTermId = Object.assign(new WorkTermId(), obj_state_carrier.CurrentWorkTermId);
        //  showMsg(`curWorkTermId type: ${typeof (curWorkTermId)} \n  and value: ${JSON.stringify(curWorkTermId, null, 4)}`);

        const wt_id_partial_key = curWorkTermId.ToArray();
        const key_curWorkTermId = ctx.stub.createCompositeKey('bmes', wt_id_partial_key);

        let buf_state_workTerm = await ctx.stub.getState(key_curWorkTermId);
        let obj_state_workTerm = BufferToObject(buf_state_workTerm, "ReportTransitionStart-320");

        //update work term state with start time 
        obj_state_workTerm.Start = str_ISO8601_timestamp;

        let res = await ctx.stub.putState(key_curWorkTermId, Buffer.from(JSON.stringify(obj_state_workTerm)));
        let message = new ProductionMessage(str_machine_name, "contract", "proc_start", curWorkTermId);
        //await ctx.stub.setEvent('StartEvent', Buffer.from(JSON.stringify(message)));
        showMsg('============= END : ReportTransitionStart =============');
    }


    async ReportTransitionEnd(ctx, str_carrier_id, str_machine_name, str_ISO8601_timestamp) {

        showMsg('============= START : ReportTransitionEnd =============');

        //find transition data from carrier state
        const key_carrier = ctx.stub.createCompositeKey('bmes', ['carrier', str_carrier_id]);
        let buf_state_carrier = await ctx.stub.getState(key_carrier);
        if (!buf_state_carrier || buf_state_carrier.length === 0) {
            return JSON.stringify(new CheckInMessage('No', '', '', `The carrier ${str_carrier_id} does not exist`));
        }

        let obj_state_carrier = BufferToObject(buf_state_carrier, "353")
        //obj_WoOfCarrier type: object  and value: {"Status": "free","TransitionInfo": null}

        const curWorkTermId = Object.assign(new WorkTermId(), obj_state_carrier.CurrentWorkTermId);
        showMsg(`curWorkTermId type: ${typeof (curWorkTermId)} \n  and value: ${JSON.stringify(curWorkTermId, null, 4)}`);

        const wt_id_partialkey = curWorkTermId.ToArray();
        const key_curWorkTermId = ctx.stub.createCompositeKey('bmes', wt_id_partialkey);

        let buf_state_workTerm = await ctx.stub.getState(key_curWorkTermId);
        let obj_state_workTerm = BufferToObject(buf_state_workTerm, "ReportTransitionEnd-353");

        //update work term state with end time 
        obj_state_workTerm.End = str_ISO8601_timestamp;

        let res = await ctx.stub.putState(key_curWorkTermId, Buffer.from(JSON.stringify(obj_state_workTerm)));
        let message = new ProductionMessage(str_machine_name, "contract", "proc_start", curWorkTermId);
        //await ctx.stub.setEvent('StartEvent', Buffer.from(JSON.stringify(message)));
        showMsg('============= END : ReportTransitionEnd =============');
    }

    async ChectOut(ctx, str_carrier_id, str_machine_name, str_ISO8601_timestamp) {
        showMsg('============= START : ChectOut =============');

        //取得 carrier state
        const key_carrier = ctx.stub.createCompositeKey('bmes', ['carrier', str_carrier_id]);
        let buf_state_carrier = await ctx.stub.getState(key_carrier);
        if (!buf_state_carrier || buf_state_carrier.length === 0) {
            return JSON.stringify(new CheckInMessage('No', '', '', `The carrier ${str_carrier_id} does not exist`));
        }
        let obj_carrierState = BufferToObject(buf_state_carrier, "ChectOut-373");
        let carrierState = Object.assign(new CarrierState(null, null), obj_carrierState);

        //取得 workterm state
        const curWorkTermId = Object.assign(new WorkTermId(), carrierState.CurrentWorkTermId);
        showMsg(`curWorkTermId type: ${typeof (curWorkTermId)} \n  and value: ${JSON.stringify(curWorkTermId, null, 4)}`);
        //const wt_id_info = curWorkTermId.ToArray();
        //const key_curWorkTermId = ctx.stub.createCompositeKey('bmes', wt_id_info);
        //let buf_state_workTerm = await ctx.stub.getState(key_curWorkTermId);
        //let obj_state_workTerm = BufferToObject(buf_state_workTerm, "ChectOut-381");

        //get work plan

        //prepare wo state
        const wo_id = new WorkOrderId(curWorkTermId.SO_id, curWorkTermId.Term_id);
        const wo_partialkey = wo_id.ToArray();
        const wo_key = ctx.stub.createCompositeKey('bmes', wo_partialkey); //generate composite key for wip key
        let buf_wo_state = await ctx.stub.getState(wo_key);
        let obj_wo_state = BufferToObject(buf_wo_state, "ChectOut-380");
        let wo_state = Object.assign(new WorkOrderState, obj_wo_state);
        const work_plan_id = wo_state.ReferedWorkPlan;

        const buffer_workpla_response = await ctx.stub.invokeChaincode('bmes-mgmt', ['GetWorkPlan', work_plan_id], 'channelmgmt');
        if (buffer_workpla_response.status != 200) {
            showMsg(JSON.stringify(buffer_workpla_response));
            return JSON.stringify(buffer_workpla_response);
        }
        const work_plan = PromisePayloadToObject(buffer_workpla_response, "ChectOut-389");

        //next state
        const next_tran_id = work_plan.TransitionList[curWorkTermId.Tran_id].OK_To;
        showMsg(`next_tran_id type: ${typeof (next_tran_id)}  and value: ${JSON.stringify(next_tran_id, null, 4)}`);

        let msg = '';
        if (next_tran_id == "done") {
            showMsg(`work order is done!`);
            //update work order state
            wo_state.End = str_ISO8601_timestamp;
            wo_state.Condition = "End";
            await ctx.stub.putState(wo_key, Buffer.from(JSON.stringify(wo_state)));

            //free carrier
            carrierState.CurrentWorkTermId = null;
            carrierState.Condition = 'free'
            await ctx.stub.putState(key_carrier, JSON.stringify(carrierState));

            //update salesorderstateatprod
            const so_state_at_prod_key = ctx.stub.createCompositeKey('bmes', ["salesorderstateatprod", curWorkTermId.SO_id]);
            let buf_so_state_at_prod = await ctx.stub.getState(so_state_at_prod_key);
            let so_state_at_prod = BufferToObject(buf_so_state_at_prod, "ChectOut-395");
            let obj_so_state_at_prod = Object.assign(new SalesOrderStateAtProd(), so_state_at_prod);

            obj_so_state_at_prod.End = str_ISO8601_timestamp;
            obj_so_state_at_prod.Condition = "End";

            await ctx.stub.putState(so_state_at_prod_key, Buffer.from(JSON.stringify(obj_so_state_at_prod)));

            msg = new CheckOutMessage("", `The transition and work order is done.`);
        }
        else if (next_tran_id == "failed") {
            let msg = new CheckOutMessage("", `Not implemented.`);
        }
        else {
            showMsg(`updating next`);
            let nextWorkTermId = curWorkTermId;
            showMsg(`nextWorkTermId type: ${typeof (nextWorkTermId)}  and value: ${JSON.stringify(nextWorkTermId, null, 4)}`);

            nextWorkTermId.Tran_id = next_tran_id;
            showMsg(`nextWorkTermId type: ${typeof (nextWorkTermId)}  and value: ${JSON.stringify(nextWorkTermId, null, 4)}`);

            //update carrier state
            carrierState.CurrentWorkTermId = nextWorkTermId;
            await ctx.stub.putState(key_carrier, JSON.stringify(carrierState));

            let nextMachine = work_plan.TransitionList[next_tran_id].WorkStation;
            msg = new CheckOutMessage(nextMachine, `The transition is done. The next transition will be performed at WorkStation ${nextMachine}`);
        }
        showMsg('============= END : ChectOut =============');
        return msg;
    }

    async GetWorkOrderState(ctx, so, st) {
        showMsg('============= START : GetWorkOrderState =============');
        const id = new WorkOrderId(so, st);
        const wo_partialkey = id.ToArray();
        const key = ctx.stub.createCompositeKey('bmes', wo_partialkey);
        const res = await ctx.stub.getState(key);
        //showMsg(`res type: ${typeof (res)} and value: ${JSON.stringify(res, null, 4)}`); 
        const res_obj = BufferToObject(res, "GetWorkOrderState");        
        showMsg(`res_obj type: ${typeof (res_obj)} and value: ${JSON.stringify(res_obj, null, 4)}`);
        showMsg('============= END : GetWorkOrderState =============');
        return JSON.stringify(res_obj);
    }

    async GetWorkTermState(ctx, so, st, wp, wt) {
        showMsg('============= START : GetWorkTermState =============');
        const id = new WorkTermId(so, st, wp, wt);
        const wt_partialkey = id.ToArray();
        const key = ctx.stub.createCompositeKey('bmes', wt_partialkey);
        let res = await ctx.stub.getState(key);
        const res_obj  = BufferToObject(res, "GetWorkTermState");
        return JSON.stringify(res_obj);
        showMsg('============= END : GetWorkTermState =============');
    }

    async TestClientCheck(ctx) {
        const proposalCreator = await ctx.stub.getCreator();
        showMsg(`\tGet ProposalCreator ${proposalCreator} ,and content: ${JSON.stringify(proposalCreator, null, 4)}`);
        showMsg(`\tits MSPID ${proposalCreator.mspid} `);

        const str_mspid = await ctx.stub.getMspID();
        showMsg(`\tGet MSPID ${str_mspid} `);
    }

    async TestEventPerformance(ctx, timestamp_ms) {
        const proposalCreator = await ctx.stub.getCreator();
        showMsg(`\tGet ProposalCreator ${proposalCreator} ,and content: ${JSON.stringify(proposalCreator, null, 4)}`);
        showMsg(`\tits MSPID ${proposalCreator.mspid} `);
        const str_mspid = await ctx.stub.getMspID();
        showMsg(`\tGet MSPID ${str_mspid} `);

        const d = new Date();
        let mid_ms = d.getTime().toString();
        let res = { start: timestamp_ms, mid: mid_ms, end: 0 }
        let buf = Buffer.from(JSON.stringify(res));
        showMsg(`\tGet timestamp_ms ${timestamp_ms} ,and content: ${JSON.stringify(res, null, 4)}`);
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