class DirectionsHandler{

    constructor(){

        this.elementCounter=1;
        this.id_prefix = "waypoint_";

        this.autoCompleteOptions = {
            bounds: GMAP.getInstance().mapObjectRef.getBounds(),
            componentREstrictions:  {'country': 'uk'}
        }
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

    setAutocompleteContainer(id){
        DirectionsHandler.getInstance().inputContainer = document.getElementById(id);
    }
 
    setAddWaypointTrigger(id){
        DirectionsHandler.getInstance().waypointTrigger = document.getElementById(id);
        DirectionsHandler.getInstance().waypointTrigger.addEventListener("click", this.addWaypointInput);

    }
    setRouteRequestTrigger(id){
        DirectionsHandler.getInstance().routeRequestTrigger = document.getElementById(id);
        DirectionsHandler.getInstance().routeRequestTrigger.addEventListener("click", this.requestAndRenderRoute);
    }
    setModeSelector(id){
        DirectionsHandler.getInstance().modeSelector = document.getElementById(id);
    }
    setDateSelector(id){
        this.dateSelector = document.getElementById(id);

    }
  setTimeSelector(id){
    this.timeSelector = document.getElementById(id);

  }

    addWaypointInput(){
        var me = DirectionsHandler.getInstance();
        var no = me.elementCounter++;
        var id = me.id_prefix+no;
        var containerDiv = document.createElement("div");
        containerDiv.classList.add("col-4");
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
        me.inputContainer.appendChild(containerDiv);
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

                           
