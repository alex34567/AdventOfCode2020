import { AdventOutput } from '../common/common';

abstract class Rule {
    abstract toRegex(): string;
}

class ConstRule extends Rule {
    rule: string;

    constructor(rule: string) {
        super();
        this.rule = rule;
    }

    toRegex(): string {
        return this.rule;
    }
}

class SelectRule extends Rule {
    rules: Rule[] = [];

    toRegex(): string {
        return this.rules.reduce((acc, val, index) => {
            if (index !== 0) {
                acc += '|';
            }
            return acc + val.toRegex();
        }, '(?:') + ')';
    }
}

class AndRule extends Rule {
    rules: Rule[] = [];

    toRegex(): string {
        return this.rules.reduce((acc, val, index) => {
            return acc + val.toRegex();
        }, '(?:') + ')';
    }
}

class Rule8 extends Rule {
    forty_two: Rule;

    constructor(forty_two: Rule) {
        super();
        this.forty_two = forty_two;
    }

    toRegex(): string {
        return '(?:' + this.forty_two.toRegex() + '+' + ')';
    }
}

class Rule11 extends Rule {
    forty_two: Rule;
    thirty_one: Rule;

    constructor(forty_two: Rule, thirty_one: Rule) {
        super();
        this.forty_two = forty_two;
        this.thirty_one = thirty_one;
    }

    toRegex(): string {
        let regex = '(?:';
        let forty_two = this.forty_two.toRegex();
        let thirty_one = this.thirty_one.toRegex();
        for (let i = 1; i <= 50; i++) {
            if (i !== 1) {
                regex += '|';
            }
            regex += '(?:';
            for (let j = 0; j < i; j++) {
                regex += forty_two;
            }
            for (let j = 0; j < i; j++) {
                regex += thirty_one;
            }
            regex += ')';
        }
        return regex + ')';
    }
}

class RuleBox extends Rule {
    rule?: Rule;

    toRegex(): string {
        return this.rule!.toRegex();
    }
}

function parseRule(rule: string, rule_map: Map<string, RuleBox>): Rule {
    let selections = rule.split(' | ');
    if (selections.length === 1) {
        let unions = selections[0].split(' ');
        if (unions.length === 1) {
            let rule = unions[0];
            if (rule[0] === '"') {
                return new ConstRule(rule.substring(1, rule.length - 1));
            }
            
            let rule_box = rule_map.get(rule);
            if (!rule_box) {
                rule_box = new RuleBox();
                rule_map.set(rule, rule_box);
            }
            return rule_box;
        }
        let and_rule = new AndRule();
        for (let union of unions) {
            and_rule.rules.push(parseRule(union, rule_map));
        }
        return and_rule;

    }
    let select_rule = new SelectRule();
    for (let selection of selections) {
        select_rule.rules.push(parseRule(selection, rule_map));
    }
    return select_rule;
}

function calcAns(input: readonly string[], part2: boolean): string {
    let sections = input.join('\n').split('\n\n');

    let rules = new Map<string, RuleBox>();

    for (let raw_rule of sections[0].split('\n')) {
        let [ident, rule_def] = raw_rule.split(': ');
        let rule = parseRule(rule_def, rules);
        let rule_box = rules.get(ident);
        if (!rule_box) {
            rule_box = new RuleBox();
            rules.set(ident, rule_box);
        }
        rule_box.rule = rule;
    }

    if (part2) {
        let forty_two = rules.get('42')!;
        let thirty_one = rules.get('31')!;
        rules.get('8')!.rule = new Rule8(forty_two);
        rules.get('11')!.rule = new Rule11(forty_two, thirty_one);
    }

    let regex = new RegExp('^' + rules.get('0')!.toRegex() + '$');

    let ans = 0;

    for (let str of sections[1].split('\n')) {
        if (regex.test(str)) {
            ans++;
        }
    }

    return String(ans);
}

export default function (input: readonly string[]): AdventOutput {
    return { part1: calcAns(input, false), part2: calcAns(input, true) };
}
