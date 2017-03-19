var Hapi = require('hapi');
var Path = require('path');
var redis = require('redis');
var server = new Hapi.Server(); 

server.connection({
    host: '0.0.0.0',
    port: 3000
});

server.redisClient = redis.createClient();

server.register([require('vision'), require('./shortner')], function(err){

    server.route({
        method: 'GET',
        path: '/',
        handler: function(request, response){
            response.view('index');
        }
    });

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'templates'
    });
});

server.start(function(){
    console.log('Server running at ' + server.info.uri);
});
