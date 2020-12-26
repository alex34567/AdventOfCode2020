import { AdventOutput } from '../common/common';
import { powMod } from 'utility';

export default function (input: readonly string[]): AdventOutput {
    let mod = 20201227;
    let public_a = Number(input[0]) % mod;
    let public_b = Number(input[1]) % mod;

    let loop_a = 0;
    let current_a = 1;

    while (current_a !== public_a) {
        current_a *= 7;
        current_a %= mod;
        loop_a++;
    }

    let encrypt_a = powMod(public_b, loop_a, mod);

    return { part1: String(encrypt_a) };
}
