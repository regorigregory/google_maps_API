
LuckyInsigthsHelper.getInstance().init("drawSquare");
GMAP.getInstance();
GMAP.instance.availableColors = ["red", "green", "blue", "orange", "pink", "yellow", "gray", "purple"];
GMAP.instance.defaultColorURL = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
GMAP.instance.mapIconBaseUrl = "https://maps.google.com/mapfiles/ms/icons/COLOR-dot.png";
GMAP.instance.latInput = document.getElementById("userInputLAT");
GMAP.instance.lngInput = document.getElementById("userInputLNG");
GMAP.getInstance().initMap();
GMAP.getInstance().initMapTypeSelect("mapTypeSelect")

userControls = {};
userControls["latInput"] = document.getElementById("userInputLAT");
userControls["lngInput"] = document.getElementById("userInputLNG");
userControls["addAndMove"] = document.getElementById("putMarkerHere");
userControls["drawCircle"] = document.getElementById("drawCircle");
userControls["drawSquare"] = document.getElementById("drawSquare");
userControls["notTooFar"] = document.getElementById("notTooFar");
userControls["antipode"] = document.getElementById("antipode");
//bound actions



userControls["latInput"].addEventListener("input", GMAP.getInstance().moveTo);
userControls["lngInput"].addEventListener("input", GMAP.getInstance().moveTo);
userControls["addAndMove"].addEventListener("click", GMAP.getInstance().addMarker);
userControls["notTooFar"].addEventListener("click", GMAP.getInstance().notTooFar);

userControls["drawSquare"].addEventListener("click", LuckyInsigthsHelper.getInstance().nextPhase);

userControls["antipode"].addEventListener("click", GMAP.getInstance().moveToAntipode);/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mapInstance = GMAP.getInstance().mapObjectRef;
 var testStyles = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8ec3b9"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1a3646"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#64779e"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#334e87"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6f9ba5"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3C7680"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#304a7d"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2c6675"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#255763"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#b0d5ce"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3a4762"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#0e1626"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#4e6d70"
        }
      ]
    }
  ]

mapInstance.setOptions({styles:testStyles})

var suggestionsHandler = new AutocompleteDirectionsHandler(mapInstance.mapObjectRef);

var outcolor = '#ffff00';
var incolor = "red";

var drawingManager = new google.maps.drawing.DrawingManager({
    drawingControl: false,
    polygonOptions: {
        fillColor: outcolor,
        fillOpacity: 0.3,
        strokeWeight: 5,
        clickable: false,
        editable: true,
        zIndex: 1
    }
});
drawingManager.setMap(mapInstance);

var drawingHandle = document.getElementById("drawPoly");
var clickedMe = false;
drawingHandle.addEventListener("click",
        function () {
            var drawingMode = google.maps.drawing.OverlayType.POLYGON;
            if (clickedMe == true) {
                drawingMode = null;
                clickedMe = false;
            } else {
                clickedMe = true;
            }
            drawingManager.setDrawingMode(drawingMode);

        });

var newPoly = null;
var eve = null;
google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
    newPoly = event.overlay;
    eve = event;
    google.maps.event.addListener(mapInstance, "mouseover", function () {
        newPoly.setOptions({fillColor: incolor})
    });
    google.maps.event.addListener(mapInstance, "mousemove", function (e) {
        console.log("I have entered the area.");
        var iAmIn = google.maps.geometry.poly.containsLocation(e.latLng, newPoly);
        if (iAmIn)
        {
            newPoly.setOptions({fillColor: incolor});
            new google.maps.Marker({
                position: e.latLng,
                map: mapInstance,
                icon: {url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"}
            });

        } else {
            newPoly.setOptions({fillColor: outcolor})
        }


    });


});