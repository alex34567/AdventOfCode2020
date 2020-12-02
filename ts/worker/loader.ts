declare function require(reques: [String]): void;
declare namespace require {
    function config(o: object): void;
}

importScripts('../../js/require.js');

(() => {

    let url = new URL(location.href);
    let script_name_loc = url.pathname.lastIndexOf('/');
    url.pathname = url.pathname.substring(0, script_name_loc);

    require.config({
        baseUrl: url.href
    })
    require(['worker'])
})()
