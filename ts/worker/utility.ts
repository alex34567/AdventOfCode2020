export interface Arrayish<T> extends Iterable<T> {
    [index: number] : T;
    readonly length: number; 
}

export function reverseSubarray<T>(array: Arrayish<T>, begin: number, end: number): void {
    end--;
    while (begin < end) {
        let tmp = array[begin];
        array[begin] = array[end];
        array[end] = tmp;
        begin++;
        end--;
    }
}

export function nextPermutation<T>(array: Arrayish<T>, compare: (lhs: T, rhs: T) => number): boolean {
    let k;
    for (k = array.length - 2; k >= 0; k--) {
        if (compare(array[k], array[k + 1]) < 0) {
            break;
        }
    }
    if (k < 0) {
        return false;
    }
    let i;
    for (i = array.length - 1; i > k; i--) {
        if (compare(array[k], array[i]) < 0) {
            break;
        }
    }
    let tmp = array[k];
    array[k] = array[i];
    array[i] = tmp;
    reverseSubarray(array, k + 1, array.length);
    return true;
}

export class CombinationSelector {
    #indexes: number[] = [];

    constructor(choose: number) {
        for (let i = 0; i < choose; i++) {
            this.#indexes.push(i);
        }
    }

    // From compprog.wordpress.com/2007/10/17/generating-combinations-1/
    nextCombination<T>(input: T[]): T[] | null {
        let n = input.length;
        let k = this.#indexes.length;
        let i = k - 1;
        this.#indexes[i]++;
        while (i >= 0 && this.#indexes[i] >= n - k + 1 + i) {
            i--;
            this.#indexes[i]++;
        }

        if (this.#indexes[0] > n - k) {
            return null;
        }

        for (i = i + 1; i < k; i++) {
            this.#indexes[i] = this.#indexes[i - 1] + 1;
        }

        return this.#indexes.map(val => input[val]);
    }
}

type ArrayConstructor<T> = (buffer: ArrayBuffer, length: number) => T;

interface TypedArray extends Arrayish<number> {
    readonly buffer: ArrayBuffer,
}

class InternalTypedVector<T extends TypedArray> {
    #array_constructor: ArrayConstructor<T>;
    #data: T;
    #length: number = 0;
    constructor(array_constructor: ArrayConstructor<T>) {
        this.#array_constructor = array_constructor;
        this.#data = this.#array_constructor(new ArrayBuffer(0), 0);
    }

    get length(): number {
        return this.#length;
    }

    get capacity(): number {
        return this.#data.length;
    }

    get view(): T {
        return this.#array_constructor(this.#data.buffer, this.length);
    }

    get(index: number): number {
        if (index >= this.length) {
            throw new RangeError();
        }
        return this.#data[index];
    }

    set(index: number, value: number): void {
        if (index >= this.length) {
            throw new RangeError();
        }
        this.#data[index] = value;
    }

    push(value: number): void {
        if (this.length == this.capacity) {
            let new_capacity = this.capacity * 2;
            if (new_capacity == 0) {
                new_capacity = 1;
            }
            this.reserve(new_capacity);
        }
        this.#data[this.length] = value;
        this.#length++;
    }

    pop(): number {
        if (this.length == 0) {
            throw 'Poped an empty vector.';
        }
        this.#length--;
        return this.#data[this.length];
    }

    reserve(new_capacity: number): void {
        if (new_capacity <= this.capacity) {
            return;
        }
        this.resize(new_capacity);
    }
    
    compact(): void {
        this.resize(this.length);
    }

    clear(): void {
        this.#length = 0;
    }

    private resize(new_capacity: number): void {
        if (new_capacity <= this.length) {
            return;
        }
        let arr_cons = this.#array_constructor;
        let new_buffer = new ArrayBuffer(new_capacity * (this.#data as any).constructor.BYTES_PER_ELEMENT);
        let new_data = arr_cons(new_buffer, new_capacity);
        for (let i = 0; i < this.length; i++) {
            new_data[i] = this.#data[i];
        }
        this.#data = new_data;
    }

    [Symbol.iterator](): Iterator<number> {
        return this.view[Symbol.iterator]();
    }
}

export interface TypedVector<T> extends Iterable<number> {
    length: number;
    capacity: number;
    view: T;

    get(index: number): number;
    set(index: number, value: number): void;
    push(value: number): void;
    pop(): number;
    clear(): void;
    compact(): void;
    reserve(count: number): void;
}

export function Uint8Vector(): TypedVector<Uint8Array> {
    let ret = new InternalTypedVector(
        (buffer, length) => new Uint8Array(buffer, 0, length));
    return ret;
}

export function Uint16Vector(): TypedVector<Uint16Array> {
    let ret = new InternalTypedVector(
        (buffer, length) => new Uint16Array(buffer, 0, length));
    return ret;
}

export function Uint32Vector(): TypedVector<Uint32Array> {
    let ret = new InternalTypedVector(
        (buffer, length) => new Uint32Array(buffer, 0, length));
    return ret;
}

export function powMod(base: number, exponent: number, mod: number): number;
export function powMod(base: bigint, exponent: bigint, mod: bigint): bigint;
export function powMod(base: any, exponent: any, mod: any): any {
    base %= mod;
    let res: any;
    let two: any;
    let one: any;
    if (typeof base === 'number') {
        res = 1;
        two = 2;
        one = 1; 
    } else {
        res = 1n;
        two = 2n;
        one = 1n;
    }
    while (exponent > 0) {
        if (exponent % two === one) {
            res = (res * base) % mod;
        }
        exponent /= two;
        if (typeof exponent === 'number') {
            exponent = Math.floor(exponent);
        }
        base = (base * base) % mod;
    }
    return res;
}

// Mod must be prime!
export function modInvert(num: number, mod: number): number;
export function modInvert(num: bigint, mod: bigint): bigint;
export function modInvert(num: any, mod: any): any {
    let modMinusTwo;
    if (typeof mod === 'bigint') {
        modMinusTwo = mod - 2n;
    } else {
        modMinusTwo = mod - 2;
    }
    return powMod(num, modMinusTwo as any, mod);
}

export function arrayCompare<T>(lhs: Arrayish<T>, rhs: Arrayish<T>, compare_fun: (lhs: T, rhs: T) => number) {
    let limit = Math.min(lhs.length, rhs.length);
    for (let i = 0; i < limit; i++) {
        let compare = compare_fun(lhs[i], rhs[i]);
        if (compare !== 0) {
            return compare;
        }
    }
    return lhs.length - rhs.length;

}

export function numArrayCompare(lhs: Arrayish<number>, rhs: Arrayish<number>): number {
    return arrayCompare(lhs, rhs, (lhs, rhs) => lhs - rhs);
}

export function stringCompare(lhs: string, rhs: string): number {
    return arrayCompare(lhs, rhs, (lhs, rhs) => lhs.charCodeAt(0) - rhs.charCodeAt(0));
}

export function reverseString(str: string): string {
    let ret = '';
    for (let i = str.length - 1; i >= 0; i--) {
        let raw_char = str.charCodeAt(i);
        if (raw_char >= 0xDC00 && raw_char <= 0xDFFF) {
            throw 'Unicode error';
        }
        ret += str[i];
    }

    return ret;
}

