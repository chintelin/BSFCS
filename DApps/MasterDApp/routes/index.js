'use strict';
var express = require('express');
var router = express.Router();

//HLF engine
var client = require('./../hlf-client');



/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});
//router.get('/GetMachine', async function (req, res){
//    let name = req.body.Name.toString();
//    let result = await client.GetMachine(name);
//    res.end(result);
//});
router.get('/GetAllWorkStation', async function (req, res){
    let result = await client.GetAllWorkStation();
    res.end(result);
});
router.post('/PostWorkStation', async function (req, res) {
    try {
        let machine_obj = req.body;
        let result = await client.PostWorkStation(machine_obj);
        res.end(result);
    }
    catch (ex) {
        res.end(ex.toString());
    }
});
router.put('/UpdateWorkStation', async function (req, res) {
    try {
        let machine_obj = req.body;
        let result = await client.UpdateWorkStation(machine_obj);
        res.end(result)
    }
    catch (ex) {
        res.end(ex.toString());
    }
});

router.get('/GetAllWP', async function (req, res) {
    let result = await client.GetAllWP();
    res.end(result)
});
router.put('/UpdateWP', async function (req, res) {
    try {
        let wp_json = JSON.stringify(req.body);
        let result = await client.UpdateWP(wp_json);
        res.end(result)
    }
    catch (ex) {
        res.end(ex.toString());
    }
});
router.get('/GetWP', async function (req, res) {
    try {
        let id = req.query.ID.toString();
        let result = await client.GetWP(id);
        res.end(result)
    }
    catch (ex) {
        res.end(ex.toString());
    }    
});




router.get('/GetAllSO', async function (req, res) {
    let result = await client.GetAllSO();
    res.end(result)
});
router.get('/GetSO', async function (req, res) {
    try {
        let id = req.query.ID.toString();
        let result = await client.GetSO(id);
        res.end(result)
    }
    catch (ex) {
        res.end(ex.toString());
    }
});
router.get('/GetSOState', async function (req, res) {
    try {
        let id = req.query.ID.toString();
        let result = await client.GetSOState(id);
        res.end(result)
    }
    catch (ex) {
        res.end(ex.toString());
    }
});
router.put('/UpdateSO', async function (req, res) {
    try {
        let wp_json = JSON.stringify(req.body);
        let result = await client.UpdateSO(wp_json);
        res.end(result)
    }
    catch (ex) {
        res.end(ex.toString());
    }
});


router.get('/StartSO', async function (req, res) {
    try {
        let id = req.query.ID.toString();
        let result = await client.StartSO(id);
        res.end(result)
    }
    catch (ex) {
        res.end(ex.toString());
    }
});
router.get('/PendSO', async function (req, res) {
    try {
        let id = req.query.ID.toString();
        let result = await client.PendSO(id);
        res.end(result)
    }
    catch (ex) {
        res.end(ex.toString());
    }
});
router.get('/RestartSO', async function (req, res) {
    try {
        let id = req.query.ID.toString();
        let result = await client.RestartSO(id);
        res.end(result)
    }
    catch (ex) {
        res.end(ex.toString());
    }
});

router.post('/ApplyEngineeringChangeOrder', async function (req, res) {
    try {
        let salesOrderId = req.body.salesOrder.toString();
        let salesTermId = req.body.salesTerm.toString();
        let newWorkPlanId = req.body.newWorkPlan.toString();
        let result = {};
        let mgmtres = await client.ApplyEngineeringChangeOrderToMgmt(salesOrderId, salesTermId, newWorkPlanId);
        result["mgmtResult"] = mgmtres.toString();
        let prodres = await client.ApplyEngineeringChangeOrderToProd(salesOrderId, salesTermId, newWorkPlanId);
        result["prodResult"] = prodres.toString();
        res.end(JSON.stringify(result));
    }
    catch (ex) {
        res.end(ex.toString());
    }
});





router.get('/GetAllObjectFromMgmt', async function (req, res) {
    let result = await client.GetAllObjectFromMgmt();
    res.end(result)
});
router.get('/GetAllObjectFromProd', async function (req, res) {
    let result = await client.GetAllObjectFromProd();
    res.end(result)
});
module.exports = router;
