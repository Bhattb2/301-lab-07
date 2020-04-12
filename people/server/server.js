'use strict';

/*
  The .env file has this in it:
  PORT=3000
*/
require('dotenv').config();
const cors = require('cors');
const express = require('express');

const PORT = process.env.PORT;

const app = express();
app.use(cors());

app.get('/people', handleName);
app.get('/john', doTheJohnStuff);

// Handler Functions

function doTheJohnStuff( req, res ) {
  res.json({foo:'bar'});
}

function handleName(request, response) {
  let nameData = require('./people.json');
  let listOfNames = [];
  nameData.forEach(name => {
    let newName = new Name(name.name);
    listOfNames.push(newName);
  });
  response.json(listOfNames);
}



function Name(name) {
  this.name = name;
}



app.listen(PORT, () => console.log('Server up on', PORT));