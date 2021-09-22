"use strict";
function init(bar) {
    /*init whatever you want*/
    return;
}

/**
 *
 * @returns {number}
 */
function getPreviousBalance() {
    return Chain.load(`blk_${Chain.msg.sender}`) || 0;
}

function assertDeposited() {
    Utils.assert(getPreviousBalance() > 0, "no deposit");
}

function saveBalance(latestBalance) {
    Chain.store(`blk_${Chain.msg.sender}`, String(latestBalance));
}

function deposit() {
    let previousBalance = getPreviousBalance();
    saveBalance(Utils.int64Add(previousBalance, Chain.msg.coinAmount));
    Chain.tlog("deposit", Chain.msg.sender, Chain.msg.coinAmount);
}

function withdrawWithCharges(amount) {
    return Utils.int64Div(Utils.int64Mul(amount, 997), 1000); // 0.003 = 0.3% fee
}

function withdraw(amount) {
    assertDeposited();
    let balance = getPreviousBalance();
    Utils.assert(Utils.int64Compare(getPreviousBalance(), amount) === 1 || Utils.int64Compare(getPreviousBalance(), amount) === 0, "insufficient balance");
    let withdrawalWithFee = withdrawWithCharges(amount);
    Chain.payCoin(Chain.msg.sender, withdrawalWithFee);
    // Assume allow contract integration
    // Reentrancy attack
    if (Chain.getContractProperty(Chain.msg.sender).length > 0) {
        Chain.contractCall(Chain.msg.sender, true, "0", "{}");
    }
    saveBalance(Utils.int64Sub(balance, amount));
    Chain.tlog("withdraw", Chain.msg.sender, amount, withdrawalWithFee);
}

function main(input) {
    let _input = JSON.parse(input);
    if (_input.method) {
        switch (_input.method) {
            case "deposit":
                Utils.assert(Utils.int64Compare(Chain.msg.coinAmount, 0) === 1, "no deposit amount");
                deposit();
                break;
            case "withdraw":
                Utils.assert(typeof _input.param.amount === "string" && Utils.stoI64Check(_input.param.amount), "invalid amount");
                withdraw(_input.param.amount);
                break;
        }
    }
}

function query(_input) {
    // let input = JSON.parse(_input);
    // switch (input.type) {
    //     case "tx":
    //         return Chain.tx[input.value];
    //     case "msg":
    //         return Chain.msg[input.value];
    // }
    return _input;
}
