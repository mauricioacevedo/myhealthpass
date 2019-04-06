const express = require("express");
const myhealthpass = require("../../app")
const app = express();

app.post('/user', (req,res)=>{
    let body= req.body;

    const user_agent= req.get('User-Agent');
    const ip_address= req.connection.remoteAddress;
    const cookies=req.cookies||'no-cookies';

    let request_signature={user_agent,ip_address,cookies};

    let user = {
        name: body.name,
        username: body.username,
        password: body.password,
        role: body.role
    }

    console.log(request_signature);
    console.log(user);
    myhealthpass.register(user,request_signature)
    .then(msg=>{
        res.json({status: 'OK'});
    })
    .catch(err=>{
        console.log(err);
        res.status(400).json({
            status: err,
            error:err
        });
    });

});

app.get('/login', (req,res)=>{
    let body= req.body;
    
    const user_agent= req.get('User-Agent');
    const ip_address= req.connection.remoteAddress;
    const cookies=req.cookies||'no-cookies';

    let request_signature={user_agent,ip_address,cookies};

    let user = {
        username: req.query.username,
        password: req.query.password
    }

    myhealthpass.login(user,request_signature)
    .then(msg=>{
        res.json(
            {
            status: 'OK',
            token: msg
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(400).json({
            status: 'Failure',
            error:err
        });
    });

})

app.get('/checkout_token', (req,res)=>{
    let body= req.body;
    
    const user_agent= req.get('User-Agent');
    const ip_address= req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress;
    const cookies=req.cookies||'no-cookies';

    let request_signature={user_agent,ip_address,cookies};

    let token = req.query.token;

    myhealthpass.checkoutToken(token,request_signature)
    .then(msg=>{
        res.json(
            {
            status: 'OK',
            token: msg
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(400).json({
            status: 'Failure',
            error:err
        });
    });

})

module.exports = app;