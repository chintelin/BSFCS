'use strict';

// key = createCompositeKey('bmes', ["salesorderstateatprod", so_id]);
class SalesOrderStateAtProd {
    Condition = "Released"; //Editing (not used) > Released > Started > Pending > End
    Start = ''; 
    End = '';
}


// key = ctx.stub.createCompositeKey('bmes', WorkOrderId.ToArray()); 
class WorkOrderId {
    SO_id = "";
    Term_id = "";
    WP_id = ""
    constructor(so_id, term_id, wp_id) {
        this.SO_id = so_id;
        this.Term_id = term_id;
        this.WP_id = wp_id;
    }

    ToArray = function () {
        return ['workorder', this.SO_id, this.Term_id, this.WP_id];
    }
}

class WorkOrderState {
    CurrentTransitionID = "0"; //first step is 10 in default
    BindingWithCarrier = null;
    Condition = "Started";//Editing (not used) > Released > Started > Pending > End
    Start = "";  
    End = "";
    Tag = "";
}

// Carrier key = ctx.stub.createCompositeKey('bmes', ['carrier', carrier_id]);
class CarrierState {
    Condition = 'free'; //  free/busy
    CurrentWorkTermId = null; // record the current work term with Wip Id

}

// WorkTermId key = ctx.stub.createCompositeKey('bmes', WorkTermId.ToArray());
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
        return ['workterm', this.SO_id, this.Term_id, this.WP_id, this.Tran_id];
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

class CheckOutMessage {
    NextMachine = '';
    Message = '';
    constructor(next, msg) {
        this.NextMachine = next;
        this.Message = msg;
    }
}

exports.WorkOrderId = WorkOrderId;
exports.WorkOrderState = WorkOrderState;
exports.CarrierState = CarrierState;
exports.WorkTermId = WorkTermId;
exports.WorkTermState = WorkTermState;
exports.ProductionMessage = ProductionMessage;
exports.CheckInMessage = CheckInMessage;
exports.CheckOutMessage = CheckOutMessage;
exports.SalesOrderStateAtProd = SalesOrderStateAtProd;