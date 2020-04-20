'use strict';

//   require libraries server build
require('dotenv').config();
const express = require('express'); 
const cors = require('cors');
const app = express();

// allows interaction with APIs
const superagent = require('superagent');

const PORT = process.env.PORT || 3000;

app.use(cors());

// paths
//  path to location
let weatherArray = [];


// LOCATION

app.get('/location', locationFunction);
function locationFunction (request, response) {
  const url = 'https://us1.locationiq.com/v1/search.php';
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
    let location = new Location(city, locationData);
    response.json(location);
    
  })
  .catch(err => {
    errorHandler(err, request, response);
  })
}

// location constructor to get information from geo.json file
function Location (city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
  
}

// WEATHER

// //getting the weather forecast for location
app.get('/weather', weatherFunction);
function weatherFunction (request, response){
  
      let latitude = request.query.latitude;
      console.log(latitude)
      let longitude = request.query.longitude;
      // const weather = request.query.weather;
      const weatherUrl = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${latitude},${longitude}`;
      // console.log(weatherUrl);
      return superagent.get(weatherUrl)
      .then(result =>{
          let weatherData = result.body.daily.data;
          console.log(`weatherData is`)
          console.log(weatherData[0])
       let weather = weatherData.map( day => {
         return new WeatherConstructor(day);
        });
       console.log(weather) 
        response.status(200).json(weather);
    //   console.log(weather); 
      })
      .catch(err => {
        console.log(err);
        response.status(500).send('Weather Broke');
      });

    }
 
// weather constructor
function WeatherConstructor(day) {
    console.log(day.forecast)
this.forecast = day.summary;
this.time = new Date(day.time*1000).toString();
}

// TRAILS

app.get('/trails', trailsFunction);
function trailsFunction (request, response){
  
      let latitude = request.query.latitude;
      console.log(latitude)
      let longitude = request.query.longitude;
      // const weather = request.query.weather;
      const trailsUrl = `https://www.hikingproject.com/data/get-trails/${process.env.TRAIL_API_KEY}/${latitude},${longitude}`;
      // console.log(weatherUrl);
      return superagent.get(trailsUrl)
      .then(result =>{
          let trailsData = result.body.daily.data;
          console.log(`trailsData is`)
          console.log(trailsData[0])
       let parsedTrails = JSON.parse(result.text);   
       let trailsList = parsedTrails.trails.map( day => {
         return new Trails(value);
        });
       console.log(trails) 
        response.status(200).json(trailsList);
    
// trails constructor
function Trails(trail) {
  this.name = trail.name;
  this.location = trail.location;
  this.length = trail.length;
  this.stars = trail.stars;
  this.star_votes = trail.starVotes;
  this.summary = trail.summary;
  this.trail.url =trail.url
  this.conditions = trail.conditionDetails;
  this.condition_date = trail.conditionDate.slice(0,10);
  this.condition_time = trail.conditionDate.slice(11,18);

}




      })
      .catch(err => {
        console.log(err);
        response.status(500).send('Weather Broke');
      });

    }


//  constructor error handler
const errorHandler = (error, request, response) => {
  response.status(500).send(error);
}


//  activate the PORT
app.listen(PORT,() => console.log(`Listening on port ${PORT}`));