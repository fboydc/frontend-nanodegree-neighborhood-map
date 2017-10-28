var neighborhoodData = [
	{
		name: "Exton",
		state: "PA",
		zipcodes: [19341, 19353],
		areacodes: [610, 484],
		latlong: [40.0326, 75.6275]
	}
]




var Neighborhood = function(name, state, zipcodes, areacodes, latlong){
	this.name = name;
	this.state = state;
	this.zipcodes = zipcodes;
	this.areacodes = areacodes;
	this.latlong = latlong;
	this.facilities = ko.observableArray([]);
	this.currentFacility = ko.observable();
}


var FacilityType = function(name){
	this.name = name;
	this.locations = ko.observableArray([]);
}


Neighborhood.prototype.init = function(){
	this.facilities.push(new FacilityType('Hospitals'));
	this.facilities.push(new FacilityType('Fitness/gym'));
	this.facilities.push(new FacilityType('Food'));
	this.facilities.push(new FacilityType('Golf'));
	this.facilities.push(new FacilityType('Mall'));
	this.facilities.push(new FacilityType('Schools'));
	this.facilities.push(new FacilityType('Tennis'));
	this.facilities.push(new FacilityType('Public Transit'));
	this.facilities.push(new FacilityType('Night Life'));
	this.facilities.push(new FacilityType('Supermarkets'));
	this.facilities.push(new FacilityType('Mailing Services'));
}


var ViewModel = function(){
	var self = this;
	self.neighborhoodList = ko.observableArray([]);
	self.currentNeighborhood = ko.observable();


	neighborhoodData.forEach(function(item){
		var entry = new Neighborhood(item.name, item.state, item.zipcodes, item.areacodes, item.latlong);
		entry.init();
		self.neighborhoodList.push(entry);
	});

	self.currentNeighborhood(self.neighborhoodList()[0]);





}

ko.applyBindings(new ViewModel());