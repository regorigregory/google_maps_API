

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
        var startCoordinates = {lat: this.getRandomLatitude(), lng: this.getRandomLongitude()};
        this.startingOpts = {zoom: 4, position: startCoordinates};
        this.startCoordinates = startCoordinates;

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
        var instance = GMAP.getInstance();
        instance.map = new google.maps.Map(instance.mapHolder,instance.startingOpts );
        //instance.startingMarker = new google.maps.Marker({position: instance.gLoc, map: instance.map});

    }
    addMarker() {
        throw "Yet to be implemented.";

    }
    moveTo(moveToTheseCoords) {

        throw "Yet to be implemented.";

    }
    moveToLondon() {

        throw "Yet to be implemented.";

    }
    zoomIn() {

        throw "Yet to be implemented.";

    }
    zoomOut() {

        throw "Yet to be implemented.";

    }
    toggleMapStyle() {
        throw "Yet to be implemented.";

    }

}

GMAP.getInstance().initMap();





function initMap(){
    console.log("I have been called");
    var startCoordinates = {lat: 51.50, lng:0};
    
    var mapDomElement = document.getElementById("map")
    
    var map = new google.maps.Map(mapDomElement, {zoom:4, center: startCoordinates});
    var markerTest =new google.maps.Marker({position:startCoordinates, map:map});
    
    
}



//GMAP.getInstance()
initMap();
