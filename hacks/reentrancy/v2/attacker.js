"use strict";
function init(address) {
    Chain.store("address", address);
    Chain.store("count", "2");
    return;
}

function main(input) {
    let count = Number(Chain.load("count"));
    if (count > 0) {
        let victim = Chain.load("address");
        count = count - 1;
        let shouldRecall = count === 0 ? "0" : "1";
        Chain.store("count", String(count));
        Chain.contractCall(victim, true, "0", shouldRecall);
    }
}

function query(input) {
    return input;
}
