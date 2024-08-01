const { v4: uuid } = require("uuid");
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const User = require('../models/user')

const DUMMY_USERS = [
    {
        id: "u1", 
        name: "Max Schwarz",
        email: "test@test.com",
        password: "testers"
    }
]

const getUsers = async (req, res, next)=> {
    let users;
    try{
        users = await User.find({}, '-password')
    }
    catch(err){
        const error = new HttpError('Fetching users failed. Please try again later', 500);
        return next(error);
    };

    res.json({users: users.map(user => user.toObject({getters: true}))})   
}

const signup = async (req, res, next)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next(new HttpError("Invalid inputs passed. Please check your data !", 422));
    }
    const {name, email, password} = req.body

    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    }
    catch(err){
        const error = new HttpError("Failed to create a new account. Please try again later", 500);
        return next(error);
    }

    if(existingUser){
        const error = new HttpError("User exists already. Please login instead!", 422);
        return next(error);
    }
    
    const createdUsers = new User({
        name,
        email,
        image: "https://img.freepik.com/free-photo/floral-patterns-depict-modern-wedding-celebration-generated-by-ai_188544-9728.jpg",
        password,
        places: []
    });

    try {
        await createdUsers.save();
    }
    catch(err){
        const error = new HttpError('Signin Up failed, Please try again', 500);
        return next(error);
    }

    DUMMY_USERS.push(createdUsers)
    res.status(201).json({user: createdUsers.toObject({getters: true})})
}

const login = async (req, res, next)=> {
    const {email, password} = req.body
    
    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    }
    catch(err){
        const error = new HttpError('Logg in Failed. Please try again', 500);
        return next(error);
    }

    if(!existingUser || existingUser.password !== password){
        const error = new HttpError('Invalid credentials', 401);
        return next(error);
    }

    res.json({message: "Logged In"})
}


exports.getUsers = getUsers
exports.signup = signup
exports.login = login