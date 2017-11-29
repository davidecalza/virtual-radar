var cors = require('cors') //enable cross domain calls
var express = require('express');
var compression = require('compression'); // enable/disable compression
var config = require('./local_conf.js');		

var app = express();

app.use(cors()) 								
app.use(compression());      					
app.use(express.static(__dirname + '/public')); 

var alluser = require('./alluser.js');			// Tutti servizi pubblici vengono dirottati 
app.use('/', alluser);							// a "alluser.js"

var port = config.ws_port;

var server = app.listen(port, function () {
    console.log("")
    console.log("*******************************************************************************************");
    console.log("Fototeca Museo della Guerra - REST WS listening at http://localhost:%s", port);
    console.log("*******************************************************************************************");
    console.log("Database: " + config.connection.database);
    console.log("Directory: " + __dirname);
    console.log("Start at:  " + Date());
    console.log("*******************************************************************************************")
});