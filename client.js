const BubiChainSDK = require("bubichain-sdk-nodejs");

const sdk = new BubiChainSDK({
    host: "seed1-node.bubi.cn"
});
sdk.block.getNumber().then(console.log).catch(console.error);
// sdk.account.getInfo("adxSmFWcwWvmmg26UMQsaVmLhLfAoJzNdVaz5").then(console.log).catch(console.error);

return;

const account = {
    privateKey: "privBtfzgzM46jQcNhp11xHcVPfJm5NEkWKkr418FpkDHYMfEegqT1VQ",
    address: "adxSZCSQyxZpdnJG5ceasZcLdKwiaiWmiwL5Q"
};

// const account = {
//     privateKey: "privbyMWajpRJuQ9b6xRKLbutUaei2Go8RC1FBZKBFhbLHsroEmig9jc",
//     publicKey: "b0012a769cf4f6694549d44d30a383089fe186f2491a0dd9364f284800eceaca1b42bdfe58b7",
//     address: "adxSuYrFE75krqFRSif1wnWec7nv6p72Yoiid"
// };

const activeAcc = sdk.operation.accountActivateOperation({
    sourceAddress: "adxSuYrFE75krqFRSif1wnWec7nv6p72Yoiid",
    destAddress: "adxSu7ppttZEFXRY2EijjeA8D27jKQcBwxyGU",
    initBalance: "5000000000",
    metadata: "Create account"
});

const blobInfo = sdk.transaction.buildBlob({
    sourceAddress: "adxSuYrFE75krqFRSif1wnWec7nv6p72Yoiid",
    nonce: "1",
    gasPrice: "10000",
    feeLimit: "1000000",
    ceilLedgerSeq: "1",
    operations: [activeAcc.result.operation]
});

const signatureInfo = sdk.transaction.sign({
    privateKeys: [account.privateKey],
    blob: blobInfo.result.transactionBlob
});

console.log(signatureInfo);
// console.log(signatureInfo.result.signatures);
// sdk.account.create().then(console.log);

// sdk.transaction
//     .submit({
//         blob: blobInfo.result.transactionBlob,
//         signature: signatureInfo.result.signatures
//     })
//     .then(console.log)
//     .catch(console.error);
