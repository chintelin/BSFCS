/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */


const { Contract } = require('fabric-contract-api');
const { WorkStation, Transition, WorkPlan, SalesTerm, SalesOrder } = require('./mgmt_util')
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
        const ws = [
            new WorkStation("ASRS", "Store, Retrive", "", 'opc.tcp://172.21.3.1:4840', "OPC UA"),
            new WorkStation("Press", "Press", "", 'opc.tcp://172.21.2.1:4840', "OPC UA"),
            new WorkStation("Magazine", "Magazine", "", 'opc.tcp://172.21.1.1:4840', "OPC UA"),
        ];
        for (const m of ws) {
            let key = ctx.stub.createCompositeKey('bmes', ['workstation', m.Name]);
            console.info(m.Name + ' key is ' + JSON.stringify(key));
            await ctx.stub.putState(key, Buffer.from(JSON.stringify(m)));
            console.info(`workstation ${m.Name} data is put into the mgmt legder`);
        }
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
        console.info(`PostWorkStation with ${name}`);
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
        //console.info(name+ ' key is '+JSON.stringify(key));

        //find state by the composite_key
        const wsJson = await ctx.stub.getState(key);

        //check exist
        if (!wsJson || wsJson.length === 0) {
            throw new Error(`The workstation ${name} does not exist`);
        }

        //show message on channel
        console.info(name)

        //return information
        return wsJson.toString();
    }

    async UpdateWorkStation(ctx, name, func, parameter, endpoint, protocol) {

        console.info(`UpdateWorkStation with ${name}`);
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

    async InitWorkPlanDoc(ctx) {

        let workPlan = new WorkPlan("1000", "Demo Product");
        workPlan.AddTransition('10', new Transition("10", 'ASRS', '2', '210', '20', '99'));
        workPlan.AddTransition('20', new Transition("20", 'Magazine', '0', '0', '30', '99'));
        workPlan.AddTransition('30', new Transition("30", 'Press', '5', '5', '40', '99'));
        workPlan.AddTransition('40', new Transition("40", 'ASRS', '1', '1210', '0', '0'));
        workPlan.AddTransition('99', new Transition("99", 'ASRS', '1', '9210', '0', '0'));

        let key = ctx.stub.createCompositeKey('bmes', ['workplan', workPlan.ID]);
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(workPlan)));
        console.info(`Work Plan ${workPlan.ID} ${workPlan.Product} data is put into the mgmt legder`);
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
        console.info(`Work Plan ${id} ${wp} data is put into the mgmt legder`);
    }

    async UpdateWorkPlan(ctx, wp_json) {
        const wp = JSON.parse(wp_json);
        const id = wp.ID;
        let key = ctx.stub.createCompositeKey('bmes', ['workplan', id]);
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(wp)));
        console.info(`Work Plan ${id} ${wp} data is put into the mgmt legder`);
    }



    async InitSalesOrderDoc(ctx) {
        let so = new SalesOrder('1000');
        so.AddSalesTerm("1", new SalesTerm("1", 'Product 1000', '1000'));
        so.AddSalesTerm("2", new SalesTerm("2", 'Product 1000', '1000'));

        let key = ctx.stub.createCompositeKey('bmes', ['salesorder', so.ID]);
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(so)));
        console.info(`Sales Order ${so.ID}  data is put into the mgmt legder and its content: ${JSON.stringify(so, null, 4)}`);
    }

    async GetSalesOrder(ctx, id) {
        console.info(`Execute GetSalesOrder`)
        // prepare a buffer
        //generate composite_key
        let key = ctx.stub.createCompositeKey('bmes', ['salesorder', id]);

        //find state by the composite_key
        const soJSON = await ctx.stub.getState(key);

        //check whether workplan exist or not
        if (!soJSON || soJSON.length === 0) {
            throw new Error(`The workplan ${id} does not exist`);
        }

        //return information
        return soJSON.toString();
    }

    async GetAllOrder(ctx) {
        console.info(`Execute GetAllOrder`)
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
        console.info(`Finish GetAllOrder`)
        return JSON.stringify(allResults);
    }

    async UpdateSalesOrder(ctx, so_json) {
        console.info('============= START : UpdateSalesOrder =============');
        const so = JSON.parse(so_json);
        const id = so.ID;
        let key = ctx.stub.createCompositeKey('bmes', ['salesorder', id]);
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(so)));
        console.info(`Sales Order ${id} ${so} data is put into the mgmt legder`);
        console.info('============= END : UpdateSalesOrder =============');
    }

    async UpdateSalesOrderState(ctx, id, str_state_name, str_ISO8601_timestamp) {
        console.info('============= START : UpdateSalesOrderState =============');

        showMsg(`Input argues: soid=${id}, state=${str_state_name}, time=${str_ISO8601_timestamp}`);
        //generate composite_key
        let key = ctx.stub.createCompositeKey('bmes', ['salesorder', id]);

        //find state by the composite_key
        const soJSON = await ctx.stub.getState(key);
        let obj_so = JSON.parse(soJSON.toString());
        if (str_state_name == "Release" || str_state_name == "Start" || str_state_name == "End") {
            showMsg(`condition= ${str_state_name}`);
            obj_so[str_state_name] = str_ISO8601_timestamp;
        }
        showMsg(`obj_so type: ${typeof (obj_so)} \n  and value: ${JSON.stringify(obj_so, null, 4)}`);

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(obj_so)));
        console.info(`Sales Order ${id} state ${str_state_name} is updated with ${str_ISO8601_timestamp}`);
        console.info('============= END : UpdateSalesOrderState =============');
    }

    async UpdateSalesTermState(ctx, so_id, term_id, str_state_name, str_ISO8601_timestamp) {
        console.info('============= START : UpdateSalesTermState =============');
        showMsg(`Input argues: soid=${so_id}, termid=${term_id} state=${str_state_name}, time=${str_ISO8601_timestamp}`);
        //generate composite_key
        let key = ctx.stub.createCompositeKey('bmes', ['salesorder', so_id]);

        //find state by the composite_key
        const buf_so = await ctx.stub.getState(key);

        let obj_so = BufferToObject(buf_so, "UpdateSalesTermState - get so");
        if (str_state_name == "Start") {
            showMsg("condition= Start")
            obj_so.SalesTerms[term_id].Start = str_ISO8601_timestamp;
            obj_so.SalesTerms[term_id].State = "Started";
        }
        else if (str_state_name == "End") {
            showMsg("condition= End")
            obj_so.SalesTerms[term_id].End = str_ISO8601_timestamp;
            obj_so.SalesTerms[term_id].State = "Finished";
        }
        showMsg(`obj_so type: ${typeof (obj_so)} \n  and value: ${JSON.stringify(obj_so, null, 4)}`);

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(obj_so)));
    }





    async getHistory(ctx, id) {
        console.info('============= START : Query History ===========');
        let iterator = await ctx.stub.getHistoryForKey(id);

        let result = [];
        let res = await iterator.next();
        // console.info(res)
        // console.info('res=======>res.value')
        // console.info(res.value)
        // console.info('res.value=======>res.value.value')
        // console.info(res.value.value)
        // console.info(res.value.timestamp)
        // console.info(res.value.timestamp.toString())
        // console.info(res.value.timestamp.seconds)
        // console.info(res.value.timestamp.seconds.low)
        while (!res.done) {
            if (res.value) {
                console.info(`found state update with value: ${res.value.value.toString('utf8')}`);
                const obj = JSON.parse(res.value.value.toString('utf8'));
                let date = new Date(res.value.timestamp.seconds.low)
                console.info(date)
                result.push(obj);
            }
            res = await iterator.next();
        }
        await iterator.close();
        console.info('============= END : Query History ===========');
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
