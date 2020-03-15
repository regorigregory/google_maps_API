class MapSymbol {
    constructor(color) {
        this.path =
                "M454.848,198.848c0,159.225-179.751,306.689-179.751,306.689c-10.503,8.617-27.692,8.617-38.195,0	c0,0-179.751-147.464-179.751-306.689C57.153,89.027,146.18,0,256,0S454.848,89.027,454.848,198.848z " +
                "M256,298.89c-55.164,0-100.041-44.879-100.041-100.041S200.838,98.806,256,98.806	s100.041,44.879,100.041,100.041S311.164,298.89,256,298.89z";
        this.fillOpacity = 0.7;
        this.scale = 0.1;
        this.strokeColor = "black";
        this.strokeWeight = 1;
        this.fillColor = color;
        this.anchor = new google.maps.Point(260, 540);
        this.labelOrigin = new google.maps.Point(240, 200);

    }

}
class LuckyInsigthsHelper {
    constructor() {
        this.numberOfStates = 4;
        this.currentState = 0;
        this.stateFunctions = [GMAP.getInstance().placeLuckyMarker,
            GMAP.getInstance().setLuckySquare,
            GMAP.getInstance().finalizeLuckyInsightsEdit,
            GMAP.getInstance().getAnotherLuckyMarker
        ];
    }

    callMe() {
        if (this.numberOfStates <= this.currentState) {
            this.currentState = 0;
        }
        this.stateFunctions[this.currentState]();
        this.currentState++;
    }
}
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
        this.circles = [];
        this.squares = [];
        this.markers = [];
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

    placeMarkerAt(passedLoc, markerColor) {
        var instance = GMAP.getInstance();
        instance.markerCounter++;
        console.log(instance.defaultColorUrl)
        var newMarker = new google.maps.Marker({
            position: passedLoc,
            map: instance.mapObjectRef,
            draggable: true,
            animation: google.maps.Animation.DROP,
            //label: "#"+instance.markerCounter,
            title: "This is #" + instance.markerCounter + " marker, my friend.",

            icon: new MapSymbol(markerColor)

        });
        newMarker.setLabel("" + instance.markerCounter);
        instance.lastMarker = passedLoc;
    }

    placeLuckyMarker() {
        var instance = GMAP.getInstance();
        var center = instance.mapObjectRef.getCenter();
        instance.placeMarkerAt(center, "red");

    }

    setLuckySquare() {
        var instance = GMAP.getInstance();
        instance.drawSquare(instance.lastMarker)

    }

    finalizeLuckyInsightsEdit() {
        var instance = GMAP.getInstance();
        instance.lastSquare.setEditable(false);
        instance.placeLuckyInsightsCorners();
        instance.getAnotherLuckyMarker();
        //place four rich markers

        //place random markers

    }
    placeLuckyInsightsCorners() {
        var instance = GMAP.getInstance();
        var squareBounds = instance.lastSquare.getBounds();
        var sw = squareBounds.getSouthWest();
        var ne = squareBounds.getNorhEast();

        var x1 = sw.Lng();
        var y1 = sw.Lat();
        var x2 = ne.LNG();
        var y2 = ne.Lat();

        var coords = [new google.maps.LatLng(y1, x1),
            new google.maps.LatLng(y2, x1),
            new google.maps.LatLng(y2, x2),
            new google.maps.LatLng(y1, x2 )];

        for (var i = 0; i < 4; i++)
        {
            instance.placeMarkerAt(coords[i], "green");

        }
    }
    getAnotherLuckyMarker() {
        
        var instance = GMAP.getInstance();
        var instance = GMAP.getInstance();
        var squareBounds = instance.lastSquare.getBounds();

        var center = instance.lastSquare.getCenter();
        var sw = squareBounds.getSouthWest();
        var ne = squareBounds.getNorhEast();

        var cx = center.Lng();
        var cy = center.Lat();

        var x1 = sw.Lng();
        var y1 = sw.Lat();

        var x2 = ne.LNG();
        var y2 = ne.Lat();

        var x_diff = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(), new google.maps.LatLng()


                );

        var y_diff = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(), new google.maps.LatLng()


                );
        var new_x_dist = instance.getRandom(x_diff, 0);
        var new_y_dist = instance.getRandom(y_diff, 0);

        var new_x = google.maps.geometry.spherical.computeOffset();
        var new_y = google.maps.geometry.spherical.computeOffset();
        
        
        instance.placeMarkerAt(new google.maps.LatLng(new_y, new_x));
        
       
    }
    getRandom(range, minimum) {
        return Math.floor(Math.random() * range + minimum);
    }

    getRandomMarkerColour(range, minimum) {
        var instance = GMAP.getInstance();
        var markerColor = "rgb(" + Math.round(instance.getRandom(205, 50)) + "," + Math.round(instance.getRandom(205, 50)) + "," + Math.round(instance.getRandom(205, 50)) + ")";
        return markerColor;
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

            instance.placeMarkerAt(newCoords, instance.getRandomMarkerColour());
            instance.lastMarker = newCoords;
        }
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
            instance.placeMarkerAt(newCoords, instance.getRandomMarkerColour());
        } else {
            instance.lastMarker = newCoords;
        }
    }

    setMapStyle(e) {

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
        instance.circles.push(newCircle);
    }

    drawSquare(center) {
        var instance = GMAP.getInstance();
        instance.mapObjectRef.setCenter(center);
        var mapBounds = instance.mapObjectRef.getBounds();

        var newSqure = new google.maps.Rectangle({
            editable: true,
            bounds: mapBounds,
            fillColor: "yellow",
            fillOpacity: 0.5,

            center: instance.mapObjectRef.getCenter()
        });
        instance.mapObjectRef.setZoom(instance.mapObjectRef.getZoom() - 1);


        newSqure.setMap(instance.mapObjectRef);
        instance.lastSquare = newSqure;
        instance.squares.push(newSqure);


    }
    notTooFar() {
        var instance = GMAP.getInstance();
        var center = instance.lastMarker;
        instance.drawCircle();
        var newLocation = google.maps.geometry.spherical.computeOffset(center, instance.getRandom(300000, 0), instance.getRandom(360, 0));
        instance.placeMarkerAt(newLocation, instance.getRandomMarkerColour());
        instance.mapObjectRef.panTo(newLocation);
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
        instance.placeMarkerAt(startCoordinates, instance.getRandomMarkerColour());
        instance.lngInput.value = Math.round(startCoordinates.lng());
        instance.latInput.value = Math.round(startCoordinates.lat());
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
userControls["notTooFar"] = document.getElementById("notTooFar");
userControls["antipode"] = document.getElementById("antipode");
//bound actions


userControls["latInput"].addEventListener("input", GMAP.getInstance().moveTo);
userControls["lngInput"].addEventListener("input", GMAP.getInstance().moveTo);
userControls["addAndMove"].addEventListener("click", GMAP.getInstance().addMarker);
userControls["notTooFar"].addEventListener("click", GMAP.getInstance().notTooFar);
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
