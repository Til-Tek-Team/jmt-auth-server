const validator = require('validator');
const _ = require('lodash');

function validateUser(data){
    let valid = true;
    const fields = ["email", "phoneNumber", "password", "firstName", "lastName"];
    const keys = _.keys(data);
    fields.map(field => {
        if(keys.includes(field)){
            return;
        }
        valid = false
    }) 
    if(!valid){
        return valid;
    }
    _.map(data, (value, key) => {
        if(key == 'email'){
            if(!validator.isEmail(value+'')){
                valid = false;
            }
        }else{
            if(validator.isEmpty(value+'')){
                valid = false
            }
        }
    })

    return valid;
}

module.exports = {
    validateUser
}