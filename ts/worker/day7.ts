import { AdventOutput } from '../common/common';

class Bag {
    name: string;
    be_contained: Bag[] = [];
    contains: [number, Bag][] = [];
    visited: boolean = false;

    constructor(name: string) {
        this.name = name;
    }

    depthSearchBeContained(): number {
        if (this.visited) {
            return 0;
        }
        this.visited = true;
        return this.be_contained.reduce((acc, val) => acc + val.depthSearchBeContained(), 1);
    }

    depthSearchContains(): number {
        return this.contains.reduce((acc, val) => acc + val[0] * val[1].depthSearchContains(), 1);
    }
}

let LINE_REGEX = /^(\w+ \w+) bags contain ((?:\w|\d| |,|\.)+)$/;
let BAG_REGEX = /(?:(no other )|(?:(\d+) (\w+ \w+) ))bags?((?:, )|(?:\.$))/y

export default function (input: readonly string[]): AdventOutput {
    let bags = new Map<string, Bag>();
    let shiny_gold = new Bag('shiny gold');
    bags.set('shiny gold', shiny_gold);
    for (let raw_bag of input) {
        let line_match = LINE_REGEX.exec(raw_bag);
        if (!line_match) {
            throw 'Input error';
        }
        let outer_bag = bags.get(line_match[1]);
        if (!outer_bag) {
            outer_bag = new Bag(line_match[1]);
            bags.set(line_match[1], outer_bag);
        }
        let contents = line_match[2];
        BAG_REGEX.lastIndex = 0;
        let bag_match = BAG_REGEX.exec(contents);
        while (bag_match) {
            if (!bag_match[1]) {
                let inner_bag = bags.get(bag_match[3]);
                if (!inner_bag) {
                    inner_bag = new Bag(bag_match[3]);
                    bags.set(bag_match[3], inner_bag);
                }
                inner_bag.be_contained.push(outer_bag);
                outer_bag.contains.push([Number(bag_match[2]), inner_bag]);
            }

            if (bag_match[4] === '.') {
                break;
            }
            
            bag_match = BAG_REGEX.exec(contents);
        }
        if (!bag_match) {
            throw 'Input error';
        }
    }
    let part1 = String(shiny_gold.depthSearchBeContained() - 1);
    let part2 = String(shiny_gold.depthSearchContains() - 1);

    return { part1, part2 };
}
