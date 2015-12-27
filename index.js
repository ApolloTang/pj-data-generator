"use strict";
const fs = require('fs');
const _ = require('lodash');
const Promise = require('bluebird');

Promise.promisifyAll(fs);

const cf = require('./conf');
const generateData = require('./dataGenerator.js');
const summarizeDataInFile = require('./summary.js');

const dataFile = cf.dataFile;

fs.openAsync(dataFile, 'r+')
    .then(function(){
        console.log('reading ' + dataFile + '... ');
        fs.readFileAsync(dataFile)
            .then(generateData)
            .then(saveData)
            //@TODO close file
            .done(function(data) { summarizeDataInFile(dataFile) });
    }, function(){
        console.log('File not exist, start new one');
        //@TODO make directory "/data/"
        generateData(null)
            .then(saveData)
            //@TODO close file
            .done(function(data) { summarizeDataInFile(dataFile) });
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

// function summarizeDataInFile(fileName) {
//     fs.readFileAsync(dataFile)
//         .then( function(b){ generateSummary( JSON.parse(b.toString()) )
//         .then( console.log )
//     });
// }
//
// function generateSummary(data) {
//     return new Promise(function(ff, rj){
//         let summary = '';
//         summary += 'Data length: ' + data.length + '\n';
//         _(cf.statsSpec).each(function(i){
//             const dimension = i.dimension;
//             const splitGroup = i.splitGroup
//             summary += 'dimension: ' + i.dimension + '\n';
//             _(splitGroup).each(function(group){
//                 let filter = {};
//                 filter[dimension] = group;
//                 const filtered = _( data ).filter(filter).value()
//                 const length = filtered.length
//                 summary += group + ': ' + length + '\n';
//             }).value();
//         }).value();
//         ff(summary);
//     });
// }

