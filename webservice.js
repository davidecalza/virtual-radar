var request = require("request");

var conn = {
  host: 'localhost',
  user: 'root',
  password: 'root'
};
var knex = require('knex')({client: 'mysql', connection: conn});

knex.raw('CREATE DATABASE IF NOT EXISTS radar')
  .then(function () {
    knex.destroy();

    conn.database = 'radar';
    knex = require('knex')({client: 'mysql', connection: conn });

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
            updateData();
            knex.destroy();

            /*******************/
            //DEBUG
            conn.database = null;
            knex = require('knex')({client: 'mysql', connection: conn });
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

  request({
    url: url,
    json: true
  }, function (error, response, body) {
    
  });
}