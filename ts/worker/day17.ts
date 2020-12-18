import { AdventOutput } from '../common/common';

let DIMETION_BOUND = 20;
function genAdjacent(four_d: boolean) {
    let deltas = [-1, -1, -1];
    if (four_d) {
        deltas.push(-1);
    }
    let raw_adjacent = [];
    while (true) {
        let all_one = true;
        let all_zero = true;
        for (let delta of deltas) {
            if (delta !== 0) {
                all_zero = false;
            }
            if (delta !== 1) {
                all_one = false;
            }
        }

        if (!all_zero) {
            raw_adjacent.push(deltas.map(x => x));
        }

        if (all_one) {
            break;
        }

        for (let i = 0; i < deltas.length; i++) {
            deltas[i]++;
            if (deltas[i] === 2) {
                deltas[i] = -1;
            } else {
                break;
            }
        }
    }
    
    if (four_d) {
        return raw_adjacent.map(x => x[0] * DIMETION_BOUND ** 3 + x[1] * DIMETION_BOUND ** 2 + x[2] * DIMETION_BOUND + x[3]);
    } else {
        return raw_adjacent.map(x => x[0] * DIMETION_BOUND ** 2 + x[1] * DIMETION_BOUND + x[2]);
    }

}
let THREE_D_ADJACENT: number[] = genAdjacent(false);
let FOUR_D_ADJACENT: number[] = genAdjacent(true);

function calcAns(input: readonly string[], four_d: boolean): string {
    let size = DIMETION_BOUND ** 3;
    if (four_d) {
        size = DIMETION_BOUND ** 4;
    }

    let main_grid = new Uint8Array(size);
    let new_grid = new Uint8Array(size);

    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            let value = 0;
            if (input[i][j] === '#') {
                value = 1;
            }
            let half_dimention = DIMETION_BOUND / 2;
            let middle_offset = half_dimention * DIMETION_BOUND**2;
            if (four_d) {
                middle_offset += half_dimention * DIMETION_BOUND**3;
            }
            new_grid[middle_offset + (i + half_dimention) * DIMETION_BOUND + j + half_dimention] = value;
        }
    }

    let adjacent = THREE_D_ADJACENT;
    if (four_d) {
        adjacent = FOUR_D_ADJACENT;
    }

    for (let q = 0; q < 6; q++) {
        let tmp = main_grid;
        main_grid = new_grid;
        new_grid = tmp;
        for (let i = 0; i < size; i++) {
            let value = main_grid[i];
            let adj_count = 0;
            for (let adj of adjacent) {
                adj_count += main_grid[i + adj];
            }

            let new_value = 0;
            if (value === 0) {
                if (adj_count === 3) {
                    new_value = 1;
                }
            }
            else {
                if (adj_count === 2 || adj_count === 3) {
                    new_value = 1;
                }
            }

            new_grid[i] = new_value;
        }
    }

    return String(new_grid.reduce((acc, val) => acc + val, 0));
}

export default function (input: readonly string[]): AdventOutput {
    return { part1: calcAns(input, false), part2: calcAns(input, true) };

}
