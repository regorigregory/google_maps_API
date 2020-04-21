

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

class GMAP {
    static instance;
    constructor() {
        this.mapHolder = document.getElementById("map");
        this.initialZoom = 4;
        this.startCoordinates = {lat: this.getRandomLatitude(), lng: this.getRandomLongitude()};
        this.gLoc=new google.maps.LatLng(this.startCoordinates.lat, this.startCoordinates.lng);

        this.startingOpts = {position: this.gLoc, zoom: this.initialZoom};
        GMAP.instance = this;
    };
    
    static getInstance(){
        if (GMAP.instance == undefined){
            GMAP.instance =  new GMAP();
        }
        return GMAP.instance;
    }
    
    getRandom(range, minimum){
        return Math.random()*range+minimum;
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
        instance.startingMarker = new google.maps.Marker({position: instance.gLoc, map: instance.map});
                debugger;

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

