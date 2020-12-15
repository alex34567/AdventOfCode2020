import { AdventOutput } from '../common/common';

let MASK_REGEX = /^mask = ((?:X|0|1){36})$/;
let MEM_REGEX = /^mem\[(\d+)\] = (\d+)$/;

function calcPart1(input: readonly string[]): string {
    let ram = new Map<number, bigint>();
    let backup_mask = 0n;
    let change_mask = 0n;
    for (let ins of input) {
        let mask_match = MASK_REGEX.exec(ins);
        let mem_match = MEM_REGEX.exec(ins); 
        if (mask_match) {
            let raw_backup = mask_match[1]
                .replace(/1/g, '0')
                .replace(/X/g, '1');
            backup_mask = BigInt(Number.parseInt(raw_backup, 2));
            let raw_change = mask_match[1]
                .replace(/X/g, '0');
            change_mask = BigInt(Number.parseInt(raw_change, 2));
        } else if (mem_match) {
            let value = BigInt(mem_match[2]);
            value &= backup_mask;
            value |= change_mask;
            ram.set(Number(mem_match[1]), value);
        } else {
            throw 'Input error';
        }
    }

    let part1 = 0n;
    for (let value of ram.values()) {
        part1 += value;
    }

    return String(part1);
}

function calcPart2(input: readonly string[]): string {
    let ram = new Map<bigint, bigint>();
    let float_mask = 0n;
    let set_mask = 0n;

    for (let ins of input) {
        let mask_match = MASK_REGEX.exec(ins);
        let mem_match = MEM_REGEX.exec(ins); 
        if (mask_match) {
            let raw_float = mask_match[1]
                .replace(/1/g, '0')
                .replace(/X/g, '1');
            float_mask = BigInt(Number.parseInt(raw_float, 2));
            let raw_set = mask_match[1]
                .replace(/X/g, '0');
            set_mask = BigInt(Number.parseInt(raw_set, 2));
        } else if (mem_match) {
            let addr = BigInt(mem_match[1]);
            addr |= set_mask;
            addr &= ~float_mask;
            let all_set = addr | float_mask;
            let value = BigInt(mem_match[2]);
            ram.set(addr, value);
            while (addr !== all_set) {
                let curr_bit = 1n;
                while (true) {
                    if (curr_bit & float_mask) {
                        if (!(curr_bit & addr)) {
                            addr |= curr_bit;
                            break;
                        } else {
                            addr &= ~curr_bit;
                        }
                    }
                    curr_bit <<= 1n;
                }
                ram.set(addr, value);
            }
        } else {
            throw 'Input error';
        }
    }

    let part2 = 0n;
    for (let value of ram.values()) {
        part2 += value;
    }

    return String(part2);
}

export default function (input: readonly string[]): AdventOutput {
    return { part1: calcPart1(input), part2: calcPart2(input) };
}
