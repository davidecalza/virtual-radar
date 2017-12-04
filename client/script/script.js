var aircrafts = [];

var mapSettings = {
    "type": "map",
    "theme": "light",

    "dataProvider": {
        "map": "worldLow",
        "zoomLevel": 28,
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
        "pauseDuration": 0.2,
        "animationDuration": 2.5,
        "adjustAnimationSpeed": true
    },

    "linesSettings": {
        "color": "#585869",
        "alpha": 0.4
    },

    "export": {"enabled": true},
    "responsive": {"enabled": true}
};

function update() {
    setInterval(function () {
        loadPlanes();
        drawMap1();
    }, 2000);
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
                    speed: 0
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

                aircrafts.push(aircraft)
            }
        }
        //drawMap();
    })
}

function drawMap() {
    var planes = [];
    for (var i in aircrafts) {
        var image = {
            "svgPath":
            "m2," +
            "106h28l24," +
            "30h72l-44," +
            "-133h35l80," +
            "132h98c21," +
            "0 21," +
            "34 0," +
            "34l-98," +
            "0 -80," +
            "134h-35l43," +
            "-133h-71l-24," +
            "30h-28l15," +
            "-47",
            "title": aircrafts[i].reg,
            "latitude": aircrafts[i].latitude,
            "longitude": aircrafts[i].longitude,
            "scale": 0.1,
            "positionScale": 1.3
        };
        planes.push(image);
    }
    mapSettings.dataProvider.images = planes;
    AmCharts.makeChart("chartdiv", mapSettings);
}

function drawMap1() {
    var planes = [];
    var lines = [];
    for (var i in aircrafts) {
        var image = {
            "svgPath": "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47",
            "title": aircrafts[i].name,
            "positionOnLine": 0,
            "color": "#000000",
            "alpha": 1,
            "animateAlongLine": true,
            "lineId": "line"+i,
            "flipDirection": false,
            "loop": false,
            "scale": 0.1,
            "positionScale": 1
        };
        var line = {
            "id": "line"+i,
            "arc": 0,
            "alpha": 0.3,
            "latitudes": [aircrafts[i].latitude, aircrafts[i].latitude+0.5],
            "longitudes": [aircrafts[i].longitude, aircrafts[i].longitude+0.5]
        };
        lines.push(line);
        planes.push(image);
    }
    mapSettings.dataProvider.images = planes;
    mapSettings.dataProvider.lines = lines;
    AmCharts.makeChart("chartdiv", mapSettings);
}

