"use strict";
function init(bar) {
    return;
}

function main(recall) {
    if (Number(recall) === 1) {
        Chain.contractCall(Chain.msg.sender, true, "0", "{}");
    }
}

function query(input) {
    return input;
}
