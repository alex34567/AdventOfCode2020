import { AdventOutput } from '../common/common';
import { numArrayCompare } from 'utility';

let ADJACENT: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];

function calcAns(input: Uint8Array, row_count: number, column_count: number, leave_threshold: number, adjacent_fun: (arr: Uint8Array, i: number, j: number) => number): number {
    let prev_cells = new Uint8Array(input.length);
    let next_cells = new Uint8Array(input);
    while (numArrayCompare(prev_cells, next_cells) !== 0) {
        for (let i = 0; i < prev_cells.length; i++) {
            prev_cells[i] = next_cells[i];
        }
        for (let i = 0; i < row_count; i++) {
            for (let j = 0; j < column_count; j++) {
                let curr_cell = prev_cells[i * column_count + j];
                let adjacent_count = adjacent_fun(prev_cells, i, j);
                if (curr_cell === 1 && adjacent_count === 0) {
                    next_cells[i * column_count + j] = 2;
                } else if (curr_cell === 2 && adjacent_count >= leave_threshold) {
                    next_cells[i * column_count + j] = 1;
                }
            }
        }
    }
    return next_cells.reduce((acc, val) => Number(val === 2) + acc, 0);
}

export default function (raw_input: readonly string[]): AdventOutput {
    let row_count = raw_input.length;
    let column_count = raw_input[0].length;
    let input = new Uint8Array(column_count * row_count);

    for (let i = 0; i < row_count; i++) {
        for (let j = 0; j < column_count; j++) {
            let value;
            switch(raw_input[i][j]) {
                case '.':
                    value = 0;
                    break;
                case 'L':
                    value = 1;
                    break;
                case '#':
                    value = 2;
                    break;
                default:
                    throw 'Input Error';
            }
            input[i * column_count + j] = value;
        }
    }
    
    let part1_adj = (arr: Uint8Array, i: number, j: number) => ADJACENT
                    .map(x => [x[0] + i, x[1] + j])
                    .filter(x => x[0] >= 0 && x[1] >= 0 && x[0] < row_count && x[1] < column_count)
                    .reduce((acc, x) => 
                            acc + Number(arr[x[0] * column_count + x[1]] === 2), 0);

    let part1 = String(calcAns(input, row_count, column_count, 4, part1_adj));

    let part2_adj = (arr: Uint8Array, row: number, column: number) => { 
        let adjacent_count = 0;
        for (let slope of ADJACENT) {
            let i = row + slope[0];
            let j = column + slope[1];
            while (i >= 0 && i < row_count && j >= 0 && j < column_count) {
                let curr_seat = arr[i * column_count + j];
                if (curr_seat === 1) {
                    break;
                } else if (curr_seat == 2) {
                    adjacent_count++;
                    break;
                }
                i += slope[0];
                j += slope[1];
            }
        }
        return adjacent_count;
    };

    let part2 = String(calcAns(input, row_count, column_count, 5, part2_adj));

    return { part1, part2 };
}
