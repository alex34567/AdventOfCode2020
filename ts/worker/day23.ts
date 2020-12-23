import { AdventOutput } from '../common/common';

class Cup {
    label: number;
    clockwise: Cup;

    constructor(label: number) {
        this.label = label;
        this.clockwise = this;
    }

    add(cup: Cup): void {
        cup.clockwise = this.clockwise;
        this.clockwise = cup;
    }

    remove(): Cup {
        let ret = this.clockwise;
        this.clockwise = this.clockwise.clockwise;
        return ret;
    }
}

function calcAns(input: readonly string[], part2: boolean): string {
    let labels = input[0].split('').map(x => Number(x));
    let current_cup = new Cup(labels[0]);
    labels.shift();
    let next_placed = current_cup;
    let lowest_label = current_cup.label;
    let highest_label = current_cup.label;
    let cups = [];
    cups[current_cup.label] = current_cup;

    for (let raw_cup of labels) {
        let cup = new Cup(raw_cup);
        next_placed.add(cup);
        cups[cup.label] = cup;
        next_placed = cup;
        if (raw_cup < lowest_label) {
            lowest_label = raw_cup;
        }

        if (raw_cup > highest_label) {
            highest_label = raw_cup;
        }
    }
    let limit = 100;
    if (part2) {
        limit = 10000000;
        while (highest_label < 1000000) {
            highest_label++;
            let cup = new Cup(highest_label);
            next_placed.add(cup);
            next_placed = cup;
            cups.push(cup);
        }
    }

    for (let i = 0; i < limit; i++) {
        let picked_cups: Cup[] = [];
        for (let j = 0; j < 3; j++) {
            picked_cups.push(current_cup.remove());
        }

        let dest_label = current_cup.label - 1;
        if (dest_label < lowest_label) {
            dest_label = highest_label;
        }

        while (picked_cups.some(x => x.label === dest_label)) {
            dest_label--;
            if (dest_label < lowest_label) {
                dest_label = highest_label;
            }
        }

        let dest_cup = cups[dest_label];
        for (let j = 2; j >= 0; j--) {
            dest_cup.add(picked_cups[j]);
        }

        current_cup = current_cup.clockwise;
    }

    let ans;
    if (part2) {
        ans = String(cups[1].clockwise.label * cups[1].clockwise.clockwise.label);
    } else {
        ans = '';
        let res_cup = cups[1];
        res_cup = res_cup.clockwise;
        while (res_cup.label !== 1) {
            ans += Number(res_cup.label);
            res_cup = res_cup.clockwise;
        }
    }

    return ans;
}

export default function(input: readonly string[]): AdventOutput {
    return { part1: calcAns(input, false), part2: calcAns(input, true) };
}
