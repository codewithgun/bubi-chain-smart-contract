"use strict";
function init(bar) {
    Chain.store("address", bar);
    Chain.store("count", "5");
    return;
}

function main(input) {
    // if (Number(input) > 0) {
    //     Chain.store("count", input);
    //     return;
    // }
    // let count = Number(Chain.load("count"));
    // if (count > 0) {
    // Chain.store("count", String(count - 1));
    // Chain.contractCall(Chain.load("address"), true, "0", "");
    // }
    let count = Number(Chain.load("count"));
    Chain.tlog("count", count);
    if (Number(input) !== 1) {
        Chain.store("count", String(count - 1));
        Chain.contractCall(Chain.load("address"), true, "0", "");
    } else {
        Chain.store("count", String(count - 1));
    }
}

function query(input) {
    return input;
}
