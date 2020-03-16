GMAP.getInstance();
GMAP.instance.availableColors = ["red", "green", "blue", "orange", "pink", "yellow", "gray", "purple"];
GMAP.instance.defaultColorURL = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
GMAP.instance.mapIconBaseUrl = "https://maps.google.com/mapfiles/ms/icons/COLOR-dot.png";
GMAP.instance.latInput = document.getElementById("userInputLAT");
GMAP.instance.lngInput = document.getElementById("userInputLNG");

//specyfying user controls

userControls = {};
userControls["latInput"] = document.getElementById("userInputLAT");
userControls["lngInput"] = document.getElementById("userInputLNG");
userControls["addAndMove"] = document.getElementById("putMarkerHere");
userControls["drawCircle"] = document.getElementById("drawCircle");
userControls["drawPoly"] = document.getElementById("drawPoly");

userControls["drawSquare"] = document.getElementById("drawSquare");
userControls["notTooFar"] = document.getElementById("notTooFar");
userControls["antipode"] = document.getElementById("antipode");
userControls["fromHere"] = document.getElementById("fromHere");
userControls["toHere"] = document.getElementById("toHere");

userControls["routeTrigger"] = document.getElementById("routeTrigger");
userControls["modeSelector"] = document.getElementById("modeSelector");
userControls["streetviewContainer"] = document.getElementById("streetviewContainer");


GMAP.getInstance().userControls = userControls;

//initializing map and its components...

GMAP.getInstance().initMap();
GMAP.getInstance().LIH = LuckyInsigthsHelper.getInstance();
GMAP.getInstance().LIH.init(GMAP.getInstance().userControls.drawSquare);

GMAP.getInstance().initMapTypeSelect("upperControls")
GMAP.getInstance().DH = new DrawingHandler(GMAP.getInstance().userControls.drawPoly);
GMAP.getInstance().AH = new AutoCompleteHandler();

//binding the actions

userControls["latInput"].addEventListener("input", GMAP.getInstance().moveTo);
userControls["lngInput"].addEventListener("input", GMAP.getInstance().moveTo);
userControls["addAndMove"].addEventListener("click", GMAP.getInstance().addMarker);
userControls["notTooFar"].addEventListener("click", GMAP.getInstance().notTooFar);

userControls["drawSquare"].addEventListener("click", LuckyInsigthsHelper.getInstance().nextPhase);

userControls["antipode"].addEventListener("click", GMAP.getInstance().moveToAntipode);

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
];

GMAP.getInstance().mapObjectRef.setOptions({ styles: testStyles });

//UI styling

$("#drawPoly").click(function () {
    $(this).toggleClass("btn-success", 3000, "fadeIn");
    $(this).toggleClass("btn-danger", 3000, "fadeIn");

});







