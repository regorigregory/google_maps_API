class MapSymbol {
    constructor(color) {
        this.path =
                "M454.848,198.848c0,159.225-179.751,306.689-179.751,306.689c-10.503,8.617-27.692,8.617-38.195,0	c0,0-179.751-147.464-179.751-306.689C57.153,89.027,146.18,0,256,0S454.848,89.027,454.848,198.848z " +
                "M256,298.89c-55.164,0-100.041-44.879-100.041-100.041S200.838,98.806,256,98.806	s100.041,44.879,100.041,100.041S311.164,298.89,256,298.89z";
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

    constructor(passedLoc, markerColor) {

        var instance = GMAP.getInstance();

        var defaultSettings = {
            map: instance.mapObjectRef,
            draggable: true,
            //animation: google.maps.Animation.DROP,
            title: "This is #" + instance.markerCounter + " marker, my friend.",
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

class LuckyInsigthsHelper {
    luckyInstance;
    constructor(){
        
    }
      static getInstance() {
        if (LuckyInsigthsHelper.luckyInstance == undefined) {
            LuckyInsigthsHelper.luckyInstance = new LuckyInsigthsHelper();
        }
        return LuckyInsigthsHelper.luckyInstance;
    }
    init(id){
        var luckyInstance = LuckyInsigthsHelper.getInstance();
        
        luckyInstance.numberOfStates = 2;
        luckyInstance.currentState = 0;
        luckyInstance.buttonInstance = document.getElementById(id);
        luckyInstance.classes = [ "btn-secondary", "btn-primary"];

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



