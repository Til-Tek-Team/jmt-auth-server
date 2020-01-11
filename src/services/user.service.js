const { User } = require('../models');

function createUser(user){
    return User.create(user).catch(err => console.log(err));
}

function getUserByEmail(email){
    return User.findOne({where: {email}}).catch(err => console.log(err));
}

function getUserById(id){
    return User.findOne({where: { id }}).catch(err => console.log(err));
}

function updateUser(user, data){
    return user.update(data);
}


module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    updateUser
}