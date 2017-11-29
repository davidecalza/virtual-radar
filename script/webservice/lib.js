var mysql = require('mysql');

var config = require('./local_conf.js');		// inizializza la variabile "config"

exports.eseguiQuery = function eseguiQuery(res, sQuery, aParam) {    
	connection = mysql.createConnection(config.connection);
    connection.connect();
    connection.query(sQuery, aParam, function (err, rows, fields) {
        if (!err) {
            res.json(rows);
        }
        else {
            console.log(' >>>>> ' + err)
            res.json('{}');
        }
    });
    connection.end();
}