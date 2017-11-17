/***********************************************************************************************************
AUTHOR: Felipe Boyd
DATE: 13/11/2017
DEPENDENT: Knockout.js, jQuery.js
DESCRIPTION: This file provides the main functionality for
my 'Neighborhood Map' project. As stated above, this file
uses the knockout framework in order to organize code according
to the MVVM pattern. For more information on knockout.js and
MVVM, please visit - http://knockoutjs.com/
API's: Google Maps javascript API

CODE ORGANIZATION:

1. MODEL:

locationData - Object
Location - Class
FacilityCategory - Class
Facility - Class

2. VIEW MODEL:

ViewModel - Function object.


3. VIEW:

index.html - HTML file


CODE NOT ENCAPSULATED BY KNOCKOUT.JS:

1. loadMap() - Used by Google Maps API only / please see function description
2. jQuery '.click' event - used for hiding/showing UI component/ please see function call description
***********************************************************************************************************/
//-----------------------------------------------     MODEL    ----------------------------------------------//
/************************************************************
Type: OBJECT
Name: locationData
Description: This object contains the
initial data that the application uses as its first location.
It is only intented for showing the user a demo location when
he/she initially loads the application.
Object properties:

address - String
zip - string
city - string
state - string
***********************************************************/
var locationData = {
    address: "289 Watch Hill Rd",
    city: "Exton",
    state: "PA",

};


/****************************************************************************************
CLASS NAME: Location
Description: A location represents an address that the user
has input through the change address form fields. It is a
point of interest typed by the user (during the initial load,
this data will be fed from the locationData object). The
map generated with the google maps api will be centered around
this location. Each time the user changes the location in the UI, a new
Location object is created; only one Location object is used at a time.

PROPERTY: address
Type: String
Description: in most cases, this represents a street +
a building number. For example: '701 Haywood Drive'

PROPERTY: city
Type: String
Description: represents a city.

PROPERTY: state
Type: String
Description: represents a state; can be written in both: short and
long form - e.g, Pennsylvania | PA , Florida | FL, etc.

PROPERTY: formatted_address
Type: String
Description: it is the concatenation of the three: address, city, and state.
This property is a read-only property.

PROPERTY: facilityCategoryList
Type: Array <FacilityCategory>
Description: This array contains all the categories, which will be used by the nearbySearch
service of the google maps javascript api. Each element in the array will contain a
FacilityCategory object with a unique category identified by the 'type' property.
The google maps nearbySearch service will populate the facilities property in each FacilityCategory
object with it's corresponding result.
*****************************************************************************************************/


/*****************************************************************************
METHOD: Constructor method
PARAMETERS: 3 - address - (String), City - (String), State - (String)
DESCRIPTION: Initializes a location object, and its facilityCategoryList
array.

******************************************************************************/
var Location = function(address, city, state) {
    this.address = address;
    this.city = city;
    this.state = state;
    this.formatted_address = address + ", " + city + ", " + state;
    this.facilityCategoryList = [];

    //A call to the init method instantiates all FacilityCategory objects,
    // and adds them to the facilityCategoryList correspondingly.
    this.init();
};




/***************************************************************************
METHOD: init
PARAMETER: NONE
RETURNS: NOTHING
DESCRIPTION: populates the facilityCategoryList property of it's corresponding
Location object. Due to the limit imposed by google, only a limited number of
ajax calls are allowed per second. Therefor I have limited total categories to
search at 11. In total, a location object should have 11 FacilityCategory objects.
Each facilityCategory object can have n number of facilities.
***************************************************************************/
Location.prototype.init = function() {
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
};


/****************************************************************************************
CLASS NAME: FacilityCategory
Description: A FacilityCategory object is a representation of all the places under a 'type',
as retrieved from the google maps javascript api nearbySearch. a Location's FacilityCategoryList
property will be as large as the number of FacilityCategories created in the init method.



PROPERTY: type
Type: String
Description: a string describing the location type as per google maps api.

PROPERTY: city
Type: String
Description: represents a city.

PROPERTY: key
Type: String
Description: the exact string as required by the nearbySearch service in order
to search places of a type. This is the actual value passed in to the nearbySearch
method.

PROPERTY: facilities
Type: ObservableArray <Facility> -- see http://knockoutjs.com/ for more information on observable arrays.
Description: A collection of facilities under a 'type' as returned by the nearbySearch sevice.

PROPERTY: numOfFacilities
Type: Computed Observable <String>
Description: returns the number of facility objects stored in the facilties property.
*****************************************************************************************************/

/**************************************************************
METHOD: Constructor method
PARAMETERS: 2 - type - (String), key - (String)
DESCRIPTION: Initializes a FacilityCategory object.
************************************************************/


var FacilityCategory = function(type, key) {
    var self = this;
    this.type = type;
    this.key = key;
    this.facilities = ko.observableArray([]);
    this.numOfFacilities = ko.computed(function() {
        return self.facilities().length;
    });
};

