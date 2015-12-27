'use strict';
const Promise = require('bluebird');
const _ = require('lodash');

const cf = require('./conf');

function startNewSet(howMany, ff, rj) {
    const dataSet = [];
    let i = howMany + 1;
    while (--i) {
        const copyOfSchema_withId = _.assign({}, cf.SCHEMA, {id:_.uniqueId()})
        dataSet.push(copyOfSchema_withId);
    }
    return dataSet;
}


function cb(datum, key, statsSpec) {
    const split      = statsSpec.split;
    const splitGroup = statsSpec.splitGroup;
    const dimension  = key;

    const spec = [];
    for (var i=1; i <= split.length-1; i++) {
        spec.push( [ split[i-1], split[i], splitGroup[i-1] ]);
    }

    const N = 10000;
    const rand = Math.floor(Math.random()*N + 1);

    _(spec).each(function(i, k){
        if (( N*i[0] < rand ) && ( rand <= N*i[1])) {
            datum[dimension] = i[2]; }
    }).value();

    return datum;
}

function generateStats(data, ff, rj) {
    // [!] KEEP THE FOLLOWING AS DOCUMENTATION
    //
    // let data_new = [];
    // data_new = _(data)
    // .map(function(datum){ return cb(datum, cf.statsSpec.ge); })
    // .map(function(datum){ return cb(datum, cf.statsSpec.ct); })
    // .map(function(datum){ return cb(datum, cf.statsSpec.ag); })
    // .map(function(datum){ return cb(datum, cf.statsSpec.os); })
    // .value();
    // ff(JSON.stringify(data_new));

    // [!] See above to understand how the following works
    // This is a dynamic version of the above.
    const data_new = _.reduce( Object.keys(cf.statsSpec), function(acc, key ){
        return acc.map( function(datum){
            return cb(datum, key, cf.statsSpec[key]);
        })
    }, _(data))
    .value();
    ff(JSON.stringify(data_new));
}

module.exports = function generateData(data_bf) {
    return new Promise(function(ff, rj){
        if (data_bf) {
            // Datafile exist, update with new stats specification
            const data = JSON.parse(data_bf.toString());
            data_new = generateStats(data, ff, rj);
       } else {
            // Datafile does not exist,  start new one
            const data_newSet = startNewSet(cf.HOW_MANY, ff, rj);
            data_new = generateStats(data_newSet, ff, rj);
       }
    });
};



