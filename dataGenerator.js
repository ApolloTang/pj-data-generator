'use strict';
const Promise = require('bluebird');
const _ = require('lodash');

const cf = require('./conf');
debugger;

function generateStats(data) {
    let data_new = {};
    const N = 10000;
    let rand;

    data_new = _(data).map(function(i, j){
        rand = Math.floor(Math.random()*N + 1);
        if (( 0 <= rand ) && ( rand <= N*0.5)) {
            console.log(rand, j, i.id, i.gender)
           console.log('b', Date.now() );
           i.gender = 'female';
        } else if (( N*0.5 < rand ) && ( rand <= N ))  {
            console.log(rand, j, i.id, i.gender)
           i.gender = 'male';
           console.log('b', Date.now() );
        }
        return i;
    });
    // data_new = data;
    return data_new;
}

function summary(data) {
   console.log('------- in summary data: ', data)
    const summary = {
        "length" : data.length,
        "gender" : {
            female: _(_.assign({}, data)).filter({gender:'female'}).value(),
            male  : _(_.assign({}, data)).filter({gender:'male'}).value()
        }
    };
    debugger;
    return summary;
}

function startNewSet(howMany) {
    console.log('---- starting new set -----');
    let dataFromSchema = generateNewSetFromSchema(howMany);
    let brandNewSet = _(dataFromSchema).map(function(i){
        i.id = _.uniqueId();
        return i;
    }).value();
    return brandNewSet;
}

function generateNewSetFromSchema(howMany) {
    const dataSet = [];
    let i = howMany + 1;
    while (--i) {
        dataSet.push(_.assign({}, cf.SCHEMA));
    }
    return dataSet;
}

module.exports = function generateData(data_bf) {
    return new Promise(function(ff, rj){
        let err = '';
        let data_new = {};

        if (data_bf) {
            if (cf.START_NEW_SET) {
                data_new = startNewSet(cf.HOW_MANY);
            } else {
                const data = JSON.parse(data_bf.toString());
                data_new = generateStats(data);
            }
       } else {
            data_new = startNewSet(cf.HOW_MANY);
       }

       if (err) {
           rj('error');
       } else {

           console.log('a', Date.now() );
           console.log(summary(data_new));
           ff(JSON.stringify(data_new));
       };
    });
}


