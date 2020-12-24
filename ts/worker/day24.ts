import { AdventOutput } from '../common/common';

let REGEX = /(nw|ne|se|sw|e|w|$)/y;

let MAX_ORIGIN_DISTANCE = 1000;
let ADJACENT = [[1, -1], [1, 0], [-1, 0], [-1, 1], [0, 1], [0, -1]].map(x => x[1] * MAX_ORIGIN_DISTANCE + x[0]);

export default function (input: readonly string[]): AdventOutput {
    let new_hexagons = new Uint8Array(MAX_ORIGIN_DISTANCE ** 2);

    for (let line of input) {
        let regex = new RegExp(REGEX);
        let e = 0;
        let ne = 0;
        while (true) {
            let match = regex.exec(line);

            if (!match) {
                throw 'Input error';
            }
            if (match[1] === '') {
                break;
            }
            switch (match[1]) {
                case 'nw':
                    ne++;
                    e--;
                    break;
                case 'ne':
                    ne++;
                    break;
                case 'sw':
                    ne--;
                    break;
                case 'se':
                    ne--;
                    e++;
                    break;
                case 'e':
                    e++;
                    break;
                case 'w':
                    e--;
                    break;
            }
        }

        e += MAX_ORIGIN_DISTANCE / 2;
        ne += MAX_ORIGIN_DISTANCE / 2;

        let id = e + ne * MAX_ORIGIN_DISTANCE;
        if (new_hexagons[id] === 0) {
            new_hexagons[id] = 1;
        } else {
            new_hexagons[id] = 0;
        }
    }
    let part1 = String(new_hexagons.reduce((acc, val) => acc + val, 0));

    let old_hexagons = new Uint8Array(MAX_ORIGIN_DISTANCE ** 2);
    for (let i = 0; i < 100; i++) {
        let tmp = new_hexagons;
        new_hexagons = old_hexagons;
        old_hexagons = tmp;

        for (let i = 0; i < old_hexagons.length; i++) {
            let adj_count = ADJACENT.reduce((acc, val) => acc + old_hexagons[i + val], 0);
            let color = old_hexagons[i];
            if (color === 1 && (adj_count === 0 || adj_count > 2)) {
                color = 0;
            } else if (color === 0 && adj_count === 2) {
                color = 1;
            }
            new_hexagons[i] = color;
        }
    }

    let part2 = String(new_hexagons.reduce((acc, val) => acc + val, 0));


    return { part1, part2 };
}
