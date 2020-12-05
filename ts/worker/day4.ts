import { AdventOutput } from '../common/common';

let PASSPORT_REGEX = /(?: ?(\w+):((?:\w|\d|#)+)\n?)|\n|$/y;
let YEAR_REGEX = /^\d{4}$/;
let HEIGHT_REGEX = /^(\d+)(in|cm)$/;
let HAIR_COLOR_REGEX = /^#(?:\d|[a-f]){6}$/;
let EYE_COLOR_REGEX = /^(?:(?:amb)|(?:blu)|(?:brn)|(?:gry)|(?:grn)|(?:hzl)|(?:oth))$/
let PASSPORT_ID_REGEX = /^\d{9}$/

function validateYear(year: string, low_bound: number, high_bound: number): boolean {
    if (!YEAR_REGEX.test(year)) {
        return false;
    }
    let year_num = Number(year);
    return year_num >= low_bound && year_num <= high_bound;
}

export default function (raw_input: readonly string[]): AdventOutput {
    let input = raw_input.join('\n');
    let required_fields: [string, (str: string) => boolean][] = [
        ['byr', year => validateYear(year, 1920, 2002)], 
        ['iyr', year => validateYear(year, 2010, 2020)], 
        ['eyr', year => validateYear(year, 2020, 2030)], 
        ['hgt', height => {
            let match = HEIGHT_REGEX.exec(height);
            if (!match) {
                return false;
            }
            let height_num = Number(match[1]);
            if (match[2] === 'cm') {
                return height_num >= 150 && height_num <= 193;
            } else {
                return height_num >= 59 && height_num <= 76;
            }
        }],
        ['hcl', color => HAIR_COLOR_REGEX.test(color)], 
        ['ecl', color => EYE_COLOR_REGEX.test(color)], 
        ['pid', id => PASSPORT_ID_REGEX.test(id)]
    ];
    let part1 = 0;
    let part2 = 0;
    PASSPORT_REGEX.lastIndex = 0;
    let match = PASSPORT_REGEX.exec(input);
    let part1_curr_fields = required_fields.map(() => false);
    let part2_curr_fields = required_fields.map(() => false);
    while (match) {
        if (match[0] === '\n' || match[0] === '') {
            if (part1_curr_fields.every(x => x)) {
                part1++;
            }
            part1_curr_fields = required_fields.map(() => false);
            if (part2_curr_fields.every(x => x)) {
                part2++;
            }
            part2_curr_fields = required_fields.map(() => false);
        }
        if (match[0] === '') {
            break;
        }
        let field = required_fields.findIndex(x => x[0] === match![1]);
        if (field !== -1) {
            part1_curr_fields[field] = true;
            part2_curr_fields[field] = required_fields[field][1](match[2]);
        }

        match = PASSPORT_REGEX.exec(input);
    }
    if (!match) {
        throw 'Input error';
    }
    return {part1: String(part1), part2: String(part2)};
}
