class MapSymbol {
    constructor(color) {
        this.path =
            "M454.848,198.848c0,159.225-179.751,306.689-179.751,306.689c-10.503,8.617-27.692,8.617-38.195,0	c0,0-179.751-147.464-179.751-306.689C57.153,89.027,146.18,0,256,0S454.848,89.027,454.848,198.848z ";
        this.fillOpacity = 0.7;
        this.scale = 0.1;
        this.strokeColor = "black";
        this.strokeWeight = 1;
        this.fillColor = color;
        this.anchor = new google.maps.Point(260, 540);
        this.labelOrigin = new google.maps.Point(240, 200);

    }
}

class InfoWindow extends google.maps.InfoWindow {
    constructor(passedContent) {
        super({
            content: passedContent
        });
    }
}

class InfoMarker extends google.maps.Marker {
    instanceCounter = 0;

    constructor(passedLoc, markerColor) {

        var instance = GMAP.getInstance();

        InfoMarker.instanceCounter += 1;

        var defaultSettings = {
            map: instance.mapObjectRef,
            draggable: true,
            animation: google.maps.Animation.DROP,
            title: "This is #" + InfoMarker.instanceCounter + " marker, my friend.",
            label: "" + instance.markerCounter
        };
        super(defaultSettings);

        this.setPosition(passedLoc);

        var icon = new MapSymbol(markerColor);

        this.setIcon(icon);

        instance.lastMarkerLocation = passedLoc;
        instance.markers.push(this);
    }

    addInfoWindow(infoWindowContent) {
        var instance = GMAP.getInstance();
        var infoWindow = new InfoWindow(infoWindowContent);
        this.addListener('click', function () {
            console.log("Stop clicking me, please.")
            infoWindow.open(instance.mapObjectRef, this);
        });
    }

    static getRandomColoured(passedLocation) {
        var colour = InfoMarker.getRandomMarkerColour();
        return new InfoMarker(passedLocation, colour);
    }

    static getRandom(range, minimum) {
        return Math.floor(Math.random() * range + minimum);
    }

    static getRandomMarkerColour(range, minimum) {
        var markerColor = "rgb(" + Math.round(InfoMarker.getRandom(205, 50)) + "," + Math.round(InfoMarker.getRandom(205, 50)) + "," + Math.round(InfoMarker.getRandom(205, 50)) + ")";
        return markerColor;
    }

}


