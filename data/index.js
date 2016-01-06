"use strict";
const fs = require('fs');
const _ = require('lodash');
const Promise = require('bluebird');

Promise.promisifyAll(fs);

const cf = require('./conf');
const generateData = require('./dataGenerator.js');
const summary = require('./summary.js');

const dataFile = cf.dataFile;

fs.openAsync(dataFile, 'r+')
    .then(function(fd){
        console.log('reading ' + dataFile + '... ');
        fs.readFileAsync(dataFile)
            .then(generateData)
            .then(saveData)
            .then(function(data){ return closeFile(fd); })
            .done(function() { summary(dataFile) });
    }, function(fd){
        console.log('File not exist, start new one');
        //@TODO make directory "/data/"
        generateData(null)
            .then(saveData)
            .done(function(data) { summary(dataFile) });
    });


function saveData(data) {
    return new Promise(function(ff, rj){
        fs.writeFileAsync(dataFile, data)
            .then( function(){
                console.log('Data saved')
                ff(data);
            }, function(){
                console.log('Fail to save data')
            });
    });
}


function closeFile(fd) {
    return new Promise(function(ff, rf){
        fs.closeAsync(fd).then( function(){
            console.log('file closed');
            ff();
        });
    })
}
