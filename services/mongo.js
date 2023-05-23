const db = require("../configs/dbConn")
const ObjectId = require('mongodb').ObjectId;
const crypto = require('crypto');



async function newDate(body){
    const collection = await db.collection('models');
    const currentDate = new Date();
    body.created_time = currentDate;
    body.updated_time = currentDate;
    await collection.insertOne(body);
}

async function printAll() {
    const collection = await db.collection('users');
    let mas =await collection.find({}).toArray();
    return mas;
}
async function printById(key) {
    
    const collection = await db.collection('users');
    let mas;
    key=new ObjectId(key);
    console.log(key);
    mas =await collection.findOne({_id: key});
    console.log(mas);
    return mas;
    
    
    // взаимодействие с базой данных

}
async function Insert(body) {
    const collection = await db.collection('users');
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const formattedDate = `${year}-${month}-${day}`;
    
    let mas;
    body.date = formattedDate;
   
    await collection.insertOne(body);
    
    return mas;
    
    
    // взаимодействие с базой данных

}

async function postcomment(req,res){
    if (req.headers['content-type'] === 'application/json'){
        body = req.body;
        if (!body.name || !body.text || body == "") {
            res.status(404).send('Error');
        }
        else{
            await Insert(body);
            const find = await printAll();
            res.send(find);
        }
    }
    else{
        res.status(404).send('Error');
    }
}
async function getcomment(req,res){
    const find = await printAll();
    res.send(find);
}
async function getcommentid(req, res){
    let id = req.params.id;

    const result = await printById(id);
        if(result === null){
            res.status(404);
            res.send('Error!');
        }
        else{
            res.send(result);
        }
}
async function checkApi(req, res, next){
    try{
        const collection = await db.collection('ApiKey');
        const apiKey = req.query.apiKey;
    
        console.log(req.query.apiKey);
        
        const findApi = await collection.findOne({ _id: apiKey});
        if (findApi){
            next();
        }
        else {        
            const error = new Error("Bad API key");
            error.statusCode = 401;
            throw error;
        }
    }
    catch (err) {
        next(err);
    }
}
async function insertMod(req, res, next){
    try{
        const collection = await db.collection('models');
        if (req.headers['content-type'] === 'application/json'){
            body = req.body;
            if (!body.name || !body.modelname || !body.type || !body.object || !body.overview || !body.comment || body === "" || Object.keys(body).length !== 6) {
                const error = new Error('Invalid request body');
                error.statusCode = 400;
                throw error;
            }
            else{
                await newDate(body);
                const find =  await collection.find().toArray();
                res.send(find);
            }
        }
        else{
            const error = new Error('Invalid content-type');
            error.statusCode = 400;
            throw error;
        }
    }
    catch (err) {
        next(err);
    }
}

async function updMod(req, res, next){
    try {
        const collection = await db.collection('models');
        if (req.headers['content-type'] === 'application/json'){
            body = req.body;
            if (!body.name || !body.modelname || !body.type || !body.object || !body.overview || !body.comment || body === "" || Object.keys(body).length !== 6) {
                const error = new Error('Invalid request body');
                error.statusCode = 400;
                throw error;
            }
            else{
                const id = req.params.id;
                
                const filter = { _id: new ObjectId(id) };
                const updateDoc = {
                    $set: {
                        name: body.name,
                        modelname: body.modelname,
                        type: body.type,
                        object: body.object,
                        overview: body.overview,
                        comment: body.comment,
                        updated_time: new Date()
                    }
                };
                const result = await collection.updateOne(filter, updateDoc);
                if (result.modifiedCount === 0) {
                    const error = new Error(`Object not found`);
                    error.statusCode = 404;
                    throw error;
                } else {
                    const findall =  await collection.find().toArray();
                    res.send(findall);
                }
            }
        }
        else{
            const error = new Error('Invalid content type');
            error.statusCode = 400;
            throw error;    
        }
    }
    catch (err) {
        next(err);
    }
}
async function delMod(req, res, next){
    try{
        const collection = await db.collection('models');
        const id = req.params.id;
        
        const result = await collection.findOne({ _id:new ObjectId(id)} );
       
        if (result==null){
            const error = new Error(`Object  not found`);
            error.status = 404;
            throw error;
        }
        else{
            await collection.deleteOne({ _id:new ObjectId(id)});
            res.send(`Object deleted`);
        }
    }
    catch (err) {
        next(err);
    }
    
}
async function newApi(body){
    try{
        const collection = await db.collection('ApiKey');
        const newapikey = crypto.randomBytes(16).toString('hex');
        if (!body || Object.keys(body).length === 0) {
            const error = new Error('Empty request');
            error.status = 404;
            throw error;
        }
        else{
            
            body._id = newapikey;
            
            await collection.insertOne(body);
            const findApi = await collection.findOne({ _id: newapikey});
            return findApi;
        }
    }
    catch (err) {
        throw err;
    }
}
async function postApi(req, res, next){
    try{
        if (req.headers['content-type'] === 'application/json'){
            const body = req.body;
            if (!body.name || body.name === "" || Object.keys(body).length !== 1){ 
                const error = new Error('Invalid request body');
                error.statusCode = 400;
                throw error;
            }
            else{
                const findApi = await newApi(body);
                res.send(findApi);
            }
        }
        else{
            const error = new Error('Invalid content type');
            error.statusCode = 400;
            throw error; 
        }
    }
    catch (err) {
        next(err);
    }
}
async function findM(req, res, next){
    try{
        const collection = await db.collection('models');
        const findAll = await collection.find().toArray();
        if (findAll === 0){
            const error = new Error('No models found');
            error.status = 404;
            throw error;
        }
        else{
            res.send(findAll);
        }
    }
    catch (err) {
        next(err);
    }
}

async function findOneM(req, res, next){
    try{
        const collection = await db.collection('models');
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const foundObject = await collection.findOne(filter);
        if (!foundObject){
            const error = new Error('No models found');
            error.status = 404;
            throw error;
        }
        else{
            res.send(foundObject);   
        }
    }
    catch (err) {
        next(err);
    }
}
module.exports={
    printAll,
    printById,
    Insert,
    getcomment,
    getcommentid,
    postcomment,
    postApi,
    checkApi,
    insertMod,
    updMod,
    delMod,
    findM,
    findOneM
}