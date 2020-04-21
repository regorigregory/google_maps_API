function startUp(){
  var mapWrapperConfig = {};
  mapWrapperConfig.elementIDS={};
  mapWrapperConfig.elementIDS["latInput"] = "userInputLAT";
  mapWrapperConfig.elementIDS["lngInput"] ="userInputLNG";
  mapWrapperConfig.elementIDS["addAndMove"] ="putMarkerHere";
  mapWrapperConfig.elementIDS["drawCircle"] = "drawCircle";
  mapWrapperConfig.elementIDS["drawPoly"] = "drawPoly";
  mapWrapperConfig.elementIDS["drawSquare"] = "drawSquare";
  mapWrapperConfig.elementIDS["notTooFar"] = "notTooFar";
  mapWrapperConfig.elementIDS["antipode"] ="antipode";
  mapWrapperConfig.elementIDS["mapType"] ="mapTypeSelect";
  mapWrapperConfig.elementIDS["streetviewContainer"] = "streetviewContainer";
  mapWrapperConfig.elementIDS["locationInfoMarker"] = "getDynamicMarker";

  var mapWrapper =  GMAP.getInstance();
  mapWrapper.initMap();

  mapWrapper.configure(mapWrapperConfig);

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
  dirHandlerConfig.elementIDS.removeWaypoint = "removeWaypointTrigger";

  dirHandlerConfig.elementIDS.routeRequest = "routeRequestTrigger";
  dirHandlerConfig.elementIDS.routeMode = "modeSelector";
  dirHandlerConfig.elementIDS.routeDate = "dateSelector";
  dirHandlerConfig.elementIDS.routeTime = "timeSelector";

  var dirHandler = DirectionsHandler.getInstance();
  dirHandler.configure(dirHandlerConfig);

  mapWrapperConfig.dirHandler = dirHandler;

  mapWrapper.PD = PolygonDrawer.getInstance();
  mapWrapper.PD.setPolyTrigger(mapWrapperConfig.elementIDS.drawPoly);
}

google.maps.event.addDomListener(window, 'load', startUp);






