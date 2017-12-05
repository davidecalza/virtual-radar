var aircrafts = []; //List of aircrafts to display

//Settings of the map to draw
var mapSettings = {
    "type": "map",
    "theme": "dark",

    "dataProvider": {
        "map": "italyHigh",
        "zoomLevel": 4,
        "zoomLongitude": 11,
        "zoomLatitude": 46,

        "lines": [],
        "images": []
    },

    "areasSettings": {"unlistedAreasColor": "#8dd9ef"},

    "imagesSettings": {
        "color": "#585869",
        "rollOverColor": "#585869",
        "selectedColor": "#585869",
        "pauseDuration": 0.1,
        "animationDuration": 2,
        "adjustAnimationSpeed": true
    },

    "linesSettings": {
        "color": "#cc0000",
        "alpha": 0.4
    },

    "export": {"enabled": true},
    "responsive": {"enabled": true}
};

function update() {
    setInterval(function () {
        loadPlanes();
        drawMap();
    }, 500);
}

function loadPlanes() {
    $.get("http://192.168.1.20:8080/All", function (data) {
        aircrafts = [];
        for (var i in data) {
            if (data.hasOwnProperty(i)) {

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
                    speed: 0,
                    first_long: 0,
                    first_lat: 0
                };

                aircraft.id = data[i].id;
                aircraft.reg = data[i].reg;
                aircraft.name = data[i].name;
                aircraft.company = data[i].company;
                aircraft.id_flight = data[i].id_flight;
                aircraft.airport_from = data[i].airport_from;
                aircraft.airport_to = data[i].airport_to;
                aircraft.date_track = data[i].date_track;
                aircraft.latitude = data[i].latitude;
                aircraft.longitude = data[i].longitude;
                aircraft.altitude = data[i].altitude;
                aircraft.speed = data[i].speed;
                aircraft.first_long = data[i].first_longitude;
                aircraft.first_lat = data[i].first_latitude;

                aircrafts.push(aircraft)
            }
        }
        //drawMap();
    })
}

function drawMap() {
    var planes = [];
    var lines = [];
    for (var i in aircrafts) {
        var image = {
            "svgPath": "M357,12.8h-51l-127.5,204H38.3C17.9,216.8,0,234.6,0,255s17.9,38.3,38.3,38.3h140.3l127.5,204h51l-63.8-204h140.3l38.3,51H510L484.5,255l25.5-89.3h-38.3l-38.3,51H293.3L357,12.8z",
            "title": aircrafts[i].name,
            "positionOnLine": 0,
            "color": "#000000",
            "alpha": 1,
            "animateAlongLine": false,
            "lineId": "line"+i,
            "flipDirection": false,
            "loop": false,
            "scale": 0.05,
            "positionScale": 1
        };
        var line = {
            "id": "line"+i,
            "arc": 0,
            "alpha": 0.3,
            "latitudes": [aircrafts[i].latitude, aircrafts[i].first_lat],
            "longitudes": [aircrafts[i].longitude, aircrafts[i].first_long]
        };
        lines.push(line);
        planes.push(image);
    }
    mapSettings.dataProvider.images = planes;
    mapSettings.dataProvider.lines = lines;
    AmCharts.makeChart("chartdiv", mapSettings);
}
