'use strict';
const fs = require('fs');
const Promise = require('bluebird');
const _ = require('lodash');


const cf = require('./conf');
const dataFile = cf.dataFile;


module.exports = function summarizeDataInFile(fileName) {
    fs.readFileAsync(dataFile)
        .then( function(b){ generateSummary( JSON.parse(b.toString()) )
        .then( console.log )
    });
}

function generateSummary(data) {
    return new Promise(function(ff, rj){
        let summary = '';
        summary += 'Data length: ' + data.length + '\n';
        _(cf.statsSpec).each(function(i){
            const dimension = i.dimension;
            const splitGroup = i.splitGroup
            summary += 'dimension: ' + i.dimension + '\n';
            _(splitGroup).each(function(group){
                let filter = {};
                filter[dimension] = group;
                const filtered = _( data ).filter(filter).value()
                const length = filtered.length
                summary += group + ': ' + length + '\n';
            }).value();
        }).value();
        ff(summary);
    });
}

