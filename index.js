/*
** Primary file for the API
*/

// dependencies
const http = require('http');
const url = require('url');


// server should responsd to all reqests with a string
const server = http.createServer((req, res)=>{
    
    // this callback function get activated whenever
    // a http request hit on the server.

    // get the url and parse it
    const parsedUrl = url.parse(req.url, true);

    // get the path of the url
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // send a response
    res.end('Hello World\n');

    // log the request path
    console.log(`Request received on path: ${trimmedPath}`);
    
});

// start the server, and have it listen on port 3000
server.listen(3000, ()=>{
    console.log('The server is listening on port 3000 now ...');
});