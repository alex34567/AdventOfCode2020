import { AdventOutput } from '../common/common';

let DIRECTIONS: [number, number][] = [[1,0], [0,-1], [-1, 0], [0, 1]];

export default function (input: readonly string[]): AdventOutput {
    let x = 0;
    let y = 0;
    let direction = 0;
    for (let ins of input) {
        let op = ins[0];
        let num = Number(ins.substr(1));
        switch (op) {
            case 'N':
                y += num;
                break;
            case 'S':
                y -= num;
                break;
            case 'E':
                x += num;
                break;
            case 'W':
                x -= num;
                break;
            case 'L':
                direction -= num / 90;
                direction %= 4;
                if (direction < 0) {
                    direction += 4;
                }
                break;
            case 'R':
                direction += num / 90;
                direction %= 4;
                break;
            case 'F':
                x += DIRECTIONS[direction][0] * num;
                y += DIRECTIONS[direction][1] * num;
                break;
        }
    }

    let part1 = String(Math.abs(x) + Math.abs(y));
    x = 0;
    y = 0;
    let way_x = 10;
    let way_y = 1;

    for (let ins of input) {
        let op = ins[0];
        let num = Number(ins.substr(1));
        switch (op) {
            case 'N':
                way_y += num;
                break;
            case 'S':
                way_y -= num;
                break;
            case 'E':
                way_x += num;
                break;
            case 'W':
                way_x -= num;
                break;
            case 'L':
                for (let i = 0; i < num / 90; i++) {
                    let new_x = -way_y;
                    let new_y = way_x;
                    way_x = new_x;
                    way_y = new_y;
                }
                break;
            case 'R':
                for (let i = 0; i < num / 90; i++) {
                    let new_x = way_y;
                    let new_y = -way_x;
                    way_x = new_x;
                    way_y = new_y;
                }
                break;
            case 'F':
                x += way_x * num;
                y += way_y * num;
                break;
        }
    }

    let part2 = String(Math.abs(x) + Math.abs(y));

    return { part1, part2 };
}
