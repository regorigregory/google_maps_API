

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})



$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

class GMAP {
    instance;
    constructor() {
        this.mapHolder = document.getElementById("map");
        this.initialZoom = 4;
        this.startCoordinates = {lat: this.getRandomLatitude(), lng: this.getRandomLongitude()};
        //this.startingOpts = {zoom: 4, position: startCoordinates};
        this.mapTypes = ["terrain", "hybrid", "satellite", "roadmap"];
        this.londonCoords = {lat: 51.5074, lng: 0.1278};
        this.currentMapTypeIndex = 0;
        GMAP.instance = this;
    }
    ;
            static getInstance() {
        if (GMAP.instance == undefined) {
            GMAP.instance = new GMAP();
        }
        return GMAP.instance;
    }

    getRandom(range, minimum) {
        return Math.floor(Math.random() * range + minimum);
    }

    getRandomLatitude() {
        return this.getRandom(180, -90);

    }

    getRandomLongitude() {
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

        var map = new google.maps.Map(mapDomElement, {zoom: instance.initialZoom, center: startCoordinates});

        var markerTest = new google.maps.Marker({position: startCoordinates, map: map});
        this.mapObjectRef = map
    }
    addMarker() {
        console.log("addMarker has been called");
        var latitude = parseInt(document.getElementById("markerLatitudeInput").value);
        var longitude = parseInt(document.getElementById("markerLongitudeInput").value);
        console.log(latitude);
        console.log(longitude)
        var error = false;
        var outputMessage = "";

        if (isNaN(longitude) || longitude > 180 || longitude < -180) {
            outputMessage = "Please correct the following errors:\nThe provided longitude values are not valid."
            error = true;
        }

        if (isNaN(latitude) || latitude > 90 || latitude < -90) {
            outputMessage += "\nThe provided latitude values are not valid."
            error = true;
        }

        if (error) {
            alert(outputMessage)
        } else {
            var instance = GMAP.getInstance();
            var newCoords = {lat: latitude, lng: longitude}
            instance.mapObjectRef.setCenter(newCoords);
            var markerTest = new google.maps.Marker({position: newCoords, map: instance.mapObjectRef});
        }
    }
    moveTo() {
        console.log("Moveto has been called");
        var latitude = parseInt(document.getElementById("latitudeInput").value);
        var longitude = parseInt(document.getElementById("longitudeInput").value);
        console.log(latitude);
        console.log(longitude)
        var error = false;
        var outputMessage = "";

        if (isNaN(longitude) || longitude > 180 || longitude < -180) {
            outputMessage = "Please correct the following errors:\nThe provided longitude values are not valid."
            error = true;
        }

        if (isNaN(latitude) || latitude > 90 || latitude < -90) {
            outputMessage += "\nThe provided latitude values are not valid."
            error = true;
        }

        if (error) {
            alert(outputMessage)
        } else {
            var instance = GMAP.getInstance();
            instance.mapObjectRef.setCenter({lat: latitude, lng: longitude});
        }

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
    setMapStyle(e) {
        //con
        //var selectedIndex = parseInt(selectedIndex.value)

        var instance = GMAP.getInstance();
        instance.currentMapTypeIndex = e.target.value;
        var nextMapType = instance.mapTypes[e.target.value];

        instance.toggleMapStyle();
    }

    toggleMapStyle() {
        var instance = GMAP.getInstance();
        var currentIndex = instance.currentMapTypeIndex;
        var nextMapType = instance.mapTypes[currentIndex];

        if (instance.currentMapTypeIndex == instance.mapTypes.length - 1) {
            instance.currentMapTypeIndex = -1;
        }
        instance.currentMapTypeIndex++;

        instance.mapObjectRef.setMapTypeId(nextMapType);

    }

    initMapTypeSelect(selectedContainerID) {
        var instance = GMAP.getInstance();
        instance.mapTypeSelectID = selectedContainerID;

        var container = document.getElementById(selectedContainerID);
        var selectElement = document.createElement("select")
        instance.mapTypeSelect = selectElement;
        selectElement.classList.add("form-control");
        selectElement.name = "mapTypeSelect"
        for (var i = 0; i < instance.mapTypes.length; i++) {
            var option = document.createElement("option");
            option.value = parseInt(i)
            option.id = "map_type_" + i
            option.text = instance.mapTypes[i]
            selectElement.add(option)
        }

        selectElement.addEventListener("change", instance.setMapStyle);
        container.appendChild(selectElement);
    }

}




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
GMAP.getInstance().initMapTypeSelect("mapStyleSelectContainer")

userControls = {};
userControls["moveToElement"] = document.getElementById("travelTo");
userControls["moveToLondonElement"] = document.getElementById("moveToLondon");
userControls["addMarkerElement"] = document.getElementById("addMarkerTo");
userControls["zoomInElement"] = document.getElementById("zoomIn");
userControls["zoomOutElement"] = document.getElementById("zoomOut");
userControls["toggleMapElement"] = document.getElementById("toggleMapStyle");


userControls["moveToElement"].addEventListener("click", GMAP.getInstance().moveTo);
userControls["moveToLondonElement"].addEventListener("click", GMAP.getInstance().moveToLondon);
userControls["addMarkerElement"].addEventListener("click", GMAP.getInstance().addMarker);
userControls["zoomInElement"].addEventListener("click", GMAP.getInstance().zoomIn);
userControls["zoomOutElement"].addEventListener("click", GMAP.getInstance().zoomOut);
userControls["toggleMapElement"].addEventListener("click", GMAP.getInstance().toggleMapStyle);
