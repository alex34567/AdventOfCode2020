import { AdventOutput } from '../common/common';

function indexInc(init: number): (peek: boolean) => number {
    let index = 0
    return (peek) => {
        if (peek) {
            return index;
        }
        return index++;
    }
}

function parseInput(input: readonly string[], part2: boolean): string {
    let ans = 0;
    for (let line of input) {
        let tokens = line.split(/(\(|\)|\+|\*)| /g).filter(x => x);
        tokens.push(')');
        function eval_expr(index: (peek: boolean) => number, tokens: String[], add_first: boolean): number {
            function get_num() {
                let raw = tokens[index(false)];
                if (raw === '(') {
                    return eval_expr(index, tokens, add_first);
                } else {
                    return Number(raw);
                }
            }
            let acc = get_num();
            let new_tokens = [];
            
            while (true) {
                let op = tokens[index(false)];
                if (op === ')') {
                    if (add_first) {
                        new_tokens.push(String(acc), ')');
                        return eval_expr(indexInc(0), new_tokens, false);
                    }
                    return acc;
                }
                let arg = get_num();
                switch (op) {
                    case '+':
                        acc += arg;
                        break;
                    case '*':
                        if (add_first) {
                            new_tokens.push(String(acc), '*');
                            acc = arg;
                        } else {
                            acc *= arg;
                        }
                        break;
                }
            }

        }
        ans += eval_expr(indexInc(0), tokens, part2);
    }
    return String(ans);
}

export default function (input: readonly string[]): AdventOutput {
    return { part1: parseInput(input, false), part2: parseInput(input, true) };
}
