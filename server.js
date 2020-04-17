  
'use strict';

//   require libraries server build
require('dotenv').config();
const express = require('express'); 
const cors = require('cors');
const app = express();
const superagent = require('superagent');

const PORT = process.env.PORT || 3000;

app.use(cors());

// paths
//  path to location
let weatherArray = [];

app.get('/location', locationFunction);
function locationFunction (request, response) {
  try{
  const url = 'https://us1.locationiq.com/v1/search.php';
  // const geoData = require('./data/geo.json');
  const city = request.query.city;
  const locationData = new Location(city, geoData);
  
console.log (city); 
response.status(200).json(locationData);
} catch{
  errorHandler('so sorry, something went wrong.', request, response);
}
}

//getting the weather forecast for location
app.get('/weather', weatherFunction);
function weatherFunction (request, response){
  try {
    const weatherUrl = 'https://api.darksky.net/forecast/38199e0a68afb5aa0c8dc98806386037/37.8267,-122.4233';
    let {latitude,} = request.query;
    let {longitude} = request.query;
    const weather = request.query.weather;
    const weatherBuilder = new WeatherConstructor(daily, weatherData);

    console.log(weather);
    response.send(weatherArray);
    console.log(weatherArray);
  }
  catch(error){
    errorHandler('so sorry, something went wrong.', request, response);
  }
})


// weather constructor
function WeatherConstructor(time, forecast){
this.time = new Date(time*1000).toString;
this.forecast = forecast;
}

// constructor function to get information from geo.json file
function Location (city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

//  constructor error handler
const errorHandler = (error, request, response) => {
  response.status(500).send(error);
}


//  activate the PORT
app.listen(PORT,() => console.log(`Listening on port ${PORT}`));