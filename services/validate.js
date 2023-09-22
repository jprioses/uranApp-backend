const validator = require("validator");

const validateNewUserData = (data) => {
  
    return (
        (data.name && !validator.isEmpty(data.name)) &&
        (data.surname && !validator.isEmpty(data.surname) )&&
        (data.national_id && !validator.isEmpty(data.national_id)) &&
        ( data.address && !validator.isEmpty(data.address)) &&
        (validator.equals(data.role, "godfather") ||
          ((validator.equals(data.role, "leader") || validator.equals(data.role, "voter")) &&
            (data.ref_parent && !validator.isEmpty(data.ref_parent))))
    );
    
}

module.exports = {
    validateNewUserData,
}