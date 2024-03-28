'use strict';

// Time format: ISO8601

class WorkStation {
    Name = "";
    Function = "Idle";
    Parameters = "";
    Endpoint = "0.0.0.0:4840";
    Protocol = "OPC UA";
    constructor(name, func, parameter, endpoint, protocol) {
        this.Name = name;
        this.Function = func;
        this.Parameters = parameter;
        this.Endpoint = endpoint;
        this.Protocol = protocol;
    }
}



class Transition {
    ID = '0';  //normally is number, but "init" means the work is done!
    WorkStation = '';
    Function = '';
    Parameter = ''; //seperate by comma ','
    OK_To = '0';  //normally is number, but "done" means the work is done!
    NOK_To = '0'; //normally is number, but "failed" means the work is failed!

    // ID, OK_To, and NOK_To are should be numbers

    constructor(id, ws, func, par, ok, nok) {
        this.ID = id;
        this.WorkStation = ws;
        this.Function = func;
        this.Parameter = par;
        this.OK_To = ok;
        this.NOK_To = nok;
    }
}

class WorkPlan {
    ID = '';
    TransitionList = {} //key = id, value = transition
    constructor(id) {
        this.ID = id;
    }
    AddTransition(id, tran) {
        this.TransitionList[id] = tran;
    }
}


//CompositeKey('bmes', ['salesorder', so.ID]);
class SalesOrder {
    ID = "";
    SalesTerms = {}; // key=id, value = salesterm
    constructor(id) {
        this.ID = id;
    }
    AddSalesTerm(id, term) {
        this.SalesTerms[id] = term;
    }
}


//CompositeKey('bmes', ['salesorderstate', so.ID]);
class SalesOrderState {
    Condition = "Released"; //Editing (not used) > Released > Started > Pending > End
    Release = "";
    Start = "";
    End = "";
}

//message to apps
class SalesOrderStateMessage {
    ID = "";
    Condition = ""; //Editing (not used) > Released > Started > Pending > End
    Release = "";
    Start = "";
    End = "";
    SalesTerms = {} //SalesTermStateMessage
    AddSalesTerm(id, salesTermStateMessage) {
        this.SalesTerms[id] = salesTermStateMessage;
    }
}

class SalesTerm {
    ID = "";
    ProductName = '';
    RefWorkPlan = '';
    constructor(id, product_name, ref_workplan) {
        this.ID = id;
        this.ProductName = product_name;
        this.RefWorkPlan = ref_workplan;
    }
}

//CompositeKey('bmes', ['salestermstate', so_id, st_id]);
class SalesTermState {
    Condition = ''; //Waiting > Started > Finished
    Start = ''; //
    End = '';
    constructor() {
        this.Condition = 'Waiting';
        this.Start = '';
        this.End = '';
    }
}

//message to apps
class SalesTermStateMessage {
    ID = "";
    ProductName = '';
    RefWorkPlan = '';
    Condition = ""; //Editing (not used) > Released > Started > Pending > End
    Start = "";
    End = "";
}




module.exports = {
    WorkStation: WorkStation,
    Transition: Transition,
    WorkPlan: WorkPlan,
    SalesTerm: SalesTerm,
    SalesTermState: SalesTermState,
    SalesTermStateMessage: SalesTermStateMessage,
    SalesOrder: SalesOrder,
    SalesOrderState: SalesOrderState,
    SalesOrderStateMessage: SalesOrderStateMessage
};