/*
  TO-DO and ISSUES
  - track insert and remove
  - track update
  - insert Reg into Aircraft table
*/

var request = require("request");
var id_st = [];
var aircrafts = [];
var ins_aircraft = [];

var conn = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'radar'
};
var knex = require('knex')({
  client: 'mysql',
  connection: conn
});


setInterval(function () {
  updateData();
}, 3000);

/* 
  updateData
  downloads JSON data and manages db data
*/
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
        console.log("NEW AIRCRAFT: " + data[i].Reg)
        id_st.push(data[i].Icao)

        //add aircraft to db  
        var aircraft = {
          id: data[i].Icao,
          name: data[i].Mdl,
          reg: data[i].Reg,
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
        console.log("AN AIRCRAFT GOT OUT OF THE RANGE: " + aircrafts[i].reg)
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
