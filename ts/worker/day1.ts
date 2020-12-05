import { AdventOutput } from '../common/common';

export default function(input: readonly string[]): AdventOutput {
    let part1 = null;
    for (let i = 0; i < input.length; i++) {
        for (let j = i + 1; j < input.length; j++) {
            let a = Number(input[i]);
            let b = Number(input[j]);
            if (a + b === 2020) {
                part1 = a * b; 
            }
        }
    }
    let part2 = null;
    for (let i = 0; i < input.length; i++) {
        for (let j = i + 1; j < input.length; j++) {
            for (let z = j + 1; z < input.length; z++) {
                let a = Number(input[i]);
                let b = Number(input[j]);
                let c = Number(input[z]);
                if (a + b + c === 2020) {
                    part2 = a * b * c; 
                }
            }
        }
    }
    return {part1: String(part1), part2: String(part2)};
}
