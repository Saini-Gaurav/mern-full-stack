const { v4: uuid } = require("uuid");
const { validationResult } = require('express-validator')

const HtppError = require('../models/http-error')
const User = require('../models/user')

const DUMMY_USERS = [
    {
        id: "u1", 
        name: "Max Schwarz",
        email: "test@test.com",
        password: "testers"
    }
]

const getUsers = (req, res, next)=> {
    res.json({users: DUMMY_USERS})
}

const signup = async (req, res, next)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next(new HtppError("Invalid inputs passed. Please check your data !", 422));
    }
    const {name, email, password, places} = req.body

    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    }
    catch(err){
        const error = new HtppError("Failed to create a new account. Please try again later", 500);
        return next(error);
    }

    if(existingUser){
        const error = new HtppError("User exists already. Please login instead!", 422);
        return next(error);
    }
    
    const createdUsers = new User({
        name,
        email,
        image: "https://img.freepik.com/free-photo/floral-patterns-depict-modern-wedding-celebration-generated-by-ai_188544-9728.jpg",
        password,
        places
    });

    try {
        await createdUsers.save();
    }
    catch(err){
        const error = new HtppError('Signin Up failed, Please try again', 500);
        return next(error);
    }

    DUMMY_USERS.push(createdUsers)
    res.status(201).json({user: createdUsers.toObject({getters: true})})
}

const login = (req, res, next)=> {
    const {email, password} = req.body
    const identifiedUser = DUMMY_USERS.find((u)=> u.email === email)
    if(!identifiedUser || identifiedUser.password !== password){
        throw new HtppError('Could not find the user, credentials seems to be wrong', 401)
    }

    res.json({message: "Logged In"})
}


exports.getUsers = getUsers
exports.signup = signup
exports.login = login