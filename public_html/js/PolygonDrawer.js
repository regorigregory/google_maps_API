class PolygonDrawer {
    constructor() {
        PolygonDrawer.instance = this;
        this.outcolor = '#ffff00';
        this.incolor = "red";
        this.defaultDrawingMode =google.maps.drawing.OverlayType.POLYGON;

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
        this.initializeBusinessLogic();
    }

    static getInstance() {
        if (PolygonDrawer.instance == undefined) {
            PolygonDrawer.instance = new PolygonDrawer();
        }
        return PolygonDrawer.instance;
    }
    setPolyTrigger(id) {
        var me = PolygonDrawer.getInstance();
        me.drawingHandle = document.getElementById(id);
        me.drawingHandle.addEventListener("click", PolygonDrawer.instance.myClickEvent);
        me.clickedMe = false;

    }
    setColours(borderColor, fillIn, fillOut) {
        var me = PolygonDrawer.getInstance();
        me.incolor = fillIn;
        me.outcolor = fillOut;
        me.drawingManager.setOptions({
            polygonOptions: {
                fillColor: fillOut,
                strokeColor:borderColor,
                fillOpacity: 0.3,
                strokeWeight: 5,
                clickable: false,
                editable: true,
                zIndex: 1
            }
        })
    }
  
    myClickEvent() {

        var drawingMode = PolygonDrawer.instance.defaultDrawingMode;
        if (PolygonDrawer.instance.clickedMe == true) {
            drawingMode = null;
            PolygonDrawer.instance.clickedMe = false;
        } else {
            PolygonDrawer.instance.clickedMe = true;
        }
        PolygonDrawer.instance.drawingManager.setDrawingMode(drawingMode);

    };
    initializeBusinessLogic() {
        var mapInstance = GMAP.getInstance().mapObjectRef;
        var newPoly = null;
        var outerEvent = null;
        google.maps.event.addListener(PolygonDrawer.instance.drawingManager, 'overlaycomplete', function (event) {
            newPoly = event.overlay;
            outerEvent = event;
            google.maps.event.addListener(mapInstance, "mouseover", function () {
                newPoly.setOptions({ fillColor: PolygonDrawer.instance.incolor })
            });
            google.maps.event.addListener(mapInstance, "mousemove", function (e) {
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
}








