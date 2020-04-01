class LuckyInsigthsHelper {
    constructor() {

    }
    static getInstance() {
        if (LuckyInsigthsHelper.luckyInstance == undefined) {
            LuckyInsigthsHelper.luckyInstance = new LuckyInsigthsHelper();
        }
        return LuckyInsigthsHelper.luckyInstance;
    }
    init(stringID) {
        var luckyInstance = LuckyInsigthsHelper.getInstance();

        luckyInstance.numberOfStates = 2;
        luckyInstance.currentState = 0;
        luckyInstance.buttonInstance = document.getElementById(stringID);
        luckyInstance.buttonInstance.addEventListener("click", luckyInstance.nextPhase);

        luckyInstance.classes = ["btn-secondary", "btn-primary"];

        luckyInstance.stateFunctions = [
            GMAP.getInstance().startLuckyInsights,
            GMAP.getInstance().finalizeLuckyInsightsEdit,
            GMAP.getInstance().getAnotherLuckyMarker
        ];

    }

    nextPhase() {
        var luckyInstance = LuckyInsigthsHelper.getInstance();

        var functionPointer = luckyInstance.stateFunctions[luckyInstance.currentState];

        functionPointer();

        luckyInstance.currentState++;

        luckyInstance.buttonInstance.classList.remove(luckyInstance.classes[luckyInstance.currentState - 1]);

        if (luckyInstance.numberOfStates <= luckyInstance.currentState) {
            luckyInstance.currentState = 0;
        }

        luckyInstance.buttonInstance.classList.add(luckyInstance.classes[luckyInstance.currentState]);

    }
}

class GMAP {

