import { AdventOutput } from '../common/common';

export default function (input: readonly string[]): AdventOutput {
    let passes = [];
    for (let pass of input) {
        let low_bound = 0;
        let high_bound = 128;
        for (let i = 0; i < 7; i++) {
            let middle = (high_bound + low_bound) / 2;
            if (pass[i] === 'F') {
                high_bound = middle;
            } else {
                low_bound = middle;
            }
        }
        let row = low_bound;
        low_bound = 0;
        high_bound = 8;
        for (let i = 7; i < 10; i++) {
            let middle = (high_bound + low_bound) / 2;
            if (pass[i] === 'L') {
                high_bound = middle;
            } else {
                low_bound = middle;
            }
        }
        let column = low_bound;
        let id = row * 8 + column;
        passes.push(id);
    }
    passes.sort((lhs, rhs) => lhs - rhs);
    let my_pass = null;
    for (let i = 0; i < passes.length - 1; i++) {
        if (passes[i + 1] - passes[i] === 2) {
            my_pass = passes[i] + 1;
            break;
        }
    }
    return {part1: String(passes[passes.length - 1]), part2: String(my_pass)};
}
