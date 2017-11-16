var mysql = require('mysql');

var jsdom = require("jsdom");

jsdom.env("", function (err, window) {
  if (err) {
    console.error(err);
    return;
  }

  var $ = require("jquery")(window);
});

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root"
});

/**********************QUERY**********************/

var db_create =
  "create database if not exists virtualRadar;"

var db_drop =
  "drop database virtualRadar;"

var db_use =
  "use virtualRadar;"

var db_create_table_Track =
  "create table if not exists Track( " +
  "id int primary key, " + //Id
  "date datetime, " +
  "latitude double, " + //Lat
  "longitude double, " + //Long
  "altitude double, " + //Alt
  "speed double); " //+ //Spd

var db_create_table_Aircraft =
  "create table if not exists Aircraft(" +
  "id char(6) primary key, " + //Icao
  "name varchar(35), " + //Mdl
  "company varchar(35), " + //Op
  "id_flight int, " + //Id
  "destination_from varchar(35), " + //From
  "destination_to varchar(35), " + //To
  "foreign key(id_flight) references Track(id));"

/*************************************************/

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  //DB AND TABLES CREATION 
  insert_query(db_create, "Database created");
  insert_query(db_use, "Use database");
  insert_query(db_create_table_Track, "Track table created");
  insert_query(db_create_table_Aircraft, "Aircraft table created");

  //INSERT VALUES
  $.getJSON('https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?lat=46.0&lng=11.0&fDstL=0&fDstU=100', function (data) {
    for (var i in data.acList){
      console.log(i.Mdl);
    }    
  });

  //DEBUG DROP
  insert_query(db_drop, "database dropped");

});


/*******************FUNCTIONS*********************/

function insert_query(query, msg) {
  con.query(query, function (err, result) {
    if (err) throw err;
    console.log(msg);
  });
}

/*************************************************/