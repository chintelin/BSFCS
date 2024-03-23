'use strict';

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
    ID = '0';
    WorkStation = '';
    Function = '';
    Parameter = ''; //seperate by comma ','
    OK_To = '0';
    NOK_To = '0';
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

class SalesTerm {
    ID = "";
    ProductName = '';
    RefWorkPlan = '';
    constructor(id, product_name, ref_workplan) {
        this.ID = id;
        this.ProductName = product_name;
        this.RefWorkPlan = ref_workplan;
    }
    State = 'Waiting'; //Waiting > Started > Finished
    Start = ''; //Time format : YYYY-MM-DD-hh-mm-ss
    End = '';
}
class SalesTermState {
    State = 'Waiting'; //Waiting > Started > Finished
    Start = ''; //Time format : YYYY-MM-DD-hh-mm-ss
    End = '';
}

class SalesOrder {
    ID = ""
    Release = ""
    SalesTerms = {}; // key=id, value = salesterm
    Start = ''; //Time format : YYYY-MM-DD-hh-mm-ss
    End = '';
    constructor(id) {
        this.ID = id;
    }
    AddSalesTerm(id, term) {
        this.SalesTerms[id] = term;
    }
}

class SalesOrderState {
    Start = ''; //Time format : YYYY-MM-DD-hh-mm-ss
    End = '';
}

module.exports = {
    WorkStation: WorkStation,
    Transition: Transition,
    WorkPlan: WorkPlan,
    SalesTerm: SalesTerm,
    SalesTermState: SalesTermState,
    SalesOrder: SalesOrder,
    SalesOrderState: SalesOrderState
};