/****************************************************************************************
CLASS NAME: Facility
Description: A Facility represents a place as per google maps javascript api.
It does not encapsulate a PlaceResult object in it's entirety, but only
the necessary properties required by the application.



PROPERTY: name
Type: String
Description: It is homogeneous to google PlaceResult.name property. It is the
name of the place as specified in the PlaceResult object, returned by the google maps
places api.

PROPERTY: location
Type: LatLng (google maps places api)
Description: represents the location of the place as a LatLng object, encapsulated in the
PlacesResult.geometry.location property.

PROPERTY: placeid
Type: String
Description: It is homogeneous to google PlaceResult.place_id property. It is
the place id given by the google maps javascript api.

PROPERTY: marker
Type: google.maps.Marker
Description: stores an instance of the google.maps.Marker class. Said instance will
contain the data of the marker representing the encapsulated facility.
*****************************************************************************************************/

/*************************************************
METHOD: Constructor Method
PARAMETERS: 2 - place (google.maps.places.PlaceResult), marker(google.maps.Marker)
DESCRIPTION: initializes a Facility object.
**************************************************/

var Facility = function(place, marker) {
    this.name = place.name;
    this.location = place.geometry.location;
    this.placeid = place.place_id;
    this.marker = marker;

};


//----------------------------------- END OF MODEL ----------------------------------------------//

//----------------------------------- VIEWMODEL ------------------------------------------------//

/***********************************************************************
TYPE: function object.
NAME: ViewModel
DESCRIPTION: Contains the viewmodel used by knockout/handles all the business
logic of the application. Whereas the observables used in the Facility class
are mainly concerned with ajax calls to the google maps API, the observables
here are concerned with user input.


PROPERTIES

1. currentLocation:
	TYPE: Observable <Location>
	DESCRIPTION: stores the current location either from: A)initial load,
	B) user input - using the change address form. This will most likely
	be a home/property address of interest.

2. currentFacilityList:
	TYPE: Observable <FacilityCategory>
	DESCRIPTION:
	stores the current FacilityCategory object shown.
	These are the categories the user sees in html select element, at index.html.
	The dacilities shown in the list-group will change depending on the value
	of currentFacilityList.

3. address:
   TYPE: Observable <String>
   DESCRIPTION:
   stores the value from the address input field used in the 'change address'
   form.

4. city:
   TYPE: Observable <String>
   Description:
   stores the value from the city input field used in the 'change address'
   form.

5. state:
   TYPE: Observable <String>
   DESCRIPTION:
   stores the value from the state input field used in the 'change address'
   form.

6. locationMarker:
   TYPE: google.maps.Marker
   DESCRIPTION:
   stores the marker object of the currentLocation property.

7. validated:
   TYPE: Computed Observable - function object
   RETURNS: BOOLEAN
   DESCRIPTION:
   The value of this property is used in the change address form of the UI.
   Eveytime the user types something in the input fields, it will evaluate all
   the observable bound to those inputs. The only way it will evaluate to true
   is if all bound observables are not empty: that is, if the user either types in
   nothing, or just the n number of empty ('') characters.
*************************************************************************/

