// JavaScript source code
/* eslint-env es6 */
/* eslint-disable no-console */
'use strict';

class Machine {
    Name = "";
    State = "Idle";
    Parameters = [];
    Endpoint = "0.0.0.0:4840";
    Protocol = "OPCUA";
    constructor(name, state, parameter, endpoint, protocol) {
        this.Name = name;
        this.State = state;
        this.Parameters = parameter;
        this.Endpoint = endpoint;
        this.Protocol = protocol;
    }
}

class Transition {
    ID = '0';
    Machine = '';
    Function = '';
    Parameter = ''; //seperate by comma ','
    OK_To = '0';
    NOK_To = '0';
    constructor(id, machine, func, par, ok, nok) {
        this.ID = id;
        this.Machine = machine;
        this.Function = func;
        this.Parameter = par;
        this.OK_To = ok;
        this.NOK_To = nok;
    }
}

class WorkPlan {
    ID = '';
    TransitionList = {}
    constructor(id) {
        this.ID = id;
    }
    AddTransition(id, tran) {
        this.TransitionList[id] = tran;
    }
}

class SalesTerm {
    ProductName = '';
    Quantity = 1;
    RefWorkPlanId = '';
    constructor(name, quantity, refwpid) {
        this.ProductName = name;
        this.Quantity = quantity;
        this.RefWorkPlanId = refwpid;
    }
}

class SalesOrder {
    ID = '';
    State = 'Pending';
    SalesTerms = [];
    Start = 'undo'; //Time format : YYYY-MM-DD-hh-mm-ss
    Stop = 'undo';
    constructor(id) {
        this.ID = id;
    }
    AddSalesTerm(term) {
        this.SalesTerms.push(term);
    }
}

exports.Machine = Machine;
exports.Transition = Transition;
exports.WorkPlan = WorkPlan;
exports.SalesTerm = SalesTerm; 
exports.SalesOrder = SalesOrder;