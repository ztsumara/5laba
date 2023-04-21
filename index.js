const express = require('express');
const routes = require(__dirname+'/routes/routes');

const app = express();

const PORT = 5002;
const HOST = '127.0.0.1';
app.use(express.static('public'));
app.use(routes);

app.listen(PORT,()=>{
    console.log(`server is starting : http://${HOST}:${PORT}`);
});




