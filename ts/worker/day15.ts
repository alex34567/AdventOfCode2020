import { AdventOutput } from '../common/common';

function calcAns(input: readonly string[], turn_count: number): string {
    let turn = 0;
    let history = new Map<number, number>();
    let last_said = null;
    for (let raw_init of input[0].split(',')) {
        let init = Number(raw_init);
        last_said = history.get(init);
        history.set(init, turn);
        turn++;
    }

    let say;
    while (turn < turn_count) {
        if (typeof last_said !== 'number') {
            say = 0;
        } else {
            say = turn - last_said - 1;
        }
        last_said = history.get(say);
        history.set(say, turn);
        turn++;
    }

    return String(say);
}

export default function (input: readonly string[]): AdventOutput {
    return { part1: calcAns(input, 2020), part2: calcAns(input, 30000000) };
}
