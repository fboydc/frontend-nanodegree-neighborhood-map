# NEIGHBORHOOD SCANNER

Neighborhood scanner is a web tool which provides potential home owners with valuable information. Users can see different points of interest located around a real estate location: from supermarkets, hospitals, schools, gyms, health and fitness centers to restaurants, pet stores, etc. Users are also shown relevant updated real estate information from [Zillow](http://www.zillow.com), such as price, price-history, price-ranges,etc. Real estate information is fed from [Zillow](http://www.zillow.com), therefore it is crucial that the information of the real estate property be available at this site; this site will only work with properties listed in this website and nowhere else. 

This gist of the application is to provide the user with all the information he/she may need about a neighborhood before making a purchasing decision.

## Getting Started

### Requirements
**Browser Requirements**
This project uses the Google Maps Javascript API, therefore if you have the latest version
of **Google Chrome** you are good to go. Other browser versions such as Firefox, Safari, and 
Opera are fine as long as you use the latest verions.

### Installation

This project is ready-to-run, all you have to do is go to the dist folder and launch index.html in your preferred
browser; I recommend Google Chrome. If you wish to replicate the project making it your own, then please see
the dependencies section.

### Dependencies/Libraries ##
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


### Installation Instructions (Not Required) ###
Include Knockout, jQuery, and Bootstrap libraries in your html file. To install Gulp in your project,
please see the instructions [here](https://css-tricks.com/gulp-for-beginners/). Please note that your starting file structure should be of the following manner:
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



**NOTE: Please note that I have inlined all css and javascript except for bootstrap.min.css. Hence, the reason I did not included them in the file structure above. If you would like to see my documented javascript and css, you can go into app/css and app/js.**

After installing **NPM** and **Gulp**, run the follow **Gulp** command:
`gulp build`
You should end up with the following file structure:

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





        



