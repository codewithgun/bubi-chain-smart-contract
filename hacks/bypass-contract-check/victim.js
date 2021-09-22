"use strict";
function init(bar) {
    /*init whatever you want*/
    Chain.store("bypass", "false");
    return;
}

function main(input) {
    Utils.assert(Chain.getContractProperty(Chain.msg.sender).length === 0, "no contract allowed");
    Chain.store("bypass", "true");
}

function query(input) {
    return input;
}
