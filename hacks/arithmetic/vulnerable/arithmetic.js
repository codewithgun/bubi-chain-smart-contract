"use strict";
// A simple Timelock contract

function init(bar) {
    return;
}

function buildTimelockKey(address) {
    return `tlk_${address}`;
}

function buildBalanceKey(address) {
    return `bk_${address}`;
}

function deposit() {
    Utils.assert(Chain.msg.coinAmount > 0, "Must > 0");
    Chain.store(buildTimelockKey(Chain.tx.initiator), String(Chain.block.timestamp + 7 * 86400 * 1000000)); // convert to microseconds
    let userBalanceKey = buildBalanceKey(Chain.tx.initiator);
    let previousBalance = Number(Chain.load(userBalanceKey));
    Chain.store(userBalanceKey, String(previousBalance + Number(Chain.msg.coinAmount)));
    Chain.tlog("deposit", Chain.tx.initiator, Chain.msg.coinAmount, Chain.block.timestamp);
}

function assertUserDeposited() {
    let deposited = Chain.load(buildBalanceKey(Chain.tx.initiator));
    Utils.assert(Number(deposited) > 0, "No deposit amount");
}

function assertTimelockExpired() {
    let timeLock = Chain.load(buildTimelockKey(Chain.tx.initiator));
    Utils.assert(Chain.block.timestamp > Number(timeLock), "Locked");
}

function increaseTimelock(seconds) {
    assertUserDeposited();
    Utils.assert(seconds > 0, "Seconds must > 0");
    let prevTimelock = Number(Chain.load(buildTimelockKey(Chain.tx.initiator)));
    let latestTimelock = prevTimelock + seconds * 1000000;
    Chain.store(buildTimelockKey(Chain.tx.initiator), String(latestTimelock));
    Chain.tlog("increaseTimelock", Chain.tx.initiator, latestTimelock, Chain.block.timestamp);
}

function withdraw() {
    assertTimelockExpired();
    assertUserDeposited();
    let balanceKey = buildBalanceKey(Chain.tx.initiator);
    let userBalance = Chain.load(balanceKey);
    Chain.payCoin(Chain.tx.initiator, userBalance, "{}");
    Chain.del(balanceKey);
    Chain.tlog("withdraw", Chain.tx.initiator, userBalance, Chain.block.timestamp);
}

function main(input) {
    let para = JSON.parse(input);
    switch (para.method) {
        case "deposit":
            deposit();
            break;
        case "increaseTimelock":
            increaseTimelock(para.input.seconds);
            break;
        case "withdraw":
            withdraw();
            break;
    }
}

/** Not working */
function query(input) {
    switch (input) {
        case "timeLock":
            return Chain.load(buildTimelockKey(Chain.msg.initiator));
        case "balance":
            return Chain.load(buildBalanceKey(Chain.msg.initiator));
    }
}
