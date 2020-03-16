class AutoCompleteHandler {
    constructor() {
        var autoCompleteOptions = {
            bounds: GMAP.instance.mapObjectRef.getBounds()
        }
        this.autoCompleteHandlerHere = new google.maps.places.Autocomplete(GMAP.getInstance().userControls.fromHere, autoCompleteOptions);
        this.autoCompleteHandlerTo = new google.maps.places.Autocomplete(GMAP.getInstance().userControls.toHere, autoCompleteOptions);
        this.autoCompleteHandlerHere.addListener("place_changed", this.placeChanged);
        this.autoCompleteHandlerTo.addListener("place_changed", this.placeChanged);
    }

    placeChanged = function () {
        console.log("I have been triggered");
        var place = this.getPlace();
        if (place.geometry) {
            var newLocation = place.geometry.location;
            GMAP.getInstance().addSuggestionsMarker(newLocation);
        }

    }
}