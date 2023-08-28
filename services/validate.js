const validator = require("validator");

const validateNewUserData = (data) => {

    return (
        !validator.isEmpty(data.name) &&
        !validator.isEmpty(data.surname) &&
        !validator.isEmpty(data.national_id) &&
        !validator.isEmpty(data.address) &&
        (validator.equals(data.role, "godfather") ||
          (validator.equals(data.role, "leader") &&
            !validator.isEmpty(data.ref_godfather)) ||
          (validator.equals(data.role, "voter") &&
            !validator.isEmpty(data.ref_godfather) &&
            !validator.isEmpty(data.ref_leader)))
    );
    
}

module.exports = {
    validateNewUserData,
}