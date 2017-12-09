var aircrafts = []; //List of aircrafts to display

//code of the X used to close the sidebar
var close_sidebar_code = '<img src="./cont/cancel.svg" width="30" height="30" alt="" id="sidebar_cancel_icon" onclick="toggleSidebar()">';

//Settings of the map to draw
var mapSettings = {
    "type": "map",
    "theme": "dark",

    "dataProvider": {
        "map": "italyHigh",
        //initial zoom level and position of the map
        "zoomLevel": 5,
        "zoomLongitude": 11,
        "zoomLatitude": 46,

        "lines": [], //tracks
        "images": [] //aircrafts
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
    "responsive": {"enabled": true},

    //Aircrafts onClick
    "listeners": [{
        "event": "clickMapObject",
        //If the sidebar is already toggled, the sidebar closes down and toggles with the new data
        //Otherwise it just toggles with the selected aircraft information
        "method": function (e) {
            var str = '<ul class="sidebar-nav" id="sidebar-nav-content">';
            str += e.mapObject.desc;
            str+='</ul>';

            if (parseInt($("#wrapper").css("padding-left")) > 0) {
                toggleSidebar();

                setTimeout(function () {
                    $('#sidebar-wrapper').html(str);
                    toggleSidebar();
                }, 500);
            }
            else {
                $('#sidebar-wrapper').html(str);
                toggleSidebar();
            }
            //append <li>Nome: ...<li/>
        }
    }]
};

/*  toggleSidebar
    toggleClass on sidebar
*/
function toggleSidebar() {
    $("#wrapper").toggleClass("toggled");
}

/*  update
    refreshes the map
    rate --> refresh rate
*/
function update(rate) {
    var map = AmCharts.makeChart("chartdiv", mapSettings);
    setInterval(function () {
        loadPlanes();
        drawItems();

        //Keeps user zoom and position of the map
        //map.dataProvider.zoomLevel = map.zoomLevel();
        map.dataProvider.zoomLatitude = map.zoomLatitude();
        map.dataProvider.zoomLongitude = map.zoomLongitude();

        //Refreshes objects
        map.validateData(map.dataProvider.lines);
        map.validateData(map.dataProvider.images);
    }, rate);
}

/*  loadPlanes
    Downloads from the webservice and stores data on aircrafts array
*/
function loadPlanes() {
    $.get("http://localhost:8080/All", function (data) {
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
    })
}

/*  drawItems
    Updates mapSettings object, pushing all the SVG objects (Planes, tracks and other items)
*/
function drawItems() {
    var items = []; //array of SVG items (planes, target and circle)
    var lines = []; //tracks of the planes

    //Circle object of the radar range
    var circle = {
        "svgPath": "M14.554,0C6.561,0,0,6.562,0,14.552c0,7.996,6.561,14.555,14.554,14.555c7.996,0,14.553-6.559,14.553-14.555     C29.106,6.562,22.55,0,14.554,0z",
        "latitude": 46,
        "longitude": 11,
        "color": "#000000",
        "rollOverColor": "#000000",
        "selectedColor": "#000000",
        "scale": 25,
        "alpha": 0.1
    };

    items.push(circle);

    for (var i in aircrafts) {
        var image = {
            "id": aircrafts[i].id,
            "svgPath": "M357,12.8h-51l-127.5,204H38.3C17.9,216.8,0,234.6,0,255s17.9,38.3,38.3,38.3h140.3l127.5,204h51l-63.8-204h140.3l38.3,51H510L484.5,255l25.5-89.3h-38.3l-38.3,51H293.3L357,12.8z",
            "positionOnLine": 0,
            "color": "#000000",
            "alpha": 1,
            "animateAlongLine": false,
            "lineId": "line" + i,
            "flipDirection": false,
            "loop": false,
            "scale": 0.05,
            "positionScale": 1,
            "selectable": true,
            "desc":
            '<li class="list_title">' + aircrafts[i].name + close_sidebar_code + '</li>' +
            '<li class="list_title">Company</li><li>' + aircrafts[i].company + '</li>' +
            '<li class="list_title">From</li><li> ' + aircrafts[i].airport_from + '</li>' +
            '<li class="list_title">To</li><li> ' + aircrafts[i].airport_to + '</li>' +
            '<li class="list_title">Speed</li><li> ' + aircrafts[i].speed + '</li>'
        };
        var line = {
            "id": "line" + i,
            "arc": 0,
            "alpha": 0.3,
            "latitudes": [aircrafts[i].latitude, aircrafts[i].first_lat],
            "longitudes": [aircrafts[i].longitude, aircrafts[i].first_long]
        };
        lines.push(line);
        items.push(image);
    }

    var target = {
        "svgPath": "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z",
        "title": "I.T.T. Marconi",
        "latitude": 46,
        "longitude": 11,
        "color": "#cc0000",
        "rollOverColor": "#cc0000",
        "selectedColor": "#cc0000"
    };

    items.push(target);
    mapSettings.dataProvider.images = items;
    mapSettings.dataProvider.lines = lines;
}
