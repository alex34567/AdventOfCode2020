import { AdventWorkerJob, AdventRes, AdventErr } from '../common/common';
import Day1 from 'day1';

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
            default:
                throw "Invalid Dayn";
        }
    } catch (e) {
        postWrapper({ message: e.toString()});
    }
    
});

