  
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
  let city = request.query.city;
  const queryStringParams = {
      key: process.env.GEOCODE_API_KEY,
      q: city,
      format: 'json',
      limit: 1,
  };
  superagent.get(url)
  .query (queryStringParams)
  .then( data => {
      let locationData = data.body[0];
      console.log(locationData);
      let location = new Location(city, locationData);
      console.log(location)
      response.status(200).json(location);

  });
}
  
// console.log (city); 
// response.status(200).json(locationData);
catch{
  errorHandler('so sorry, something went wrong.', request, response);
}
}

// //getting the weather forecast for location
app.get('/weather', weatherFunction);
function weatherFunction (request, response){
  try {
      let latitude = request.query.latitude;
      let longitude = request.query.longitude;
      // const weather = request.query.weather;
      const weatherUrl = `https://api.darksky.net/${process.env.WEATHER_API_KEY}/${latitude},${longitude}`;
      return superagent.get(weatherUrl)
      .then(weatherData =>{
          
      })
    // const weatherBuilder = new WeatherConstructor(daily, weatherData);


    console.log(weather);
    response.send(weatherArray);
    console.log(weatherArray);
  }
  catch(error){
    errorHandler('so sorry, something went wrong.', request, response);
  }
}


// weather constructor
function WeatherConstructor(time, forecast){
this.time = new Date(time*1000).toString;
this.forecast = forecast;
}

// constructor function to get information from geo.json file
function Location (city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}

//  constructor error handler
const errorHandler = (error, request, response) => {
  response.status(500).send(error);
}


//  activate the PORT
app.listen(PORT,() => console.log(`Listening on port ${PORT}`));