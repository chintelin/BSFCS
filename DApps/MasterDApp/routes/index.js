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
    let machine_obj = req.body;
    let result = await client.PostWorkStation(machine_obj);
    res.end(result);
});
router.put('/UpdateWorkStation', async function (req, res) {
    let machine_obj = req.body;
    let result = await client.UpdateWorkStation(machine_obj);
    res.end(result)
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
router.get('/GetAllWP', async function (req, res) {
    let result = await client.GetAllWP();
    res.end(result)
});
//router.post('/PostWP', async function (req, res) {
//    let wp_obj = req.body;
//    let result = await client.PostWP(wp_obj);
//    res.end(result)
//});
router.put('/UpdateWP', async function (req, res) {
    let wp_json = JSON.stringify(req.body);
    let result = await client.UpdateWP(wp_json);
    res.end(result)
});


//router.get('/GetSO', async function (req, res) {
//    let id = req.body.ID.toString();
//    let result = await client.GetSO(id);
//    res.end(result)
//});
router.get('/GetAllSO', async function (req, res) {
    let result = await client.GetAllSO();
    res.end(result)
});
//router.post('/PostSO', async function (req, res) {
//    let wp_obj = req.body;
//    let result = await client.PostSO(wp_obj);
//    res.end(result)
//});
router.put('/UpdateSO', async function (req, res) {
    let wp_json = JSON.stringify(req.body);
    let result = await client.UpdateSO(wp_json);
    res.end(result)
});

router.get('/GetAll', async function (req, res) {
    let result = await client.GetAllObject();
    res.end(result)
});

module.exports = router;
