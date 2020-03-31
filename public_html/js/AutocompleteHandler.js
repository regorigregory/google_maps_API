class AutoCompleteHandler {
    constructor() {
        AutoCompleteHandler.instance = this;
        var autoCompleteOptions = {
            bounds: GMAP.getInstance().mapObjectRef.getBounds()
        }
       
        this.directionsService = new google.maps.DirectionsService;
        this.directionsRenderer = new google.maps.DirectionsRenderer;
        this.directionsRenderer.setMap(GMAP.getInstance().mapObjectRef);
       
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
    calculateAndDisplayRoute2(){
        console.log("Route has been requested...");
        console.log(GMAP.getInstance().userControls.fromHere.value);
        console.log(GMAP.getInstance().userControls.toHere.value);
        console.log(AutoCompleteHandler.instance.modeSelector.value);

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
                    GMAP.getInstance().updateLatLngInputs();
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
    }

    addStreetViewMarkers(response) {
        
        AutoCompleteHandler.instance.markerArray = [];
        response.routes.forEach(function(r){
            let myRoute = r.legs[0];
            PanoramaViewMarker.active = null;
            PanoramaViewMarker.instances = [];
            PanoramaViewMarker.markerCounter = 0;
            for (var i = 0; i < myRoute.steps.length; i++) {
    
                PanoramaViewMarker.addNewMarker(myRoute.steps[i].start_location);  
                //https://developers.google.com/maps/documentation/javascript/examples/directions-complex
             } 
            }
            );
      
    }
}
}