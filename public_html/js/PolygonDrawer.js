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








