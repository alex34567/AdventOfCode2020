declare function require(reques: [String]): void;
declare namespace require {
    function config(o: object): void;
}

require.config({
    baseUrl: 'ts',
});

require(['web/main'])
