const express = require('express');
const routes = require(__dirname+'/routes/routes');
const contAPI = require("./controllers/Controll")
const app = express();

const PORT = 5002;
const HOST = '127.0.0.1';
app.use(express.static('public'));
app.use(routes);
app.use('/CRUD',contAPI);
app.listen(PORT,()=>{
    console.log(`server is starting : http://${HOST}:${PORT}`);
});


app.use((err, req, res)=> {
    console.log("Server error");
    
    res.status(500).send(`Something Wrong. Status code:${res.statusCode}`)
    
})




