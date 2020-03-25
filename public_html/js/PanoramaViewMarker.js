class PanoramaViewMarker extends google.maps.Marker {
    constructor(passedLoc, markerColor) {
        if (PanoramaViewMarker.markerCounter == undefined) {
            PanoramaViewMarker.markerCounter = 0;
        }
        if (PanoramaViewMarker.instances == undefined) {
            PanoramaViewMarker.instances = [];
        }

        var defaultSettings = {
            map: GMAP.getInstance().mapObjectRef,
            draggable: false,
            animation: google.maps.Animation.DROP,
            title: "This is #" + (PanoramaViewMarker.markerCounter+1) + " marker, my friend.",
            label: "" + (PanoramaViewMarker.markerCounter+1)
        };

        super(defaultSettings);
        var myself = this;
        PanoramaViewMarker.active = null;
        PanoramaViewMarker.instances.push(myself);
        myself.responseData = null;
        var icon = new MapSymbol(markerColor);
        myself.setIcon(icon);
        myself.setPosition(passedLoc);
        myself.addListener("click", this.openMe);
        PanoramaViewMarker.markerCounter++;
    }

 

    openMe() {

        if (PanoramaViewMarker.active != null){

            PanoramaViewMarker.active.infoWindow.setContent("");
            PanoramaViewMarker.active.infoWindow.close();
        }
        PanoramaViewMarker.active = this;

        StreetViewHandler.getInstance().getStreetViewData(this.getPosition());
       
    }

 
    getPanoramaViewWindow(response) {
        var myself = this;
        if (response != null) {
            var elementId = response.location.pano;
            myself.title = response.location.description;
            //myself.position = response.location.latLng;
            var myPanorama = PanoramaViewMarker.getPanorama();
      

            myPanorama.setPano(elementId);
            myPanorama.setPov({
                heading: 270,
                pitch: 0
            });

            return new InfoWindow(PanoramaViewMarker.getPanoramaViewWrapper());
        } else {
            return new InfoWindow("There is no Sreetview Panorama available for this location.");
        }
        console.log("Something went wrong. Come here and debug me please.");
    }
    static getPanoramaViewWrapper() {
        if (PanoramaViewMarker.containerInstance == undefined) {
            var panoramaWrapper = document.createElement("div");
            panoramaWrapper.classList.add("streetViewMarkerImage");
            PanoramaViewMarker.containerInstance = panoramaWrapper
        }
        return PanoramaViewMarker.containerInstance;
    }

    static getPanorama(){
        PanoramaViewMarker.panoramaHandler = null;
        delete PanoramaViewMarker.panoramaHandler;
      // if(PanoramaViewMarker.panoramaHandler == undefined) {
        PanoramaViewMarker.panoramaHandler = new google.maps.StreetViewPanorama(PanoramaViewMarker.getPanoramaViewWrapper());
       //} 
        return PanoramaViewMarker.panoramaHandler;
    }

    static addNewMarker(latlng) {
        new PanoramaViewMarker(latlng, "blue");
    }

    

}


