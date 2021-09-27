/**
 * @typedef {{ balance: string, nonce: string, mnemonic: string, privateKey: string, wif: string, publicKey: string, address: string }} Wallet
 */
const BubiChainSDK = require("bubichain-sdk-nodejs");
const Wallet = require("./wallet");

const sdk = new BubiChainSDK({
    host: "seed1-node.bubi.cn"
});

async function getFullWallet() {
    let wallet = await Wallet.getInfo();
    let sourceAccount = await sdk.account.getInfo(wallet.address);
    if (sourceAccount.result) {
        const { balance, nonce } = sourceAccount.result;
        return {
            ...wallet,
            balance,
            nonce
        };
    } else {
        throw new Error("Wallet address not created on the blockchain");
    }
}

async function start() {
    let myWallet = await getFullWallet();
    const amount = "1000000000";
    const destination = await sdk.account.create().then((res) => res.result.address);
    let hash = await transfer(myWallet, amount, destination || "adxSa8aXpw4XDkFPwJZML1aXGsw1m68Utdi3J");
    console.log(`https://explorer.bubi.cn/tx/${hash}`);
}

function throwIfError(obj) {
    if (obj.errorDesc) {
        throw new Error(obj.errorDesc);
    }
}

/**
 * @param {Wallet} wallet
 * @param {string} amount
 * @param {string} destination
 */
async function transfer(wallet, amount, destination) {
    let receiver = await sdk.account.getInfo(destination);
    let operations = [];
    if (!receiver.result) {
        let activateAccountOperation = sdk.operation.accountActivateOperation({
            destAddress: destination,
            initBalance: amount
        });
        throwIfError(activateAccountOperation);
        operations.push(activateAccountOperation.result.operation);
    } else {
        let buSendOperation = sdk.operation.buSendOperation({
            destAddress: destination,
            buAmount: amount
        });
        throwIfError(buSendOperation);
        operations.push(buSendOperation.result.operation);
    }

    const estimateFee = await sdk.transaction.evaluateFee({
        sourceAddress: wallet.address,
        nonce: String(Number(wallet.nonce) + 1),
        operations
    });
    throwIfError(estimateFee);

    const blobInfo = sdk.transaction.buildBlob({
        sourceAddress: wallet.address,
        gasPrice: estimateFee.result.gasPrice,
        feeLimit: estimateFee.result.feeLimit,
        nonce: String(Number(wallet.nonce) + 1),
        operations
    });
    throwIfError(blobInfo);

    const signatureInfo = sdk.transaction.sign({
        privateKeys: [wallet.wif],
        blob: blobInfo.result.transactionBlob
    });
    throwIfError(signatureInfo);

    let res = await sdk.transaction.submit({
        blob: blobInfo.result.transactionBlob,
        signature: signatureInfo.result.signatures
    });

    throwIfError(res);
    wallet.nonce = String(Number(wallet.nonce) + 1);
    return res.result.hash;
}

start();
