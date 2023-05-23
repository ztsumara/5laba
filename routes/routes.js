
const express = require('express');
const {forprint, forPut} = require('../controllers/Controll')

const route = express.Router();
const morgan = require('morgan')
const bodyParser = require('body-parser');

const helmet = require('helmet');

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

let user = {     
    user_agent: 0,  
};

route.get('/home', (req,res)=>{
    console.log(req.method);
   
    res.send('Hello, its a home page\n');
    
})
//---------------------------------------------------------------------
route.get('/starts', (req,res)=>{
    console.log(req.method);
    
    user.user_agent++;
    res.send(`<p>User agent <span>${user.user_agent}</span></p>`)
})
//---------------------------------------------------------------------


route.post('/check',check, (req,res)=>{
    console.log(req.method);
    
    res.send(`ok`)
})


//---------------------------------------------------------------------
module.exports = route;