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

class SalesTerm {
    ID = "";
    ProductName = '';
    RefWorkPlan = '';
    State = 'Waiting'; //Waiting > Started > Finished
    Start = ''; //Time format : YYYY-MM-DD-hh-mm-ss
    End = '';
    constructor(id, product_name, ref_workplan) {
        this.ID = id;
        this.ProductName = product_name;
        this.RefWorkPlan = ref_workplan;
        this.State = 'Waiting';
        this.Start = '';
        this.End = '';
    }

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


module.exports = {
    WorkStation: WorkStation,
    Transition: Transition,
    WorkPlan: WorkPlan,
    SalesTerm: SalesTerm,
    SalesOrder: SalesOrder,
};