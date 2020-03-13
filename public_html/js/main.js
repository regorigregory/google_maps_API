

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
        this.markerCounter = 0;
        this.colorIndex = 0;
        GMAP.instance = this;
    }

    static getInstance() {
        if (GMAP.instance == undefined) {
            GMAP.instance = new GMAP();
            GMAP.instance.availableColors = ["red", "green", "blue", "orange", "pink", "yellow", "gray", "purple"];
            GMAP.instance.defaultColorURL = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
            GMAP.instance.mapIconBaseUrl = "https://maps.google.com/mapfiles/ms/icons/COLOR-dot.png";
            GMAP.instance.latInput = document.getElementById("userInputLAT");
            GMAP.instance.lngInput = document.getElementById("userInputLNG");
            GMAP.instance.requiredRadius = 300000;
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
    getNextColorUrl() {
        var instance = GMAP.getInstance();
        instance.colorIndex++;
        if (!(instance.colorIndex < instance.availableColors.length)) {
            instance.colorIndex = 0;
        }
        var nextIndex = instance.colorIndex
        var nextColorUrl = instance.mapIconBaseUrl.replace("COLOR", instance.availableColors[nextIndex]);
        return nextColorUrl;
    }

    checkIFCoordsAreValid() {
        var instance = GMAP.getInstance();
        var latitude = parseInt(instance.latInput.value);
        var longitude = parseInt(instance.lngInput.value);
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
            console.log(outputMessage)
            return false;
        }
        return true;
    }
    addMarker() {
        var instance = GMAP.getInstance();
        if (instance.checkIFCoordsAreValid())
        {
            var latitude = parseInt(instance.latInput.value);
            var longitude = parseInt(instance.lngInput.value);
            var newCoords = {lat: latitude, lng: longitude}
            instance.mapObjectRef.setCenter(newCoords);
            instance.placeMarkerAt(newCoords, false);
            instance.lastMarker = newCoords;
        }
    }
    placeMarkerAt(passedLoc, defaultColor) {
        console.log(passedLoc);
        var instance = GMAP.getInstance();
        instance.markerCounter++;
        console.log(instance.defaultColorUrl)
        var colorURL = (defaultColor == true) ? instance.defaultColorURL : instance.getNextColorUrl();
        var newMarker = new google.maps.Marker({
            position: passedLoc,
            map: instance.mapObjectRef,
            draggable: true,
            animation: google.maps.Animation.DROP,
            //label: "#"+instance.markerCounter,
            title: "This is #" + instance.markerCounter + " marker, my friend.",
            icon: {url: colorURL}

        });
//        var newMarker = new google.maps.Marker({
//            map: instance.mapObjRef,
//            position: passedLoc
//                    //draggable: true,
//                    //animation: google.maps.Animation.DROP,
//                    //label: "#" + instance.markerCounter
//                    //colorType: "orange"
//        });

    }
    moveTo() {
        var instance = GMAP.getInstance();
        if (instance.checkIFCoordsAreValid())
        {
            var latitude = parseInt(instance.latInput.value);
            var longitude = parseInt(instance.lngInput.value);
            instance.mapObjectRef.panTo({lat: latitude, lng: longitude});
        }




    }
    moveToLondon() {
        var instance = GMAP.getInstance();
        var londonCoords = instance.londonCoords;
        instance.mapObjectRef.panTo(londonCoords);
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
    drawCircle() {
        var instance = GMAP.getInstance();
        var lastMarkerCoords = instance.lastMarker;
        console.log(lastMarkerCoords);
        var userRadius = 300 * 1000;
        var newCircle = new google.maps.Circle({
            map: instance.mapObjectRef,
            fillOpacity: 0.3,
            fillColor: "red",
            center: lastMarkerCoords,
            radius: 300000
        });
        var bounds = newCircle.getBounds();
        //latitude
        var diff_x = Math.abs(bounds.Za.i-bounds.Za.j);
        //longitude
        var diff_y = Math.abs(bounds.Ua.i-bounds.Ua.j);
        
        var ratio = diff_x/diff_y
        
        var randomLat = instance.getRandom(diff_x, bounds.Za.i)
        
        var randomLng = instance.getRandom(diff_x, bounds.Za.i)

        console.log("x diff:"+Math.abs(bounds.Za.i-bounds.Za.j));
        console.log("y diff:"+Math.abs(bounds.Ua.i-bounds.Ua.j));

        instance.lastCircle = newCircle;
    }
    // stolen from: https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
    haversine(center, newLoc) {
        Number.prototype.toRad = function () {
            return this * Math.PI / 180;
        }

        var lat2 = center.lat;
        var lon2 = center.lon;
        var lat1 = newLoc.lat;
        var lon1 = newLoc.lon;
        var R = 6371; // km 

        var x1 = lat2 - lat1;
        var dLat = x1.toRad();
        var x2 = lon2 - lon1;
        var dLon = x2.toRad();
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }
    getRandomHaverSineWithinRange() {


    }
    getRandomLocationWithinRange() {
        var isntance = GMAP.getInstance();
        var maxDistance = instance.requiredRadius;
        var distance = 301;
        var lastCircle = instance.lastCircle;
        var bounds = lastCircle.getBounds();


        var coords = instance.getRandomHaverSineWithinRange();
        instance.placeMarkerAt(coords);
    }

    updateLatLngInputs() {

        var instance = GMAP.getInstance();
        var coords = instance.mapObjectRef.getCenter();
        coords = new google.maps.LatLng({lat: coords.lat(), lng: coords.lng()});
        console.log(coords.lat());
        console.log(coords.lng());
        instance.latInput.value = coords.lat();
        instance.lngInput.value = coords.lng();
    }
    initMap()
    {
        //var instance = GMAP.getInstance();
        //instance.map = new google.maps.Map(instance.mapHolder,instance.startingOpts );
        //instance.startingMarker = new google.maps.Marker({position: instance.gLoc, map: instance.map});
        var instance = GMAP.getInstance();
        var startCoordinates = instance.startCoordinates;
        //var startCoordinates = {lat: 51.50, lng:0};
        instance.lastMarker = startCoordinates;
        var mapDomElement = document.getElementById("map")

        var map = new google.maps.Map(mapDomElement, {zoom: instance.initialZoom, center: startCoordinates});
        instance.mapObjectRef = map;

        instance.mapObjectRef.addListener('center_changed', GMAP.getInstance().updateLatLngInputs);


        //var markerTest = new google.maps.Marker({position: startCoordinates, map: map});
        instance.placeMarkerAt(startCoordinates, true);
        //instance.lngInput.value = Math.round(startCoordinates["lng"]);
        //instance.latInput.value = Math.round(startCoordinates["lat"]);
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
userControls["latInput"] = document.getElementById("userInputLAT");
userControls["lngInput"] = document.getElementById("userInputLNG");
userControls["addAndMove"] = document.getElementById("putMarkerHere");
userControls["drawCircle"] = document.getElementById("drawCircle");

//bound actions


userControls["latInput"].addEventListener("input", GMAP.getInstance().moveTo);
userControls["lngInput"].addEventListener("input", GMAP.getInstance().moveTo);
userControls["addAndMove"].addEventListener("click", GMAP.getInstance().addMarker);
userControls["drawCircle"].addEventListener("click", GMAP.getInstance().drawCircle);

//buttons

//userControls["addMarkerElement"] = document.getElementById("addMarkerTo");
//userControls["zoomInElement"] = document.getElementById("zoomIn");
//userControls["zoomOutElement"] = document.getElementById("zoomOut");
//userControls["toggleMapElement"] = document.getElementById("toggleMapStyle");


//userControls["moveToElement"].addEventListener("click", GMAP.getInstance().moveTo);
//userControls["moveToLondonElement"].addEventListener("click", GMAP.getInstance().moveToLondon);
//userControls["addMarkerElement"].addEventListener("click", GMAP.getInstance().addMarker);
//userControls["zoomInElement"].addEventListener("click", GMAP.getInstance().zoomIn);
//userControls["zoomOutElement"].addEventListener("click", GMAP.getInstance().zoomOut);
//userControls["toggleMapElement"].addEventListener("click", GMAP.getInstance().toggleMapStyle);
