// CREATE DATABASE
// creates database if not already exists

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
            table.integer('id').primary(); //Id
            table.dateTime('date_track'); //PosTime
            table.double('latitude');//Lat
            table.double('longitude'); //Long
            table.double('altitude'); //Alt
            table.double('speed'); //Spd
        })
            .then(function () {
                knex.schema.createTableIfNotExists('aircraft', function (table) {
                    table.string('id').primary(); //Icao
                    table.string('reg'); //Reg
                    table.string('name'); //Mdl
                    table.string('company'); //Op
                    table.integer('id_flight');//.notNullable().references('id').inTable('track'); //Id
                    table.string('airport_from'); //From
                    table.string('airport_to'); //To
                    table.double('first_longitude'); //First longitude for track drawing
                    table.double('first_latitude'); //First latitude for track drawing
                })
                    .then(function () {
                        knex.destroy();
                        console.log('Database created')
                    });
            });
    });