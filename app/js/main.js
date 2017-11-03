var locationData = {addressline: "708 N Whitford Rd, 191341, Exton, PA"};




var Location = function(addressline){
	this.addressline = addressline;
	this.facilityCategoryList = [];
	this.init();
}


Location.prototype.init = function(){
	this.facilityCategoryList.push(new FacilityCategory('All', 'all'));
	this.facilityCategoryList.push(new FacilityCategory('Hospitals', 'hospital'));
	this.facilityCategoryList.push(new FacilityCategory('Fitness/gym/sports', 'gym'));
	this.facilityCategoryList.push(new FacilityCategory('Food', 'restaurant'));
	this.facilityCategoryList.push(new FacilityCategory('Mall', 'shopping_mall'));
	this.facilityCategoryList.push(new FacilityCategory('Schools', 'school'));
	this.facilityCategoryList.push(new FacilityCategory('Public Transit', 'transit_station'));
	this.facilityCategoryList.push(new FacilityCategory('Night Life', 'night_club'));
	this.facilityCategoryList.push(new FacilityCategory('Groceries', 'convenience_store'));
	this.facilityCategoryList.push(new FacilityCategory('Mailing Services', 'post_office'));
	this.facilityCategoryList.push(new FacilityCategory('Universities', 'university'));
}



var FacilityCategory = function(type, key){
	var self = this;
	this.type = type;
	this.key = key;
	this.facilities = ko.observableArray([]);
	this.numOfFacilities = ko.computed(function(){
		return self.facilities().length;
	});
}


var Facility = function(place, marker){
	this.name = place.name;
	this.location = place.geometry.location;
	this.placeid = place.place_id;
	this.marker = marker;
}

Facility.prototype.removeMarker = function(){
	this.marker.setMap(null);
}

Facility.prototype.addMarker = function(){
	this.marker.setMap(vmodel.map);
}






var ViewModel = function(){
	var self = this;
	this.currentLocation = ko.observable();

	this.currentFacilityList = ko.observable();

	this.currentLocation(new Location(locationData.addressline));

	this.currentFacilityList(this.currentLocation().facilityCategoryList[0]);

	this.locationMarker = null;

	this.currentFacilityList.subscribe(function(){
		self.filterMarkers();
	});





	this.emptyFieldsError = function(input){

		input.style.border = "1px solid red";
		var message_element = document.getElementById('messages');
		message_element.innerHTML = "Error: address line field empty*";
		message_element.style.color = "red";

	}

	this.resetAddressInput = function(input){
		 input.value = '';
		 document.getElementById('messages').innerHTML='';
	}

	this.changeMap = function(result){
		this.map.setCenter(result.geometry.location);
		this.map.setZoom(15);
		this.currentLocation(new Location(result.formatted_address));
		this.currentLocation().latlong = result.geometry.location;
		this.createLocationMarker(this.map);
		this.searchFacilities();

	}

	this.searchFacilities = function(){
		if(this.currentFacilityList())
			this.currentFacilityList([]);
		this.bounds = new google.maps.LatLngBounds();
		var allCategories = this.currentLocation().facilityCategoryList[0];
		for(var i=1; i<this.currentLocation().facilityCategoryList.length; i++){
			var current = this.currentLocation().facilityCategoryList[i];
			this.service.nearbySearch({
				location: this.currentLocation().latlong,
				radius: 4828.03,
				type: current.key
			}, this.facilitiesCallback(current, allCategories));

		}




	}

	this.facilitiesCallback = function(current, all){

		return function(results, status){
			if(status === google.maps.places.PlacesServiceStatus.OK){
				for(var j=0; j<results.length; j++){
					var facility = new Facility(results[j], self.createFacilityMarker(results[j]));
					current.facilities.push(facility);
					all.facilities.push(facility);
				}
				self.map.fitBounds(self.bounds);
			}
		};


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



		 if (place.geometry.viewport) {
            this.bounds.union(place.geometry.viewport);
          } else {
            this.bounds.extend(location);
          }

        return marker;
	}

	this.filterMarkers = function(){
		for(var i=0; i<this.currentLocation().facilityCategoryList.length; i++){
			var current = this.currentLocation().facilityCategoryList[i];

			if(current.key !== this.currentFacilityList().key && this.currentFacilityList().key !== 'all'){
				for(var j=0; j<current.facilities().length; j++){
					var facility = current.facilities()[j];
					facility.marker.setMap(null);
				}
			}else{
				for(var j=0; j<current.facilities().length; j++){
					var facility = current.facilities()[j];
					if(!facility.marker.getMap()){
						facility.marker.setMap(this.map);
					}
				}
			}
		}
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

	this.zoomToFacility = function(facility){
			window.setTimeout(function(){
				facility.marker.setAnimation(null);
			}, 730);

			facility.marker.setAnimation(google.maps.Animation.BOUNCE);
			self.map.setCenter(facility.location);
			self.map.setZoom(15);


	}

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


	this.resetZoom = function(){
		this.map.setCenter(this.currentLocation().latlong);
		this.map.setZoom(15);
		this.map.fitBounds(this.bounds);

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
