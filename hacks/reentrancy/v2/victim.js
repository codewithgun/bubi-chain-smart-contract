"use strict";
function init(bar) {
    return;
}

function main() {
    Chain.contractCall(Chain.msg.sender, true, "0", "1");
}

function query(input) {
    return input;
}
