"use strict";
// A simple Timelock contract
const MICROSECOND_PER_DAY = 604800000000;

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
    let timeLock = Utils.int64Add(Chain.block.timestamp, MICROSECOND_PER_DAY);
    Chain.store(buildTimelockKey(Chain.tx.initiator), timeLock);
    let userBalanceKey = buildBalanceKey(Chain.tx.initiator);
    let previousBalance = Chain.load(userBalanceKey) || "0";
    Chain.store(userBalanceKey, Utils.int64Add(previousBalance, Chain.msg.coinAmount));
    Chain.tlog("deposit", Chain.tx.initiator, Chain.msg.coinAmount);
}

function assertUserDeposited() {
    let deposited = Chain.load(buildBalanceKey(Chain.tx.initiator)) || "0";
    Utils.assert(Utils.int64Compare(deposited, 0) === 1, "No deposit amount");
}

function assertTimelockExpired() {
    let timeLock = Chain.load(buildTimelockKey(Chain.tx.initiator)) || "0";
    Utils.assert(Utils.int64Compare(Chain.block.timestamp, timeLock) === 1, "Locked");
}

function increaseTimelock(seconds) {
    assertUserDeposited();
    Utils.assert(Utils.stoI64Check(seconds) && Utils.int64Compare(seconds, 0) === 1, "Seconds must > 0");
    let prevTimelock = Chain.load(buildTimelockKey(Chain.tx.initiator)) || "0";
    let latestTimelock = Utils.int64Add(prevTimelock, seconds * 1000000);
    Chain.store(buildTimelockKey(Chain.tx.initiator), latestTimelock);
    Chain.tlog("increaseTimelock", Chain.tx.initiator, latestTimelock);
}

function withdraw() {
    assertTimelockExpired();
    assertUserDeposited();
    let balanceKey = buildBalanceKey(Chain.tx.initiator);
    let timeLockKey = buildTimelockKey(Chain.tx.initiator);
    let userBalance = Chain.load(balanceKey);
    Chain.payCoin(Chain.tx.initiator, userBalance, "{}");
    Chain.del(balanceKey);
    Chain.del(timeLockKey);
    Chain.tlog("withdraw", Chain.tx.initiator, userBalance);
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
