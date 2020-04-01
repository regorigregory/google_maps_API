function startUp(){
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

  mapWrapperConfig = {};
  mapWrapperConfig.elementIDS={};
  mapWrapperConfig.elementIDS["latInput"] = "userInputLAT";
  mapWrapperConfig.elementIDS["lngInput"] ="userInputLNG";
  mapWrapperConfig.elementIDS["addAndMove"] ="putMarkerHere";
  mapWrapperConfig.elementIDS["drawCircle"] = "drawCircle";
  mapWrapperConfig.elementIDS["drawPoly"] = "drawPoly";
  mapWrapperConfig.elementIDS["drawSquare"] = "drawSquare";
  mapWrapperConfig.elementIDS["notTooFar"] = "notTooFar";
  mapWrapperConfig.elementIDS["antipode"] ="antipode";
 
  mapWrapperConfig.elementIDS["streetviewContainer"] = "streetviewContainer";
  mapWrapperConfig.elementIDS["locationInfoMarker"] = "getDynamicMarker";

  
  var mapWrapper =  GMAP.getInstance();
  mapWrapper.configure(mapWrapperConfig);
  mapWrapper.initMap(mapWrapperConfig);

  //The three lines below are deprecated...
  //Just left here to support "legacy" functions
  // having done during the workshops
  mapWrapperConfig.availableColors = ["red", "green", "blue", "orange", "pink", "yellow", "gray", "purple"];
  mapWrapperConfig.defaultColorURL = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
  mapWrapperConfig.mapIconBaseUrl = "https://maps.google.com/mapfiles/ms/icons/COLOR-dot.png";
  
  var dirHandlerConfig = {};
  dirHandlerConfig.elementIDS = {};
  dirHandlerConfig.elementIDS.autoCompleteContainer = "autocompleteInputs";
  dirHandlerConfig.elementIDS.waypoint = "addWaypointTrigger";
  dirHandlerConfig.elementIDS.routeRequest = "routeRequestTrigger";
  dirHandlerConfig.elementIDS.routeMode = "modeSelector";
  dirHandlerConfig.elementIDS.routeDate = "dateSelector";
  dirHandlerConfig.elementIDS.routeTime = "timeSelector";

  var dirHandler = DirectionsHandler.getInstance();
  dirHandler.configure(dirHandlerConfig);

  mapWrapperConfig.dirHandler = dirHandler;
  
}

google.maps.event.addDomListener(window, 'load', startUp);






