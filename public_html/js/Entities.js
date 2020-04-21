//*******************************************************************
//** Helper Entities with smaller repsponsibilites ******************
//** Approx. 100 lines each *****************************************
//*******************************************************************

//*******************************************************************
//** Helper class for the marker rain********************************
//*******************************************************************

class LuckyInsigthsHelper {
    constructor() {

    }
    static getInstance() {
        if (LuckyInsigthsHelper.luckyInstance == undefined) {
            LuckyInsigthsHelper.luckyInstance = new LuckyInsigthsHelper();
        }
        return LuckyInsigthsHelper.luckyInstance;
    }
    init(stringID) {
        var luckyInstance = LuckyInsigthsHelper.getInstance();

        luckyInstance.numberOfStates = 2;
        luckyInstance.currentState = 0;
        luckyInstance.buttonInstance = document.getElementById(stringID);
        luckyInstance.buttonInstance.addEventListener("click", luckyInstance.nextPhase);

        luckyInstance.classes = ["btn-secondary", "btn-primary"];

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


//*******************************************************************
//** Mapsymbol: so that we can have truly random coloured markers ***
//*******************************************************************

class MapSymbol {
    constructor(color) {
        this.path =
            "M454.848,198.848c0,159.225-179.751,306.689-179.751,306.689c-10.503,8.617-27.692,8.617-38.195,0	c0,0-179.751-147.464-179.751-306.689C57.153,89.027,146.18,0,256,0S454.848,89.027,454.848,198.848z ";
        this.fillOpacity = 1;
        this.scale = 0.07;
        this.strokeColor = "black";
        this.strokeWeight = 1;
        this.fillColor = color;
        this.anchor = new google.maps.Point(260, 540);
        this.labelOrigin = new google.maps.Point(240, 200);

    }
}


//*******************************************************************
//** InfoWindow: extension of Google's class ************************
//*******************************************************************

class InfoWindow extends google.maps.InfoWindow {


    constructor(passedContent) {
        super({
            content: passedContent
        });
    }
}

//*******************************************************************
//** InfoMarker: extension of Google's class ************************
//** This is so I can more efficiently can call repetative functions*
//*******************************************************************

class InfoMarker extends google.maps.Marker {
    //static instanceCounter=0;

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
        this.amIOpened = false;

        this.setPosition(passedLoc);

        var icon = new MapSymbol(markerColor);

        this.setIcon(icon);

        instance.lastMarkerLocation = passedLoc;
        instance.markers.push(this);
    }

    addInfoWindow(infoWindowContent) {
        var me = this;
        var instance = GMAP.getInstance();
        me.infoWindow = new InfoWindow(infoWindowContent);
        me.addListener('click', function () {
            me.toggleFunction(me);
        });
    }
    toggleFunction(me) {
        if (me.amIOpened == false) {
            me.infoWindow.open(GMAP.getInstance().mapObjectRef, this);
            me.amIOpened = true;
        } else {
            me.infoWindow.close();
            me.amIOpened = false;
        }
    }
    getOneLineLocation() {
        var locString = "Lat: " + this.getPosition().lat() + "Lng:" + this.getPosition().lng();
        return locString;
    }
    addLocationWindow() {
        var me = this;
        var instance = GMAP.getInstance();
        me.setTitle(me.getOneLineLocation(me));
        me.infoWindow = new google.maps.InfoWindow();
        me.addListener('click', function () {
            console.log("Stop clicking me, please.")
            var newContent = GMAP.getCoordsWindowContent(me.getPosition());
            if (me.amIOpened == false) {
                me.infoWindow.setContent(newContent);
            }
            me.setTitle(me.getOneLineLocation(me));
            me.toggleFunction(me);
        });

        me.addListener('position_changed',
            function () {
                me.setTitle(me.getOneLineLocation());
                if (me.amIOpened == true) {
                    var newContent = GMAP.getCoordsWindowContent(me.getPosition());
                    me.infoWindow.setContent(newContent);
                }
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


//*******************************************************************
//** PanoramaViewMarker: extension of Google's class ****************
//** Its name implies its function :)))) ****************************
//*******************************************************************

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
            draggable: true,
            animation: google.maps.Animation.DROP,
            title: "This is #" + (PanoramaViewMarker.markerCounter + 1) + " marker, my friend.",
            label: "" + (PanoramaViewMarker.markerCounter + 1)
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

        if (PanoramaViewMarker.active != null) {

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

    static getPanorama() {
        PanoramaViewMarker.panoramaHandler = null;
        delete PanoramaViewMarker.panoramaHandler;
        // if(PanoramaViewMarker.panoramaHandler == undefined) {
        PanoramaViewMarker.panoramaHandler = new google.maps.StreetViewPanorama(PanoramaViewMarker.getPanoramaViewWrapper());
        //} 
        return PanoramaViewMarker.panoramaHandler;
    }

    static addNewMarker(latlng, color) {
        if (color == undefined) {
            color = "blue"
        }
        var pm = new PanoramaViewMarker(latlng, color);
        return pm;
    }

}



//*******************************************************************
//** StreetViewHandler: this helper handles Streetview requests *****
//*******************************************************************

class StreetViewHandler extends google.maps.StreetViewService {
    constructor() {
        super();

    }
    static getInstance() {
        if (StreetViewHandler.instance == undefined) {
            StreetViewHandler.instance = new StreetViewHandler();
        }
        return StreetViewHandler.instance;
    }

    getNewRequestObject(latlong) {
        return {
            location: latlong
        }

    }

    getStreetViewData(latlong) {
        var requestObj = this.getNewRequestObject(latlong);
        this.getPanorama(requestObj, this.panoramaCallback);
    }
    panoramaCallback(responseData, streetViewStatus) {
        if (streetViewStatus == google.maps.StreetViewStatus.OK) {
            var activeMarker = PanoramaViewMarker.active;
            var infoWindow = activeMarker.getPanoramaViewWindow(responseData);
            infoWindow.open(GMAP.getInstance().mapObjectRef, activeMarker);

            var content = infoWindow.getContent();
            PanoramaViewMarker.active.infoWindow = infoWindow;

        } else if (streetViewStatus == google.maps.StreetViewStatus.UNKNOWN_ERROR) {
            alert("There has been an error when trying to retrieve the street view data for the last location.")
        }
    }

}

    //*******************************************************************
    //** Class to implement button 5(?)'s functionalities***************
    //*******************************************************************
    
    class PolygonDrawer {
        constructor() {
            PolygonDrawer.instance = this;
            this.outcolor = '#ffff00';
            this.incolor = "red";
            this.defaultDrawingMode = google.maps.drawing.OverlayType.POLYGON;
            this.eventHandlers = []
            this.drawingManager = new google.maps.drawing.DrawingManager({
                drawingControl: false,
                polygonOptions: {
                    fillColor: PolygonDrawer.instance.outcolor,
                    fillOpacity: 0.3,
                    strokeWeight: 5,
                    clickable: false,
                    editable: true,
                    zIndex: 1
                }
            });
            this.drawingManager.setMap(GMAP.getInstance().mapObjectRef);
            this.clickedMe  = false;
        }
    
        static getInstance() {
            if (PolygonDrawer.instance == undefined) {
                PolygonDrawer.instance = new PolygonDrawer();
            }
            return PolygonDrawer.instance;
        }
       
        changeDrawingState() {
            var me = PolygonDrawer.instance;
            var drawingMode = PolygonDrawer.instance.defaultDrawingMode;
            if(me.clickedMe==false){
                me.startDrawingListeners();
                me.clickedMe = true;
                me.drawingManager.setDrawingMode(me.defaultDrawingMode);
                me.drawingHandle.classList.remove("btn-default");
                me.drawingHandle.classList.add("btn-danger");
    
            } else {
                me.drawingHandle.classList.remove("btn-success");
                me.drawingHandle.classList.add("btn-secondary");
    
                me.stopDrawingListeners();
                me.clickedMe = false;
            }
    
        };
    
        setPolyTrigger(id) {
            var me = PolygonDrawer.getInstance();
            me.drawingHandle = document.getElementById(id);
            me.drawingHandle.addEventListener("click", PolygonDrawer.instance.changeDrawingState);
            me.clickedMe = false;
    
        }
        setColours(borderColor, fillIn, fillOut) {
            var me = PolygonDrawer.getInstance();
            me.incolor = fillIn;
            me.outcolor = fillOut;
            me.drawingManager.setOptions({
                polygonOptions: {
                    fillColor: fillOut,
                    strokeColor: borderColor,
                    fillOpacity: 0.3,
                    strokeWeight: 5,
                    clickable: false,
                    editable: true,
                    zIndex: 1
                }
            })
        }
        startDrawingListeners() {
            var me = this;
            var mapInstance = GMAP.getInstance().mapObjectRef;
            var newPoly = null;
            var outerEvent = null;
            me.eventHandlers[0] =  google.maps.event.addListener(PolygonDrawer.instance.drawingManager, 'polygoncomplete', function (newPoly) {
                //newPoly = event.overlay;
                me.drawingManager.setDrawingMode(null);
                me.drawingHandle.classList.remove("btn-danger");
    
                me.drawingHandle.classList.add("btn-success");
    
                outerEvent = event;
                me.eventHandlers[1] = google.maps.event.addListener(mapInstance, "mouseover", function () {
                    newPoly.setOptions({ fillColor: PolygonDrawer.instance.incolor })
                });
                me.eventHandlers[2] = google.maps.event.addListener(mapInstance, "mousemove", function (e) {
                    console.log("I have entered the area.");
                    var iAmIn = google.maps.geometry.poly.containsLocation(e.latLng, newPoly);
                    if (iAmIn) {
                        newPoly.setOptions({ fillColor: PolygonDrawer.instance.incolor });
                        new google.maps.Marker({
                            position: e.latLng,
                            map: mapInstance,
                            icon: { url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png" }
                        });
    
                    } else {
                        newPoly.setOptions({ fillColor: PolygonDrawer.instance.outcolor })
                    }
    
    
                });
            });
        }
        stopDrawingListeners(){
            var me = PolygonDrawer.instance;
            me.eventHandlers.forEach(function(eh){
                eh.remove();
    
            });
        }
    } 