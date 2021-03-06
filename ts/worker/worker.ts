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
import Day16 from 'day16';
import Day17 from 'day17';
import Day18 from 'day18';
import Day19 from 'day19';
import Day20 from 'day20';
import Day21 from 'day21';
import Day22 from 'day22';
import Day23 from 'day23';
import Day24 from 'day24';
import Day25 from 'day25';

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
            case 16:
                postWrapper(Day16(input));
                break;
            case 17:
                postWrapper(Day17(input));
                break;
            case 18:
                postWrapper(Day18(input));
                break;
            case 19:
                postWrapper(Day19(input));
                break;
            case 20:
                postWrapper(Day20(input));
                break;
            case 21:
                postWrapper(Day21(input));
                break;
            case 22:
                postWrapper(Day22(input));
                break;
            case 23:
                postWrapper(Day23(input));
                break;
            case 24:
                postWrapper(Day24(input));
                break;
            case 25:
                postWrapper(Day25(input));
                break;
            default:
                throw "Invalid Dayn";
        }
    } catch (e) {
        postWrapper({ message: e.toString()});
    }
    
});

