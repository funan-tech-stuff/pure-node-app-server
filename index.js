/*
** Primary file for the API
*/

// dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;


// server should responsd to all reqests with a string
const server = http.createServer((req, res)=>{
    
    // this callback function get activated whenever
    // a http request hit on the server.

    // get the url and parse it
    const parsedUrl = url.parse(req.url, true);

    // get the path of the url
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // get the query string as an object
    const queryStringObject = parsedUrl.query;
    // get the http method (get, post, put)
    const method = req.method.toLowerCase();

    // get the headers as an object
    const headers = req.headers;

    // get the payload, if any.
    // payload comes into the http server as streams.
    // so it is important to handle the bites of data coming through and form it into the full payload.
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    // event listener for stream data coming into the http server
    req.on('data', (data)=>{
        
        // accumulate the data stream content
        buffer += decoder.write(data);
    })

    // event listener for the end of streaming.
    // this event will always be called, even if there are no payload pasted into the http server.
    req.on('end', ()=>{
        buffer += decoder.end();
        
        // choose the handler this request should go to.
        // if no matching handler, send to the not found handler.

        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // construct the data object to be sent to the handler
        const data = {
            "trimmedPath" : trimmedPath,
            "queryStringObject" : queryStringObject,
            "method" : method,
            "headers" : headers,
            "payload" : buffer
        };

        // route (or send) the request to the handler
        chosenHandler(data, (statusCode, payload)=>{
            // use the status code returned via the callback, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // use the payload returned via the callback, or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // convert the payload to a string
            const payloadString = JSON.stringify(payload);

            // return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // log the request path
            console.log(`Request received on path: ${trimmedPath}`);
            console.log(`Request received with this method : ${method}`);
            console.log(`Request received with these query string parameters : `, queryStringObject);
            console.log(`Request received with these headers : `, headers);
            console.log(`Request received with this payload : `, buffer);
            console.log('Returning this response : ', statusCode, payloadString);

        });

        // send a response
        res.end('Hello World\n');

        
    });

});

// start the server, and have it listen on port 3000
server.listen(3000, ()=>{
    console.log('The server is listening on port 3000 now ...');
});

// define the handlers
const handlers = {};

// sample handler
handlers.sample = (data, callback)=>{
    // callback a http status code, and a payload object
    

    callback(406, {'name': 'sample handler'});
};

// not found handler
handlers.notFound = (data, callback)=>{
    callback(404);
};

// define a request router
const router = {
    'sample' : handlers.sample
}