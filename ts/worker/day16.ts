import { AdventOutput } from '../common/common';

let RULE_REGEX = /^((?: |\w)+): (\d+)-(\d+) or (\d+)-(\d+)$/;

class Range {
    start: number;
    end: number;

    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }
}

export default function (raw_input: readonly string[]): AdventOutput {
    let sections = raw_input.join('\n').split('\n\n');
    let raw_rules = sections[0].split('\n');
    let rules: [string, [Range, Range]][] = [];
    for (let raw_rule of raw_rules) {
        let match = RULE_REGEX.exec(raw_rule);
        if (!match) {
            throw 'Input error';
        }
        rules.push([match[1], [new Range(Number(match[2]), Number(match[3])),
                   new Range(Number(match[4]), Number(match[5]))]]);
    }
    
    let raw_nearby = sections[2].split('\n');
    raw_nearby.shift();
    let nearby = raw_nearby.map(x => x.split(',').map(y => Number(y)));
    let part1 = 0;
    function ticket_filter(ticket: number[]) {
        let tick_valid = true;
        for (let field of ticket) {
            let valid = false;
            for (let rule of rules) {
                for (let range of rule[1]) {
                    if (field >= range.start && field <= range.end) {
                        valid = true;
                        break;
                    }
                }
                if (valid) {
                    break;
                }
            }
            if (!valid) {
                part1 += field;
                tick_valid = false;
            }
        }
        return tick_valid;
    }
    let good_tickets = nearby.filter(ticket_filter);
    let my_ticket = sections[1].split('\n')[1].split(',').map(x => Number(x));

    let mapping = [];
    for (let i = 0; i < rules.length; i++) {
        let possible = [];
        for (let j = 0; j < rules.length; j++) {
            possible.push(j);
        }
        mapping.push(possible);
    }
    for (let ticket of good_tickets) {
        for (let i = 0; i < ticket.length; i++) {
            let field = ticket[i];
            mapping[i] = mapping[i].filter(x => {
                for (let range of rules[x][1]) {
                    if (field >= range.start && field <= range.end) {
                        return true;
                    }
                }
                return false;
            });
        }
    }

    let reduced;
    do {
        reduced = [];
        for (let i = 0; i < mapping.length; i++) {
            if (mapping[i].length === 1) {
                reduced.push(mapping[i][0]);
            }
        }
        for (let index of reduced) {
            for (let i = 0; i < mapping.length; i++) {
                if (mapping[i].length === 1 && mapping[i][0] === index) {
                    continue;
                }
                mapping[i] = mapping[i].filter(x => x !== index);
            }
        }
    } while (reduced.length !== mapping.length);
    
    let part2 = 1;
    for (let i = 0; i < my_ticket.length; i++) {
        if (rules[reduced[i]][0].startsWith('departure')) {
            part2 *= my_ticket[reduced[i]];
        }
    }
    return { part1: String(part1), part2: String(part2) };
}
