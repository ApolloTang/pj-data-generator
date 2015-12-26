"use strict";
const fs = require('fs');
const _ = require('lodash');
const Promise = require('bluebird');

Promise.promisifyAll(fs);

const cf = require('./conf');
const generateData = require('./dataGenerator.js');

const dataFile = './data/data.json';

let stat = {
    dataFileExist : false,
};



fs.openAsync(dataFile, 'r+')
    .then(function(){
        console.log('reading ' + dataFile + '... ');
        fs.readFileAsync(dataFile)
            .then(generateData)
            .then(saveData)
            .then(function() {
                summarizeDataInFile(dataFile)
            });
    }, function(){
        console.log('file not exist');
        generateData(null)
            .then(saveData)
    });

function saveData(data) {
    return new Promise(function(ff, rj){
        fs.writeFileAsync(dataFile, data)
            .then( function(){
                // save success
                console.log('Data saved')
                ff();
            }, function(){
                console.log('Fail to save data')
            });
    });
}

function summarizeDataInFile(fileName) {
    fs.readFileAsync(dataFile)
        .then(function(data){

            const summary = getSummary(JSON.parse(data.toString()));
            // console.log('summary: ', summary);

        })
}


function getSummary(data) {
   // console.log('------- in summary data: ', data)
    const summary = {
        "length" : data.length,
        "ge" : {
            F : _(_.assign({}, data)).filter({ge:'F'}).value(),
            M: _(_.assign({}, data)).filter({ge:'M'}).value()
        }
    };
    console.log('f: ' , summary.ge.F.length);
    console.log('m: ' , summary.ge.M.length);

    return summary;
}

