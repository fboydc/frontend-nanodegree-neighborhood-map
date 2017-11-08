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
		this.currentLocation().placeid = result.place_id;
		this.getLocationDetails();
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

	this.getLocationDetails = function(){
		console.log("id "+this.currentLocation().placeid);
		this.service.getDetails({placeId: this.currentLocation().placeid}, function(place, status){
			console.log(status);
			if(status == google.maps.places.PlacesServiceStatus.OK){
				console.log("here");
				console.log(place);
			}
		});

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
		//self.googleDetailsSearch(context);
		self.createInfowindowContent(context);

	}


	this.createInfowindowContent = function(context){
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

	this.getDetailsData = function(id){

		this.service.getDetails({placeId: id}, function(place, status){
			if(status === google.maps.places.PlacesServiceStatus.OK){
				console.log(place);
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

					document.getElementById('destination_distance').innerHTML = response.rows[0].elements[0].distance.text;
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

	this.locationZoom = function(){
		if(this.map.getCenter() !== this.currentLocation().latlong){
			this.map.setCenter(this.currentLocation().latlong);
			this.map.setZoom(17)
		}

	}

	this.getZillowData = function(address){
		var zillowUrl = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1g2zp84l5vv_4234r&address=10%20Dillon%20Ct,&citystatezip=EXTON,PA"
	}




}



function loadMap(){

	vmodel.geocoder = new google.maps.Geocoder();
	vmodel.geocoder.geocode({'address':vmodel.currentLocation().addressline},
		function(results, status){
			if(status === 'OK'){
				vmodel.currentLocation().latlong =  results[0].geometry.location;
				vmodel.currentLocation().placeid = results[0].place_id;
				vmodel.map = new google.maps.Map(document.getElementById('map_container'), {
					center: vmodel.currentLocation().latlong,
					zoom: 15
				});
				vmodel.infowindow = new google.maps.InfoWindow();
				vmodel.service = new google.maps.places.PlacesService(vmodel.map);
				vmodel.distanceService = new google.maps.DistanceMatrixService;
				vmodel.createLocationMarker(vmodel.map);
				vmodel.getLocationDetails();
				vmodel.searchFacilities();

			}
		});



}


vmodel = new ViewModel();
ko.applyBindings(vmodel);
