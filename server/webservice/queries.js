var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('./local_conf.js');
//var update = require('./loadData');

/*************************************************************/

router.get('/Aircrafts', function (req, res) { //List of Aircrafts
    eseguiQuery(res, 'SELECT * FROM aircraft ORDER BY id;');
});

router.get('/Tracks', function (req, res) { //List of Tracks
    eseguiQuery(res, 'SELECT * FROM track ORDER BY id;');
});

router.get('/Version', function (req, res) {
    res.end(config.ws_version);
});

router.get('/Aircrafts/:id', function (req, res) { //Select Aircraft by ID
    eseguiQuery(res, 'SELECT * FROM aircraft WHERE id=?;', req.params.id);
});

router.get('/Tracks/:id', function (req, res) { //Select Track by ID
    eseguiQuery(res, 'SELECT * FROM track WHERE id=?;', req.params.id);
});

router.get('/All', function (req, res) { //List of bot Aicrafts and Tracks
    eseguiQuery(res, 'SELECT * FROM aircraft JOIN track ON id_flight=track.id;');
});

// router.get('/Run/:range/:lat/:long/:fDstL/:fDstU', function(req, res) {
//     update.refresh(req.params.rate,req.params.lat,req.params.long,req.params.fDstL, req.params.fDstU);
// });
/*************************************************************/

function eseguiQuery(res, sQuery, aParam) {

    //console.log('> Request: SQL -- ' + sQuery); //debug

    connection = mysql.createConnection(config.connection);
    connection.connect();
    connection.query(sQuery, aParam, function (err, rows) {
        if (!err) {
            res.json(rows);
        }
        else {
            console.log('> ERROR: ' + err);
            res.json('{}');
        }
    });
    connection.end();
}

module.exports = router;
