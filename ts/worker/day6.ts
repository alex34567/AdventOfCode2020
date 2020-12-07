import { AdventOutput } from '../common/common';

let REGEX = /(\w+)\n?|\n|$/y

export default function (raw_input: readonly string[]): AdventOutput {
    let input = raw_input.join('\n');
    let group_letters = new Map<string, number>();
    REGEX.lastIndex = 0;
    let match = REGEX.exec(input);
    let part1 = 0;
    let part2 = 0;
    let group_size = 0;
    while (match) {
        if (match[0] === '\n' || match[0] === '') {
            part1 += group_letters.size;
            for (let count of group_letters.values()) {
                if (count === group_size) {
                    part2++;
                }
            }
            group_letters.clear();
            group_size = 0;
            if (match[0] === '') {
                break;
            }
        } else {
            group_size++;
            for (let letter of match[1]) {
                let count = group_letters.get(letter);
                if (!count) {
                    count = 0;
                }
                count++;
                group_letters.set(letter, count);
            }
        }
        
        match = REGEX.exec(input);
    }
    if (!match) {
        throw 'Input error';
    }
    return { part1: String(part1), part2: String(part2) };
}
