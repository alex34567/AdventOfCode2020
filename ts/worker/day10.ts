import { AdventOutput } from '../common/common';

export default function (raw_input: readonly string[]): AdventOutput {
    let input = raw_input.map(x => Number(x));
    input.push(0);
    input.sort((lhs, rhs) => lhs - rhs);
    input.push(input[input.length - 1] + 3);
    let voltage = 0;
    let one_volt = 0;
    let three_volt = 0;
    for (let num of input) {
        let diff = num - voltage;
        voltage = num;
        if (diff === 1) {
            one_volt++;
        } else if (diff === 3) {
            three_volt++;
        }
    }
    let possible_arrangements = input.map(() => 1);
    for (let i = possible_arrangements.length - 4; i >= 0; i--) {
        let curr_arrangements = possible_arrangements[i + 1];
        if (input[i + 2] - input[i] <= 3) {
            curr_arrangements += possible_arrangements[i + 2];
        }
        if (input[i + 3] - input[i] <= 3) {
            curr_arrangements += possible_arrangements[i + 3];
        }
        possible_arrangements[i] = curr_arrangements;
    }
    let part1 = String(one_volt * three_volt);
    let part2 = String(possible_arrangements[0]);

    return { part1, part2 };
}