var ViewModel = function() {
    var self = this; // described above
    this.currentLocation = ko.observable(); // described above
    this.currentFacilityList = ko.observable(); // described above
    this.address = ko.observable(); // described above
    this.city = ko.observable(); // described above
    this.state = ko.observable(); // described above
    this.locationMarker = null; // described above


    // described above
    this.validated = ko.computed(function() {

        if ((self.address() && self.address().trim()) && (self.city() && self.city().trim()) && (self.state() && self.state().trim())) {
            return true;
        } else {
            return false;
        }
    });


    // this function call will change the displayed markers on the map whenever the user
    //filters the locations (chooses a different FacilityCategory).
    this.currentFacilityList.subscribe(function() {
        self.filterMarkers();
    });

    /****************************************************************************
    METHOD: init
    PARAMETERS: NONE
    RETURNS: NOTHING
    DESCRIPTION:
    This function will initialize the currentLocation object, to the data
    encapsulated by the locationData object. Likewise, it will also call
    the KO's 'extend' method on the 'viewmodel.address', 'viewmodel.city', and
    'viewmodel.state' observable properties in order to delegate input validation
    to our extender 'required'.
    *****************************************************************************/
    this.init = function() {
        this.currentLocation(new Location(locationData.address, locationData.city, locationData.state));
        this.currentFacilityList(this.currentLocation().facilityCategoryList[0]);

        this.address.extend({
            required: "*address is required"
        });
        this.city.extend({
            required: "*city is required"
        });
        this.state.extend({
            required: "*state is required"
        });

    };


    /****************************************************************************
    METHOD: changeMap
    PARAMETERS: 1- GeocoderResult
    RETURNS: NOTHING
    DESCRIPTION:
    Sets the map center and zoom around the LatLong encapsualted in the result parameter;
    creates a new reference to a new location object and creates a new marker for the
    newly user specified location. Consequently, as the location has changed, it must
    also change all the markers on the map by searching for new nearby locations,
    delete old facility (places) markers and create new ones. It also adds two new
    properties the location instance (latlong and placeid) for us to have a reference
    of each for future use; we might need them in other third party APIs we would like to use.

    Note:
    Since the address_components property of google map's GeocodeResult class
    has the location/place information in an inconsistent manner, it is necessary
    to parse through it in order to get the information we need for our new location
    i.e: street, city, state. Hence the call to parseAddress function.
    *****************************************************************************/
    this.changeMap = function(result) {
        this.map.setCenter(result.geometry.location);
        this.map.setZoom(15);
        var parsedAddress = this.parseAddress(result.address_components);
        this.currentLocation(new Location(parsedAddress[0], parsedAddress[1], parsedAddress[2]));
        this.currentLocation().latlong = result.geometry.location;
        this.currentLocation().placeid = result.place_id;
        this.getZillowLocationId();
        this.searchFacilities();
        self.createLocationMarker(this.map);
    };

    /****************************************************************************
    METHOD: newLocation
    PARAMETERS: NOTHING
    RETURNS: NOTHING
    DESCRIPTION:
    changes our map to the new specified location. This method is bound to the
    'Go' button in the change map form. It computes the lat and long values from
    the user input by using google map's geocoder method. If succesful,
    it will change the map accordingly. Otherwise, it will notify the user.
    *****************************************************************************/
    this.newLocation = function() {

        var addressline = this.address() + ", " + this.city() + ", " + this.state();


        this.geocoder.geocode({
            'address': addressline,
            componentRestrictions: {
                country: 'US'
            }
        }, function(results, status) {
            if (status === 'OK') {

                if (results.length > 0) {
                    self.changeMap(results[0]);

                } else {
                    alert('Error: no results were found for your provided address.');
                }
            }
        });

    };

    /****************************************************************************
    METHOD: parseAddress
    PARAMETERS: 1 - Array <Object>
    RETURNS: Array <String>
    DESCRIPTION:
    parses the address_components object property encapsulated in the GeocoderResult
    class. It will then return an array containing the strings that composte a complete
    address (street, city, state).
    *****************************************************************************/
    this.parseAddress = function(addressComponents) {
        var result = [];
        var address = '';
        var city = '';
        var state = '';

        for (var i = 0; i < addressComponents.length; i++) {
            switch (true) {
                case (addressComponents[i].types[0] == "street_number"):
                    address += addressComponents[i].short_name + " ";
                    break;
                case (addressComponents[i].types[0] == "route"):
                    address += addressComponents[i].short_name;
                    break;
                case (addressComponents[i].types[0] == "locality"):
                    city = addressComponents[i].short_name;
                    break;
                case (addressComponents[i].types[0] == "administrative_area_level_1"):
                    state = addressComponents[i].short_name;
                    break;
            }
        }

        result.push(address);
        result.push(city);
        result.push(state);

        return result;
    };




    /****************************************************************************
    METHOD: searchFacilities
    PARAMETERS: NONE
    RETURNS: NOTHING
    DESCRIPTION:
    performs a nearby search for every place type (specified in the key property) of every
    FacilityCategory object stored in the FacilityCategoryList location property.

    NOTE:
    Please note that the radius is currently hardwired to aproximately 3 miles,
    as according to the user needs of the application I believe it's the right distance.

    TODO:
    Allow the user to set the radius to search for.
    *****************************************************************************/
    this.searchFacilities = function() {
        if (this.currentFacilityList())
            this.currentFacilityList([]);


        this.bounds = new google.maps.LatLngBounds();
        var allCategories = this.currentLocation().facilityCategoryList[0];
        for (var i = 1; i < this.currentLocation().facilityCategoryList.length; i++) {
            var current = this.currentLocation().facilityCategoryList[i];
            this.service.nearbySearch({
                location: this.currentLocation().latlong,
                radius: 4828.03,
                type: current.key
            }, this.facilitiesCallback(current, allCategories));

        }

    };

    //NOTE: The following methods occur once per each nearbysearch peformed
    //that is, every ith iteration of searchFacilitie's for loop. These methods
    //run only when a new location is specified or the application is initially loaded.


    /****************************************************************************
	METHOD: facilitiesCallback
	PARAMETERS: 2 - FacilityCategory, FacilityCategory
	RETURNS: NOTHING
	DESCRIPTION:
	callback function used in google's nearbySearch service. If places are found
	by such, it will create a new Facility object with it's data and add it the
	current FacilityCategory's facilities array.

	NOTE:
	We also have an 'all' category, which will contain all the facilities(Places),
	stored in all the other FacilityCategory objects. This will allow us to have
	an unfiltered FacilityCategory in order for our users to see all the places
	unfiltered.
	*****************************************************************************/
    this.facilitiesCallback = function(current, all) {

        return function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var j = 0; j < results.length; j++) {
                    var facility = new Facility(results[j], self.createFacilityMarker(results[j]));
                    current.facilities.push(facility);
                    all.facilities.push(facility);
                }

                //EXPAND/CONTRACT BOUNDS TO FIT ALL OUR LOCATION
                self.map.fitBounds(self.bounds);
            }
        };


    };



    /****************************************************************************
    METHOD: createFacilityMarker
    PARAMETERS: 1-  google.maps.places.PlaceResult
    RETURNS: NOTHING
    DESCRIPTION:
    creates a marker associated to the place parameter and sets it on the map.
    Also, binds a click event to the goToFacility window, in order to show an infowindow
    and zoom the map to this location.
    *****************************************************************************/
    this.createFacilityMarker = function(place) {
        var location = place.geometry.location;
        var marker = new google.maps.Marker({
            map: vmodel.map,
            icon: this.getIconData(place),
            title: place.name,
            position: location,
            id: place.place_id
        });

        google.maps.event.addListener(marker, 'click', function() {
            self.goToFacility(marker);
        });

        if (place.geometry.viewport) {
            this.bounds.union(place.geometry.viewport);
        } else {
            this.bounds.extend(location);
        }

        return marker;
    };


    //--------------------------  END OF NOTE -----------------------------


    /****************************************************************************
    METHOD: goToFacility
    PARAMETERS: 1. google.maps.Marker || Facility
    RETURNS: NOTHING
    DESCRIPTION:
    This method takes one parameter on one of two forms. Either it is a type of
    google.maps.Marker, defined in the event that the user clicks on a marker on the
    map; or a Facility, defined in the event that the user clicks on a Facility/place
    in the list-view (contained in the facilites property of CurrentFacilityList observable).

    centers the map according to the latlng property of the marker or associated marker,
    animates it, and create/shows an infowindow with it's associated data.
    *****************************************************************************/
    this.goToFacility = function(context) {

        if (window.innerWidth < 961) {
            $("#side_menu").hide();
        }

        if (context instanceof Facility)
            context = context.marker;


        self.map.setCenter(context.position);
        self.map.setZoom(15);
        context.setAnimation(google.maps.Animation.DROP);
        self.createFacilityInfoWindow(context);

    };

    /****************************************************************************
    METHOD: goToLocation
    PARAMETERS: NONE
    RETURNS: NOTHING
    DESCRIPTION:
    Similar to goToFacility, centers the map according to the latlng property of the
    currentLocation observable; that is, the address specified by the user, or by
    the dataLocation object.

    Animates it's associated marker and creates/opens an info window with it's data.
    Since we only have to keep track of one location object at a time, we can just access
    it within the closure of the view model.
    *****************************************************************************/
    this.goToLocation = function() {

        if (window.innerWidth < 961) {
            $("#side_menu").hide();
        }

        if (this.map.getCenter() !== this.currentLocation().latlong) {
            this.map.setCenter(this.currentLocation().latlong);
            this.map.setZoom(17);
        }
        this.locationMarker.setAnimation(google.maps.Animation.DROP);
        this.createLocationInfoWindow();


    };


    /****************************************************************************
    METHOD: createFacilityInfoWindow
    PARAMETERS: google.maps.Marker
    RETURNS: NOTHING
    DESCRIPTION:
    Creates the html template used for each Facility's info window.
    Set's a GIF file in the body, in order to notify the use of any outgoing
    requests. Furthermore, fetches corresponding data, changes it's DOM,
    and opens it.
    *****************************************************************************/
    this.createFacilityInfoWindow = function(context) {
        this.infowindow.setContent('<div class="info_window_container">' +
            '<nav>' +
            '<ul class="nav nav-tabs">' +
            '<li><a href="#" onclick="vmodel.getDetailsData(\'' + context.id + '\');">details</a></li>' + '<li><a href="#" onclick="vmodel.getOpeningHours();">opening hours</li>' +
            '<li><a href="#" onclick="vmodel.getFoursquareTips();">reviews</a></li>' +
            '<li><a href="#"onclick="vmodel.getFoursquarePhotos();">photos</a></li>' +
            '</ul>' +
            "</nav>" +
            '<div id="info_window_body">' +
            '<p>Fetching some cool stuff...</p>' +
            '<img src="img/110.gif">' +
            '</div>' +
            '</div>');


        this.getDetailsData(context.id);
        this.infowindow.open(context.map, context);


    };


    /****************************************************************************
    METHOD: getDetailsData
    PARAMETERS: String
    RETURNS: NOTHING
    DESCRIPTION:
    Performs a details search using google's getDetails service.
    Once it retrieves the results, changes the content of the info_window_body
    container with data relevant to the associated place/Facility.
    *****************************************************************************/
    this.getDetailsData = function(id) {

        this.service.getDetails({
            placeId: id
        }, function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                self.showDistance(place.geometry.location);
                self.getVenueId(place.name, place.geometry.location.lat(), place.geometry.location.lng());
                var container = document.getElementById('info_window_body');
                var content = {
                    heading: '<h4>' + place.name + '</h4>',
                    phone: place.formatted_phone_number ? "<p><strong>Phone</strong>: " + place.formatted_phone_number + "</p>" : "<p>No phone information available</p>",
                    photo: place.photos ? "<img src='" + place.photos[0].getUrl({
                        'maxWidth': 150,
                        'maxHeight': 150
                    }) + "' width='150px' height='150px'alt='location_image'>" : "<img src='img/noimage.jpg' alt='location_image'>",
                    address: place.formatted_address ? "<p><em>" + place.formatted_address + "</em></p>" : '<p><em>Sorry, no address available for this place</em></p>',
                    ratings: place.reviews ? "<p><strong>user rating</strong>: <span class='label label-info'>" + place.rating + "</label></p>" : "<p>user rating: <span class='label label-info'>No reviews av.</label></p>",
                    website: place.website ? "<a href='" + place.website + "'>go to website</a>" : "<span>No website available</span>",
                    open_now: place.opening_hours ? (place.opening_hours.open_now ? "<p>Open now: <span style='color: green;'>open</span></p>" : "<p>Open now: <span style='color: red;'>closed</span></p>") : "<p>Open now: Data not available</p>"
                };

                container.innerHTML = content.heading +
                    content.address +
                    '<div id="infowindow_card">' +
                    '<div id="infowindow_photo">' + content.photo + '</div>' +
                    '<div id="infowindow_address">' +
                    content.phone + content.ratings +
                    '<p>' + content.website + '</p>' +
                    '<p><strong>Distance</strong>: <span id="destination_distance"></span></p>' +
                    content.open_now +
                    '</div>' +
                    '</div>';

                //self.test(content.address);
                self.infowindow.heading = content.heading;

                //STORES THE opening_hours property for later use.
                if (place.opening_hours) {
                    self.infowindow.opening_hours = place.opening_hours;
                }

            }
        });
    };

    /****************************************************************************
    METHOD: createLocationInfoWindow
    PARAMETERS: NONE
    RETURNS: NOTHING
    DESCRIPTION:
    Creates the template for creating our current location's infowindow.
    Calls getStreetView by default, in order to load the 360 panoramic image
    of our location by default.
    *****************************************************************************/
    this.createLocationInfoWindow = function() {
        this.infowindow.setContent('');
        self.infowindow.setContent("<div class='info_window_container'>" +
            "<nav>" +
            "<ul class='nav nav-tabs'>" +
            "<li><a href='#' onclick='vmodel.getStreetView();'>street view</a></li>" +
            "<li><a href='#' onclick='vmodel.getZestimate();'>details</a></li>" +
            "</ul>" +
            "</nav>" +
            "<div id='streetview_container'>" +
            "<p>Fetching some cool stuff...</p>" +
            "<img src='img/110.gif'>" +
            "</div>" +
            "</div>");
        this.getStreetView();
        this.infowindow.open(this.map, this.locationMarker);
    };


    /****************************************************************************
    METHOD: getStreetView
    PARAMETERS: NONE
    RETURNS: NOTHING
    DESCRIPTION:
    Uses Google's street view service api in order to get a 360 degree panoramic
    photo of the location. This Photo can be any satellite shot photo, within
    100 meter radius, facing the location.
    *****************************************************************************/
    this.getStreetView = function() {
        this.streetViewService.getPanoramaByLocation(this.currentLocation().latlong, 100, self.streetViewCallback);
    };

    /****************************************************************************
    METHOD: streetViewCallback
    PARAMETERS: 2 - StreetViewPanoramaData, StreetViewStatus
    RETURNS: NOTHING
    DESCRIPTION:
    Callback function used in the createLocationInfoWindow method. If found, This will
    insert our street view panoramic image into our location marker's infowindow
    *****************************************************************************/
    this.streetViewCallback = function(data, status) {

        if (status == google.maps.StreetViewStatus.OK) {

            var closestLocation = data.location.latLng;
            var heading = google.maps.geometry.spherical.computeHeading(
                closestLocation, self.locationMarker.position
            );
            var panoramaView = new google.maps.StreetViewPanorama(document.getElementById('streetview_container'), {
                position: closestLocation,
                pov: {
                    heading: heading,
                    pitch: 10
                }
            });


        } else {
            self.infowindow.setContent("<div>Sorry, no street view available for this location.</div>");
        }
    };



    /****************************************************************************
    METHOD: getOpeningHours
    PARAMETERS: NOTHING
    RETURNS: NOTHING
    DESCRIPTION:
    Executes when the 'opening hours' tab is clicked, populates the DOM
    with the opening hours data stored in the infowindow's opening_hours property.
    This property is initialized in the getDetailsData method.

    *****************************************************************************/
    this.getOpeningHours = function() {
        var container = document.getElementById('info_window_body');
        var content = this.infowindow.heading;

        if (this.infowindow.opening_hours) {
            content += '<p><strong>Opening Schedule:</strong></p>';
            content += '<ul>';
            for (var i = 0; i < this.infowindow.opening_hours.weekday_text.length; i++) {
                content += '<li>' + this.infowindow.opening_hours.weekday_text[i] + '</li>';
            }
            content += '</ul>';
        } else {
            content += '<strong>No opening hours available</strong>';
        }

        container.innerHTML = content;

    };



    /****************************************************************************
    METHOD: showDistance
    PARAMETERS: 1- place.geometry.location
    RETURNS: NOTHING
    DESCRIPTION:
    Executed by the getDetailsData method. Utilizes de getDistanceMatrix api service
    in order to get a calculated distance from our currentLocation object to the
    destination parameter, which in this case is the facility's info window we are
    viewing.
    *****************************************************************************/
    this.showDistance = function(dest) {

        var origin = this.currentLocation().latlong;
        var destination = [dest];

        this.distanceService.getDistanceMatrix({
            origins: [origin],
            destinations: destination,
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
        }, function(response, status) {
            if (status == 'OK') {
                var distance_element = document.getElementById('destination_distance');
                if (distance_element) {
                    distance_element.innerHTML = response.rows[0].elements[0].distance.text;
                }

            }

        });


    };


    /****************************************************************************
    METHOD: filterMarker
    PARAMETERS: NONE
    RETURNS: NOTHING
    DESCRIPTION:
    Executed when the user currentFacilityList observable value changes, via a ko
    subscriber. removes all markers in the map and shows only the markers which
    belong to the current FacilityCategory.
    *****************************************************************************/
    this.filterMarkers = function() {
        for (var i = 0; i < this.currentLocation().facilityCategoryList.length; i++) {
            var current = this.currentLocation().facilityCategoryList[i];

            if (current.key !== this.currentFacilityList().key && this.currentFacilityList().key !== 'all') {
                for (var j = 0; j < current.facilities().length; j++) {
                    var facility = current.facilities()[j];
                    facility.marker.setMap(null);
                }
            } else {
                for (var k = 0; k < current.facilities().length; k++) {
                    var facility = current.facilities()[k];
                    if (!facility.marker.getMap()) {
                        facility.marker.setMap(this.map);
                    }
                }
            }
        }
    };


    /****************************************************************************
    METHOD: createLocationMarker
    PARAMETERS: 1 - google.maps.Map
    RETURNS: NOTHING
    DESCRIPTION:
    Creates a marker for our current location, as specified by the user or by the
    locationData object. Bind a click event, which centers the map around our current
    location and show relevant data in an infowindow.
    *****************************************************************************/
    this.createLocationMarker = function(map) {
        if (this.locationMarker)
            this.locationMarker.setMap(null);

        var marker = new google.maps.Marker({
            map: map,
            title: this.currentLocation().addressline,
            position: this.currentLocation().latlong
        });



        this.locationMarker = marker;

        google.maps.event.addListener(this.locationMarker, 'click', function() {
            self.goToLocation();
        });


    };

    /****************************************************************************
    METHOD: getIconData
    PARAMETERS: 1 - google.maps.Map
    RETURNS: Object - encapsulates the arguments required to create our facility's icon.
    DESCRIPTION:
    returns an object which contains the properties necessary for creating
    our facility marker's icon.
    *****************************************************************************/
    this.getIconData = function(place) {
        return {
            url: place.icon,
            size: new google.maps.Size(35, 35),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 34),
            scaledSize: new google.maps.Size(25, 25)
        };
    };



    /****************************************************************************
    METHOD: clearFields
    PARAMETERS: NONE
    RETURNS: NOTHING
    DESCRIPTION:
    Executed when the user clicks on the 'clear fields' botton.
    Clears all the change address input fields in our change address form.
    *****************************************************************************/
    this.clearFields = function() {
        this.address('');
        this.city('');
        this.state('');
    };


    /****************************************************************************
    METHOD: resetZoom
    PARAMETERS: NONE
    RETURNS: NOTHING
    DESCRIPTION:
    recenters our map around our current location, fits everything into our
    map's boundaries, and resets the zoom.
    *****************************************************************************/
    this.resetZoom = function() {

        if (window.innerWidth < 961) {
            $("#side_menu").hide();
        }
        this.map.setCenter(this.currentLocation().latlong);
        this.map.setZoom(15);
        this.map.fitBounds(this.bounds);

    };

    //--------------------- FOURSQUARE PLACES API -----------------------------------------//
    //PLEASE NOTE THAT MOST OF THE PLACES THAT HAVE AVAILABLE FOURSQUARE DATA ARE
    //WITHIN THE 'restaurant' OR 'shopping_mall' PLACES TYPE.



    /****************************************************************************
    METHOD: getVenueId
    PARAMETERS: 3 - place.name, place.geometry.location.lat, place.geometry.location.lng
    RETURNS: NOTHING
    DESCRIPTION:
    Fetches the venue id required by foursquare and stores it in our infowindow.

    *****************************************************************************/
    this.getVenueId = function(title, lat, long) {
        var venueIdUrl = "https://api.foursquare.com/v2/venues/search?v=20161016&ll=" +
            lat + "," + long + "&query=" + title + "&intent=match&client_id=G2CO0HDKUJAJMKRVLLSD2PAZ20MVMJJWRGAKUC3M4H20NJWV&client_secret=5NVLZB2BP2VFIHB1URO1AVRVECFLHYBPIGUKE0ISXU0AXEHB";
        $.ajax({
            url: venueIdUrl,
            success: function(data) {
                self.infowindow.venue = (data.response.venues.length > 0) ? data.response.venues[0].id : false;

            }
        });
    };

    /****************************************************************************
    METHOD: getFoursquareTips
    PARAMETERS: NONE
    RETURNS: NOTHING
    DESCRIPTION:
    Executed when the 'reviews' tab is clicked. Uses the venue id to retrieve
    all relevant 'tips' posted by foursquare users and updates the infowindow DOM.
    *****************************************************************************/
    this.getFoursquareTips = function() {
        var container = document.getElementById('info_window_body');
        var content = '<p>Fetching some cool stuff...</p>' +
            '<img src="img/110.gif">';

        if (this.infowindow.venue) {
            var venueTipsUrl = "https://api.foursquare.com/v2/venues/" + this.infowindow.venue + "/tips?v=20161016&client_id=G2CO0HDKUJAJMKRVLLSD2PAZ20MVMJJWRGAKUC3M4H20NJWV&client_secret=5NVLZB2BP2VFIHB1URO1AVRVECFLHYBPIGUKE0ISXU0AXEHB";

            $.ajax({
                url: venueTipsUrl,
                success: function(data) {
                    var tips = data.response.tips.items;
                    content = self.infowindow.heading;
                    content += "<img src='img/foursquare.png'>";
                    if (tips.length > 0) {

                        for (var i = 0; i < tips.length; i++) {
                            content += "<div class='well'>" + tips[i].text + " -- <em>" + tips[i].user.firstName + "</em></div>";
                        }
                    } else {
                        content += "No reviews found.";
                    }
                    container.innerHTML = content;
                }
            });

        } else {
            content = self.infowindow.heading + "No foursquare data available";
            container.innerHTML = content;
        }

    };

    /****************************************************************************
    METHOD: getFoursquarePhotos
    PARAMETERS: NONE
    RETURNS: NOTHING
    DESCRIPTION:
    Executed when the user clicks on the infowindow 'photos' tab.
    Fetches the photos from the foursquare places api using the stored
    vanue_id, and updates the DOM with the images.
    *****************************************************************************/
    this.getFoursquarePhotos = function() {
        var container = document.getElementById('info_window_body');
        var content = this.infowindow.heading;


        if (this.infowindow.venue) {
            var venuePhotosUrl = "https://api.foursquare.com/v2/venues/" + this.infowindow.venue + "/photos?v=20161016&client_id=G2CO0HDKUJAJMKRVLLSD2PAZ20MVMJJWRGAKUC3M4H20NJWV&client_secret=5NVLZB2BP2VFIHB1URO1AVRVECFLHYBPIGUKE0ISXU0AXEHB";
            $.ajax({
                url: venuePhotosUrl,
                success: function(data) {
                    var photos = data.response.photos.items;

                    if (photos.length > 0) {
                        content += "<p><img src='img/foursquare.png'></p>";
                        content += '<div class="container" id="carousel-container">';
                        content += '<div id="infowindow_carousel" class="carousel slide">';
                        content += '<div class="carousel-inner">';
                        for (var i = 0; i < photos.length; i++) {
                            if (i === 0) {
                                content += '<div class="item active">';
                            } else {
                                content += '<div class="item">';
                            }
                            content += '<img class="thumbnail" src="' + photos[i].prefix + '300x300' + photos[i].suffix + '">';
                            content += '</div>';
                        }
                        content += '</div>';
                        content += '<a class="left carousel-control" href="#infowindow_carousel" data-slide="prev">' +
                            '<span class="glyphicon glyphicon-chevron-left"></span>' +
                            '</a>';
                        content += '<a class="right carousel-control" href="#infowindow_carousel" data-slide="next">' +
                            '<span class="glyphicon glyphicon-chevron-right"></span>' +
                            '</a>';
                        content += '</div>';
                        content += '</div>';
                    } else {
                        content += "No photos found.";
                    }

                    container.innerHTML = content;
                }
            });

        } else {
            content += "No foursquare photos available";
            container.innerHTML = content;
        }
    };


    //---------------------- ZILLOW API METHODS ----------------------------------------//

    /****************************************************************************
    METHOD: getZillowLocationId
    PARAMETERS: NONE
    RETURNS: NOTHING
    DESCRIPTION:
    fetches the zillow zpid using currentLocation()'s address, city, and state
    properties.
    *****************************************************************************/
    this.getZillowLocationId = function() {
        $.ajax({
            url: 'http://www.felipeboyd.com/webservices/zillow-zpid-service.php',
            data: {
                "address": self.currentLocation().address,
                "city": self.currentLocation().city,
                "state": self.currentLocation().state
            },
            success: function(data, status) {
                if (data == 1) {
                    alert('No Zillow id found for this property. Please verify your address');
                } else {
                    self.currentLocation().zpid = data;
                }

            }
        });
    };


    /****************************************************************************
    METHOD: getZestimate
    PARAMETERS: NONE
    RETURNS: NOTHING
    DESCRIPTION:
    fetches the zillow data of the property: current price, low-high value ranges,
    and value changes.
    *****************************************************************************/
    this.getZestimate = function() {
        if (this.currentLocation().zpid) {
            $.ajax({
                url: 'http://www.felipeboyd.com/webservices/zillow-zestimate-service.php',
                data: {
                    "zpid": this.currentLocation().zpid
                },
                success: function(data, status) {
                    self.parseZillowData(data);
                    self.renderZillowData();
                }
            });
        } else {
            document.getElementById("streetview_container").innerHTML = "<p>Sorry, Zillow information is not available for this address. Make sure this property is available on zillow</p>";
        }
    };

    /****************************************************************************
    METHOD: parseZillowData
    PARAMETERS: String - Stringified XML
    RETURNS: NOTHING
    DESCRIPTION:
    Parses our xml returned from the zillow call and retreives our data of interest.
    Stores the values in newly defined properties, inside our vmodel.
    *****************************************************************************/
    this.parseZillowData = function(data) {
        var xmlDoc = $.parseXML(data);
        var xml = $(xmlDoc);
        var zestimate = xml.find('zestimate');
        this.currentLocation().z_dollar_amount = zestimate.find('amount').text();
        this.currentLocation().z_last_updated = zestimate.find('last-updated').text();
        this.currentLocation().z_value_change = zestimate.find('valueChange').text();
        this.currentLocation().z_value_low = zestimate.find('low').text();
        this.currentLocation().z_value_high = zestimate.find('high').text();
        this.currentLocation().z_value_duration = zestimate.find('valueChange').attr("duration");



    };

    /****************************************************************************
    METHOD: renderZillowData
    PARAMETERS: NONE
    RETURNS: NOTHING
    DESCRIPTION:
    Update our infowindow DOM with our newly generated content from zillow.
    *****************************************************************************/
    this.renderZillowData = function() {
        var container = document.getElementById("streetview_container");
        container.removeAttribute("jstcache");
        container.removeAttribute("style");
        container.innerHTML = '<h4>Zillow Data</h4>' +
            '<ul class="list_group">' +
            '<li class="list-group-item"><b>Amount(USD):</b> ' + this.currentLocation().z_dollar_amount + '</li>' +
            '<li class="list-group-item"><b>Last Price Update:</b> ' + this.currentLocation().z_last_updated + '</li>' +
            '<li class="list-group-item"><b>Change in Value:</b> ' + this.currentLocation().z_value_change + ' (' + this.currentLocation().z_value_duration + ' days)</li>' +
            '<li class="list-group-item"><b>High:</b> ' + this.currentLocation().z_value_high + '</li>' +
            '<li class="list-group-item"><b>Low:</b> ' + this.currentLocation().z_value_low + '</li>' +
            '</ul>' +
            '<p>Data fetched from www.zellow.com</p>';
    };




};


