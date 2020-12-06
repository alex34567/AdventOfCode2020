import { AdventWorkerJob, AdventRes, AdventErr } from '../common/common';
import Day1 from 'day1';
import Day2 from 'day2';
import Day3 from 'day3';
import Day4 from 'day4';
import Day5 from 'day5';

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
            default:
                throw "Invalid Dayn";
        }
    } catch (e) {
        postWrapper({ message: e.toString()});
    }
    
});

