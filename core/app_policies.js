/**
 * Password policies file.
 * 
 */
require("../config/config");


/**
 * password policie check:
 * check the different policies for new passwords using as configuration
 * enviroment variables set on the [config.js] file.
 * 
 * The function use a regular expression to run password validation.
 */

let password_policy_check = (password) => {
   
    var errors = [];
    
    //1. check password length
    if(process.env.PASSWORD_LENGTH!="DISABLED"){
        if(password.length < process.env.PASSWORD_LENGTH){
            errors.push(`- Invalid password length (${password.length}).`);
            //return `[ERROR] Invalid password length (${password.length}).`;
        }
    }
    //2. check mixed case
    if(process.env.PASSWORD_MIXED_CASE=="ENABLED"){
        if(!checkPasswordCase(password)){
            errors.push("- Password must have upper and lower case letters.");
            //return `[ERROR] Password must have upper and lower case letters.`;
        }
    }
    //3. check special characters

    // password can't have any special character!
    if(process.env.PASSWORD_SPECIAL_CHARACTERS=="DISABLED"){
        if(checkInvalidSpecialCharacters){
            errors.push("- Password can't have any special character ("+
            process.env.PASSWORD_SPECIAL_CHARACTERS_VALID_OPTIONS+
            process.env.PASSWORD_SPECIAL_CHARACTERS_INVALID_OPTIONS+").");
            //return `[ERROR] Password can't have any special character.`;
        }
        // password must have any of the defined special characters!
    } else if(process.env.PASSWORD_SPECIAL_CHARACTERS=="ENABLED"){
        
        if(!checkValidSpecialCharacters(password)){
            errors.push(`- Password must have at least 1 of the defined special characters (${process.env.PASSWORD_SPECIAL_CHARACTERS_VALID_OPTIONS}).`);
            //return `[ERROR] Password must have at least 1 of the defined special characters (${process.env.PASSWORD_SPECIAL_CHARACTERS_VALID_OPTIONS}).`;
        }
    }
    
    //4. Numbers in password(must have)
    if(process.env.PASSWORD_NUMBERS == 'ENABLED') {
        if(!checkNumbers(password)){
            errors.push("- Password must have at least 1 number.");
            //return "[ERROR] Password must have at least 1 number.";
        }
    }
    
    if(errors.length==0){
        return 'OK';
    } else {
        return "ERROR: \n" + errors.join("\n");
    }
}

//check the user object to find if it has the required fields 
// for the registration to succeed
let new_user_valid_fields = (user) => {
    let fields = process.env.NEW_USER_REQUIRED_FIELDS;

    let errors = [];

    for(var i=0;i<fields.length;i++){
        if(user.hasOwnProperty(fields[i])){
            errors.push("- Field "+ fields[i] + " is required.");
        }
    }

    if(user.email){//check username field, must be an email
        if(!checkEmail(user.email)){
            errors.push(`- Invalid email (${user.email}).`);
        }
    }

    if(errors.length>0){
        return "[ERROR]: \n" + errors.join();
    }else{
        return 'OK';
    }
    
}

let valid_email_check = (email)=>{
    return checkEmail(email);
}


/************************************************************************
 ************************* HELPER FUNCTIONS *****************************
 ************************************************************************/

// password must have lower and upper case letters.
let checkPasswordCase = (password) => {
    let regularExpression = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])");
    return regularExpression.test(password);
}

let checkValidSpecialCharacters = (password) => {
    var valid = new RegExp("^(?=.*?["+process.env.PASSWORD_SPECIAL_CHARACTERS_VALID_OPTIONS+"])");
    var invalid = new RegExp("^(?=.*?["+process.env.PASSWORD_SPECIAL_CHARACTERS_INVALID_OPTIONS+"])");

    return (valid.test(password) && !invalid.test(password));
}

let checkInvalidSpecialCharacters = (password) => {
    var valid = new RegExp("^(?=.*?["+process.env.PASSWORD_SPECIAL_CHARACTERS_VALID_OPTIONS+"])");
    var invalid = new RegExp("^(?=.*?["+process.env.PASSWORD_SPECIAL_CHARACTERS_INVALID_OPTIONS+"])");

    return (invalid.test(password) || valid.test(password));
}

let checkNumbers = (password) => {

    return /[0-9]/.test(password);
}

let checkEmail = (email) => {
    const regex = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([a-zA-Z]{2,})$/;
    return regex.test(email);
}

module.exports = {
    password_policy_check,
    new_user_valid_fields,
    valid_email_check
}