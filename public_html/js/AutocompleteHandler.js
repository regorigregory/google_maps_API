class AutoCompleteHandler {
    constructor() {
        AutoCompleteHandler.instance = this;
        var autoCompleteOptions = {
            bounds: GMAP.getInstance().mapObjectRef.getBounds()
        }
        this.autoCompleteHandlerHere = new google.maps.places.Autocomplete(GMAP.getInstance().userControls.fromHere, autoCompleteOptions);
        this.autoCompleteHandlerTo = new google.maps.places.Autocomplete(GMAP.getInstance().userControls.toHere, autoCompleteOptions);
        this.autoCompleteHandlerHere.addListener("place_changed", this.placeChanged);
        this.autoCompleteHandlerTo.addListener("place_changed", this.placeChanged);
        this.directionsService = new google.maps.DirectionsService;
        this.directionsRenderer = new google.maps.DirectionsRenderer;
        this.directionsRenderer.setMap(GMAP.getInstance().mapObjectRef);
        this.triggerButton = GMAP.getInstance().userControls.routeTrigger;
        this.triggerButton.addEventListener("click", AutoCompleteHandler.instance.calculateAndDisplayRoute)
        this.modeSelector = GMAP.getInstance().userControls.modeSelector;
        this.markerArray = [];
    }

    placeChanged() {
        console.log("I have been triggered");
        var place = this.getPlace();
        if (place.geometry) {
            var newLocation = place.geometry.location;
            //GMAP.getInstance().addSuggestionsMarker(newLocation);
        }

    }

    calculateAndDisplayRoute() {
        console.log("Route has been requested...");
        console.log(GMAP.getInstance().userControls.fromHere.value);
        console.log(GMAP.getInstance().userControls.toHere.value);
        console.log(AutoCompleteHandler.instance.modeSelector.value);

        AutoCompleteHandler.instance.directionsService.route(
            {
                origin: { query: GMAP.getInstance().userControls.fromHere.value },
                destination: { query: GMAP.getInstance().userControls.toHere.value },
                travelMode: AutoCompleteHandler.instance.modeSelector.value,
                provideRouteAlternatives: true
            },
            function (response, status) {
                if (status === 'OK') {
                    AutoCompleteHandler.instance.directionsRenderer.setDirections(response);
                    AutoCompleteHandler.instance.addStreetViewMarkers(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
    }

    addStreetViewMarkers(response) {
        
        AutoCompleteHandler.instance.markerArray = [];
        var myRoute = response.routes[0].legs[0];
        PanoramaViewMarker.active = null;
        PanoramaViewMarker.instances = [];
        PanoramaViewMarker.markerCounter = 0;
        for (var i = 0; i < myRoute.steps.length; i++) {

            PanoramaViewMarker.addNewMarker(myRoute.steps[i].start_location);  
            //https://developers.google.com/maps/documentation/javascript/examples/directions-complex
        
        }
    }
}