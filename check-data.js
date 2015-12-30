"use strict";
const fs = require('fs');
const _ = require('lodash');
const Promise = require('bluebird');

Promise.promisifyAll(fs);

const cf = require('./conf');
const summary = require('./summary.js');

const dataFile = cf.dataFile;

fs.readFileAsync(dataFile)
    .done(function(data) { summary(dataFile) });




