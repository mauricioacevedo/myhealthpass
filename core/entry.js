/************************************************************************
 * ****************** MEDULLAN MYHEALTHPASS AUTH ************************ 
 * **********************************************************************
 * PROXY IMPLEMENTATION. Allow the software control every access.
 * 
 * */

const main = require("./main");
const db_actions = require("./db_actions");
require("../config/config");
/**
 * execute_action
 * All transactions pass through this method, it let the system analyze every request
 * 
 */
let execute_action = (action, param, request_signature) => {

    if(request_signature==''||request_signature=={}||request_signature==null){
        //if no signature given, we asume the detaulf value
        request_signature={user_agent:'',ip_address:'',browser_cookies:''};
    }else{
        //if the request signature does not have the necesary fields give error
        if(!check_request_signature(request_signature)){
            return new Promise((resolve,reject)=> reject(err));
        }
    }
    
        //all the transactions must pass for the security control
        return securityCheck(action,param,request_signature)
        .then(resp=>{//everything seems ok, let it pass
            return main.execute(action,param,request_signature);
        }).catch(err=>{
            return Promise.reject(err);
        });
    
    
}

let securityCheck = (action, param, request_signature)=>{
    
    if(process.env.SECURITY_MODE=='ENFORCE'){

        return system_lockout_check(request_signature)
        .then(msg=>{

            if(action=='LOGIN'){
                return control_login(param,request_signature);
            }else{
                return Promise.resolve(msg);
            }
        }).catch(err=>{
            return Promise.reject(err);
        });

    }else if(process.env.SECURITY_MODE=='DISABLED'){
        return Promise.resolve("OK");
    }else{
        return Promise.reject("[ERROR] OPTION ("+process.env.SECURITY_MODE+") is not a valid option.");
    }
}

let system_lockout_check= (request_signature)=>{
    //1. first check if the signature have issues

    return db_actions.checkLockouts(request_signature)
    .then(reg=>{
        //everything seems ok
        if(reg==null||reg.length==0){
            return Promise.resolve('OK');
        }else{
            //transactions are locked for request_signature
            var myJSON = JSON.stringify(request_signature);
            return Promise.reject("[WARNING] SYSTEM LOCKOUT ("+process.env.LOCKOUT_DURATION+"m). Request Signature: "+myJSON);
        }
    })
    .then(msg=>{//if not lockout lets find out if we are under attack...

        return db_actions.findAttacks(request_signature)
        .then(regs=>{
            if(regs!=null){
                if(regs.length>process.env.LOCKOUT_TRESSHOLD){//we must create a system lockout for the request signature
                    
                    console.log("[DANGER] WE ARE UNDER ATTACK!!!!!!!");
                    return db_actions.createLockout(request_signature)
                    .then(msg=>{
                        return Promise.reject(msg);
                    })
                    .catch(err=>{
                        return Promise.reject(err);
                    });
                }   
            }
        }).catch(err=>{
            return Promise.reject(err);
            //console.log(err);
        })
    }).catch(err=>{
        return Promise.reject(err);
    });
}

let control_login = (user, request_signature)=>{
    //1. check the log table to see if user is ok to login or blocked or it needs to be blocked..

    return new Promise( (resolve,reject)=>{
        //1. check if user is ACTIVE OR BLOCKED...

        return db_actions.findUser(user)
        .then(async userDB=>{

            if(userDB==null){//maybe an attack
                const error = "[ERROR]: User dont exist.";
                await db_actions.logEvent(user.username,'LOGIN',request_signature,'FAILURE',error);
                return reject( error );
            }

            if(userDB.status=='BLOCKED'){
                const error = "[ERROR] User "+user.username + " is blocked. Please contact the system administrator.";
                db_actions.logEvent(user.username,'LOGIN',request_signature,'FAILURE',error).then(msg=>{
                    return reject(error);
                });
                
            }
            return resolve('OK');
        }).then(msg=>{
                
                return db_actions.getUserLastLogins(user, process.env.FAIL_LOGIN_TRESSHOLD)
                .then(logs =>{            
                    let userSuccessfulStatus='';
                    if(logs.length==0){
                        userSuccessfulStatus='SUCCESS';
                    }

                    for (var logUser of logs){
                        if(logUser.tx_final_status =='SUCCESS'){
                            userSuccessfulStatus='SUCCESS';
                            break;
                        }
                    }
                    
                    if(userSuccessfulStatus=='SUCCESS'){
                        return resolve('OK');
                    }
                    
                    //2. if we get to this stage the 3 last logs of this user where failure
                    //   we proceed to lock the account and return reject for the promise
                    const userBlock = {username: user.username};
                    return db_actions.blockUser(userBlock,'User blocked for unsuccessful consecutive logins(3)',request_signature)
                    .then(resp=>{
                        return reject('[ERROR] User blocked for unsuccessful consecutive logins(3). Please contact the system administrator.');
                    }).catch(err=>{
                        return reject(err);
                    });
            
            });
        })
        .catch(err=>{
            return reject(err);
        });

        
    });
    
}

let check_request_signature = (request_signature)=>{
    
    //if no signature given, we asume the detaulf value
    request_signature={user_agent:'',ip_address:'',browser_cookies:''};

    let fail=false;
    if(!request_signature.hasOwnProperty('user_agent')){fail=true;}
    if(!request_signature.hasOwnProperty('ip_address')){fail=true;}
    if(!request_signature.hasOwnProperty('browser_cookies')){fail=true;}

    if(fail){
        return false;
    }
    
    return true;
}

module.exports = {
    execute_action
}