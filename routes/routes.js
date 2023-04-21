const express = require('express');

const {printAll,printById,Insert}=require('../services/mongo.js');
const route = express.Router();
const morgan = require('morgan')
const {parse} = require('querystring')
const helmet = require('helmet');
const { log } = require('console');

route.use(helmet());
route.use(morgan('combined'))
function check(req, res, next){
    const key = req.query.apiKey;
    if (key !== 'secret'){
        res.status(401).send('Что-то пошло не так.');
    }
    else {
        next();
    }
}
function checkbody(req, res, next){
    let body = '';
    req.on('data', chunk =>{
        
        body+=chunk.toString();
    });
    req.on('end',async()=>{
        
        let obj = parse(body);
        body = JSON.parse(body);
        await Insert(body);
        
    })
}
let user = {     
    user_agent: 0,  
};
function getClientIP(req){
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}
route.get('/home', (req,res)=>{
    console.log(req.method);
    console.log(getClientIP(req));
    res.send('Hello, its a home page\n');
    
})
//---------------------------------------------------------------------
route.get('/starts', (req,res)=>{
    console.log(req.method);
    console.log(getClientIP(req));
    user.user_agent++;
    res.send(`<p>User agent <span>${user.user_agent}</span></p>`)
})
//---------------------------------------------------------------------
route.get('/comments/:id?', async(req,res,next)=>{
    var key = req.params.id;
    
    
    if (typeof key !== 'undefined') {
        const result= await printById(key);
        if(result===null){
            res.status(404);
            next();
        }
        else{
            console.log("success");
            res.send(result);
        }
    }
    else{
        const result = await printAll();
        console.log("success");
        res.send(result);
    }
    
})
route.post('/comments', async(req,res)=>{
    console.log(req.method);
    console.log(getClientIP(req));
    let body = '';
    req.on('data', chunk =>{
        
        body+=chunk.toString();
    });
    req.on('end',async()=>{
        
        let obj = parse(body);
        body = JSON.parse(body);
        await Insert(body);
        const result =await printAll();
        res.send(result)
    })
    
    
})
route.post('/check',check, (req,res)=>{
    console.log(req.method);
    console.log(getClientIP(req));
    res.send(`ok`)
})

route.use((req, res, next)=> {
    console.log("Bad path");
    if(res.statusCode==404){
        res.send(`Something Wrong. Status code:${res.statusCode}`)
    }
    else{
        res.status(400).send(`Something Wrong. Status code:${res.statusCode}`)
    }
})
//---------------------------------------------------------------------
module.exports = route;