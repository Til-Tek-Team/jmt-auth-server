const userService = require('../services/user.service');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CONSTANTS = require('../../constants.js');
const { validateUser } = require('../_helpers/validators');
const _ = require('lodash');

function login(req, res, next){
    const {email, password} = req.body;
    if(!email || !password){
        res.status(200).json({ success: false, error: 'incorrect request' });
        return;
    }

    authenticateUser(email, password)
        .then(user => res.status(200).json({success: true, user}))
        .catch(err => next(err));
}

function signUp(req, res, next){
    const user = req.body;

    console.log(user);
    const valid = validateUser(user);

    if(!valid){
        res.status(200).json({ success: false, error: 'invalid request' });
        return;
    }

    createUser(user)
        .then(user => res.status(200).json({success: true, user}))
        .catch(err => next(err));
}


async function authenticateUser(email, password){
    let user = await userService.getUserByEmail(email);
    if(!user){
        throw "email or password incorrect";
    }

    const pass = bcryptjs.compareSync(password, user.password);
    if(!pass){
        throw "email or password incorrect";
    }

    if(pass){
        const token = jwt.sign({ sub: user.id }, CONSTANTS.JWTSECRET, { expiresIn: '24h' });
        let updatedUser = _.omit(user.dataValues, ["password"]);
        updatedUser.token = token;
        return updatedUser;
    }
}

async function createUser(user){
    user.username = user.email;
    let createdUser = await userService.createUser(user);
    
    if(!createdUser){
        throw "something went wrong.";
    }
    let updatedUser = _.omit(createdUser.dataValues, ["password"]);

    return updatedUser;
}



module.exports = {
    login,
    signUp
}