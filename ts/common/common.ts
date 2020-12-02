export interface AdventWorkerJob {
    readonly input: string;
    readonly dayN: number;
}

export type AdventRes = AdventOutput | AdventErr;

export function adventResIsOk(res: AdventRes): res is AdventOutput {
    return !('message' in res);
}

export function adventResIsErr(res: AdventRes): res is AdventErr {
    return 'message' in res;
}

export interface AdventOutput {
    readonly part1: string;
    readonly part2?: string;
}

export interface AdventErr {
    readonly message: string;
}
