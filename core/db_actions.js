require("../config/config")

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err,resp) => {
    if(err) throw err;
    console.log('[INFO]MyHealthPass database ONLINE! '+mongoose.connection.host);
});

const User = require("./../models/users");
const UserAuthLogsSchema = require("./../models/user_auth_logs");
const SystemLockout = require("./../models/system_lockouts");


let logInUser = (usern, request_signature) => {

    return new Promise((resolve, reject) => {
        User.findOne({username: usern.username}, async (err,userDB) => {

            if(err){
                const error = "[ERROR]: Username or password is incorrect";
                await logEvent(usern.username,'LOGIN',request_signature,'FAILURE',error);
                return reject( error );
            }
            else{
                const error = "[ERROR]: Username or password is incorrect.";
                if(userDB==null||usern==null) {
                    logEvent(usern.username,'LOGIN',request_signature,'FAILURE',error).then(msg=>{
                        return reject(error);//weird...
                    });
                    return;
                } 

                if(userDB.status=='BLOCKED'){
                    return reject("[ERROR] User "+userDB.username + " is blocked. Please contact the system administrator.");
                }

                if(!bcrypt.compareSync( usern.password,userDB.password)){
                    logEvent(usern.username,'LOGIN',request_signature,'FAILURE',error).then(msg=>{
                        return reject(error);
                    });
                    
                    
                }else {
                    // successful login
                    if(userDB!= null)
                        userDB.password="";
                    let token = jwt.sign({
                        user: userDB
                    }, process.env.SEED_AUTH, {expiresIn: process.env.TOKEN_EXPIRES});
                    
                    logEvent(usern.username,'LOGIN',request_signature,'SUCCESS', 'TOKEN: '+token)
                    .then(msg=>{
                        return resolve(token);
                    }) 
                }
            }
        });
    });
}

let saveUser = (newUser,request_signature) => {

    let user = new User({
        name: newUser.name,
        username: newUser.username,
        password: bcrypt.hashSync(newUser.password,10),
        role: newUser.role,
        status: 'ACTIVE'
    });

    return new Promise((resolve, reject) => {

        user.save((err,userDB)=>{
            if(err){
                
                return logEvent(newUser.username,'REGISTER',request_signature,'FAILURE',"[ERROR]:" + err)
                .then(msg=>{
                    return reject("[ERROR]: \n" + err);
                });
                
            }else{
                return logEvent(newUser.username,'REGISTER',request_signature,'SUCCESS', 'OK')
                .then(msg=>{
                    
                    return resolve("OK");
                });
            }
        })
    });
}

let findUser = (usern)=>{

    return new Promise((resolve,reject)=>{
        User.findOne({username: usern.username}, (err,userDB) =>{
            if(err){
                return reject(err);
            }else{
                if(userDB!=null) userDB.password='';
                return resolve(userDB);
            }
        });
    });
}


let removeUser = (usern, request_signature) => {   

    return new Promise((resolve, reject) => {
        User.findOneAndDelete({username: usern.username}, {useFindAndModify: false},(err,userDB) => {

            if(err){
                const error= "[ERROR]: Username is incorrect";
                
                return logEvent(usern.username,'REMOVE',request_signature,'FAILURE', error)
                .then(msg=>{
                    return reject(error);
                });
            }
            else{
                
                return logEvent(usern.username,'REMOVE',request_signature,'SUCCESS', 'OK')
                .then(msg=>{
                    return resolve("OK");
                });
            }
        });
    });  
}


let logEvent = (usern, action, request_signature, tx_final_status, message) => {
    let log = new UserAuthLogsSchema({
        username: usern,
        action: action,
        request_signature: request_signature,
        tx_final_status: tx_final_status,
        message: message
    });

    return new Promise((resolve, reject) => {

        log.save((err,log)=>{
            if(err){
                return reject("[ERROR]: \n" + err);
            }else{
                return resolve("OK");
            }
        })
    });
}

