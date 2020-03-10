

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})



$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

class GMAP {
    static instance;
    constructor() {
        this.mapHolder = document.getElementById("map");
        this.initialZoom = 4;
        this.startCoordinates = {lat: this.getRandomLatitude(), lng: this.getRandomLongitude()};
        //this.startingOpts = {zoom: 4, position: startCoordinates};
        this.mapTypes = ["terrain", "hybrid", "satellite", "roadmap"];
        this.londonCoords = {lat: 51.5074, lng:0.1278};
        this.currentMapTypeIndex = 0;
        GMAP.instance = this;
    };
    
    static getInstance(){
        if (GMAP.instance == undefined){
            GMAP.instance =  new GMAP();
        }
        return GMAP.instance;
    }
    
    getRandom(range, minimum){
        return Math.floor(Math.random()*range+minimum);
    }
    
    getRandomLatitude(){
        return this.getRandom(180, -90);
        
    }
    
    getRandomLongitude(){
         return this.getRandom(360, -180);
        
    }
    
    
    initMap() {
        //var instance = GMAP.getInstance();
        //instance.map = new google.maps.Map(instance.mapHolder,instance.startingOpts );
        //instance.startingMarker = new google.maps.Marker({position: instance.gLoc, map: instance.map});
        console.log("I have been called");
            var instance = GMAP.getInstance();
            var startCoordinates = instance.startCoordinates;
            //var startCoordinates = {lat: 51.50, lng:0};

            var mapDomElement = document.getElementById("map")

           var map = new google.maps.Map(mapDomElement, {zoom:instance.initialZoom, center: startCoordinates});

            var markerTest =new google.maps.Marker({position:startCoordinates, map:map});
        this.mapObjectRef = map
    }
    addMarker() {
        throw "Yet to be implemented.";

    }
    moveTo(moveToTheseCoords) {

        throw "Yet to be implemented.";

    }
    moveToLondon() {
        var instance = GMAP.getInstance();     
        var londonCoords = instance.londonCoords;
        instance.mapObjectRef.setCenter(londonCoords);
        var newMarker = new google.maps.Marker({position: londonCoords, map: instance.mapObjectRef});
       // throw "Yet to be implemented.";

    }
    zoomIn() {
        console.log("I have been clicked");
           var instance = GMAP.getInstance();     
        var currentZoom = instance.mapObjectRef.zoom;
        instance.mapObjectRef.setZoom(++currentZoom);
    }
    zoomOut() {
                console.log("I have been clicked");
        var instance = GMAP.getInstance();     
        var currentZoom = instance.mapObjectRef.zoom;
        instance.mapObjectRef.setZoom(--currentZoom);

    }
    toggleMapStyle() {
                console.log("I have been clicked");
       var instance = GMAP.getInstance();             
       var currentIndex = instance.currentMapTypeIndex;
       var nextMapType = instance.mapTypes[currentIndex];
       
       if(instance.currentMapTypeIndex==instance.mapTypes.length-1){
           instance.currentMapTypeIndex = -1;
       }
       instance.currentMapTypeIndex++;
       
       instance.mapObjectRef.setMapTypeId(nextMapType);

    }

}

GMAP.getInstance().initMap();


userControls = {};
userControls["moveToElement"] = document.getElementById("moveTo");
userControls["moveToLondonElement"] = document.getElementById("moveToLondon");
userControls["addMarkerElement"] = document.getElementById("addMarker");
userControls["zoomInElement"] = document.getElementById("zoomIn");
userControls["zoomOutElement"] = document.getElementById("zoomOut");
userControls["toggleMapElement"] = document.getElementById("toggleMapStyle");


//userControls["moveToElement"].onclick(GMAP.getInstance().moveTo);
userControls["moveToLondonElement"].addEventListener("click", GMAP.getInstance().moveToLondon);
userControls["addMarkerElement"].addEventListener("click", GMAP.getInstance().addMarker);
userControls["zoomInElement"].addEventListener("click", GMAP.getInstance().zoomIn);
userControls["zoomOutElement"].addEventListener("click", GMAP.getInstance().zoomOut);
userControls["toggleMapElement"].addEventListener("click", GMAP.getInstance().toggleMapStyle);


//function initMap(){
//    console.log("I have been called");
//    var startCoordinates = {lat: 51.50, lng:0};
//    
//    var mapDomElement = document.getElementById("map")
//    
//    var map = new google.maps.Map(mapDomElement, {zoom:4, center: startCoordinates});
//    var markerTest =new google.maps.Marker({position:startCoordinates, map:map});
//return map
//    
//}



GMAP.getInstance().initMap();
