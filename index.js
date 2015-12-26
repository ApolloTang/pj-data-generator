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
        })
}


function getSummary(data) {
    const summary = {
        "length" : data.length,
        "ge" : {
            D : _(_.assign({}, data)).filter({ge:'D'}).value(),
            F : _(_.assign({}, data)).filter({ge:'F'}).value(),
            M : _(_.assign({}, data)).filter({ge:'M'}).value()
        },
        "ct" : {
            T : _(_.assign({}, data)).filter({ct:'T'}).value(),
            M : _(_.assign({}, data)).filter({ct:'M'}).value(),
            V : _(_.assign({}, data)).filter({ct:'V'}).value(),
            D : _(_.assign({}, data)).filter({ct:'D'}).value()
        }
    };

    console.log('d: ' , summary.ge.D.length);
    console.log('f: ' , summary.ge.F.length);
    console.log('m: ' , summary.ge.M.length);
    console.log('- - - - - - - - - -');
    console.log('t: ' , summary.ct.T.length);
    console.log('m: ' , summary.ct.M.length);
    console.log('v: ' , summary.ct.V.length);
    console.log('d: ' , summary.ct.D.length);
    return summary;
}

