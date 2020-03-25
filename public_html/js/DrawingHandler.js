class DrawingHandler {
    constructor(drawingHandleId) {
        DrawingHandler.instance = this;
        this.outcolor = '#ffff00';
        this.incolor = "red";
        this.drawingManager = new google.maps.drawing.DrawingManager({
            drawingControl: false,
            polygonOptions: {
                fillColor:  DrawingHandler.instance.outcolor,
                fillOpacity: 0.3,
                strokeWeight: 5,
                clickable: false,
                editable: true,
                zIndex: 1
            }
        });
        this.drawingManager.setMap(GMAP.getInstance().mapObjectRef);

        this.drawingHandle = document.getElementById("drawPoly");
        this.drawingHandle.addEventListener("click", DrawingHandler.instance.myClickEvent);
        this.clickedMe = false;
        this.initializeGlobalListener();

    }

    static getInstance(){
        return DrawingHandler.instance;
    }



    myClickEvent() {
        var drawingMode = google.maps.drawing.OverlayType.POLYGON;
        if (DrawingHandler.instance.clickedMe == true) {
            drawingMode = null;
            DrawingHandler.instance.clickedMe = false;
        } else {
            DrawingHandler.instance.clickedMe = true;
        }
        DrawingHandler.instance.drawingManager.setDrawingMode(drawingMode);

    };
    initializeGlobalListener() {
        var mapInstance  = GMAP.getInstance().mapObjectRef;
        var newPoly = null;
        var eve = null;
        google.maps.event.addListener(DrawingHandler.instance.drawingManager, 'overlaycomplete', function (event) {
            newPoly = event.overlay;
            eve = event;
            google.maps.event.addListener(mapInstance, "mouseover", function () {
                newPoly.setOptions({ fillColor: DrawingHandler.instance.incolor })
            });
            google.maps.event.addListener(mapInstance, "mousemove", function (e) {
                console.log("I have entered the area.");
                var iAmIn = google.maps.geometry.poly.containsLocation(e.latLng, newPoly);
                if (iAmIn) {
                    newPoly.setOptions({ fillColor: DrawingHandler.instance.incolor });
                    new google.maps.Marker({
                        position: e.latLng,
                        map: mapInstance,
                        icon: { url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png" }
                    });

                } else {
                    newPoly.setOptions({ fillColor: DrawingHandler.instance.outcolor })
                }


            });


        });
    }
}








