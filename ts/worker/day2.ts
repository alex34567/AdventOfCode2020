import { AdventOutput } from '../common/common';

let regex = /^(\d+)-(\d+) (\w): (\w+)$/;

export default function (input: readonly string[]): AdventOutput {
    let part1 = 0;
    let part2 = 0;
    for (let line of input) {
        let match = regex.exec(line);
        if (!match) {
            throw 'Syntax Error';
        }

        let low_bound = Number(match[1]);
        let high_bound = Number(match[2]);
        let letter = match[3];
        let password = match[4];
        let count = 0;
        for (let char of password) {
            if (char === letter) {
                count++;
            }
        }
        if (count >= low_bound && count <= high_bound) {
            part1++;
        }
        let pos_match = 0;
        if (password[low_bound - 1] === letter) {
            pos_match++;
        }
        if (password[high_bound - 1] === letter) {
            pos_match++;
        }
        if (pos_match === 1) {
            part2++;
        }
    }

    return {part1: String(part1), part2: String(part2)};
}
