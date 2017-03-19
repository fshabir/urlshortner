const Joi = require('joi');
const boom = require('boom');

exports.register = function(server, options, next){
	var alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
    var base = alphabet.length;

	server.route({
		method: 'POST',
		path: '/',
		handler: function(request, reply){
			var receivedURL = request.payload.url;
			Joi.validate({url: receivedURL}, {url: Joi.string().uri()}, function(err, value){
				if(err){
					reply(boom.badRequest("Entered URL is invalid"));
				}else{
					var multi = request.server.redisClient.multi();
            		multi.incr("urlCounter");
           			multi.exec(function(err,replies){
                		if(replies && replies.length > 0){
                   	 		var counter = replies[0];
                   	 		var encodedURL = encode(counter);
                   	 		request.server.redisClient.setex(counter, 60*60, request.payload.url);//Short urls will be saved for 60 min
                   	 		encodedURL = 'http:/localhost:3000/' + encodedURL;
							console.log(encodedURL);
                	    	reply(encodedURL);
            	    	}else{
        	            	reply(boom.serverUnavailable("Error occured while generating a short url for you. Please try again later"));
    	            	}
	            	});
				}
			});
		}
	});

	server.route({
        method: 'GET',
        path: '/{shortURL}',
        handler: function(request, reply){
			var receivedURL = server.info.uri + '/' + request.params.shortURL;
			Joi.validate({url: receivedURL}, {url: Joi.string().uri()}, function(err,value){
				if(err){
                    reply(boom.badRequest("Entered URL is invalid"));
                }else{
					if(request.params.shortURL){
                		var decodedCounter = decode(request.params.shortURL);
                		request.server.redisClient.get(decodedCounter, function(err, response){
                    		reply.redirect(response);
                		});
            		}else{
                		reply(boom.serverUnavailable("Error occured while generating a short url for you"));
            		}
				}
			});
        }
    });

	function encode(num){
		var encoded = ''; 
        while (num){
        	var remainder = num % base;
            num = Math.floor(num / base);
            encoded = alphabet[remainder].toString() + encoded;
        }
        return encoded;
	}

	function decode(str){
 	 	var decoded = 0;
  		while (str){
    		var index = alphabet.indexOf(str[0]);
    		var power = str.length - 1;
    		decoded += index * (Math.pow(base, power));
    		str = str.substring(1);
  		}
  		return decoded;
	}
	next();
};

exports.register.attributes = {
	name: 'shortner',
	version: '1.0.0'
};
