const c = {};

// c.START_NEW_SET = true;
c.START_NEW_SET = false;
c.HOW_MANY = 10000;
c.SCHEMA = {
    'id' : '', // id
    'dd' : '', // date
    'ct' : '', // city
    'ge' : '', // gender
    'ag' : '', // age
    'os' : ''  // os
};

c.statsSpec = {
    ge: {
        split: [0, 0.1, 0.2, 1],
        splitGroup:['M', 'F', 'D'],
        dimension: 'ge'
    },
    ct: {
        split: [0, 0.1, 0.2, 0.3, 1],
        splitGroup: ['T', 'M', 'V', 'D'],
        dimension: 'ct'
    },
    os: {
        split: [0, 0.1, 0.2, 0.3, 1],
        splitGroup: ['an', 'ap', 'bb', 'wn'],
        dimension: 'os'
    },
    ag: {
        split: [0, 0.33, 0.50, 0.75, 1],
        splitGroup: ['tn', 'ya', 'ad', 'se'],
        dimension: 'ag'
    },
}
module.exports = c;
