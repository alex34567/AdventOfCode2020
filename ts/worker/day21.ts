import { AdventOutput } from '../common/common';
import { stringCompare } from 'utility';

let REGEX = /^(\w+(?:\w+ )*)\(contains (\w+(?:, \w+)*)\)$/

export default function (input: readonly string[]): AdventOutput {
    let alergen_to_ingre = new Map<string, string[]>();
    for (let line of input) {
        let match = REGEX.exec(line);
        if (!match) {
            throw 'Input error';
        }
        let ingredients = match[1].split(' ').filter(x => x);
        let aler = match[2].split(', ');

        for (let alergen of aler) {
            let ingre = alergen_to_ingre.get(alergen);
            if (!ingre) {
                ingre = ingredients;
            } else {
                ingre = ingre.filter(x => ingredients.includes(x));
            }
            alergen_to_ingre.set(alergen, ingre);
        }
    }

    let reduction = true;
    while (reduction) {
        reduction = false;
        for (let [aler, ingre] of alergen_to_ingre) {
            if (ingre.length === 1) {
                for (let [a, i] of alergen_to_ingre) {
                    if (a !== aler) {
                        let new_i = i.filter(x => x !== ingre[0]);
                        if (new_i.length !== i.length) {
                            reduction = true;
                        }
                        alergen_to_ingre.set(a, new_i);
                    }
                }
            }
        }
    }

    let deadly: [string, string][] = [];
    for (let [aler, ingre] of alergen_to_ingre) {
        if (ingre.length === 1) {
            deadly.push([aler, ingre[0]]);
        }
    }
    deadly.sort((lhs, rhs) => stringCompare(lhs[0], rhs[0]));

    let part1 = 0;
    for (let line of input) {
        let match = REGEX.exec(line)!;
        let ingredients = match[1].split(' ').filter(x => x);
        let aler = match[2].split(', ');

        for (let ingredient of ingredients) {
            if (!deadly.some((x) => x[1] === ingredient)) {
                part1++;
            }
        }
    }

    return { part1: String(part1), part2: deadly.map(x => x[1]).join(',') };
}
