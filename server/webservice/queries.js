var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('./local_conf.js');

/*************************************************************/

router.get('/Aircrafts', function (req, res) {
    eseguiQuery(res, 'SELECT * FROM aircraft ORDER BY id;');
});

router.get('/Tracks', function (req, res) {
    eseguiQuery(res, 'SELECT * FROM track ORDER BY id;');
});

router.get('/Version', function (req, res) {
    res.end(config.ws_version);
})

router.get('/Aircrafts/:id', function (req, res) {
    eseguiQuery(res, 'SELECT * FROM aircraft WHERE id=?;', req.params.id);
});

/*************************************************************/

function eseguiQuery(res, sQuery, aParam) {

    console.log('> Request: SQL -- ' + sQuery); //debug

    connection = mysql.createConnection(config.connection);
    connection.connect();
    connection.query(sQuery, aParam, function (err, rows, fields) {
        if (!err) {
            res.json(rows);
        }
        else {
            console.log('> ERROR: ' + err)
            res.json('{}');
        }
    });
    connection.end();
}

module.exports = router;
