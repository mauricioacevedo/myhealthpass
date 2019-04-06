/**
 * MACEVEDG
 * 
 * entry point for authentication and authorization middleware.
 * 
 */

const policies = require("./app_policies");
const db_actions = require("./db_actions");
const jwt = require('jsonwebtoken');

 /*
  * REGISTER:
  * Receives user object to be registered on database 
  * 1. Run field validation
  * 2. Run password validation
  * 3. If everything seems ok insert on db
  * 4. Returns a promise
  */
let register = (user,request_signature) => {

    const validUser = policies.new_user_valid_fields(user);

    if(validUser.indexOf("ERROR")!=-1){
        return new Promise((resolve, reject) => {
            reject(validUser);
        });
    }

    if(user.hasOwnProperty('password')){
        let result=policies.password_policy_check(user.password);
        if(result.indexOf("ERROR")!=-1){
            return new Promise((resolve, reject) => {
                reject(result);
            });   
        }
    }

    const validEmail=policies.valid_email_check(user.username);

    if(!validEmail){
        return new Promise((resolve, reject) => {
            reject("[ERROR]Invalid email.");
        });   
    }
    
    return db_actions.saveUser(user,request_signature);
}

/**
 * LOGIN:
 * Receives as parameter an user object with username and password fields
 * returns a promise.
 */
let login = (user,request_signature) => {
    return db_actions.logInUser(user,request_signature);
}
/**
 * REMOVE:
 * delete an user from db, receives the username
 * returns a promise.
 */
let removeUser = (user,request_signature) => {
    return db_actions.removeUser(user,request_signature);
}

/**
 * CHECKOUT TOKEN
 * check if the actual token is still valid
 * returns a promise
 */
let checkoutToken = (token,request_signature) => {

    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SEED_AUTH, (err, decoded)=>{
            if( err ){
                reject('[ERROR] The actual token is not valid anymore!!!');
            }
            resolve(decoded);
        });
    });

}

/**
 * BLOCK USER
 */
let blockUser = (user,request_signature)=>{
    return db_actions.blockUser(user,request_signature);
}

/**
 * UNLOCK USER
 */

let unlockUser = (user,request_signature) =>{

    return db_actions.unlockUser(user,request_signature);
}

let execute = (action, param, request_signature) => {
    switch (action) {
        case "REGISTER":
            return register(param,request_signature);
            break;
        case "LOGIN":
            return login(param,request_signature);
            break;
        case "REMOVE":
            return removeUser(param);
            break;
        case "CHECKOUT_TOKEN":
            return checkoutToken(param);
            break;
        case "BLOCK_USER":
            return blockUser(param,request_signature);
            break;
        case "UNLOCK_USER":
            return unlockUser(param,request_signature);
            break;

        default:
            return new Promise((resolve, reject)=>{
                console.log("Implement usage()");
                return reject("Implement usage()");
            });
            break;
    }
}


module.exports = {
    register,
    login,
    removeUser,
    checkoutToken,
    blockUser,
    unlockUser,
    execute
}