let getUserLastLogins = (usern,tresshold)=>{
    
    return new Promise((resolve,reject)=>{
        
        UserAuthLogsSchema.find({username: usern.username, action: 'LOGIN'})
        .sort({updatedAt:-1})
        .limit(3)
        .exec((err, logsDB)=>{
            if(err){
                return reject(err);
            }
            return resolve(logsDB);
        });
        
    });
}

let blockUser = (user, request_signature) => {

    return new Promise((resolve,reject)=>{
        
        User.findOneAndUpdate(user, {$set:{status:'BLOCKED'}},{new: true}, (err, newUser)=>{
            if(err){
                return reject(err);
            }
            //console.log("[INFO] final user status :"+ newUser);
            logEvent(user.username,'BLOCK',request_signature,'SUCCESS','User blocked.').then(msg=>{
                return resolve('OK');
            });
            
        })
    });
}

let unlockUser = (usern, request_signature) => {

    return new Promise((resolve,reject)=>{
        
        User.findOneAndUpdate({username: usern.username}, {$set:{status:'ACTIVE'}},{new: true}, (err, newUser)=>{
            if(err){
                return reject(err);
            }
            //console.log("[INFO] final user status :"+ newUser);
            logEvent(usern.username,'LOGIN',request_signature,'SUCCESS','User was unlocked. Can login now!').then(msg=>{
                resolve('OK');
            });
            
        })
    });
}

let checkLockouts = (request_signature)=>{

    /*let dat= new Date();
    dat.setMinutes(dat.getMinutes() + 20);
    let lock = new SystemLockout({
        lockout: 'TEST LOCKOUT',
    request_signature: { user_agent: '', ip_address: '', browser_cookies: ''}
    , lockout_date_end: dat
    });

    lock.save();*/

    return new Promise((resolve,reject)=>{

        SystemLockout.findOne({"lockout_date_end":{$gt: new Date()}, 
            "request_signature.user_agent":request_signature.user_agent
            ,"request_signature.ip_address":request_signature.ip_address
            ,"request_signature.browser_cookies":request_signature.browser_cookies
        })
        .sort({updatedAt:-1})
        .then(regs=>{
            return resolve(regs);
        }).catch(err=>{
            return reject(err);
        });

    });
}

let findAttacks = (request_signature)=>{

    return new Promise((resolve,reject)=>{
        let dat= new Date();
        dat.setMinutes(dat.getMinutes() - process.env.LOCKOUT_TIME);
        UserAuthLogsSchema.find({"updatedAt":{$gt: dat}, 
            "request_signature.user_agent":request_signature.user_agent
            ,"request_signature.ip_address":request_signature.ip_address
            ,"request_signature.browser_cookies":request_signature.browser_cookies
            , "tx_final_status":"FAILURE"
            ,"action":"LOGIN"
        })
        .then(regs=>{
            return resolve(regs);
        }).catch(err=>{
            return reject(err);
        });

    });
}

let createLockout = (request_signature) => {
    let dat= new Date();
    dat.setMinutes(dat.getMinutes() + 20);
    let lock = new SystemLockout({
        lockout: 'LOCKOUT_LOGIN',
        request_signature: { 
            user_agent: request_signature.user_agent
            , ip_address: request_signature.ip_address
            , browser_cookies: request_signature.browser_cookies
        }
        , lockout_date_end: dat
    });

    return new Promise((resolve, reject)=>{

        lock.save((err,dbLockout)=>{
            if(err){
                return reject(err);
            }else{
                const rs=JSON.stringify(request_signature)
                return resolve("[WARNING]SYSTEM LOCKOUT("+process.env.LOCKOUT_DURATION+"m) for request_signature: "+rs);
            }
        });
    });
    
}

let resetCollections = async ()=>{
    try {
        await User.collection.drop();
        await UserAuthLogsSchema.collection.drop();
        await SystemLockout.collection.drop();    
        return Promise.resolve('OK');
    } catch (error) {
        return Promise.reject(error);
    }
    

}

module.exports = {
    logInUser,
    saveUser,
    removeUser,
    getUserLastLogins,
    blockUser,
    unlockUser,
    findUser,
    logEvent,
    checkLockouts,
    findAttacks,
    createLockout,
    resetCollections
}