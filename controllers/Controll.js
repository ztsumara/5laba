const express = require("express");
const cont = express.Router();
const {  printAll, printById, Insert, getcomment, getcommentid, postcomment, postApi, checkApi, insertMod, 
    updMod, delMod, findM, findOneM } = require('../services/mongo');

const jsonParser = express.json();

cont.post('/comments',jsonParser, postcomment);

cont.get('/comments', getcomment);

cont.get('/comments/:id', getcommentid);

cont.post('/apikey', jsonParser, postApi);

cont.get('/models', findM);

cont.post('/models', checkApi, jsonParser, insertMod);

cont.get('/models/:id', findOneM);

cont.put('/models/:id', checkApi, jsonParser, updMod);

cont.delete('/models/:id', checkApi, delMod);

module.exports = cont;