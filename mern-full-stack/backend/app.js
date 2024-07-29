const express = require('express');
const bodyParser = require('body-parser');

const HtppError = require('./models/http-error')

const placeRoutes = require("./routes/places-routes")

const app = express();

app.use(bodyParser.json())

app.use('/api/places', placeRoutes);

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


app.listen(5000)