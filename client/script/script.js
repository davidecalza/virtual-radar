var aircraft = {
    id: "",
    reg: "",
    name: "",
    company: "",
    id_flight: "",
    airport_from: "",
    airport_to: "",
    date_track: "",
    latitude: "",
    longitude: "",
    altitude: "",
    speed: ""
}

var aircrafts = []
var tracks_ids = []

function loadPlanes() {
    $.get("http://192.168.6.45:8080/Aircrafts", function (data) {
        alert("AIRCRAFT")

        for (var i in data) {
            aircraft.id = data[i].id
            aircraft.reg = data[i].reg
            aircraft.name = data[i].name
            aircraft.company = data[i].company
            aircraft.id_flight = data[i].id_flight
            aircraft.airport_from = data[i].airport_from
            aircraft.airport_to = data[i].airport_to


            $.get("http://192.168.6.45:8080/Track", function (tdata) {
                alert("TRACK")
                for (var t in tdata) {
                    if (aircraft.id_flight = tdata[t].id) {
                        aircraft.date_track = tdata[t].date_track
                        aircraft.latitude = tdata[t].latitude
                        aircraft.longitude = tdata[t].longitude
                        aircraft.altitude = tdata[t].altitude
                        aircraft.speed = tdata[t].speed
                    }
                }
            })
            aircrafts.push(aircraft)
        }
    })
}

function drawMap() {
    /**
     * SVG path for target icon
     */
    var targetSVG =
        "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

    /**
     * SVG path for plane icon
     */
    var planeSVG =
        "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47";

    /**
     * Create the map
     */
    var map = AmCharts.makeChart("chartdiv", {
        "type": "map",
        "theme": "light",


        "dataProvider": {
            "map": "worldLow",
            "zoomLevel": 20,
            "zoomLongitude": 11,
            "zoomLatitude": 46,

            "lines": [],
            "images": [{
                "svgPath": planeSVG,
                "title": "Havana",
                "latitude": 46,
                "longitude": 11,
                "scale": 0.1,
                "positionScale": 1.3
            }]
        },

        "areasSettings": {
            "unlistedAreasColor": "#8dd9ef"
        },

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

        "export": {
            "enabled": true
        }

    });
}