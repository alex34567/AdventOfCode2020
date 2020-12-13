import { AdventOutput } from '../common/common';
import { modInvert } from 'utility';

export default function (input: readonly string[]): AdventOutput {
    let earlyist_depart = Number(input[0]);
    let bus_ids = input[1].split(',').map(x => {
        if (x === 'x') {
            return 1;
        }
        else {
            return Number(x);
        }
    });
    let best_delta = Infinity;
    let best_id = Infinity;
    for (let id of bus_ids) {
        if (id === 1) {
            continue;
        }
        let depart_delta = id - (earlyist_depart % id);
        if (depart_delta < best_delta) {
            best_delta = depart_delta;
            best_id = id;
        }
    }
    let part1 = String(best_delta * best_id);
    let part2 = 0n;
    let base = bus_ids.reduce((acc, val) => acc * BigInt(val), 1n);

    for (let depart_delta = 0; depart_delta < bus_ids.length; depart_delta++) {
        let id = BigInt(bus_ids[depart_delta]);
        let base_divided_by_curr = base / id;
        let inverse_base = modInvert(base_divided_by_curr, id);
        let mod_target = id - BigInt(depart_delta) % id;
        part2 += mod_target * inverse_base * base_divided_by_curr;
        part2 %= base;
    }

    return { part1, part2: String(part2) };
}
