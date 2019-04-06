/************************************************************************
 * ****************** MEDULLAN MYHEALTHPASS AUTH ************************ 
 * **********************************************************************
 * 
 * Entry point for authentication and authorization middleware.
 * The idea is to have single entry point for every action in the library (as a proxy).
 * The proxy approach allow me to control all the request and control and/or
 * prevent brute force attacks.
 * 
 */

const entry = require("./core/entry");

 /*
  * REGISTER:
  * Receives user object to be registered on database 
  * also receives a request_signature: 
  *     {   
  *         user_agent: String,
            ip_address: String,
            browser_cookies: String
        }
  * 1. Run field validation
  * 2. Run password validation
  * 3. If everything seems ok insert on db
  * 4. Returns a promise
  */
let register = (user,request_signature) => {

    return entry.execute_action('REGISTER',user,request_signature);
}

/**
 * LOGIN:
 * Receives as parameter an user object with username and password fields
 * returns a promise.
 */
let login = (user,request_signature) => {
    return entry.execute_action('LOGIN',user,request_signature);
}
/**
 * REMOVE:
 * delete an user from db, receives the username
 * returns a promise.
 */
let removeUser = (user,request_signature) => {
    return entry.execute_action('REMOVE',user,request_signature);
}

/**
 * CHECKOUT TOKEN
 * check if the actual token is still valid
 * returns a promise
 */
let checkoutToken = (token,request_signature) => {
    return entry.execute_action('CHECKOUT_TOKEN',token,request_signature);
}

/**
 * BLOCK USER
 * Block the requested user in db. After this user cant login again.
 */

let blockUser = (user,request_signature)=>{
    return entry.execute_action('BLOCK_USER',user,request_signature);
}

/**
 * UNLOCK USER
 * Removes the BLOCK status in db.
 */

let unlockUser = (user,request_signature)=>{
    return entry.execute_action('UNLOCK_USER',user,request_signature);
}


module.exports = {
    register,
    login,
    removeUser,
    checkoutToken,
    blockUser,
    unlockUser
}



