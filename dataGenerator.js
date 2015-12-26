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
    ff(JSON.stringify(dataSet));
}

function cb(datum, split, splitGroup, dataProps) {
    const spec = [];
    for (var i=1; i <= split.length-1; i++) {
        spec.push( [ split[i-1], split[i], splitGroup[i-1] ]);
    }

    const N = 10000;
    const rand = Math.floor(Math.random()*N + 1);

    _(spec).each(function(i){
        if (( N*i[0] < rand ) && ( rand <= N*i[1])) {
            datum[dataProps] = i[2];
        }
    }).value();

    return datum;
}

function generateStats(data, ff, rj) {
    let data_new = {};
    // const N = 10000;
    // let rand;

    data_new = _(data)
    .map(function(datum){
       return cb(datum,
            [0, 0.1, 0.2, 1],
            ['M', 'F', 'D'],
            'ge'
        );
    })
    .map(function(datum){
       return cb(datum,
             [0, 0.1, 0.2, 0.3, 1],
             ['T', 'M', 'V', 'D'],
             'ct'
       );
    }).value();

    // .map(function(datum, j){
    //     const split      = [0, 0.1, 0.2, 1];
    //     const splitGroup = ['M', 'F', 'D'];
    //
    //     const spec = [];
    //     for (var i=1; i <= split.length-1; i++) {
    //         spec.push( [ split[i-1], split[i], splitGroup[i-1] ]);
    //     }
    //
    //     rand = Math.floor(Math.random()*N + 1);
    //     _(spec).each(function(i){
    //         if (( N*i[0] < rand ) && ( rand <= N*i[1])) {
    //            datum.ge = i[2];
    //         }
    //     }).value();
    //
    //     return datum;
    // })
    // .map(function(datum, j){
    //     const split      = [0, 0.1, 0.2, 0.3, 1];
    //     const splitGroup = ['T', 'M', 'V', 'D'];
    //
    //     const spec = [];
    //     for (var i=1; i <= split.length-1; i++) {
    //         spec.push( [ split[i-1], split[i], splitGroup[i-1] ]);
    //     }
    //
    //     rand = Math.floor(Math.random()*N + 1);
    //     _(spec).each(function(i){
    //         if (( N*i[0] < rand ) && ( rand <= N*i[1])) {
    //            datum.ct = i[2];
    //         }
    //     }).value();
    //
    //     return datum;
    // });
    // ;

    ff(JSON.stringify(data_new));
}

module.exports = function generateData(data_bf) {
    return new Promise(function(ff, rj){
        let err = '';
        let data_new = {};

        if (data_bf) {
            if (cf.START_NEW_SET) {
                data_new = startNewSet(cf.HOW_MANY, ff, rj);
            } else {
                const data = JSON.parse(data_bf.toString());
                data_new = generateStats(data, ff, rj);
            }
       } else {
            data_new = startNewSet(cf.HOW_MANY, ff, rj);
       }
    });
}


