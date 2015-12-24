"use strict";
const fs = require('fs');
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
            .then(saveData);
    }, function(){
        console.log('file not exist');
        generateData(null)
            .then(saveData);
    });

function saveData(data) {
    // console.log('saving data: ', data);
    fs.writeFileAsync(dataFile, data);
}
