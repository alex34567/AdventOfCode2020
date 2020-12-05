import { AdventOutput } from '../common/common';

function calcTrees(input: readonly string[], slopex: number, slopey = 1): number {
    let column_count = input[0].length;
    let row_count = input.length;
    let x = 0;
    let trees = 0;
    for (let y = 0; y < row_count; y += slopey) {
        if (input[y][x] === '#') {
            trees++;
        }
        x += slopex;
        x %= column_count;
    }
    return trees;
}

export default function (input: readonly string[]): AdventOutput {
    let part1 = calcTrees(input, 3);
    let slopes: [number, number?][] = [[1], [3], [5], [7], [1, 2]];
    let part2 = slopes.reduce((acc, val) => calcTrees(input, val[0], val[1]) * acc, 1);
    return {part1: String(part1), part2: String(part2)};
}