    //*******************************************************************
    //** Init functions *************************************************
    //*******************************************************************

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
        this.uiElementPointers = {};
    }

    configure(opts) {
        var myself = GMAP.getInstance();
        myself.configObject = opts;
        var ids = opts.elementIDS;

        myself.configUIElement(ids.latInput, "latInput", "input", myself.moveTo);
        myself.configUIElement(ids.lngInput, "lngInput", "input", myself.moveTo);


        myself.configUIElement(ids.addAndMove, "addAndMove", "click", myself.addMarker);
        myself.configUIElement(ids.notTooFar, "notTooFar", "click", myself.notTooFar);

        myself.configUIElement(ids.antipode, "antipode", "click", myself.moveToAntipode);


        myself.configUIElement(ids.locationInfoMarker, "locationInfoMarker", "click", myself.addLocationInfoMarker);
        myself.configUIElement(ids.mapType, "mapTypeSelect", "change", myself.setMapStyle);

        myself.initMap();


        myself.LIH = LuckyInsigthsHelper.getInstance();
        myself.LIH.init(ids.drawSquare);



    }


    configUIElement(stringID, key, action, functionToBind) {
        var myself = GMAP.getInstance();
        var element = document.getElementById(stringID);
        this.uiElementPointers[key] = element;
        element.addEventListener(action, functionToBind);
    }

    initMap() {

        var instance = GMAP.getInstance();
        var startCoordinates = instance.londonCoords;
        //var startCoordinates = {lat: 51.50, lng:0};
        instance.lastMarkerLocation = startCoordinates;
        var mapDomElement = document.getElementById("map")

        var map = new google.maps.Map(mapDomElement, {
            zoom: instance.initialZoom,
            center: startCoordinates,
        });

        instance.mapObjectRef = map;
        instance.mapObjectRef.addListener('center_changed', GMAP.getInstance().updateLatLngInputs);
        instance.updateLatLngInputs();
        //var markerTest = new google.maps.Marker({position: startCoordinates, map: map});
        instance.placeMarkerAt(startCoordinates, instance.getRandomMarkerColour());
        instance.uiElementPointers.lngInput.value = Math.round(startCoordinates.lng());
        instance.uiElementPointers.latInput.value = Math.round(startCoordinates.lat());
    }
    // Static functions ------------------------------------------------------
    static getInstance() {
        if (GMAP.instance == undefined) {
            GMAP.instance = new GMAP();

            //GMAP.instance.requiredRadius = 300000;
        }
        return GMAP.instance;
    }
    static getCoordsWindowContent(coords) {
        var content = `
                        <div class="infoWindow">
                        <table class="table table-hover">
                        <thead>
                        <tr>
                          <th colspan=2>Exact location:</th>
                         
                        </tr>
                <tbody>
                    <tr>
                        <td>Latitude: </td>
                        <td>
                        `;
        content += coords.lat();
        content += `
                        </td>

                    </tr>
                    <tr>
                    <td>Longitude:</td>
                    <td>
                    `;
        content += coords.lng();
        content += `</td>
                    </tr> 
                </tbody>
                </table>
                                        </div> 
            `;
        return content;
    }

    // Business logic --------------------------------------------------------

    startLuckyInsights() {
        var instance = GMAP.getInstance();
        var center = instance.mapObjectRef.getCenter();
        instance.placeMarkerAt(center, "red");
        instance.markers[instance.markers.length - 1].setDraggable(false);
        instance.setLuckySquare();
    }
    setLuckySquare() {
        var instance = GMAP.getInstance();
        instance.mapObjectRef.setCenter(instance.lastMarkerLocation);
        var m = instance.mapObjectRef;
        //Well, this is becouse gmap gets the bounds of the map erroneously using the getBounds function if zoom level is <4
        if (m.getZoom() < 20) {
            m.setZoom(m.getZoom() + 1);
        }
        instance.drawSquare(instance.lastMarkerLocation)
        m.setZoom(m.getZoom() - 1);
    }

    finalizeLuckyInsightsEdit() {
        var instance = GMAP.getInstance();
        instance.lastSquare.setEditable(false);
        instance.placeLuckyInsightsCorners();
        for (var i = 0; i < Math.floor(Math.random() * 100 + 10); i++) {
            var timeout = Math.round(Math.random() * 1000);
            setTimeout(instance.getAnotherLuckyMarker, timeout);


        }
        //place four rich markers

        //place random markers

    }
    placeLuckyInsightsCorners() {
        var instance = GMAP.getInstance();
        var squareBounds = instance.lastSquare.getBounds();
        var sw = squareBounds.getSouthWest();
        var ne = squareBounds.getNorthEast();

        var x1 = sw.lng();
        var y1 = sw.lat();

        var x2 = ne.lng();
        var y2 = ne.lat();

        var coords = [new google.maps.LatLng(y1, x1),
        new google.maps.LatLng(y2, x1),
        new google.maps.LatLng(y2, x2),
        new google.maps.LatLng(y1, x2)];

        for (var i = 0; i < 4; i++) {
            instance.placeMarkerAt(coords[i], "green");

            // instance.lastMarker.addLocationWindow();

        }
    }

    getAnotherLuckyMarker() {
        var instance = GMAP.getInstance();
        var squareBounds = instance.lastSquare.getBounds();

        var sw = squareBounds.getSouthWest();
        var ne = squareBounds.getNorthEast();
        var nw = new google.maps.LatLng(ne.lat(), sw.lng());
        var se = new google.maps.LatLng(sw.lat(), ne.lng());

        var xFraction = Math.random();
        var yFraction = Math.random();


        var newLng = google.maps.geometry.spherical.interpolate(sw, se, xFraction).lng();
        var newLat = google.maps.geometry.spherical.interpolate(sw, nw, yFraction).lat();

        var newMarkerCoords = new google.maps.LatLng(newLat, newLng);
        instance.placeMarkerAt(newMarkerCoords, instance.getRandomMarkerColour());


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

    checkIFCoordsAreValid() {
        var instance = GMAP.getInstance();
        var latitude = parseInt(instance.uiElementPointers.latInput.value);
        var longitude = parseInt(instance.uiElementPointers.lngInput.value);
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
    placeMarkerAt(passedLoc, markerColor) {
        var instance = GMAP.getInstance();
        instance.markerCounter++;

        var newMarker = new InfoMarker(passedLoc, markerColor);
        newMarker.addLocationWindow();
        instance.lastMarkerLocation = passedLoc;
        instance.lastMarker = newMarker;
        instance.markers.push(newMarker);
        return newMarker;
    }
    addMarker() {
        var instance = GMAP.getInstance();
        instance.antipodeSwitch = 0;
        if (instance.checkIFCoordsAreValid()) {
            var latitude = parseInt(instance.uiElementPointers.latInput.value);
            var longitude = parseInt(instance.uiElementPointers.lngInput.value);
            var newCoords = new google.maps.LatLng(latitude, longitude);
            instance.mapObjectRef.setCenter(newCoords);
            instance.placeMarkerAt(newCoords, instance.getRandomMarkerColour());
        }
    }

    addSuggestionsMarker(newCoords) {
        var instance = GMAP.getInstance();
        instance.mapObjectRef.setCenter(newCoords);
        instance.updateLatLngInputs();
        instance.placeMarkerAt(newCoords, instance.getRandomMarkerColour());

    }
    addLocationInfoMarker() {
        var myself = GMAP.getInstance();
        myself.markerCounter++;
        var coords = myself.mapObjectRef.getCenter();
        var marker = new InfoMarker(coords, "red");
        marker.addLocationWindow();
        myself.markers.push(marker);

    }
    moveTo() {
        var instance = GMAP.getInstance();
        if (instance.checkIFCoordsAreValid()) {
            var latitude = parseInt(instance.latInput.value);
            var longitude = parseInt(instance.lngInput.value);
            var coords = new google.maps.LatLng(latitude, longitude);
            instance.mapObjectRef.setCenter(coords);
        }
    }

    moveToAntipode() {
        var instance = GMAP.getInstance();
        instance.antipodeSwitch++;
        var markerCoords = instance.lastMarkerLocation;
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
            instance.lastMarkerLocation = newCoords;
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

    getShrunkenBounds() {
        var instance = GMAP.getInstance();
        var mapBounds = instance.mapObjectRef.getBounds();

        var sw = mapBounds.getSouthWest();
        var ne = mapBounds.getNorthEast();
        var nw = new google.maps.LatLng(ne.lat(), sw.lng());
        var se = new google.maps.LatLng(sw.lat(), ne.lng());

        var y_distance = google.maps.geometry.spherical.computeDistanceBetween(sw, nw);
        var x_distance = google.maps.geometry.spherical.computeDistanceBetween(sw, se);

        var new_sw = new google.maps.LatLng({
            lat: google.maps.geometry.spherical.computeOffset(sw, y_distance * 0.2, 0).lat(),
            lng: google.maps.geometry.spherical.computeOffset(sw, x_distance * 0.2, 90).lng()
        });
        // the buuuug is somewhere here...
        var new_ne = new google.maps.LatLng({
            lat: google.maps.geometry.spherical.computeOffset(sw, y_distance * 0.8, 0).lat(),
            lng: google.maps.geometry.spherical.computeOffset(sw, x_distance * 0.8, 90).lng()
        });

        //var new_sw = google.maps.geometry.spherical.computeOffset(sw, distance*0.2, heading);
        //var new_ne = google.maps.geometry.spherical.computeOffset(sw, distance*0.8, heading);
        console.log("|-----------------------------------------------------------------------------------------------|")
        console.log("SW: " + sw.toString());
        console.log("NE: " + ne.toString());

        console.log("SE" + se.toString());

        console.log("NW:" + nw.toString());

        console.log("The x distance is: " + x_distance);
        console.log("The u distance is: " + y_distance);

        console.log("new SW: " + new_sw.toString());
        console.log("new NE:" + new_ne.toString());
        //var new_sw = google.maps.geometry.spherical.interpolate(sw, ne, 0.2)
        //var new_ne = google.maps.geometry.spherical.interpolate(sw, ne, 0.8)
        return new google.maps.LatLngBounds(new_sw, new_ne);
    }
    drawCircle() {
        var instance = GMAP.getInstance();
        var lastMarkerLocationCoords = instance.lastMarkerLocation;
        var userRadius = 300 * 1000;
        var newCircle = new google.maps.Circle({
            map: instance.mapObjectRef,
            fillOpacity: 0.3,
            fillColor: "red",
            center: lastMarkerLocationCoords,
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
        //var mapBounds = instance.getShrunkenBounds(0.2);
        var newSquare = new google.maps.Rectangle({
            editable: true,
            bounds: mapBounds,
            fillColor: "yellow",
            fillOpacity: 0.5,
            strokeWeight: 1,

            center: new google.maps.LatLng(instance.mapObjectRef.getCenter().lat(), instance.mapObjectRef.getCenter().lng())
        });
        newSquare.setMap(instance.mapObjectRef);
        instance.lastSquare = newSquare;
        instance.squares.push(newSquare);

    }

    notTooFar() {
        var instance = GMAP.getInstance();
        var center = instance.lastMarkerLocation;
        instance.drawCircle();
        var newLocation = google.maps.geometry.spherical.computeOffset(center, instance.getRandom(300000, 0), instance.getRandom(360, 0));
        instance.placeMarkerAt(newLocation, instance.getRandomMarkerColour());
        instance.mapObjectRef.panTo(newLocation);
    }

    updateLatLngInputs() {
        var instance = GMAP.getInstance();
        var coords = new google.maps.LatLng(instance.mapObjectRef.getCenter().lat(), instance.mapObjectRef.getCenter().lng());
        var latPointer = instance.uiElementPointers.latInput;
        var lngPointer = instance.uiElementPointers.lngInput;
        latPointer.removeEventListener("input", GMAP.getInstance().moveTo);
        lngPointer.removeEventListener("input", GMAP.getInstance().moveTo);
        latPointer.value = Math.round(coords.lat());
        lngPointer.value = Math.round(coords.lng());
        latPointer.addEventListener("input", GMAP.getInstance().moveTo);
        lngPointer.addEventListener("input", GMAP.getInstance().moveTo);
    }
    moveToLondon() {
        var instance = GMAP.getInstance();
        var instance = GMAP.getInstance();
        var londonCoords = instance.londonCoords;
        instance.mapObjectRef.setCenter(londonCoords);
        var newMarker = new google.maps.Marker({ position: londonCoords, map: instance.mapObjectRef });
        // throw "Yet to be implemented.";
        // throw "Yet to be implemented.";

    }
    zoomIn() {
        var instance = GMAP.getInstance();
        var instance = GMAP.getInstance();
        var currentZoom = instance.mapObjectRef.zoom;
        instance.mapObjectRef.setZoom(++currentZoom);
    }
    zoomOut() {
        var instance = GMAP.getInstance();
        console.log("I have been clicked");
        var instance = GMAP.getInstance();
        var currentZoom = instance.mapObjectRef.zoom;
        instance.mapObjectRef.setZoom(--currentZoom);

    }


}