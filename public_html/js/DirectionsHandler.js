//*******************************************************************
//** This class is responsible for processing route responses *******
//** and additionally, for rendering those routes *******************
//*******************************************************************

class DirectionsHandler {

    constructor() {

        this.elementCounter = 1;
        this.id_prefix = "waypoint_";

        this.autoCompleteOptions = {
            bounds: GMAP.getInstance().mapObjectRef.getBounds(),
            componentREstrictions: { 'country': 'uk' }
        }
        this.uiElementPointers = {};
        this.autoCompleteElements = [];
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = google.maps.DirectionsRenderer;
        this.markers = [];

    }

    static getInstance() {
        if (DirectionsHandler.instance == undefined) {
            DirectionsHandler.instance = new DirectionsHandler();
        }
        return DirectionsHandler.instance;
    }
    configure(opts) {
        var me = DirectionsHandler.getInstance()
        me.configObject = opts;
        var ids = opts.elementIDS;
        me.addUIElementReference(ids.autoCompleteContainer, "autoCompleteContainer");
        me.addUIElementReference(ids.routeDate, "routeDate");
        me.addUIElementReference(ids.routeTime, "routeTime");

        me.configUIElement(ids.waypoint, "waypoint", "click", me.addWaypointInput);
        me.configUIElement(ids.routeRequest, "routeRequest", "click", me.requestAndRenderRoute);
        me.configUIElement(ids.routeMode, "routeMode", "change", me.monitorSelect);
        me.configUIElement(ids.removeWaypoint, "removeWaypoint", "click", me.removeWaypointInput);


        me.addWaypointInput();
        me.addWaypointInput();

    }
    monitorSelect() {
        var me = DirectionsHandler.getInstance();
        var waypointTrigger = me.uiElementPointers.waypoint;

        if (me.uiElementPointers.routeMode.value == "TRANSIT") {
            var childNodes = me.uiElementPointers.autoCompleteContainer.childNodes;
            var childNodesNo = childNodes.length;

            if (childNodesNo > 2) {
                for (var i = 2; i < childNodesNo; i++) {
                    me.uiElementPointers.autoCompleteContainer.removeChild(childNodes[i]);
                }
                alert("If Transit mode is chosen, only two waypoints are allowed. The additional ones will be removed.");
            }
            waypointTrigger.setAttribute("disabled", true);


        } else {
            waypointTrigger.removeAttribute("disabled");


        }


    }
    addUIElementReference(stringID, key) {
        var me = DirectionsHandler.getInstance();
        me.uiElementPointers[key] = document.getElementById(stringID);
    }

    configUIElement(stringID, key, actionName, functionToBind) {
        var myself = DirectionsHandler.getInstance();
        myself.addUIElementReference(stringID, key);
        myself.uiElementPointers[key].addEventListener(actionName, functionToBind);


    }

    removeWaypointInput(){
        var me = DirectionsHandler.getInstance();
        var elNum =me.uiElementPointers.autoCompleteContainer.childNodes.length;
        var container = me.uiElementPointers.autoCompleteContainer;
        if(elNum>2){
            container.removeChild(container.childNodes[elNum-1]);
        } else {
            alert("The request could not be fulfilled. You need a minimum of two waypoints for every operation!")
        }
    }
    addWaypointInput() {
        var me = DirectionsHandler.getInstance();
        var no = me.elementCounter++;
        var id = me.id_prefix + no;
        var containerDiv = document.createElement("div");
        containerDiv.classList.add("col-md-4");
        containerDiv.classList.add("col-sm-12");
        var labelElement = document.createElement("label");
        labelElement.setAttribute("for", id);
        labelElement.classList.add("form-control-plaintext");
        labelElement.classList.add("mr-2");

        labelElement.innerHTML = "Waypoint #" + no

        var inputElement = document.createElement("input");
        inputElement.setAttribute("type", "text");
        inputElement.setAttribute("name", id);
        inputElement.setAttribute("id", id);
        inputElement.setAttribute("placeHolder", "Start typing for suggestions");
        inputElement.classList.add("form-control");
        inputElement.classList.add("mr-2");
        inputElement.classList.add("directionsInput");

        containerDiv.appendChild(labelElement);
        containerDiv.appendChild(inputElement);
        me.bindAutoCompleteToNewInput(inputElement);
        me.uiElementPointers.autoCompleteContainer.appendChild(containerDiv);
    }

    bindAutoCompleteToNewInput(element) {
        var me = DirectionsHandler.getInstance();
        var newAutocomplete = new google.maps.places.Autocomplete(element, me.autoCompleteOptions);
        newAutocomplete.addListener("place_changed", this.placeChanged);
    }

    placeChanged() {
        console.log("I have been triggered");
        //we are inside the autocomplete gmaps object, therefore "this" refers to that object.
        var place = this.getPlace();
        if (place.geometry) {
            var newLocation = place.geometry.location;
        }

    }

    requestAndRenderRoute() {
        var me = DirectionsHandler.getInstance();
        console.log("Route has been requested...");
        var wayPointInputs = document.getElementsByClassName("directionsInput");
        var src = wayPointInputs[0];
        var dst = wayPointInputs[wayPointInputs.length - 1];
        var departure = new Date(
            me.uiElementPointers.routeDate.value
            + "T"
            + me.uiElementPointers.routeTime.value);
        if(departure < new Date()){
            var newDate = new Date;
            newDate.setMinutes(newDate.getMinutes(), 5);
            departure = newDate;
            alert("The date specified is in the past. It has been set to "+departure);
        }
        var opts = {
            origin: src.value,
            destination: dst.value,
            travelMode: google.maps
                .TravelMode[me.uiElementPointers.routeMode.value],
            provideRouteAlternatives: true,
            drivingOptions: {
                departureTime: departure
            },
            transitOptions: {
                departureTime: departure
            }
        };



        var wayPoints = [];
        if (wayPointInputs.length > 2) {
            for (var i = 1; i < wayPointInputs.length - 1; i++) {
                var newObject = {
                    location: wayPointInputs[i].value,
                    stopover: false
                }
                wayPoints.push(newObject);
            }
            opts.waypoints = wayPoints;
        }

        me.directionsService.route(
            opts
            ,
            function (response, status) {
                if (status === 'OK') {
                    me.addStreetViewMarkers(response);
                    GMAP.getInstance().updateLatLngInputs();
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
    }

    addStreetViewMarkers(response) {
        var me = DirectionsHandler.getInstance();
        me.markers = [];

        GMAP.getInstance().lastResponse = response;
        var j = 0;
        var map = GMAP.getInstance().mapObjectRef;
        var locations = [];

        response.routes.forEach(function (r) {
            var color = InfoMarker.getRandomMarkerColour()

            var tempDirectionsRenderer = new google.maps.DirectionsRenderer({
                map: map,
                directions: response,
                routeIndex: j,
                suppressMarkers: false,
                polylineOptions: {
                    strokeColor: color
                }
            });


            //debugger;

            j++;
            let myRoute = r.legs[0];
            PanoramaViewMarker.active = null;
            PanoramaViewMarker.instances = [];
            PanoramaViewMarker.markerCounter = 0;
            for (var i = 1; i < myRoute.steps.length-1; i++) {
                var location = myRoute.steps[i].start_location;
                if(locations.some(l=>l.equals(location))){
                    console.log("Overlapping markers!");
                    PanoramaViewMarker.markerCounter++;
                    continue;
                    
                }
                locations.push(location);
                var panoMarker = PanoramaViewMarker.addNewMarker(location, color);
                
               
                //https://developers.google.com/maps/documentation/javascript/examples/directions-complex
            }
        }
        );

    }
}


