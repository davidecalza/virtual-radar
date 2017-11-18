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
            table.integer('id_flight') //Id
            table.string('airport_from') //From
            table.string('airport_to') //To
            table.foreign('id_flight').references('track.id')
          })
          .then(function () {
            knex.destroy();

            setInterval(function () {
              updateData();
            }, 3000);

            /*******************/
            //DEBUG
            conn.database = null;
            knex = require('knex')({
              client: 'mysql',
              connection: conn
            });
            knex.raw('DROP DATABASE radar')
              .then(function () {
                knex.destroy();
              });
            /*******************/
          });
      });
  });

function updateData() {
  var lat = 46.0
  var lng = 11.0
  var fDstL = 0
  var fDstU = 100
  var url = "https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?lat=" + lat + "&lng=" + lng + "&fDstL=" + fDstL + "&fDstU=" + fDstU
  aircrafts = []

  process.stdout.write('\033c');

  request({
    url: url,
    json: true
  }, function (error, response, body) {

    var data = body.acList
    var id_tmp = []    

    for (var i in data) {
      id_tmp.push(data[i].Icao)
      if (!id_st.includes(data[i].Icao)) { //aircraft id is not in the db yet       
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
      }
    }

    for (var i in id_tmp) {
      if (!id_tmp.includes(id_st[i])) { //aircraft is out of the range
        id_st.splice(id_st.indexOf(id_st[1]), 1);

        //delete aircraft from db

      }
    }

    insertData(aircrafts, 'aircraft')
    //knex.select().table('aircraft')
  })
}

function insertManager(array1, array2, table1, table2) {
  insertData(array1, table1)
  insertData(array2, table2)
}

function insertData(array, table) {
  
  console.log(array.length)

  for (var i in array) {

    conn.database = 'radar'
    knex = require('knex')({
      client: 'mysql',
      connection: conn
    });

    knex.insert(array[i]).into(table)
      .then(function (id) {
        knex.destroy();
        console.log("INSERT")
      })

  }

}