/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */


const { Contract } = require('fabric-contract-api');
const { WorkStation, Transition, WorkPlan, SalesTerm, SalesTermState, SalesOrder, SalesOrderState, SalesOrderStateMessage, SalesTermStateMessage } = require('./mgmt_util')
const { PromisePayloadToObject, BufferToObject } = require('./tool_util');
const { WorkOrderId, WorkOrderState } = require('./prod_util');

const DEBUG_MODE = true;
function showMsg(key) {
    if (DEBUG_MODE) {
        console.info(key.toString());
    }
}

class BMES_MGMT extends Contract {
    //#region WorkStation
    async InitWorkStationDoc(ctx) {
        showMsg('============= START : InitWorkStationDoc ===========');
        const ws = [
            new WorkStation("ASRS", "Store, Retrive", "", 'opc.tcp://172.21.3.1:4840', "OPC UA"),
            new WorkStation("Press", "Press", "", 'opc.tcp://172.21.2.1:4840', "OPC UA"),
            new WorkStation("Magazine", "Magazine", "", 'opc.tcp://172.21.1.1:4840', "OPC UA"),
        ];
        for (const m of ws) {
            let key = ctx.stub.createCompositeKey('bmes', ['workstation', m.Name]);
            showMsg(m.Name + ' key is ' + JSON.stringify(key));
            await ctx.stub.putState(key, Buffer.from(JSON.stringify(m)));
            showMsg(`workstation ${m.Name} data is put into the mgmt legder`);
        }
        showMsg('============= END : InitWorkStationDoc ===========');
    }

