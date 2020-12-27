const START_BALANCE = 1000

const DIFF = 2;

const REWARDINPUT = {
    address: 'reward'
};

const MININGREWARD = 5;

const GENESIS_BLOCK_DATA = {
    timestamp: 1,
    lasthash: '0',
    hash: '0',
    data: [],
    difficulty:DIFF,
    nonce:0
};

const RATE = 2000;

module.exports = {GENESIS_BLOCK_DATA, RATE, START_BALANCE,REWARDINPUT,MININGREWARD};