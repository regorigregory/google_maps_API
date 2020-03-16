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
           
            GMAP.instance.requiredRadius = 300000;
        }
        return GMAP.instance;
    }


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
        instance.drawSquare(instance.lastMarkerLocation)


    }

    finalizeLuckyInsightsEdit() {
        var instance = GMAP.getInstance();
        instance.lastSquare.setEditable(false);
        instance.placeLuckyInsightsCorners();
        for (var i = 0; i < 10; i++) {
            instance.getAnotherLuckyMarker();

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
            content += coords[i].lat();
            content+=`
                        </td>

                    </tr>
                    <tr>
                    <td>Longitude:</td>
                    <td>
                    `;
        content += coords[i].lng();
        content+=`</td>
                    </tr> 
                </tbody>
                </table>
                                        </div> 
            `;


            instance.lastMarker.addInfoWindow(content);

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
    placeMarkerAt(passedLoc, markerColor) {
        var instance = GMAP.getInstance();
        instance.markerCounter++;

        var newMarker = new InfoMarker(passedLoc, markerColor);
        instance.lastMarkerLocation = passedLoc;
        instance.lastMarker = newMarker;
        instance.markers.push(newMarker);
    }
    addMarker() {
        var instance = GMAP.getInstance();
        instance.antipodeSwitch = 0;
        if (instance.checkIFCoordsAreValid()) {
            var latitude = parseInt(instance.latInput.value);
            var longitude = parseInt(instance.lngInput.value);
            var newCoords = new google.maps.LatLng(latitude, longitude);
            instance.mapObjectRef.setCenter(newCoords);
            instance.placeMarkerAt(newCoords, instance.getRandomMarkerColour());
        }
    }

    addSuggestionsMarker(newCoords){
        var instance = GMAP.getInstance();
        instance.mapObjectRef.setCenter(newCoords);
        instance.updateLatLngInputs();
        instance.placeMarkerAt(newCoords, instance.getRandomMarkerColour());
        
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

    initMapTypeSelect(selectedContainerID) {
        var instance = GMAP.getInstance();
        instance.mapTypeSelectID = selectedContainerID;
        var container = document.getElementById(selectedContainerID);
        var selectElement = document.createElement("select")
        instance.mapTypeSelect = selectElement;
        selectElement.classList.add("form-control");
        selectElement.classList.add("mt-3");
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

        var newSquare = new google.maps.Rectangle({
            editable: true,
            bounds: mapBounds,
            fillColor: "yellow",
            fillOpacity: 0.5,
            strokeWeight: 1,

            center: instance.mapObjectRef.getCenter()
        });
        instance.mapObjectRef.setZoom(instance.mapObjectRef.getZoom() - 1);


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
        instance.latInput.removeEventListener("input", GMAP.getInstance().moveTo);
        instance.lngInput.removeEventListener("input", GMAP.getInstance().moveTo);
        instance.latInput.value = Math.round(coords.lat());
        instance.lngInput.value = Math.round(coords.lng());
        instance.latInput.addEventListener("input", GMAP.getInstance().moveTo);
        instance.lngInput.addEventListener("input", GMAP.getInstance().moveTo);
    }

    initMap() {

        var instance = GMAP.getInstance();
        var startCoordinates = instance.startCoordinates;
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
        instance.lngInput.value = Math.round(startCoordinates.lng());
        instance.latInput.value = Math.round(startCoordinates.lat());
    }

}


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
