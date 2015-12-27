'use strict';
const fs = require('fs');
const Promise = require('bluebird');
const _ = require('lodash');


const cf = require('./conf');
const dataFile = cf.dataFile;


module.exports = function summarizeDataInFile(fileName) {
    // @TODO open file
    fs.readFileAsync(dataFile)
        .then( function(b){ generateSummary( JSON.parse(b.toString()) )
        .then( console.log )
    });
    // @TODO close file
};

function generateSummary(data) {
    return new Promise(function(ff, rj){
        let summary = '';
        summary += 'Data length: ' + data.length + '\n';
        Object.keys(cf.statsSpecs).forEach(function(key){
            let i = cf.statsSpecs[key];
            const dimension = key;
            const splitGroup = i.splitGroup
            summary += 'dimension: ' + i.dimension + '\n';
            _(splitGroup).each(function(group){
                let filter = {};
                filter[dimension] = group;
                const filtered = _( data ).filter(filter).value()
                const length = filtered.length
                summary += group + ': ' + length + '\n';
            }).value();
        });

        ff(summary);
    });
}

