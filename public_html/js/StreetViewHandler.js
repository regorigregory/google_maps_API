class StreetViewHandler extends google.maps.StreetViewService{
    constructor(){
        super();
       
    }
    static getInstance(){
        if(StreetViewHandler.instance == undefined){
            StreetViewHandler.instance = new StreetViewHandler();
        }
        return StreetViewHandler.instance;
    }

    getNewRequestObject(latlong){
        return {
            location: latlong
        }

    }

    getStreetViewData(latlong){
        var requestObj = this.getNewRequestObject(latlong);
        this.getPanorama(requestObj, this.panoramaCallback);
    }
    panoramaCallback(responseData, streetViewStatus){
        if(streetViewStatus == google.maps.StreetViewStatus.OK){
            var activeMarker = PanoramaViewMarker.active;
            var infoWindow = activeMarker.getPanoramaViewWindow(responseData);
            infoWindow.open(GMAP.getInstance().mapObjectRef, activeMarker);
            PanoramaViewMarker.getPanorama().setVisible(true);

            var content = infoWindow.getContent();
            PanoramaViewMarker.active.infoWindow = infoWindow;
        

            
        } else if (streetViewStatus == google.maps.StreetViewStatus.UNKNOWN_ERROR){
            alert("There has been an error when trying to retrieve the street view data for the last location.")
        } 
         
          
    }

}

