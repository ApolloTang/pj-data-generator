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


function generateStats(data, ff, rj) {
    let data_new = {};
    const N = 10000;
    let rand;

    data_new = _(data).map(function(i, j){
        rand = Math.floor(Math.random()*N + 1);
        if (( 0 <= rand ) && ( rand <= N*0.1)) {
           i.ge = 'F';
        } else if (( N*0.1 < rand ) && ( rand <= N ))  {
           i.ge = 'M';
        }
        return i;
    });


    ff(JSON.stringify(data_new));
    // data_new = data;
    // return data_new;
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

       // if (err) {
       //     rj('error');
       // } else {
       //
       //     console.log('a', Date.now() );
       //     console.log(summary(data_new));
       //     ff(JSON.stringify(data_new));
       // };
    });
}


