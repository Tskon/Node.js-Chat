'use strict';
const readline = require('readline');
const rl = readline.createInterface({
    'input': process.stdin,
    'output': process.stdout
});
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const newGameDate = new Date() + '\n';

let logPath = './log.txt';
if(argv.log) logPath = argv.log;

fs.writeFile(logPath, newGameDate, (err) => {
    if(err) throw err;
    console.log('log has been created (' + logPath + ')');
});
startGame();

function startGame() {
    rl.question('Орел(1) или Решка(2)?\n', function (answer) {
        const correctVal = getRandom(1, 2);
        if (answer === '1' || answer === '2') {
            let result = 'lose\n';
            if(correctVal === +answer){
                result = 'win\n';
            }
            fs.appendFile(logPath, result, (err) => {
                if(err) throw err;
                startGame();
            })
        } else if(answer === '0'){
            process.exit();
        } else {
            console.log('Введите "1" - орел или "2" - Решка. "0" - для выхода');
            startGame();
        }
    })
}

function getRandom(minVal = 0, maxVal = 10, isInteger = true){
    if(isInteger){
        let result = minVal + Math.random() * (maxVal + 1 - minVal);
        return Math.floor(result);
    }else{
        return minVal + Math.random() * (maxVal - minVal);
    }
}