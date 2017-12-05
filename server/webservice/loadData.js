var request = require("request");

var id_st = []; //Ids of aircrafts in the database 

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

/*  refresh
    refreshes the database
    rate  --> refresh rate
    lat   --> latitude
    lng   --> longitude
    fDstL --> ?
    fDstU --> range
*/
function refresh(rate, lat, lng, fDstL, fDstU) {
    setInterval(function () {
        updateData(lat, lng, fDstL, fDstU);
    }, rate);
}

/*  updateData
    downloads JSON data and manages db data
    lat   --> latitude
    lng   --> longitude
    fDstL --> ?
    fDstU --> range
*/
function updateData(lat, lng, fDstL, fDstU) {

    var url = "https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?lat=" + lat + "&lng=" + lng + "&fDstL=" + fDstL + "&fDstU=" + fDstU;

    //process.stdout.write('\033c');

    request({
        url: url,
        json: true
    }, function (error, response, body) {

        knex = require('knex')({
            client: 'mysql',
            connection: conn
        });

        deleteTables();

        var data = body.acList;
        var id_tmp = []; //check if an aircraft got out of the range

        for (var i in data) { //loop on the lists of aircrafts in the range right now
            if (data.hasOwnProperty(i)) {

                id_tmp.push(data[i].Id);

                if (!id_st.includes(data[i].Id)) { //aircraft ID is not in the db yet

                    console.log("> NEW AIRCRAFT: " + data[i].Icao);
                    id_st.push(data[i].Id);

                    var aircraft = { //aircraft object to add to the db
                        id: data[i].Icao,
                        name: data[i].Mdl,
                        reg: data[i].Reg,
                        company: data[i].Op,
                        id_flight: data[i].Id,
                        airport_from: data[i].From,
                        airport_to: data[i].To,
                        first_latitude: data[i].Lat,
                        first_longitude: data[i].Long
                    };

                    var track = { //track object to add to the db
                        id: data[i].Id,
                        date_track: new Date(data[i].PosTime),
                        latitude: data[i].Lat,
                        longitude: data[i].Long,
                        altitude: data[i].Alt,
                        speed: data[i].Spd
                    };

                    insert(aircraft, 'aircraft');
                    insert(track, 'track');
                }

                var update_row = { //track object to update
                    date_track: new Date(data[i].PosTime),
                    latitude: data[i].Lat,
                    longitude: data[i].Long,
                    altitude: data[i].Alt,
                    speed: data[i].Spd
                };

                update('id', data[i].Id, 'track', update_row);

            }
        }

        for (var t in id_st) { //check and compare if aircrafts in the db are the same as the ones in the range right now
            if (!id_tmp.includes(id_st[t])) { //aircraft got out of the range
                console.log("> AIRCRAFT " + id_st[t] + " GOT OUT OF THE RANGE");
                remove('id_flight', id_st[t], 'aircraft');
                remove('id', id_st[t], 'track');
                id_st.splice(t, 1);
            }
        }

        knex.destroy();
    })
}

/*  Insert
    inserts a row into a table 
    row   --> row of the table (instance)
    table --> table of the db
*/
function insert(row, table) {
    knex.insert(row).into(table)
        .then(function (id) {
            //console.log("> DB INSERT: " + row.id)
        })
}

/*  Remove
    removes a row of a table 
    field     --> field of the row to remove
    condition --> condition of the field 
    table     --> table of the db
*/
function remove(field, condition, table) {
    knex(table)
        .where(field, condition)
        .del()
        .then(function (id) {
            //console.log("> DB remove: " + field + "_" + condition)
        })
}

/*  Update
    updates a row of a table 
    field     --> field of the row to remove
    condition --> condition of the field 
    table     --> table of the db
    row       --> updated row of the table (instance)
*/
function update(field, condition, table, row) {
    knex(table)
        .where(field, condition) //Id
        .update(row)
        .then(function (id) {
            //console.log("> DB updated: " + field + "_" + condition)
        })
}

/*  deleteTables
    clears all tables
*/
function deleteTables() {
    knex('aircraft').truncate()
        .then(function () {
            knex('track').truncate()
                .then(function () {
                    console.log("> Tables cleared")
                })
        })
}

module.exports.refresh = function (rate, latitude, longitude, fDstL, fDstU) {
    return refresh(rate, latitude, longitude, fDstL, fDstU);
};