class DirectionsHandler{

    constructor(){

        this.elementCounter=1;
        this.id_prefix = "waypoint_";

        this.autoCompleteOptions = {
            bounds: GMAP.getInstance().mapObjectRef.getBounds(),
            componentREstrictions:  {'country': 'uk'}
        }
        this.uiElementPointers = {};
        this.autoCompleteElements = [];
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = google.maps.DirectionsRenderer;
        this.markers = [];

    }

    static getInstance(){
        if(DirectionsHandler.instance == undefined){
            DirectionsHandler.instance  = new DirectionsHandler();
        }
        return DirectionsHandler.instance;
    }
    configure(opts){
        var me = DirectionsHandler.getInstance()
        me.configObject = opts;
        var ids = opts.elementIDS;
        me.addUIElementReference("autoCompleteContainer", ids.autoCompleteContainer);
        
        me.configUIElement(ids.waypoint, "waypoint", "click", me.addWaypointInput);
        me.configUIElement(ids.routeRequest, "routeRequest", "click", me.routeRequest);
        me.configUIElement(ids.routeMode, "routeMode", "click", me.routeRequest);
        me.configUIElement(ids.routeDate, "routeDate", "click", me.routeRequest);
        me.configUIElement(ids.routeTime, "routeTime", "click", me.routeRequest);
        me.addWaypointInput();
        me.addWaypointInput();

    }
    addUIElementReference(key, stringID){
        var me = DirectionsHandler.getInstance();
        me.uiElementPointers[key] = document.getElementById(stringID);
    }
 
    configUIElement(stringID, key, actionName, functionToBind){
        var myself = DirectionsHandler.getInstance();
        myself.addUIElementReference(key, stringID);
        myself.uiElementPointers[key].addEventListener("click", functionToBind);


    }
    

    addWaypointInput(){
        var me = DirectionsHandler.getInstance();
        var no = me.elementCounter++;
        var id = me.id_prefix+no;
        var containerDiv = document.createElement("div");
        containerDiv.classList.add("col-md-4");
        containerDiv.classList.add("col-sm-12");
        var labelElement = document.createElement("label");
            labelElement.setAttribute("for", id);
            labelElement.classList.add("form-control-plaintext");
            labelElement.classList.add("mr-2");

            labelElement.innerHTML = "Waypoint #"+no

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

    bindAutoCompleteToNewInput(element){
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
        var dst = wayPointInputs[wayPointInputs.length-1];
        var opts =  {
            origin: src.value,
            destination: dst.value,
            travelMode: google.maps.TravelMode[me.modeSelector.value],
            provideRouteAlternatives: true,
            drivingOptions:{departureTime: new Date(me.dateSelector+"T"+me.timeSelector),
        },
            transitOptions:{departureTime: new Date(me.dateSelector+"T"+me.timeSelector),
        }

        };

        var wayPoints = [];
        if(wayPointInputs.length>2){
            for(var i =1; i<wayPointInputs.length-1; i++){
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
        response.routes.forEach(function(r){
            var color = InfoMarker.getRandomMarkerColour()

        var tempDirectionsRenderer = new google.maps.DirectionsRenderer({
                map: map,
                directions: response,
                routeIndex:j,
                
                polylineOptions: {
                    strokeColor: color
                },
                supressMarkers: true
            });

        
            //debugger;

            j++;
            let myRoute = r.legs[0];
            PanoramaViewMarker.active = null;
            PanoramaViewMarker.instances = [];
            PanoramaViewMarker.markerCounter = 0;
            for (var i = 0; i < myRoute.steps.length; i++) {
    
                PanoramaViewMarker.addNewMarker(myRoute.steps[i].start_location, color);  
                //https://developers.google.com/maps/documentation/javascript/examples/directions-complex
             } 
            }
            );
      
    }
}

                           
