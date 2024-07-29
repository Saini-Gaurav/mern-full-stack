const { v4: uuid } = require("uuid");

const HtppError = require('../models/http-error')

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

const signup = (req, res, next)=> {
    const {name, email, password} = req.body

    const hasUser = DUMMY_USERS.find((u)=> u.email === email)
    if(hasUser){
        throw new HtppError("Could not create user, email already exists", 422)
    }
    
    const createdUsers = {
        id: uuid(),
        name, //name: name
        email,
        password
    }
    DUMMY_USERS.push(createdUsers)
    res.status(201).json({user: createdUsers})
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