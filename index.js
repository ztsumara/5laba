const http = require('http');
const {parse} = require('querystring')
let user = {     
    user_agent: 0,  
};
function getClientIP(req){
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}
let server = http.createServer((req,res)=>{
    console.log(getClientIP(req));
    if (req.method == 'GET'){
        console.log(req.method);
        if (req.url == '/'){
            res.writeHead(200, {'Content-Type': 'text/plane; charset = utf-8'})
            res.end(`Hello, its a root path\n`)
        }
        else if (req.url =='/starts' ){
            user.user_agent++;
            res.writeHead(200, {'Content-Type': 'text/html; charset = utf-8'})
            res.end(`<p>User agent <span>${user.user_agent}</span></p>`)
        }
        else{
            res.writeHead(400, {'Content-Type': 'text/plane; charset = utf-8'})
            res.end('400 Bad Request.\n')
        }
    }
    if (req.method == 'POST'){
        res.writeHead(200, {'Content-Type': 'application/json'})
        console.log(req.method);
        
        if (req.url == '/comments'){
            let body = '';
            req.on('data', chunk =>{
                
                body+=chunk.toString();
            });
            req.on('end',()=>{
                
                let obj = parse(body);
                console.log(body);
                
                res.end('ok')
            })
            
            
        }
        else{
            res.writeHead(400, {'Content-Type': 'text/html; charset = utf-8'})
            res.end('400 Bad Request.\n')
        }
    }
})
const PORT = 5002;
const HOST = '127.0.0.1';

server.listen(PORT, HOST, ()=>{
    console.log(`server is starting : http://${HOST}:${PORT}`);
    
    console.log();
    
})
