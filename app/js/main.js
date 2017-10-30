var locationData = {addressline: "708 N Whitford Rd, 191341, Exton, PA"};




var Location = function(addressline){
	this.addressline = addressline;
	this.facilityLists = ko.observableArray([]);
	this.currentFacilityList = ko.observable();
	this.init();
}


var FacilityList = function(type, key){
	this.type = type;
	this.key = key;
	this.facilities = ko.observableArray([]);
}


var Facility = function(){

}

Location.prototype.init = function(){
	this.facilityLists.push(new FacilityList('Hospitals', 'hospital'));
	this.facilityLists.push(new FacilityList('Fitness/gym/sports', 'gym'));
	this.facilityLists.push(new FacilityList('Food', 'restaurant'));
	this.facilityLists.push(new FacilityList('Mall', 'shopping_mall'));
	this.facilityLists.push(new FacilityList('Schools', 'school'));
	this.facilityLists.push(new FacilityList('Public Transit', 'transit_station'));
	this.facilityLists.push(new FacilityList('Night Life', 'night_club'));
	this.facilityLists.push(new FacilityList('Groceries', 'convenience_store'));
	this.facilityLists.push(new FacilityList('Mailing Services', 'post_office'));
}



var ViewModel = function(){
	var self = this;
	this.location = ko.observable();
	this.currentLocation = ko.observable();
	this.currentLocation(new Location(locationData.addressline));
	this.facilityMarkers = [];
	this.locationMarker = null;


	this.emptyFieldsError = function(input){

		input.style.border = "1px solid red";
		var message_element = document.getElementById('messages');
		message_element.innerHTML = "Error: address line field empty*";
		message_element.style.color = "red";

	}

	this.resetAddressInput = function(input){
		 input.value = '';
		 input.style.border = "none";
		 document.getElementById('messages').innerHTML='';
	}

	this.changeMap = function(result){
		this.map.setCenter(result.geometry.location);
		this.map.setZoom(15);
		this.currentLocation(new Location(result.formatted_address));
		this.currentLocation().latlong = result.geometry.location;
		vmodel.createLocationMarker(vmodel.map);	
		this.searchFacilities();
	}

	this.searchFacilities = function(){
		this.bounds = new google.maps.LatLngBounds();
		for(var i=0; i<this.currentLocation().facilityLists().length; i++){
			this.currentList = this.currentLocation().facilityLists()[i];
			this.service.nearbySearch({
				location: this.currentLocation().latlong,
				radius: 4828.03,
				type: this.currentLocation().facilityLists()[i].key
			}, this.facilitiesCallback);

		}

	}

	this.facilitiesCallback = function(results, status){
		console.log(self.currentList);
		if(status === google.maps.places.PlacesServiceStatus.OK){
			for(var j=0; j<results.length; j++){
				self.createFacilityMarker(results[j]);
			}
		}



	}

	this.createFacilityMarker = function(place){
		var location = place.geometry.location;
		var marker = new google.maps.Marker({
			map: vmodel.map,
			icon: this.getIconData(place),
			title: place.name,
			position: location,
			id: place.place_id
		});


		this.facilityMarkers.push(marker);

		 if (place.geometry.viewport) {
            this.bounds.union(place.geometry.viewport);
          } else {
            this.bounds.extend(location);
          }
          	//THIS IS NOT EFFICIENT AT THIS LOCATION
           this.map.fitBounds(this.bounds);
	}

	this.removeFaciltyMarker = function(){
		for(var i=0; i<this.facilityMarkers.length; i++){
			this.facilityMarkers[i].setMap(null);
		}

		this.facilityMarkers = [];
	}


	this.createLocationMarker = function(map){
		if(this.locationMarker)
			this.locationMarker.setMap(null);

		var marker = new google.maps.Marker({
			map: map,
			title: this.currentLocation().addressline,
			position: this.currentLocation().latlong
		});

		this.locationMarker = marker;

	}


	this.getIconData = function(place){
		return {
			url: place.icon,
			size: new google.maps.Size(35, 35),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 34),
            scaledSize: new google.maps.Size(25, 25)
		}
	}

	//----------------EVENT LISTENERS ---------------------------------//

	this.changeLocation = function(){
		var input = document.getElementById('addressline_input');
		if(input.value){

			this.geocoder.geocode({'address': input.value, 
				componentRestrictions: {country:'US'}}, function(results, status){
				if(status === 'OK'){
					if(results.length > 0){
						self.changeMap(results[0]);

					}else{
						alert('Error: no results were found for your provided address.');
					}
				}
			});
			this.resetAddressInput(input);
		}else{
			this.emptyFieldsError(input);
		}

	}


}



function loadMap(){

	vmodel.geocoder = new google.maps.Geocoder();
	vmodel.geocoder.geocode({'address':vmodel.currentLocation().addressline},
		function(results, status){
			if(status === 'OK'){
				vmodel.currentLocation().latlong =  results[0].geometry.location;
				vmodel.map = new google.maps.Map(document.getElementById('map_container'), {
					center: vmodel.currentLocation().latlong,
					zoom: 15
				});

				vmodel.service = new google.maps.places.PlacesService(vmodel.map);
				vmodel.createLocationMarker(vmodel.map);
				vmodel.searchFacilities();
			}
		});

}


vmodel = new ViewModel();
ko.applyBindings(vmodel);
