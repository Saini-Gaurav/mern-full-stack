const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const HtppError = require('./models/http-error')

const placeRoutes = require("./routes/places-routes")
const userRoutes = require("./routes/users-routes")

const app = express();

app.use(bodyParser.json())

app.use('/api/places', placeRoutes);

app.use('/api/users', userRoutes)

app.use((req, res, next)=>{
  const error = new HtppError("Could not found this route", 404);
  throw error;
})

app.use((error, req, res, next)=>{
    if(res.headerSent){
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message: error.message || "An Unknown error occured!"})
})


mongoose.connect('mongodb+srv://gauravsaini050203:bBczYMuvruZTTnfv@cluster0.nndflme.mongodb.net/places').then(()=>{
  app.listen(5000)
  console.log("Database is connected")
}).catch(err => {
  console.log(err);
})
