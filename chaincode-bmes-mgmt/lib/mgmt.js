/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */


const { Contract } = require('fabric-contract-api');
const { WorkStation, Transition, WorkPlan, SalesTerm, SalesTermState, SalesOrder, SalesOrderState } = require('./mgmt_util')
const { PromisePayloadToObject, BufferToObject } = require('./tool_util');


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
        if (wsJson && wsJson.length == 0) {
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
        if (wsJSON && wsJSON.length == 0) {
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
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(wp)));
        showMsg(`Work Plan ${id} ${wp} data is put into the mgmt legder`);
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

        const key = ctx.stub.createCompositeKey('bmes', ['salesorder', so.ID]);        
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(so)));

        const key_of_state = ctx.stub.createCompositeKey('bmes', ['salesorderstate', so.ID]);
        let so_state = new SalesOrderState();
        so_state.Release = str_ISO8601_timestamp;
        await ctx.stub.putState(key_of_state, Buffer.from(JSON.stringify(so_state)));
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
        showMsg(`so_json type: ${typeof (so_json)} and value: ${JSON.stringify(so_json, null, 4)}`); 

        showMsg(`*****  END: GetSalesOrder *****`)
        //return information
        return so_json.toString();
    }

    async GetSalesOrderState(ctx, so_id) {
        showMsg(`*****  START: Get SalesOrder State *****`)
        // prepare a buffer
        //generate composite_key
        let key = ctx.stub.createCompositeKey('bmes', ['salesorderstate', so_id]);

        // == find state by the composite_key ==
        let buf_so_state = await ctx.stub.getState(key);
        //showMsg(`so_state_json type: ${typeof (buf_so_state)} and value: ${JSON.stringify(buf_so_state, null, 4)}`);
        let so_state_json = BufferToObject(buf_so_state, "GetSalesOrderState: buf_so_state > so_state_json")
        //check whether workplan exist or not
        if (!so_state_json || so_state_json.length === 0) {
            throw new Error(`The State of Sales Order ${so_id} does not exist`);
        }
        //showMsg(`so_state_json type: ${typeof (so_state_json)} and value: ${JSON.stringify(so_state_json, null, 4)}`);
         
        // == sync sale order state ==
        const buf_so_state_record_at_prod = await ctx.stub.invokeChaincode('bmes-prod', ['StartSaleOrderStateAtProd', so_id], 'channelprod');
        //showMsg(`buf_so_state_record_at_prod type: ${typeof (buf_so_state_record_at_prod)} and value: ${JSON.stringify(buf_so_state_record_at_prod, null, 4)}`);

        const so_state_record_at_prod = PromisePayloadToObject(buf_so_state_record_at_prod, "invokeChaincode >GetWorkOrderState")
        //showMsg(`so_state_record_at_prod type: ${typeof (so_state_record_at_prod)} and value: ${JSON.stringify(so_state_record_at_prod, null, 4)}`);
       
        if (so_state_json.Start != so_state_record_at_prod.Start) {
            so_state_json.Start = so_state_record_at_prod.Start
        }
        if (so_state_json.End != so_state_record_at_prod.End) {
            so_state_json.End = so_state_record_at_prod.End
        }

        // == sync sale term state ==





        await ctx.stub.putState(key, Buffer.from(JSON.stringify(so_state_json)));

        let so_json = JSON.stringify(so_state_json);

        showMsg(`*****  END: Get SalesOrder State *****`)
        //return information
        return so_json.toString();
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
        const id = so.ID;
        let key = ctx.stub.createCompositeKey('bmes', ['salesorder', id]);

        showMsg(`Sales Order ${id} ${so} data is been put into the mgmt legder`);
        let res = await ctx.stub.putState(key, Buffer.from(JSON.stringify(so)));        
        showMsg('============= END : UpdateSalesOrder =============');
        return res;
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
