'use strict';

var Q       = require('q');
var http = require('http');
/**
 * getLabel - passes in the config object from the client.
 * This function MUST exist and MUST return a string.
 */
exports.getLabel = function(property, settings){

    // this is the object saved from your the /input portion of the slab.
    var searchTerm  = 'Leeds,uk';

    if(settings && settings.searchTerm){
        searchTerm  = settings.searchTerm;
    }

    if(property === 'temp'){
        return 'Temperature in ' + searchTerm;
    }

    return property + ' : bad property name';

};



/**
 * getData - passes in the config object from the client.
 * This function MUST exist and MUST return a promise.
 */
exports.getData = function(settings) {

    // this is the object saved from your the /input portion of the slab.
    var searchTerm  = 'Leeds,uk';
    var deferred = Q.defer();

    var data = {
        temp : 0
    };

    if(settings && settings.searchTerm){
        searchTerm  = settings.searchTerm;
    }

    var req = http.request({
        host:'api.openweathermap.org',
        port:80,
        path: '/data/2.5/weather?q='+searchTerm+'&units=metric',
        method: 'GET',
        headers: {
            'User-Agent': 'slabs.io',
            'Content-Type' : 'application/json'
        }
    }, function(res){

        var output = '';
        res.setEncoding('utf8');
        console.log(res.statusCode);

        res.on('data', function (chunk) {
            output += chunk;
        });

        req.on('error', function(e) {
            deferred.error('problem with request: ' + e.message);
        });

        res.on('end', function(){
            var data = JSON.parse(output);
            deferred.resolve({
                temp: data.main.temp
            });
        });


    });

    req.end();

    // Always return your promise here.
    return deferred.promise;

};
