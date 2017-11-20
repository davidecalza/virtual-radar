/*
  TO-DO and ISSUES
  - database already present issue fix
  - aircraft remove
  - track insert and remove
  - track update
*/

var request = require("request");

var conn = {
  host: 'localhost',
  user: 'root',
  password: 'root'
};
var knex = require('knex')({
  client: 'mysql',
  connection: conn
});

var id_st = [];
var aircrafts = [];
var ins_aircraft = [];

knex.raw('CREATE DATABASE IF NOT EXISTS radar')
  .then(function () {
    knex.destroy();

    conn.database = 'radar';
    knex = require('knex')({
      client: 'mysql',
      connection: conn
    });

    knex.schema.createTableIfNotExists('track', function (table) {
      table.integer('id').primary(); //Id
      table.dateTime('date') //PosTime
      table.double('latitude') //Lat
      table.double('longitude') //Long
      table.double('altitude') //Alt
      table.double('speed') //Spd
    })
      .then(function () {
        knex.schema.createTableIfNotExists('aircraft', function (table) {
          table.string('id').primary() //Icao
          table.string('name') //Mdl
          table.string('company') //Op
          table.integer('id_flight'); //Id
          table.string('airport_from') //From
          table.string('airport_to') //To
        })
          .then(function () {
            knex.destroy();

            setInterval(function () {
              updateData();
            }, 3000);
          });
      });
  });

function updateData() {
  var lat = 46.0
  var lng = 11.0
  var fDstL = 0
  var fDstU = 100
  var url = "https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?lat=" + lat + "&lng=" + lng + "&fDstL=" + fDstL + "&fDstU=" + fDstU

  //process.stdout.write('\033c');

  request({
    url: url,
    json: true
  }, function (error, response, body) {

    var data = body.acList
    var id_tmp = []

    for (var i in data) {
      id_tmp.push(data[i].Icao)
      if (!id_st.includes(data[i].Icao)) { //aircraft id is not in the db yet   
        console.log("NEW AIRCRAFT: " + data[i].Icao)
        id_st.push(data[i].Icao)

        //add aircraft to db  
        var aircraft = {
          id: data[i].Icao,
          name: data[i].Mdl,
          company: data[i].Op,
          id_flight: data[i].Id,
          airport_from: data[i].From,
          airport_to: data[i].To
        }

        aircrafts.push(aircraft)
        insert(aircraft, 'aircraft')
      }
    }

    for (var i in id_st) {
      if (!id_tmp.includes(id_st[i])) { //aircraft is out of the range
        console.log("AN AIRCRAFT GOT OUT OF THE RANGE: " + id_st[i])        
        remove('id', id_st[i], 'aircraft')
        id_st.splice(i, 1);
        aircrafts.splice(i, 1);
      }
    }

  })
}

/* 
  Insert
  inserts a row into a table 
  row --> row of the table (instance)
  table --> table of the db
*/
function insert(row, table) {
  conn.database = 'radar'
  knex = require('knex')({
    client: 'mysql',
    connection: conn
  });

  knex.insert(row).into(table)
    .then(function (id) {
      console.log("DB INSERT: " + row.name)
      knex.destroy();
    })
}

/* 
  Remove
  removes a row of a table 
  row --> row of the table (instance)
  field --> field of the row to remove
  condition --> condition of the field 
*/
function remove(field, condition, table) {
  conn.database = 'radar'
  knex = require('knex')({
    client: 'mysql',
    connection: conn
  });

  knex(table)
    .where(field, condition)
    .del()
    .then(function (id) {
      console.log("DB remove: " + field + "_" + condition)
      knex.destroy();
    })
}
