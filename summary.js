'use strict';
const fs = require('fs');
const Promise = require('bluebird');
const _ = require('lodash');


const cf = require('./conf');
const dataFile = cf.dataFile;


let _distinctValueMap = {}; //{ ge: [M, F, D],  ...dimension: distinctValues.. .}

module.exports = function summarizeDataInFile(fileName) {
    fs.readFileAsync(dataFile)
        .then( parseToObject )
        .then( analysisData )
        .then( generateSummary )
        .then( console.log )
};

function parseToObject(buffer){
    return JSON.parse(buffer.toString());
}

function analysisData(data) {
    return new Promise(function(ff, rj) {
        console.log('Analysing data...');
        const summary = 'Data length: ' + data.length + '\n';

        // dimensions = ['dd', 'ct','ge','ag', 'os'];
        const dimensions = _(Object.keys(cf.SCHEMA)).filter(function(i){
            if ( i !== 'id' ) return true; // remove 'id'
            return false;
        }).value();

        // Build disctinct value map
        dimensions.forEach(function(dimension){
            _distinctValueMap[dimension] = _.uniq(_(data).reduce(function(acc, datum){
                if (datum[dimension]) {  // ingore empty string
                    acc.push(datum[dimension])
                };
                return acc;
            }, []));
        });

        console.log('Done analysing data: disctinct value map built');
        ff(data);
    });
}

function generateSummary(data) {
    return new Promise(function(ff, rj){
        console.log('Generating summary...');
        let summary = '';
        summary += 'Data length: ' + data.length + '\n';
        Object.keys(_distinctValueMap).forEach(function(dimension){
            let distinctValues = _distinctValueMap[dimension];
            summary += 'Dimension: ' + dimension + '\n';
            distinctValues.forEach(function(dv){
                const filtered = _( data ).filter(dimension, dv).value()
                const length = filtered.length
                summary += dv + ': ' + length + '\n';
            });
        });
        console.log('Summary generated');
        ff(summary);
    });
}