/********************************************************
TYPE: Extender
NAME: required
PARAMETERS: 2 - ko.Observable, String
DESCRIPTION:
Used by our currentFacilityList subscriber in order to validate
the user's input. Sets our observable argument's message to either
the empty character or a defined string. If our observable's value
is null, it will show a message.
*******************************************************/
ko.extenders.required = function(target, overrideMessage) {

    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    function validate(value) {
        target.hasError(value ? false : true);
        target.validationMessage(value ? "" : overrideMessage || "This field is required");
    }

    validate(target());

    target.subscribe(validate);

    return target;

};

/*******************************************
 TYPE: Global scoped function
 NAME: loadMap
 PARAMETERS: NONE
 RETURNS: NOTHING
 DESCRIPTION:
 Used by the google maps javascript API as a callback function,
 invoked by the script tag in index.html. Initializes our map,
 and all the services used by our application.
*******************************************/
function loadMap() {
    vmodel.map = new google.maps.Map(document.getElementById('map_container'), {
        center: vmodel.currentLocation().latlong,
        zoom: 15
    });

    vmodel.geocoder = new google.maps.Geocoder();
    vmodel.infowindow = new google.maps.InfoWindow();
    vmodel.service = new google.maps.places.PlacesService(vmodel.map);
    vmodel.distanceService = new google.maps.DistanceMatrixService();
    vmodel.streetViewService = new google.maps.StreetViewService();
    vmodel.address(locationData.address);
    vmodel.city(locationData.city);
    vmodel.state(locationData.state);
    vmodel.newLocation();



}



//create our global scoped view model instance.
vmodel = new ViewModel();

//sets our current location to the one in the locationData object.
//sets our default category to the 'all' CategoryList
vmodel.init();

//apply our bindings
ko.applyBindings(vmodel);



//used for the hamburger iconm in order to hide/show the side menu.
$('#hamburger').click(function() {
    $("#side_menu").slideToggle();
});