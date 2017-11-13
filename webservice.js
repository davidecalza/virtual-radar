var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root"
});

var db_create = 
"create database if not exists virtualRadar;" +
"use virtualRadar;"

var db_create_table_Track =
"create table if not exists Track( "+
"id int primary key, " + //Id
"date datetime, " + 
"latitude double, " + //Lat
"longitude double, " + //Long
"altitude double, " + //Alt
"speed double)); " //+ //Spd

//"create table if not exists Aircraft("+
//"id char(6) primary key, " + //Icao
//"name varchar(35)," + //Mdl
//"company varchar(35)," + //Op
//"id_flight int," + //Id
//"from varchar(35)," + //From
//"to varchar(35)" + //To
//"foreign key(id_flight) references Track(id));"

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");  

  con.query(db_create, function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });

  con.query(db_create_table_Track, function (err, result) {
    if (err) throw err;
    console.log("Track table created");
  });
});