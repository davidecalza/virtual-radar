var aircrafts = []

var mapSettings = {
    "type": "map",
    "theme": "light",

    "dataProvider": {
        "map": "worldLow",
        "zoomLevel": 20,
        "zoomLongitude": 11,
        "zoomLatitude": 46,

        "lines": [],
        "images": []
    },

    "areasSettings": { "unlistedAreasColor": "#8dd9ef" },

    "imagesSettings": {
        "color": "#585869",
        "rollOverColor": "#585869",
        "selectedColor": "#585869",
        "pauseDuration": 0.2,
        "animationDuration": 2.5,
        "adjustAnimationSpeed": true
    },

    "linesSettings": {
        "color": "#585869",
        "alpha": 0.4
    },

    "export": { "enabled": true }
}

function update() {
    //setInterval(function () {
    //    loadPlanes();
    //    drawMap();
    //}, 500);
    loadPlanes();
}

function loadPlanes() {
    aircrafts = [];
    $.get("http://192.168.6.13:8080/Aircrafts", function (data) {
        /*****************************************************************/
        for (var i in data) {

            var aircraft = {
                id: "",
                reg: "",
                name: "",
                company: "",
                id_flight: "",
                airport_from: "",
                airport_to: "",
                date_track: "",
                latitude: 0.0,
                longitude: 0.0,
                altitude: 0,
                speed: 0
            };

            aircraft.id = data[i].id
            aircraft.reg = data[i].reg
            aircraft.name = data[i].name
            aircraft.company = data[i].company
            aircraft.id_flight = data[i].id_flight
            aircraft.airport_from = data[i].airport_from
            aircraft.airport_to = data[i].airport_to

            $.get("http://192.168.6.13:8080/Tracks/" + data[i].id_flight, function (tdata) {
                aircraft.date_track = tdata[0].date_track
                aircraft.latitude = tdata[0].latitude
                aircraft.longitude = tdata[0].longitude
                aircraft.altitude = tdata[0].altitude
                aircraft.speed = tdata[0].speed

                aircrafts.push(aircraft)
                //alert(JSON.stringify(aircrafts))
            })
        }
        /*****************************************************************/
        alert(JSON.stringify(aircrafts))
        drawMap();
    })
}

function drawMap() {

    var planes = [];

    for (var i in aircrafts) {
        image = {
            "svgPath": "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47",
            "title": aircrafts[i].reg,
            "latitude": aircrafts[i].latitude,
            "longitude": aircrafts[i].longitude,
            "scale": 0.1,
            "positionScale": 1.3
        }
        planes.push(image);
    }

    mapSettings.dataProvider.images = planes

    var map = AmCharts.makeChart("chartdiv", mapSettings);
}

