/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mapInstance = GMAP.getInstance().mapObjectRef;

var outcolor = '#ffff00';
var incolor = "red";

var drawingManager = new google.maps.drawing.DrawingManager({
    drawingControl: false,
    polygonOptions: {
        fillColor: outcolor,
        fillOpacity: 0.3,
        strokeWeight: 5,
        clickable: false,
        editable: true,
        zIndex: 1
    }
});
drawingManager.setMap(mapInstance);

var drawingHandle = document.getElementById("drawPoly");
var clickedMe = false;
drawingHandle.addEventListener("click",
        function () {
            var drawingMode = google.maps.drawing.OverlayType.POLYGON;
            if (clickedMe == true) {
                drawingMode = null;
                clickedMe = false;
            } else {
                clickedMe = true;
            }
            drawingManager.setDrawingMode(drawingMode);

        });

var newPoly = null;
var eve = null;
google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
    newPoly = event.overlay;
    eve = event;
    google.maps.event.addListener(mapInstance, "mouseover", function () {
        newPoly.setOptions({fillColor: incolor})
    });
    google.maps.event.addListener(mapInstance, "mousemove", function (e) {
        console.log("I have entered the area.");
        var iAmIn = google.maps.geometry.poly.containsLocation(e.latLng, newPoly);
        if (iAmIn)
        {
           newPoly.setOptions({fillColor: incolor});
           new google.maps.Marker({
               position: e.latLng,
               map: mapInstance,
               icon:{url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"} 
           });

        } else {
            newPoly.setOptions({fillColor: outcolor})
        }


    });
    

});

