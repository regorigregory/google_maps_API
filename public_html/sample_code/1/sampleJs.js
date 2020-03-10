/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* 
   Programming III - Google Maps API - 2018
   Paolo Remagnino (c)
 */


var map;      

var Coords = {
         lat: 40.7484,
         lng: -73.9857
};

function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(Coords.lat, Coords.lng),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };
    // assigning to global variable:
    map = new google.maps.Map(document.getElementById("map"),
        mapOptions);
        
}

google.maps.event.addDomListener(window, 'load', initialize);


function moveToLocation(lat, lng){
    var center = new google.maps.LatLng(lat, lng);
    // using global variable:
    map.panTo(center);
}
