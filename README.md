# NEIGHBORHOOD SCANNER

Neighborhood scanner is a web tool which provides potential home owners with valuable information. Users can see different points of interest located around a real estate location: from supermarkets, hospitals, schools, gyms, health and fitness centers to restaurants, pet stores, etc. Users are also shown relevant updated real estate information from [Zillow](http://www.zillow.com), such as price, price-history, price-ranges,etc. Real estate information is fed from [Zillow](http://www.zillow.com), therefore it is crucial that the information of the real estate property be available at this site; this site will only work with properties listed in this website and nowhere else.

This gist of the application is to provide the user with all the information he/she may need about a neighborhood before making a purchasing decision.

## Getting Started

### Requirements
**Browser Requirements**
This project uses the Google Maps Javascript API, therefore if you have the latest version
of **Google Chrome** you are good to go. Other browser versions such as Firefox, Safari, and
Opera are fine as long as you use the latest verions.

### How do I Run The Application? ###
It is very simple: all you have to do is go to the dist folder, open up index.html in your preferred browser (I recommend one of the choices above) and that's it.

### Installation

As mentioned above, This project is ready-to-run; all you have to do is go to the dist folder and launch index.html. If you wish to replicate the project making it your own, then read on:

1. Include all the javascript libraries specified in the **Libraries** section
2. **Install NPM.** Please see the following [link](https://nodejs.org/en/) for instructions on how to install node.
3. **Install Gulp.** To install gulp run the following command: Mac Os `sudo npm install gulp -g`, Windows `npm install gulp -g`. please follow the tutorial hosted [here](https://css-tricks.com/gulp-for-beginners/) for instructions on how to configure gulp along with gulpfile.js. *This is very important, please follow this tutorial before preceding with the installation.*

4. **Install Gulp dependencies. There is a great summary [here](https://css-tricks.com/gulp-for-beginners/):**
4.1 **Install gulp-uglify:** run the following command on your command prompt or terminal `npm install --save-dev gulp-uglify`. Gulp-uglify will allow us to minify all our javascript files. For more information on gulp-uglify, [go here](https://www.npmjs.com/package/gulp-uglify).
4.2 **Install gulp-cssnano:** run the following command on your command prompt or terminal `npm install gulp-cssnano --save-dev`. Gulp-cssnano will allow us to minify all our css files. For more information on gulp-cssnano, [go here](https://www.npmjs.com/package/gulp-cssnano).
4.3 **Install run-sequence** run the following command on your command prompt or terminal `npm install --save-dev run-sequence`. This will allow us to chain our defined tasks above into a single command. For more information on run-sequence, [go here](https://www.npmjs.com/package/run-sequence).

5. **Build the application.** In order to build the application, run the following command for your terminal: `gulp build`. Once finished, your dist folder should contain all the simplified, optimized code ready.

6. **Run the Application.** Launch index.html in the dist folder; the application should come up in your browser.

### How Do I Use This Application? ###
If you are on a desktop, your control menu sould be on the left hand side. If you are on a mobile device, your menu should slide down. The application shows the property details for a default address at *289 Watch Hill Rd, Exton, PA*. It also shows all the places found under the following categories under Google Maps API within a 4 mile radius of this location: Hospitals, Gym, Food, Mall, Schools, Public Transit, Groceries, Mailing Services, Veterinary, and Pet Shops.  This default address is actually a property being sold at www.zillow.com, found [here](https://www.zillow.com/homes/289-Watch-Hill-Rd,-Exton,-PA_rb/). The places appear on a list which can be filtered by selecting the appropiate filter in the selection box, and are marked in the map with an icon representing the type of the place. When filtered, only the relevant places to the filter will appear.

#### Information about nearby places ####
In order to get information of a place, you can select the place from the list by clicking on the name. This will make the map zoom to said location and an info window will appear containing relevant information. The same can be done, if you select the relevant marker on the map. The info window will contain general information about the place, such as address, distance, user-rating, phone-number, opening-hours, reviews, photos, etc.

#### Information about a Zillow property ####
The needle shaped marker in the middle of your map represents your zillow
property location. If you click on the "go to property" button, the map will zoom in to where your property is. Also, an infowindow will appear showing a street view of your property by default. A tab menu will let you see additional data about your property such as property price, price-range, high-lows, etc.

#### Changing/Inputting your own address ####
If you have a zillow property you are interested in, you can also input it on the application to show relevant information. To do so, you can press the "change address" button, and the address change form will appear. In order for the Zillow api to find your address you must fill in the appropriate input tag as follows:

1. ADDRESS STREET/ROAD: e.g. 6351 Fringilla Avenue
2. CITY: e.g Gardena
3. STATE: e.g. Colorado | CO (you can use any of the two formats)

Hit the "go" button and Voila! the map will change with your relevant information. You can use this information and find more about where you would like to live: like closest supermarket, gym, restaurants. Not only that, if you want reviews on these places you can also find out using the 'reviews' tab, the 'pictures' tab will help you with restaurants, and much more.

### Libraries ##
**Knockout.js (V. 3.4.2)**
Knockout.js is a javascript framework, providing developers with an optimized design pattern which simplifies and organizes
their code reducing development time and facilitates code optimization and debugging. To learn more about knockout.js, go [here](http://knockoutjs.com/).

**Jquery (V. 3.2.1)**
jQuery is a multi-platform javascript library which simplifies the user of verbose javascript to perform DOM manipulation,
ajax calls, among others. ([check it out](https://jquery.com/))

**Bootstrap (V. 3.3)**
Responsive css and javascript library, helping you make your website functional across many different platforms and view-port sizes.([check it out](https://getbootstrap.com/docs/3.3/))

**GULP.js**
Gulp.js is a build processing tool used for automating tasks such as  minimizing images and compressing css and javascript files. [check it out](http://knockoutjs.com/).


### FILE STRUCTURE ###
Please note that your starting file structure should be of the following manner:
**BOLD** - Folder
*italics* - File

**app**
- **css**
    - bootstrap.min.css
- **fonts**
    -glyphicons-halflings-regular.eot
    -glyphicons-halflings-regular.svg
    -glyphicons-halflings-regular.ttf
    -glyphicons-halflings-regular.woff
    -glyphicons-halflings-regular.woff2

- **img**
    - 110.gif
    - foursquare.png
    - google.png
    - noimage.png
- **index.html**

**dist**
**node_modules**
gulpfile.js
package.json


After running Gulp:

**app**
- **css**
    - bootstrap.min.css
- **fonts**
    -glyphicons-halflings-regular.eot
    -glyphicons-halflings-regular.svg
    -glyphicons-halflings-regular.ttf
    -glyphicons-halflings-regular.woff
    -glyphicons-halflings-regular.woff2

- **img**
    - 110.gif
    - foursquare.png
    - google.png
    - noimage.png
- **index.html**

**dist**
- **css**
  - bootstrap.min.css
- **fonts**
    -glyphicons-halflings-regular.eot
    -glyphicons-halflings-regular.svg
    -glyphicons-halflings-regular.ttf
    -glyphicons-halflings-regular.woff
    -glyphicons-halflings-regular.woff2
- **img**
    -  110.gif
    - foursquare.png
    - google.png
    - noimage.png
- index.html

**node_modules**
gulpfile.js
package.json

### 3rd Party API's ###
**Google Maps**
- [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/adding-a-google-map)
- [Google Maps Javascript Street View Service API](https://developers.google.com/maps/documentation/javascript/streetview)
- [Google Maps Distance Matrix Service](https://developers.google.com/maps/documentation/javascript/distancematrix)
- [Google Maps Places Library](https://developers.google.com/maps/documentation/javascript/places)
-
**Foursquare**
- [Foursquare Places API](https://developer.foursquare.com/places-api)


**Zillow**
- [Zillow API](https://www.zillow.com/howto/api/APIOverview.htm)


### PROXY APIs ###
Given the fact that Zillow API does not allow Cross-Domain requests, it was necessary to create two PHP proxy/intermediary web services acting as a mid-layer between this application and Zillow. You can find these proxy service at my website:

http://www.felipeboyd.com/webservices/zillow-zpid-service.php
http://www.felipeboyd.com/webservices/zillow-zestimate-service.php









