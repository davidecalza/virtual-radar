var conn = {
  host: 'localhost',
  user: 'root',
  password: 'root'
};
var knex = require('knex')({
  client: 'mysql',
  connection: conn
});

knex.raw('CREATE DATABASE IF NOT EXISTS radar')
  .then(function () {
    knex.destroy();

    conn.database = 'radar';
    knex = require('knex')({
      client: 'mysql',
      connection: conn
    });

    knex.schema.createTableIfNotExists('track', function (table) {
        table.integer('id').primary();
        table.dateTime('date')
        table.double('latitude')
        table.double('longitude')
        table.double('altitude')
        table.double('speed')
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
          });
      });
  });