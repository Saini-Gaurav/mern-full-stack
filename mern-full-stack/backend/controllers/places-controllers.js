const { v4: uuid } = require('uuid')

const HtppError = require('../models/http-error')

const DUMMY_PLACES = [
    {
      id: 'p1',
      title: 'Empire State Building',
      description: 'One of the most famous sky scrapers in the world!',
      location: {
        lat: 40.7484474,
        lng: -73.9871516
      },
      address: '20 W 34th St, New York, NY 10001',
      creator: 'u1'
    }
  ];

const getPlacesById = (req, res, next)=> {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find((p)=> {
        return p.id === placeId
    })
    if(!place){
        throw new HtppError('Could not find a place for the provided id' , 404)
    }
    res.json({place})
}

const getPlacesByUserId =  (req, res, next)=>{
    const userId = req.params.uid;
    const user = DUMMY_PLACES.find((p)=>{
        return p.creator === userId;
    })

    if(!user){
        return next(new HtppError('Could not find a place for the provided user id', 404)) 
    }
    res.json(user)
}

const createPlace = (req, res, next)=>{
    const {title, description, coordinates, address, creator} = req.body;

    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creator
    }

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({place: createdPlace})

}

exports.getPlacesById = getPlacesById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace