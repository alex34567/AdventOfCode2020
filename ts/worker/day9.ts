import { AdventOutput } from '../common/common';

function IncNum(num: number, map: Map<number, number>) {
    let count = map.get(num);
    if (!count) {
        count = 0;
    }
    map.set(num, count + 1);
}

function DecNum(num: number, map: Map<number, number>) {
    let count = map.get(num);
    count!--;
    if (count === 0) {
        map.delete(num);
    } else {
        map.set(num, count!);
    }
}

export default function (input: readonly string[]): AdventOutput {
    let history_array: number[] = [];
    let history_map = new Map<number, number>();
    for (let i = 0; i < 25; i++) {
        let num = Number(input[i]);
        history_array.push(num);
        IncNum(num, history_map);
    }
    let i;
    for (i = 25; i < input.length; i++) {
        let curr_num = Number(input[i]);
        let good_num = false;
        for (let history_num of history_array) {
            if (curr_num === history_num * 2) {
                continue;
            }
            if (history_map.has(curr_num - history_num)) {
                good_num = true;
                break;
            }
        }
        if (!good_num) {
            break;
        }
        DecNum(history_array[0], history_map);
        history_array.shift();
        history_array.push(curr_num);
        IncNum(curr_num, history_map);
    }
    let target = Number(input[i]);
    let curr = Number(input[0]);
    let start_range = 0;
    let end_range = 1;
    while (target !== curr || start_range + 1 === end_range) {
        if (curr < target || start_range + 1 === end_range) {
            curr += Number(input[end_range]);
            end_range++;
        } else {
            curr -= Number(input[start_range]);
            start_range++;
        }
    }
    let smallest_num = Infinity;
    let largest_num = -Infinity;
    for (let i = start_range; i < end_range; i++) {
        let num = Number(input[i]);
        if (num < smallest_num) {
            smallest_num = num;
        }
        if (num > largest_num) {
            largest_num = num;
        }
    }

    let part2 = String(smallest_num + largest_num);

    return { part1: String(target), part2 };
}
