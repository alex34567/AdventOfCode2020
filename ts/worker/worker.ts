import { AdventWorkerJob, AdventRes, AdventErr } from '../common/common';
import Day1 from 'day1';
import Day2 from 'day2';
import Day3 from 'day3';
import Day4 from 'day4';
import Day5 from 'day5';
import Day6 from 'day6';
import Day7 from 'day7';
import Day8 from 'day8';
import Day9 from 'day9';
import Day10 from 'day10';
import Day11 from 'day11';
import Day12 from 'day12';
import Day13 from 'day13';
import Day14 from 'day14';
import Day15 from 'day15';

function postWrapper(res: AdventRes): void {
    postMessage(res);
}

addEventListener('message', (mesg: MessageEvent<AdventWorkerJob>) => {
    let job = mesg.data;
    let input = job.input.trim().split('\n');
    for (let i = 0; i < input.length; i++) {
        input[i] = input[i].trim();
    }
    try {
        switch (job.dayN) {
            case 1:
                postWrapper(Day1(input));
                break;
            case 2:
                postWrapper(Day2(input));
                break;
            case 3:
                postWrapper(Day3(input));
                break;
            case 4:
                postWrapper(Day4(input));
                break;
            case 5:
                postWrapper(Day5(input));
                break;
            case 6:
                postWrapper(Day6(input));
                break;
            case 7:
                postWrapper(Day7(input));
                break;
            case 8:
                postWrapper(Day8(input));
                break;
            case 9:
                postWrapper(Day9(input));
                break;
            case 10:
                postWrapper(Day10(input));
                break;
            case 11:
                postWrapper(Day11(input));
                break;
            case 12:
                postWrapper(Day12(input));
                break;
            case 13:
                postWrapper(Day13(input));
                break;
            case 14:
                postWrapper(Day14(input));
                break;
            case 15:
                postWrapper(Day15(input));
                break;
            default:
                throw "Invalid Dayn";
        }
    } catch (e) {
        postWrapper({ message: e.toString()});
    }
    
});

