const assert = require("chai").assert;
const app = require("../app");
const db_actions = require("../core/db_actions");
require("../config/config");


const request_signature_global={
    user_agent:'Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405'
    ,ip_address:'192.168.1.25'
    ,browser_cookies:'lu=Rg3vHJZnehYLjVg7qi3bZjzg; Expires=Tue, 15 Jan 2013 21:47:38 GMT; Path=/; Domain=.example.com; HttpOnly'
};


describe('My Health pass Tests', function (){
    this.timeout(5000);

    
    describe('Reset Collections', function(){
        it('Delete Collections', function(){

            db_actions.resetCollections()
            .then(msg=>{
                setTimeout(() => {
                    console.log("[INFO]Sleep for 1 sec.");
                }, 1000);
                assert.equal(msg,'OK')
            })
            .catch(err=>{ 
                console.log(err);
                assert.fail(err)
            });

        })
    });
    
    describe('Register user tests', function() {
        it('Successfully register a new user.', async ()=>{
                  
            let user = {
                name: "Mauricio Acevedo",
                username: "mauricio.acevedo@gmail.com",
                password: "Starcraft1*",
                role: "ADMIN"
            }
            try{
                let r= await app.removeUser(user,request_signature_global);
                //console.log(r);
                let rr=await app.register(user,request_signature_global);
                //console.log(rr);
                assert.include(rr,'OK');
            }catch(error){
                //console.log(error);
                assert.fail(error);
            }
            
    
        });
        
        it('Errors registering a new user with a bad password.', async ()=>{
            let user = {
                name: "Mauricio Acevedo",
                username: "mauricio.acevedo@gmail.com",
                password: "",
                role: "ADMIN"
            }

            try{
                let r= await app.removeUser(user,request_signature_global);
                //console.log(r);
                let rr=await app.register(user,request_signature_global);
                //console.log(rr);
                
            }catch(err){
                assert.include(err,'ERROR');
            }
        
        });
        
        it('Errors registering a new user without the necesary fields.', async ()=>{
            let user = {
                name: "Mauricio Acevedo",
                //username: "mauricio.acevedo@gmail.com",
                password: "",
                //role: "ADMIN"
            }
    
            try {
                let r =await app.register(user,request_signature_global);    
            } catch (error) {
                //console.log(error);
                assert.include(error,'ERROR');
            }
        
        });

        
        it('Errors registering a new user with a bad formed email.', async ()=>{
            let user = {
                name: "Mauricio Acevedo",
                username: "mauricio.acevedo_mail.com",
                password: "Starcraft1*",
                role: "ADMIN"
            }
    
            try {
                let r = await app.register(user,request_signature_global);    
            } catch (error) {
                //console.log(error);
                assert.include(error,'ERROR');
            }
        });

    });

    describe('Login user tests', function (){
        it('Successful login to myHealthpass', async () => {
            let user = {
                name: "Mauricio Acevedo",
                username: "mauricio.acevedo@gmail.com",
                password: "Starcraft1*",
                role: "ADMIN"
            }

            try {
                let r= await app.removeUser(user,request_signature_global);
                //console.log("[INLOGIN]"+r);
                let re = await app.register(user,request_signature_global); 
                //console.log("[INLOGIN]"+re);
                let l = await app.login(user,request_signature_global); 
                //console.log("[INLOGIN]"+l);
                assert(l);
            } catch (error) {
                //console.log("[ERROR LOGIN]"+error);
                assert.fail(error);
            }
        });

        it('Validation of an old Json web Token', async () => {
            let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVjYTYyMGRhNGQ5YjFkMjliMDY2YzAxMyIsIm5hbWUiOiJNYXVyaWNpbyBBY2V2ZWRvIiwidXNlcm5hbWUiOiJtYXVyaWNpby5hY2V2ZWRvQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsInN0YXR1cyI6IkFDVElWRSIsImNyZWF0ZWRBdCI6IjIwMTktMDQtMDRUMTU6MjA6NTguNjAyWiIsInVwZGF0ZWRBdCI6IjIwMTktMDQtMDRUMTU6MjA6NTguNjAyWiIsIl9fdiI6MH0sImlhdCI6MTU1NDM5MTI1OCwiZXhwIjoxNTU0MzkxODU4fQ.CILjOvXalSQjtGv2yts9YQJ95dRW6m7VkBiNoKkfWiU";
            //let token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVjYTc5YzU4NjdjMjUxNjE3YzUyNGMyNyIsIm5hbWUiOiJNYXVyaWNpbyBBY2V2ZWRvIiwidXNlcm5hbWUiOiJtYXVyaWNpby5hY2V2ZWRvQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsInN0YXR1cyI6IkFDVElWRSIsImNyZWF0ZWRBdCI6IjIwMTktMDQtMDVUMTg6MjA6MDguNTI2WiIsInVwZGF0ZWRBdCI6IjIwMTktMDQtMDVUMTg6MjA6MDguNTI2WiIsIl9fdiI6MH0sImlhdCI6MTU1NDQ4ODQwOSwiZXhwIjoxNTU0NDg5MDA5fQ.NfLIFjSXfdIEaa8iBRof9ZC9bf5RUtwVWmEjpvWNgNg";
            try {
                let r= await app.checkoutToken(token,request_signature_global);
                console.log(r);
                assert.fail("[ERROR]JSON WEB TOKEN ALIVE!!!!");
            } catch (error) {
                //console.log(error);
                assert.include(error, 'ERROR');
            }
        });

        it('Failed login to myHeathpass with wrong password.', async () => {
            let user = {
                username: "mauricio.acevedo@gmail.com",
                password: "Warcraft1*"
            }

            try { 
                let l = await app.login(user,request_signature_global); 
                //console.log(l);
                assert.fail("[ERROR]Let a user login with a wrong password.");
            } catch (error) {
                //console.log(error);
                assert.include(error,'ERROR');
            }

        });

    });

    describe('Block User and system', function (){

        it('Block an account with 3 failed login attemps.', async () => {
            let userToBlock = {
                name: "Bad User",
                username: "bad.user@gmail.com",
                password: "1Dragonball*",
                role: "DEFAULT_ACCESS"
            }

            try {
                let r= await app.removeUser(userToBlock,request_signature_global);
                let re = await app.register(userToBlock,request_signature_global); 
            } catch (error) {
                //console.log(error);
                assert.fail(error);
            }
            userToBlock.password="something";
            try {
                let l1 = await app.login(userToBlock,request_signature_global).catch(err=>{return err}); 
                let l2 = await app.login(userToBlock,request_signature_global).catch(err=>{return err}); 
                let l3 = await app.login(userToBlock,request_signature_global).catch(err=>{return err}); 
                let l4 = await app.login(userToBlock,request_signature_global).catch(err=>{return err}); 
                //console.log("[THING]"+l4);
                assert.include(l4,'blocked');
            } catch (error) {
                //console.log(error);
                assert.fail(error);
            }
            
        });
        
        it('Block a request signature having '+process.env.LOCKOUT_TRESSHOLD+' failed logins no matter the username.', async ()=> {

            let resp="";
            for (let i = 0; i < process.env.LOCKOUT_TRESSHOLD + 1; i++) {
                let forceUser = {
                    name: "Bad User"+i,
                    username: "bad.user"+i+"@gmail.com",
                    password: "1Dragonball*",
                    role: "DEFAULT_ACCESS"
                }
                try{
                    resp=await app.login(forceUser,request_signature_global);
                    //console.log("[WHAT]"+what);
                }catch(err){
                    //console.log("[ERROR]"+err);
                    resp=err;
                    if(err.indexOf("SYSTEM LOCKOUT")!=-1){
                        break;
                    }
                }
            }

            if(resp.indexOf("SYSTEM LOCKOUT")!=-1){
                //console.log(resp);
                assert.include(resp,'SYSTEM LOCKOUT');
            }else{
                assert.fail("[ERROR] SOMETHING HAPPENED.. "+resp);
            }

        });
    });

});