    async GetAllWorkStation(ctx) {
        // prepare a buffer
        const allResults = [];

        // get all states by keys composited with 'WorkStation'
        const iterator = await ctx.stub.getStateByPartialCompositeKey('bmes', ['workstation']);

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

            //put value into buffer
            allResults.push(Value);
            result = await iterator.next();
        }
        return JSON.stringify(allResults); //JSON.parse(JSON.stringify(userData))
    }

    async WorkStationExists(ctx, name) {
        //generate composite_key
        let key = ctx.stub.createCompositeKey('bmes', ['workstation', name]);
        //check whether the object WorkStation is or not
        const wsJson = await ctx.stub.getState(key);
        return wsJson && wsJson.length > 0;
    }

    async PostWorkStation(ctx, name, func, parameter, endpoint, protocol) {
        showMsg(`PostWorkStation with ${name}`);
        //generate composite_key
        let key = ctx.stub.createCompositeKey('bmes', ['workstation', name]);
        //check WorkStation exist in ledger or not
        const wsJSON = await ctx.stub.getState(key);
        if (wsJSON && wsJSON.length > 0) {
            throw new Error(`The asset ${name} (type=workstation) already exist`);
        }

        // create WorkStation instance
        const ws = new WorkStation(name, func, parameter, endpoint, protocol);

        // post a new workstation
        return ctx.stub.putState(key, Buffer.from(JSON.stringify(ws)));
    }

    async GetWorkStation(ctx, name) {
        //generate composite_key
        let key = ctx.stub.createCompositeKey('bmes', ['workstation', name]);
        //showMsg(name+ ' key is '+JSON.stringify(key));

        //find state by the composite_key
        const wsJson = await ctx.stub.getState(key);

        //check exist
        if (!wsJson || wsJson.length === 0) {
            throw new Error(`The workstation ${name} does not exist`);
        }

        //show message on channel
        showMsg(name)

        //return information
        return wsJson.toString();
    }

    async UpdateWorkStation(ctx, name, func, parameter, endpoint, protocol) {

        showMsg(`UpdateWorkStation with ${name}`);
        //generate composite_key
        let key = ctx.stub.createCompositeKey('bmes', ['workstation', name]);

        //check WorkStation exist in ledger or not
        const wsJson = await ctx.stub.getState(key);
        if (!wsJson && wsJson.length == 0) {
            throw new Error(`The asset ${name} (type=workstation) does not exist`);
        }

        // create WorkStation instance
        const m = new WorkStation(name, func, parameter, endpoint, protocol);

        // put a new WorkStation
        return ctx.stub.putState(key, Buffer.from(JSON.stringify(m)));
    }

    async DeleteWorkStation(ctx, name) {
        //generate composite_key
        let key = ctx.stub.createCompositeKey('bmes', ['workstation', name]);

        //check WorkStation exist in ledger or not
        const wsJSON = await ctx.stub.getState(key);
        if (!wsJSON && wsJSON.length == 0) {
            throw new Error(`The asset ${name} (type=workstation) does not exist`);
        }

        return ctx.stub.deleteState(key);
    }
    //#endregion

    //#region WorkPlan

    async InitWorkPlanDoc(ctx) {
        showMsg('============= START : InitWorkPlanDoc ===========');
        let workPlan = new WorkPlan("1000", "Demo Product");
        workPlan.AddTransition('init', new Transition("init", 'ASRS', '2', '210', '20', '99'));
        workPlan.AddTransition('20', new Transition("20", 'Magazine', '0', '0', '30', '99'));
        workPlan.AddTransition('30', new Transition("30", 'Press', '5', '5', '40', '99'));
        workPlan.AddTransition('40', new Transition("40", 'ASRS', '1', '1210', 'done', 'done'));
        workPlan.AddTransition('99', new Transition("99", 'ASRS', '1', '9210', 'failed', 'failed'));

        let key = ctx.stub.createCompositeKey('bmes', ['workplan', workPlan.ID]);
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(workPlan)));
        showMsg(`Work Plan ${workPlan.ID} ${workPlan.Product} data is put into the mgmt legder`);
        showMsg('============= END : InitWorkPlanDoc ===========');
    }

    async GetWorkPlan(ctx, id) {
        //generate composite_key
        let key = ctx.stub.createCompositeKey('bmes', ['workplan', id]);

        //find state by the composite_key
        const wpJSON = await ctx.stub.getState(key);

        //check whether workplan exist or not
        if (!wpJSON || wpJSON.length === 0) {
            throw new Error(`The workplan ${id} does not exist`);
            //return wpJSON = "{}"; 
        }

        //return information
        return wpJSON.toString();
    }

    async GetAllWorkPlan(ctx) {
        // prepare a buffer
        const allResults = [];

        // get all states by keys composited with 'workplan'
        const iterator = await ctx.stub.getStateByPartialCompositeKey('bmes', ['workplan']);

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

            //put value into buffer
            allResults.push(Value);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    async PostWorkPlan(ctx, wp_json) {
        const wp = JSON.parse(wp_json);
        const id = wp.ID;
        let key = ctx.stub.createCompositeKey('bmes', ['workplan', id]);
        const wpJsonInLedger = await ctx.stub.getState(key);

        if (!wpJsonInLedger || wpJsonInLedger.length === 0) {
            showMsg(`Work Plan ${id} ${wp} data is put into the mgmt legder.`);
        }
        else {
            showMsg(`Work Plan ${id} ${wp} data in the mgmt legder is updated.`);
        }

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(wp)));        
    }

    async UpdateWorkPlan(ctx, wp_json) {
        const wp = JSON.parse(wp_json);
        const id = wp.ID;
        let key = ctx.stub.createCompositeKey('bmes', ['workplan', id]);
        const response = await ctx.stub.putState(key, Buffer.from(JSON.stringify(wp)));
        
        showMsg(`Work Plan ${id} ${wp} data is put into the mgmt legder`);
        return response;
    }

    //#endregion

    //#region SalesOrder

    async InitSalesOrderDoc(ctx, str_ISO8601_timestamp) {
        let so = new SalesOrder('1000');
        so.AddSalesTerm("1", new SalesTerm("1", 'Product 1000', '1000'));
        so.AddSalesTerm("2", new SalesTerm("2", 'Product 1000', '1000'));

        const so_key = ctx.stub.createCompositeKey('bmes', ['salesorder', so.ID]);        
        await ctx.stub.putState(so_key, Buffer.from(JSON.stringify(so)));

        const so_state_key = ctx.stub.createCompositeKey('bmes', ['salesorderstate', so.ID]);
        let so_state = new SalesOrderState();
        so_state.Release = str_ISO8601_timestamp;
        await ctx.stub.putState(so_state_key, Buffer.from(JSON.stringify(so_state)));

        //initialize sales terms state
        for (var key in so.SalesTerms) {
            const sales_term_key = ctx.stub.createCompositeKey('bmes', ['salestermstate', so.ID, key]);
            const sales_term_state = new SalesTermState();
            await ctx.stub.putState(sales_term_key, Buffer.from(JSON.stringify(sales_term_state)));
        }

        showMsg(`Sales Order ${so.ID}  data is put into the mgmt legder and its content: ${JSON.stringify(so, null, 4)}`);
    }

    async GetSalesOrder(ctx, so_id) {
        showMsg(`*****  START: GetSalesOrder *****`)
        // prepare a buffer
        //generate composite_key
        let key = ctx.stub.createCompositeKey('bmes', ['salesorder', so_id]);

        //find state by the composite_key
        let so_json = await ctx.stub.getState(key);

        //check whether workplan exist or not
        if (!so_json || so_json.length === 0) {
            throw new Error(`The SalesOrder ${so_id} does not exist`);
        }
        showMsg(`so_json type: ${typeof(so_json)} and value: ${JSON.stringify(so_json, null, 4)}`); 

        showMsg(`*****  END: GetSalesOrder *****`)
        //return information
        return so_json.toString();
    }

    async GetSalesOrderState(ctx, so_id) {
        showMsg(`*****  START: Get SalesOrder State *****`)
        // prepare a buffer
        //generate composite_key
        let so_state_key = ctx.stub.createCompositeKey('bmes', ['salesorderstate', so_id]);

        // == find state by the composite_key ==
        let buf_so_state = await ctx.stub.getState(so_state_key);
       // showMsg(`buf_so_state type: ${typeof(buf_so_state)} and value: ${JSON.stringify(buf_so_state, null, 4)}`);
        let obj_so_state = BufferToObject(buf_so_state, "GetSalesOrderState: buf_so_state > so_state_json")
        if (!obj_so_state || obj_so_state.length === 0) {
            throw new Error(`The State of Sales Order ${so_id} does not exist`);        }
        let so_state = Object.assign(new SalesOrderState(), obj_so_state);
        //showMsg(`so_state type: ${typeof(so_state)} and value: ${JSON.stringify(so_state, null, 4)}`);
         
        // == sync sale order state ==
        const buf_so_state_record_at_prod = await ctx.stub.invokeChaincode('bmes-prod', ['GetSaleOrderStateAtProd', so_id], 'channelprod');
        const so_state_record_at_prod = PromisePayloadToObject(buf_so_state_record_at_prod, "invokeChaincode >GetSaleOrderStateAtProd")

        //update sales order state
        if (so_state.Start != so_state_record_at_prod.Start) {
            so_state.Start = so_state_record_at_prod.Start
        }
        //if (so_state.End != so_state_record_at_prod.End) {
        //    so_state.End = so_state_record_at_prod.End
        //}
        if (so_state.Condition != so_state_record_at_prod.Condition) {
            so_state.Condition = so_state_record_at_prod.Condition
        }
        
        //prepare SalesOrderStateMessage
        let so_key = ctx.stub.createCompositeKey('bmes', ['salesorder', so_id]);
        let buf_so = await ctx.stub.getState(so_key);
       // showMsg(`buf_so type: ${typeof(buf_so)} and value: ${JSON.stringify(buf_so, null, 4)}`);
        let so = BufferToObject(buf_so, "GetSalesOrderState: buf_so > so")
        showMsg(`so type: ${typeof(so)} and value: ${JSON.stringify(so, null, 4)}`);

        let sos_msg = new SalesOrderStateMessage();
        sos_msg = Object.assign(sos_msg, so);
        sos_msg = Object.assign(sos_msg, so_state);

        // == sync sale term state ==
        // 使用 for...in 迴圈遍歷物件的所有鍵名
        let isSalesOrderFinished = true;
        let so_end_time = new Date(-864000000000000);

        for (var key in so.SalesTerms) {
            if (so.SalesTerms.hasOwnProperty(key)) { // 檢查是否為物件自身的屬性，避免遍歷原型鏈上的屬性

                // get wo state from channelprod
                const sid = sos_msg.ID;
                const stid = key.toString();
                const wpid = sos_msg.SalesTerms[stid].RefWorkPlan;
                const buf_wo_state = await ctx.stub.invokeChaincode('bmes-prod', ['GetWorkOrderState', sid, stid], 'channelprod');
                showMsg(`buf_wo_state type: ${typeof(buf_wo_state)} and value: ${JSON.stringify(buf_wo_state, null, 4)}`);
                const wo_state = PromisePayloadToObject(buf_wo_state, "invokeChaincode > GetWorkOrderState")
                showMsg(`wo_state type: ${typeof(wo_state)} and value: ${JSON.stringify(wo_state, null, 4)}`);

                // get st state 
                const sales_term_key = await ctx.stub.createCompositeKey('bmes', ['salestermstate', so_id, key]);               
                const buf_sales_term_state = await ctx.stub.getState(sales_term_key);
                //showMsg(`buf_sales_term_state type: ${typeof(buf_sales_term_state)} and value: ${JSON.stringify(buf_sales_term_state, null, 4)}`);
                let sales_term_state = BufferToObject(buf_sales_term_state, "GetSalesOrderState: bnf_sales_term_state > sales_term_state")
                showMsg(`sales_term_state type: ${typeof(sales_term_state)} and value: ${JSON.stringify(sales_term_state, null, 4)}`);

                //update st state
                if (sales_term_state.Start == "" && sales_term_state.Start != wo_state.Start) {
                    sales_term_state.Start = wo_state.Start
                }
                if (sales_term_state.End  == "" && sales_term_state.End != wo_state.End) {
                    sales_term_state.End = wo_state.End
                }
                if (sales_term_state.Condition != wo_state.Condition) {
                    sales_term_state.Condition = wo_state.Condition
                }
                showMsg(`updated sales_term_state type: ${typeof(sales_term_state)} and value: ${JSON.stringify(sales_term_state, null, 4)}`);
                await ctx.stub.putState(sales_term_key, Buffer.from(JSON.stringify(sales_term_state)));

                if (sales_term_state.End != "" && !isSalesOrderFinished) {
                    let salesTermEndDate = new Date(sales_term_state.End);                    

                    if (salesTermEndDate > so_end_time) {
                        so_end_time = sales_term_state.End;
                    }
                }
                else {
                    isSalesOrderFinished = true;
                }

                let sts_msg = new SalesTermStateMessage();
                sts_msg = Object.assign(sts_msg, so.SalesTerms[key]);
                sts_msg = Object.assign(sts_msg, sales_term_state);
                showMsg(`sts_msg type: ${typeof (sts_msg)} and value: ${JSON.stringify(sts_msg, null, 4)}`);

                sos_msg.AddSalesTerm(key, sts_msg);
            }
        }

        if (isSalesOrderFinished) {
            so_state.End = so_end_time.toISOString();
            showMsg(`Sales order ${so_id} is finished at ${so_state.End}`)
        }

        await ctx.stub.putState(so_state_key, Buffer.from(JSON.stringify(so_state)));


        showMsg(`sos_msg type: ${typeof (sos_msg)} and value: ${JSON.stringify(sos_msg, null, 4)}`);

        let result = JSON.stringify(sos_msg);

        showMsg(`*****  END: Get SalesOrder State *****`)
        //return information
        return result.toString();
    }

    async GetAllOrder(ctx) {
        showMsg('============= START : GetAllOrder =============');
        // prepare a buffer
        const allResults = [];

        // get all states by keys composited with 'salesorder'
        const iterator = await ctx.stub.getStateByPartialCompositeKey('bmes', ['salesorder']);

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

            //put value into buffer
            allResults.push(Value);
            result = await iterator.next();
        }
        showMsg(`Finish GetAllOrder, starting merge production data`)

        showMsg('============= END : GetAllOrder =============');
        return JSON.stringify(allResults);
    }

    async UpdateSalesOrder(ctx, so_json) {
        showMsg('============= START : UpdateSalesOrder =============');
        const so = JSON.parse(so_json);
        const so_id = so.ID;

        //update so state
        await GetSalesOrderState(ctx, id);

        //Check sales order state
        let so_state_key = ctx.stub.createCompositeKey('bmes', ['salesorderstate', so_id]);
        let buf_so_state = await ctx.stub.getState(so_state_key);
        let obj_so_state = BufferToObject(buf_so_state, "GetSalesOrderState: buf_so_state > so_state_json")
        if (!obj_so_state || obj_so_state.length === 0) {
            throw new Error(`The State of Sales Order ${so_id} does not exist`);
        }
        let so_state = Object.assign(new SalesOrderState(), obj_so_state);
        
        if (so_state.Condition == "Released")// only in released condition, so can be updated.
        {
            let key = ctx.stub.createCompositeKey('bmes', ['salesorder', id]);
            showMsg(`Sales Order ${id} ${so} data is been put into the mgmt legder`);
            let res = await ctx.stub.putState(key, Buffer.from(JSON.stringify(so)));
            showMsg('============= END : UpdateSalesOrder =============');
            return JSON.stringify(res);
        }
        else {
            let no_updated_msg = `The order ${so_id} cannot be updated due to its condition = ${so_state.Condition}`;
            return no_updated_msg;
        }        
    }

    async ApplyEngineeringChangeOrder(ctx, salesOrderId, salesTermId, newWorkPlanId, str_ISO8601_timestamp) {
        showMsg(`*****  START: ApplyEngineeringChangeOrder *****`)
        let so_key = ctx.stub.createCompositeKey('bmes', ['salesorder', salesOrderId]);
        let so_buf = await ctx.stub.getState(so_key);
        if (!so_buf || so_buf.length === 0) {
            throw new Error(`The SalesOrder ${salesOrderId} does not exist`);
        }
        const so_obj = BufferToObject(so_buf, "so_obj");
        showMsg(`so_obj type: ${typeof (so_obj)} and value: ${JSON.stringify(so_obj, null, 4)}`);
        let so = Object.assign(new SalesOrder(), so_obj);

        //update sales order
        const oldWorkPlanId = so.SalesTerms[salesTermId].RefWorkPlan;
        so.SalesTerms[salesTermId].RefWorkPlan = newWorkPlanId;
        await ctx.stub.putState(so_key, Buffer.from(JSON.stringify(so)));

        //update sales order state
        const so_state_key = ctx.stub.createCompositeKey('bmes', ['salesorderstate', salesOrderId]);
        let so_state_buf = await ctx.stub.getState(so_state_key);
        if (!so_state_buf || so_state_buf.length === 0) {
            throw new Error(`The SalesOrder ${salesOrderId} does not exist`);
        }
        const so_state_obj = BufferToObject(so_state_buf, "so_state_obj");
        showMsg(`so_state_obj type: ${typeof (so_state_obj)} and value: ${JSON.stringify(so_state_obj, null, 4)}`);
        let so_state = Object.assign(new SalesOrderState(), so_state_obj);
        so_obj.Tag = `Referred Work plan is switched from ${oldWorkPlanId} to ${newWorkPlanId} at ${str_ISO8601_timestamp}`;
        await ctx.stub.putState(so_state_key, Buffer.from(JSON.stringify(so_state)));

        showMsg(`*****  END: ApplyEngineeringChangeOrder *****`)
        //return information
        return so_buf.toString();
    }

    async getHistory(ctx, id) {
        showMsg('============= START : Query History ===========');
        let iterator = await ctx.stub.getHistoryForKey(id);

        let result = [];
        let res = await iterator.next();
        // showMsg(res)
        // showMsg('res=======>res.value')
        // showMsg(res.value)
        // showMsg('res.value=======>res.value.value')
        // showMsg(res.value.value)
        // showMsg(res.value.timestamp)
        // showMsg(res.value.timestamp.toString())
        // showMsg(res.value.timestamp.seconds)
        // showMsg(res.value.timestamp.seconds.low)
        while (!res.done) {
            if (res.value) {
                showMsg(`found state update with value: ${res.value.value.toString('utf8')}`);
                const obj = JSON.parse(res.value.value.toString('utf8'));
                let date = new Date(res.value.timestamp.seconds.low)
                showMsg(date)
                result.push(obj);
            }
            res = await iterator.next();
        }
        await iterator.close();
        showMsg('============= END : Query History ===========');
        return result;
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

module.exports = BMES_MGMT;
