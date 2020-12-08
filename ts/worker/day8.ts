import { AdventOutput } from '../common/common';

class Registers {
    acc: number = 0;
    pc: number = 0;
}

type AsmIns = (regs: Registers) => void;
type AsmCons = (arg: number) => (regs: Registers) => void;

function Nop(): AsmIns {
    return regs => regs.pc++;
}

function Acc(arg: number): AsmIns {
    return regs => {
        regs.acc += arg;
        regs.pc++;
    }
}

function Jmp(arg: number): AsmIns {
    return regs => {
        regs.pc += arg;
    }
}

let ASM_INS = new Map<string, [AsmCons, AsmCons]> ([
    ['nop', [Nop, Jmp]],
    ['acc', [Acc, Acc]],
    ['jmp', [Jmp, Nop]],
]);

let REGEX = /((?:nop)|(?:acc)|(?:jmp)) ((?:\+|-)\d+)/;

export default function (input: readonly string[]): AdventOutput {
    let program: [(regs: Registers) => void, (regs: Registers) => void, boolean][] = [];
    for (let raw_ins of input) {
        let match = REGEX.exec(raw_ins);
        if (!match) {
            throw 'Input error';
        }
        let opcode_with_patch = ASM_INS.get(match[1]);
        if (!opcode_with_patch) {
            throw 'Missing instruction?';
        }
        let [opcode, patch] = opcode_with_patch;
        let arg = Number(match[2]);
        program.push([opcode(arg), patch(arg), false]);
    }
    let regs = new Registers();
    while (true) {
        if (program[regs.pc][2]) {
            break;
        }
        program[regs.pc][2] = true;
        program[regs.pc][0](regs);
    }
    let part1 = String(regs.acc);
    let part2 = null;
    for (let patch = 0; patch < program.length; patch++) {
        for (let ins of program) {
            ins[2] = false;
        }
        regs.acc = 0;
        regs.pc = 0;
        while (regs.pc < program.length) {
            if (program[regs.pc][2]) {
                break;
            }
            program[regs.pc][2] = true;
            let ins = program[regs.pc][0]
            if (patch === regs.pc) {
                ins = program[regs.pc][1]
            }
            ins(regs);
        }
        if (regs.pc >= program.length) {
            part2 = regs.acc;
            break;
        }
    }
    
    return { part1, part2: String(part2) };
}
