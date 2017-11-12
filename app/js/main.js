var locationData = {
	address: "708 N Whitford Rd",
	zip: "191341",
	city: "Exton",
	state: "PA",

};






var Location = function(address, city, state){
	this.address = address;
	this.city = city;
	this.state = state;
	this.formatted_address = address+", "+city+", "+state;
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
	this.facilityCategoryList.push(new FacilityCategory('Groceries', 'convenience_store'));
	this.facilityCategoryList.push(new FacilityCategory('Mailing Services', 'post_office'));
	this.facilityCategoryList.push(new FacilityCategory('Veterinary', 'veterinary_care'));
	this.facilityCategoryList.push(new FacilityCategory('Pet Shops', 'pet_store'));
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
	this.currentFacility = ko.observable();
	this.address = ko.observable();
	this.city = ko.observable();
	this.state = ko.observable();
	this.locationMarker = null;


	this.validated = ko.computed(function(){

		if((self.address() && self.address().trim())
			&& (self.city() && self.city().trim())
			&& (self.state() && self.state().trim())){
			return true;
		}else{
			return false;
		}
	});





	this.currentFacilityList.subscribe(function(){
		self.filterMarkers();
	});


	this.init = function(){
		this.currentLocation(new Location(locationData.address, locationData.city, locationData.state));
		this.currentFacilityList(this.currentLocation().facilityCategoryList[0]);

		this.address.extend({required: "*address is required"});
		this.city.extend({required: "*city is required"});
		this.state.extend({required: "*state is required"});

	}



	this.changeMap = function(result){
		this.map.setCenter(result.geometry.location);
		this.map.setZoom(15);
		var parsedAddress = this.parseAddress(result.address_components);
		this.currentLocation(new Location(parsedAddress[0], parsedAddress[1], parsedAddress[2]));
		this.currentLocation().latlong = result.geometry.location;
		this.currentLocation().placeid = result.place_id;
		this.searchFacilities();
		self.createLocationMarker(this.map);



	}

	this.parseAddress = function(addressComponents){
		var result = [];
		var address = '';
		var city = '';
		var state = '';

		for(var i =0; i<addressComponents.length; i++){
			switch(true){
				case(addressComponents[i].types[0] == "street_number"):
					address += addressComponents[i].short_name+" ";
					break;
				case(addressComponents[i].types[0] == "route"):
					address += addressComponents[i].short_name;
					break;
				case(addressComponents[i].types[0] == "locality"):
					city =  addressComponents[i].short_name;
					break;
				case(addressComponents[i].types[0] == "administrative_area_level_1"):
					state = addressComponents[i].short_name;
					break;
			}
		}

		result.push(address);
		result.push(city);
		result.push(state);

		return result;
	}


	this.newLocation = function(){

		//this.getZillowData(this.address(), this.city(), this.state());
		var addressline = this.address() + ", " + this.city() + ", "+this.state();


			this.geocoder.geocode({'address': addressline,
				componentRestrictions: {country:'US'}}, function(results, status){
				if(status === 'OK'){

					if(results.length > 0){
						self.changeMap(results[0]);

					}else{
						alert('Error: no results were found for your provided address.');
					}
				}
			});

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
				console.log(status);
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

		google.maps.event.addListener(marker, 'click', function(){
			self.goToFacility(marker)
		});

		 if (place.geometry.viewport) {
            this.bounds.union(place.geometry.viewport);
          } else {
            this.bounds.extend(location);
          }

        return marker;
	}




	this.goToFacility = function(context){


		if(context instanceof Facility)
			context = context.marker;


		self.map.setCenter(context.position);
		self.map.setZoom(15);
		context.setAnimation(google.maps.Animation.DROP);
		self.createFacilityInfoWindow(context);

	}


	this.goToLocation = function(){

		if(this.map.getCenter() !== this.currentLocation().latlong){
			this.map.setCenter(this.currentLocation().latlong);
			this.map.setZoom(17);
		}
		this.locationMarker.setAnimation(google.maps.Animation.DROP);
		this.createLocationInfoWindow();


	}


	this.createFacilityInfoWindow = function(context){
		this.infowindow.setContent( '<div id="info_window_container">'+
									'<nav>'+
										'<ul id="info_window_header" class="nav nav-tabs">'+
											'<li><a href="#" onclick="vmodel.getDetailsData(\''+context.id+'\');">details</a></li>'
											+'<li><a href="#" onclick="vmodel.getOpeningHours();">opening hours</li>'+
											'<li><a href="#" onclick="vmodel.getFoursquareTips();">reviews</a></li>'+
											'<li><a href="#"onclick="vmodel.getFoursquarePhotos();">photos</a></li>'+
										'</ul>'+
									"</nav>"+
									'<div id="info_window_body">'+
										'<p>Fetching some cool stuff...</p>'+
										'<img src="img/110.gif">'+
									'</div>'+
									'</div>');


		this.getDetailsData(context.id);
		this.infowindow.open(context.map, context);


	}


	this.createLocationInfoWindow = function(){
		this.infowindow.setContent('');
		console.log(this.locationMarker.position);
		this.streetViewService.getPanoramaByLocation(this.locationMarker.position, 50, this.streetViewCallback);
		this.infowindow.open(this.map, this.locationMarker);

	}

	this.streetViewCallback = function(data, status){
		console.log(status);
		 if (status == google.maps.StreetViewStatus.OK) {
		 	console.log('here');
		 	console.log(self.currentLocation().latlong);
		 	this.infowindow.setContent("<div id='streetview_container'>content goes here</div>");
		 	var panoramaView = new google.maps.StreetViewPanorama(document.getElementById('streetview_container'),
			 {
				position: self.currentLocation().latlong,
				pov: {
					heading: 34,
					pitch: 10
				}
			});


		 }
	}


	this.getDetailsData = function(id){

		this.service.getDetails({placeId: id}, function(place, status){
			if(status === google.maps.places.PlacesServiceStatus.OK){
				self.showDistance(place.geometry.location);
				self.getVenueId(place.name, place.geometry.location.lat(), place.geometry.location.lng());
				var container = document.getElementById('info_window_body');
				var content = {
					heading: '<h4>'+place.name+'</h4>',
					phone: place.formatted_phone_number ? "<p><strong>Phone</strong>: "+place.formatted_phone_number+"</p>":"<p>No phone information available</p>",
					photo: place.photos ? "<img src='"+place.photos[0].getUrl({'maxWidth':150, 'maxHeight':150})+"' width='150px' height='150px'alt='location_image'>":"<img src='img/noimage.jpg' alt='location_image'>",
					address: place.formatted_address ? "<p><em>"+place.formatted_address+"</em></p>" : '<p><em>Sorry, no address available for this place</em></p>',
					ratings: place.reviews ? "<p><strong>user rating</strong>: <span class='label label-info'>"+place.rating+"</label></p>":"<p>user rating: <span class='label label-info'>No reviews av.</label></p>",
					website: place.website ? "<a href='"+place.website+"'>go to website</a>":"<span>No website available</span>",
					open_now: place.opening_hours ? (place.opening_hours.open_now ? "<p>Open now: <span style='color: green;'>open</span></p>":"<p>Open now: <span style='color: red;'>closed</span></p>") : "<p>Open now: Data not available</p>"
				};

				container.innerHTML =   content.heading+
										content.address+
										'<div id="infowindow_card">'+
											'<div id="infowindow_photo">'+content.photo+'</div>'+
											'<div id="infowindow_address">'+
												content.phone+content.ratings+
												'<p>'+content.website+'</p>'+
												'<p><strong>Distance</strong>: <span id="destination_distance"></span></p>'+
												content.open_now+
											'</div>'+
										'</div>';

				//self.test(content.address);
				self.infowindow.heading = content.heading;
				if(place.opening_hours){
					self.infowindow.opening_hours = place.opening_hours;
				}

			}
		});
	}

	this.getOpeningHours = function(){
		var container = document.getElementById('info_window_body');
		var content = this.infowindow.heading;

		if(this.infowindow.opening_hours){
			content += '<p><strong>Opening Schedule:</strong></p>'
			content +='<ul>';
			for(var i=0; i<this.infowindow.opening_hours.weekday_text.length; i++){
				content += '<li>'+this.infowindow.opening_hours.weekday_text[i]+'</li>';
			}
			content +='</ul>';
		}else{
			content += '<strong>No opening hours available</strong>';
		}

		container.innerHTML = content;

	}

	this.getVenueId = function(title, lat, long){
		var venueIdUrl = "https://api.foursquare.com/v2/venues/search?v=20161016&ll="+
						 lat+","+long+"&query="+title+"&intent=match&client_id=G2CO0HDKUJAJMKRVLLSD2PAZ20MVMJJWRGAKUC3M4H20NJWV&client_secret=5NVLZB2BP2VFIHB1URO1AVRVECFLHYBPIGUKE0ISXU0AXEHB";
		$.ajax({
			url: venueIdUrl,
			success: function(data){
					self.infowindow.venue = (data.response.venues.length > 0) ? data.response.venues[0].id : false;

			}
		});
	}

	this.getFoursquareTips = function(){
		var container = document.getElementById('info_window_body');
		var content = '<p>Fetching some cool stuff...</p>'+
										'<img src="img/110.gif">';

		if(this.infowindow.venue){
			var venueTipsUrl = "https://api.foursquare.com/v2/venues/"+this.infowindow.venue+"/tips?v=20161016&client_id=G2CO0HDKUJAJMKRVLLSD2PAZ20MVMJJWRGAKUC3M4H20NJWV&client_secret=5NVLZB2BP2VFIHB1URO1AVRVECFLHYBPIGUKE0ISXU0AXEHB";

			$.ajax({
				url: venueTipsUrl,
				success: function(data){
					var tips = data.response.tips.items;
					content = self.infowindow.heading;
					content += "<img src='img/foursquare.png'>";
					if(tips.length > 0){

						for(var i=0; i<tips.length; i++){
							content += "<div class='well'>"+tips[i].text+" -- <em>"+tips[i].user.firstName+"</em></div>";
						}
					}else{
						content += "No reviews found.";
					}
					container.innerHTML = content;
				}
			});

		}else{
			content = self.infowindow.heading + "No foursquare data available";
			container.innerHTML = content;
		}

	}


	this.showDistance = function(destination){

		var origin = this.currentLocation().latlong;
		var destination = [destination]

		this.distanceService.getDistanceMatrix({
				origins: [origin],
				destinations: destination,
				travelMode: 'DRIVING',
				unitSystem: google.maps.UnitSystem.METRIC,
				avoidHighways: false,
          		avoidTolls: false
			}, function(response, status){
				if(status == 'OK'){
					var distance_element = document.getElementById('destination_distance');
					if(distance_element){
						distance_element.innerHTML = response.rows[0].elements[0].distance.text;
					}

				}

			});


	}


	this.getFoursquarePhotos = function(){
		var container = document.getElementById('info_window_body');
		var content = this.infowindow.heading;


		if(this.infowindow.venue){
			var venuePhotosUrl = "https://api.foursquare.com/v2/venues/"+this.infowindow.venue+"/photos?v=20161016&client_id=G2CO0HDKUJAJMKRVLLSD2PAZ20MVMJJWRGAKUC3M4H20NJWV&client_secret=5NVLZB2BP2VFIHB1URO1AVRVECFLHYBPIGUKE0ISXU0AXEHB";
			$.ajax({
				url: venuePhotosUrl,
				success: function(data){
					var photos = data.response.photos.items;

					if(photos.length > 0){
						content += "<p><img src='img/foursquare.png'></p?";
						content += '<div class="container" id="carousel-container">';
						content += '<div id="infowindow_carousel" class="carousel slide">';
						content += '<div class="carousel-inner">';
						for(var i=0; i<photos.length; i++){
							if(i === 0){
								content += '<div class="item active">';
							}else{
								content += '<div class="item">';
							}
							content += 	'<img class="thumbnail" src="'+photos[i].prefix+'300x300'+photos[i].suffix+'">';
							content += '</div>';
						}
						content += '</div>';
						content += '<a class="left carousel-control" href="#infowindow_carousel" data-slide="prev">'+
										'<span class="glyphicon glyphicon-chevron-left"></span>'+
									'</a>';
						content += '<a class="right carousel-control" href="#infowindow_carousel" data-slide="next">'+
										'<span class="glyphicon glyphicon-chevron-right"></span>'+
									'</a>';
						content += '</div>';
						content += '</div>';
					}else{
						content += "No photos found.";
					}

					container.innerHTML = content;
				}
			});

		}else{
			content += "No foursquare photos available";
			container.innerHTML = content;
		}
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

		google.maps.event.addListener(this.locationMarker, 'click', function(){
			self.goToLocation();
		});


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




	this.clearFields = function(){
		this.address('');
		this.city('');
		this.state('');
	}



	this.resetZoom = function(){
		this.map.setCenter(this.currentLocation().latlong);
		this.map.setZoom(15);
		this.map.fitBounds(this.bounds);

	}

	this.locationZoom = function(){


	}

	this.getZillowData = function(address, city, state){
		var zillowUrl = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1g2zp84l5vv_4234r&address="+address+"&citystatezip="+city+","+state;

		$.ajax({
			url: zillowUrl,
			success: function(response, status){
				console.log(response);
			}
		});
	}




}



ko.extenders.required = function(target, overrideMessage){

	target.hasError = ko.observable();
	target.validationMessage = ko.observable();

	function validate(value){
		target.hasError(value ? false : true);
		target.validationMessage(value ? "" : overrideMessage || "This field is required");
	}

	validate(target());

	target.subscribe(validate);

	return target;

}


function loadMap(){
	vmodel.map = new google.maps.Map(document.getElementById('map_container'), {
					center: vmodel.currentLocation().latlong,
					zoom: 15
				});

	vmodel.geocoder = new google.maps.Geocoder();
	vmodel.infowindow = new google.maps.InfoWindow();
	vmodel.service = new google.maps.places.PlacesService(vmodel.map);
	vmodel.distanceService = new google.maps.DistanceMatrixService;
	vmodel.streetViewService = new google.maps.StreetViewService();
	vmodel.address(locationData.address);
	vmodel.city(locationData.city);
	vmodel.state(locationData.state);
	vmodel.newLocation();

	google.maps.event.addDomListener(window, 'resize', function(){
		vmodel.map.setCenter(vmodel.currentLocation.latlong);
	});




}


vmodel = new ViewModel();
vmodel.init();

ko.applyBindings(vmodel);


$('#hamburger').click(function(){
	$("#side_menu").slideToggle();
});

