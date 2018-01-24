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
if (argv.log) logPath = argv.log;

fs.writeFile(logPath, newGameDate, (err) => {
    if (err) throw err;
    console.log('log has been created (' + logPath + ')');
});
startGame();

function startGame() {
    rl.question('Орел(1) или Решка(2)?\n', function (answer) {
        const correctVal = getRandom(1, 2);
        if (answer === '1' || answer === '2') {
            let result = 'lose\n';
            if (correctVal === +answer) {
                result = 'win\n';
            }
            fs.appendFile(logPath, result, (err) => {
                if (err) throw err;
                startGame();
            })
        } else if (answer === '0') {
            parseLog(logPath);
            rl.close();
        } else {
            console.log('Введите "1" - орел или "2" - Решка. "0" - для выхода');
            startGame();
        }
    })
}

function parseLog(logPath) {
    fs.readFile(logPath, (err, data) => {
        if (err) throw err;
        data = data.toString();
        let dataArr = data.split('\n');
        dataArr = dataArr.slice(1, dataArr.length - 1);
        console.log(dataArr);

        let lastVal = '';
        let currentVal = '';
        let maxWin = 0;
        let maxLose = 0;
        let currentCount = 0;
        let loseCount = 0;
        let winCount = 0;

        const iteration = (current) => {
            if (lastVal !== current){
                if(lastVal === 'win' && currentCount > maxWin){
                    maxWin = currentCount;
                }
                if(lastVal === 'lose' && currentCount > maxLose){
                    maxLose = currentCount;
                }

                currentCount = 0;
            }
            currentCount++;
            lastVal = currentVal;
            currentVal = current;
        };

        for (let i = 0; i < dataArr.length; i++) {
            if(dataArr[i] ===  'win'){
                winCount++;
                iteration('win');
            }
            if(dataArr[i] ===  'lose'){
                loseCount++;
                iteration('lose');
            }
            lastVal = currentVal;
        }
        currentVal = 'end';
        iteration(currentVal);

        console.log('Общее количество партий:', dataArr.length);
        console.log('Количество побед:', winCount);
        console.log('Количество поражений:', loseCount);
        console.log('win/lose:', (winCount / loseCount).toFixed(2));
        console.log('Максимум побед подряд:', maxWin);
        console.log('Максимум поражений подряд:', maxLose);

    })
}
function getRandom(minVal = 0, maxVal = 10, isInteger = true) {
    if (isInteger) {
        let result = minVal + Math.random() * (maxVal + 1 - minVal);
        return Math.floor(result);
    } else {
        return minVal + Math.random() * (maxVal - minVal);
    }
}