const cf = {};

cf.dataFile = './data/data.json';

cf.HOW_MANY = 10000;

cf.SCHEMA = {
    'id' : '', // id
    'dd' : '', // date
    'ct' : '', // city
    'ge' : '', // gender
    'ag' : '', // age
    'os' : ''  // os
};

cf.statsSpecs = {
    // dd:
    ct: {
        split: [0, 0.1, 0.2, 0.5, 1],
        splitGroup: ['T', 'M', 'V', 'D'],
    },
    ge: {
        split: [0, 0.1, 0.2, 1],
        splitGroup:['M', 'F', 'D'],
    },
    ag: {
        split: [0, 0.33, 0.50, 0.75, 1],
        splitGroup: ['tn', 'ya', 'ad', 'se'],
    },
    os: {
        split: [0, 0.1, 0.2, 0.3, 1],
        splitGroup: ['an', 'ap', 'bb', 'wn'],
    }
}
module.exports = cf;
