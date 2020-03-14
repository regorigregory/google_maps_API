

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
        this.startCoordinates = new google.maps.LatLng(this.getRandomLatitude(), this.getRandomLongitude());
        //this.startingOpts = {zoom: 4, position: startCoordinates};
        this.mapTypes = ["terrain", "hybrid", "satellite", "roadmap"];
        this.londonCoords = new google.maps.LatLng(51.5074, 0.1278);

        this.currentMapTypeIndex = 0;
        this.markerCounter = 0;
        this.colorIndex = 0;
        this.antipodeSwitch = 0;
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
        instance.antipodeSwitch = 0;
        if (instance.checkIFCoordsAreValid())
        {
            var latitude = parseInt(instance.latInput.value);
            var longitude = parseInt(instance.lngInput.value);
            var newCoords = new google.maps.LatLng(latitude, longitude);
            instance.mapObjectRef.setCenter(newCoords);
            instance.placeMarkerAt(newCoords, false);
            instance.lastMarker = newCoords;
        }
    }
    placeMarkerAt(passedLoc, defaultColor) {
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
        instance.lastMarker = passedLoc;


    }
    moveTo() {
        var instance = GMAP.getInstance();
        if (instance.checkIFCoordsAreValid())
        {
            var latitude = parseInt(instance.latInput.value);
            var longitude = parseInt(instance.lngInput.value);
            var coords = new google.maps.LatLng(latitude, longitude);
            instance.mapObjectRef.setCenter(coords);
        }
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
    moveToAntipode() {
        var instance = GMAP.getInstance();
        instance.antipodeSwitch++;
        var markerCoords = instance.lastMarker;
        var newLat = 0 - markerCoords.lat();
        var isPositive = markerCoords.lng() >= 0 ? true : false;
        var newLong = 180 - Math.abs(markerCoords.lng());
        var signOfNewLong = Math.sign(markerCoords.lng());
        newLong = newLong * (0 - signOfNewLong);

        var newCoords = new google.maps.LatLng(newLat, newLong);
        //var newGoogleCoords = new google.maps.LatLng(newCoords);
        instance.mapObjectRef.panTo(newCoords);

        if (instance.antipodeSwitch == 1) {
            instance.placeMarkerAt(newCoords);
        } else {
            instance.lastMarker = newCoords;
        }
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

        var x_i_neg = bounds.Za.i < 0 ? true : false;
        var x_j_neg = bounds.Za.i < 0 ? true : false;


        var diff_x = Math.abs(bounds.Za.i) - Math.abs(bounds.Za.j);

        //longitude
        var diff_y = Math.abs(bounds.Ua.i - bounds.Ua.j);

        var ratio = diff_x / diff_y

        var randomLat = instance.getRandom(diff_x, bounds.Za.i)

        var randomLng = instance.getRandom(diff_x, bounds.Za.i)

        console.log("x diff:" + Math.abs(bounds.Za.i - bounds.Za.j));
        console.log("y diff:" + Math.abs(bounds.Ua.i - bounds.Ua.j));

        instance.lastCircle = newCircle;
    }
    drawSquare() {
        var instance = GMAP.getInstance();
        var bounds = instance.mapObjectRef.getBounds();
        //Ua: longitude
        var lng1 = bounds.Ua.i
        var lng2 = bounds.Ua.j


        //Za: latitude
        var lat1 = bounds.Za.i
        var lat2 = bounds.Za.j



        var diff_lat = 0;

        diff_lat = Math.abs(lat2 - lat1);


        var newLat1 = lat1 + 0.1 * diff_lat;
        var newLat2 = lat2 - 0.1 * diff_lat;
        var newLng1 = lng1 + 0.1 * diff_lng;
        var newLng2 = lng2 + 0.1 * diff_lng;

        var rectangle = new google.maps.Rectangle({
            strokeColor: "green",
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: "red",
            fillOpacity: 0.35,
            map: instance.mapObjectRef
        });


        var sw = new google.maps.LatLng(newLat1, newLng1);
        var se = new google.maps.LatLng(newLat1, newLng2);
        var nw = new google.maps.LatLng(newLat2, newLng1);
        var ne = new google.maps.LatLng(newLat2, newLng2);


        var rectangleBounds = new google.maps.LatLngBounds(sw, ne);
        rectangle.setBounds(rectangleBounds);
        instance.colorIndex = 0;

        instance.placeMarkerAt(sw);
        instance.colorIndex = 0;

        instance.placeMarkerAt(se);
        instance.colorIndex = 0;

        instance.placeMarkerAt(nw);

        instance.colorIndex = 0;

        instance.placeMarkerAt(ne);




    }
    updateLatLngInputs() {
        var instance = GMAP.getInstance();
        var coords = new google.maps.LatLng(instance.mapObjectRef.getCenter().lat(), instance.mapObjectRef.getCenter().lng());

        instance.latInput.removeEventListener("input", GMAP.getInstance().moveTo);
        instance.lngInput.removeEventListener("input", GMAP.getInstance().moveTo);

        instance.latInput.value = Math.round(coords.lat());
        instance.lngInput.value = Math.round(coords.lng());

        instance.latInput.addEventListener("input", GMAP.getInstance().moveTo);
        instance.lngInput.addEventListener("input", GMAP.getInstance().moveTo);

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

        var map = new google.maps.Map(mapDomElement, {
            zoom: instance.initialZoom,
            center: startCoordinates, });
        instance.mapObjectRef = map;

        instance.mapObjectRef.addListener('center_changed', GMAP.getInstance().updateLatLngInputs);

        instance.updateLatLngInputs();

        //var markerTest = new google.maps.Marker({position: startCoordinates, map: map});
        instance.placeMarkerAt(startCoordinates, true);
        instance.lngInput.value = Math.round(startCoordinates.lng());
        instance.latInput.value = Math.round(startCoordinates.lat());
    }
    static round_to_precision(x, precision) {
        var y = +x + (precision === undefined ? 0.5 : precision / 2);
        return y - (y % (precision === undefined ? 1 : +precision));
    }
    
    distance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        } else {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit == "K") {
                dist = dist * 1.609344
            }
            if (unit == "N") {
                dist = dist * 0.8684
            }
            return dist;
        }
    }
}





GMAP.getInstance().initMap();
GMAP.getInstance().initMapTypeSelect("menuForm")

userControls = {};
userControls["latInput"] = document.getElementById("userInputLAT");
userControls["lngInput"] = document.getElementById("userInputLNG");
userControls["addAndMove"] = document.getElementById("putMarkerHere");
userControls["drawCircle"] = document.getElementById("drawCircle");
userControls["drawSquare"] = document.getElementById("drawSquare");

userControls["antipode"] = document.getElementById("antipode");

//bound actions


userControls["latInput"].addEventListener("input", GMAP.getInstance().moveTo);
userControls["lngInput"].addEventListener("input", GMAP.getInstance().moveTo);
userControls["addAndMove"].addEventListener("click", GMAP.getInstance().addMarker);
userControls["drawCircle"].addEventListener("click", GMAP.getInstance().drawCircle);

userControls["drawSquare"].addEventListener("click", GMAP.getInstance().drawSquare);

userControls["antipode"].addEventListener("click", GMAP.getInstance().moveToAntipode);
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
