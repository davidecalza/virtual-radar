var cors = require('cors');
var express = require('express');
var compression = require('compression'); 		
var config = require('./local_conf.js');		
var app = express();
app.use(cors());
app.use(compression());      					
var queries = require('./queries.js');			
app.use('/', queries);
var update = require('./loadData.js');
require('../conf/deleteTables.js');

var port = config.ws_port;

app.listen(port, function () {
    update.refresh(500,46,11,0,100);
    console.log("");
    console.log("");
    console.log("Database: " + config.connection.database);
    console.log("Start at:  " + Date());
    console.log(">")
});