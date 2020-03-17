class StreetViewHandler extends google.maps.StreetViewService{
    static #instance =null;

    #constructor(){
        super();
    }
    
    static getInstance(){
        if (StreetViewHandler.instance == null){
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
        
        var requestObj = this.getNewRequestObject(latlong)
        var response = null;
        this.getPanorama(requestObj, function(responseData, streetViewStatus){

            if(streetViewStatus == google.maps.StreetViewStatus.OK){
                response = responseData;
            } else if (streetViewStatus == google.maps.StreetViewStatus.UNKNOWN_ERROR){
                alert("There has been an error when trying to retrieve the street view data for the last location.")
            } 

        });
        return response;
    }
}