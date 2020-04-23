'use strict';

// REQUIRE LIBRARIES /////
require('dotenv').config();
const express = require('express'); 
const cors = require('cors');
const app = express();

// INTERACT WITH APIs /////
const superagent = require('superagent');

const PORT = process.env.PORT || 3000;

app.use(cors());

// PATHS /////
//  path to location
let weatherArray = [];
let trailsArray = [];


// LOCATION /////

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


// LOCATION CONSTRUCTOR to get information from geo.json file /////
function Location (city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
  
}


// WEATHER /////
// //getting the weather forecast for location
app.get('/weather', weatherFunction);
function weatherFunction (request, response){
  
      let latitude = request.query.latitude;
      // console.log(latitude)
      let longitude = request.query.longitude;
      const weatherUrl = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${latitude},${longitude}`;
      return superagent.get(weatherUrl)
      .then(result => {
          let weatherData = result.body.daily.data;
          let weather = weatherData.map( day => {
         return new WeatherConstructor(day);
        });
      
        response.status(200).json(weather);
    
      })
      .catch(err => {
        console.log(err);
        response.status(500).send('Weather Broke');
      });

    }
 

// WEATHER CONSTRUCTOR /////
function WeatherConstructor(day) {
    console.log(day.forecast)
this.forecast = day.summary;
this.time = new Date(day.time*1000).toString();
}


// TRAILS /////
// getting trails data 
app.get('/trails', trailsFunction);
function trailsFunction (request, response){
  
      let latitude = request.query.latitude;
      let longitude = request.query.longitude;
      const trailsUrl = `https://hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=10&key=${process.env.TRAIL_API_KEY}`;
       return superagent.get(trailsUrl)
      .then(data => {
        console.log (data);
          
        let trailsList = data.body.trails.map( value => {
         return new Trails(value);
        });
        response.status(200).json(trailsList);

        
// TRAILS ERROR HANDLER /////

      })
      .catch(err => {
        console.log(err);
        response.status(500).send('Trails is Broken');
      });

      }

//  TRAILS CONSTRUCTOR /////
function Trails(trail) {
  this.name = trail.name;
  this.location = trail.location;
  this.length = trail.length;
  this.stars = trail.stars;
  this.star_votes = trail.starVotes;
  this.summary = trail.summary;
  this.url = trail.url
  this.conditions = trail.conditionDetails;
  this.condition_date = trail.conditionDate.slice(0,10);
  this.condition_time = trail.conditionDate.slice(11,18);

}
// const errorHandler = (error, request, response) => {
//   response.status(500).send(error);
// }


//  ACTIVATE the PORT /////
app.listen(PORT,() => console.log(`Listening on port ${PORT}`));