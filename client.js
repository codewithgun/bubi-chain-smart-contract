const BubiChainSDK = require("bubichain-sdk-nodejs");

const sdk = new BubiChainSDK({
    host: "seed1-node.bubi.cn"
});

const account = {
    privateKey: "privbvScctdKqPfhqfW7uSL1dPKnJLuFapjAbJKHYePAq4ttEzMqeqBZ",
    publicKey: "b001ba34f0c4efc95d8ede451ca19518edb88cadbc9201c4d78dc8bb9882b87a86a2764fcf11",
    address: "adxSa8aXpw4XDkFPwJZML1aXGsw1m68Utdi3J"
};

const activeAcc = sdk.operation.accountActivateOperation({
    sourceAddress: "adxSa8aXpw4XDkFPwJZML1aXGsw1m68Utdi3J",
    destAddress: "adxSorN8HvjGBqr5m9CyYPMMX5Q8nf7nyR2Hi",
    initBalance: "5000000000",
    metadata: "Create account"
});

const blobInfo = sdk.transaction.buildBlob({
    sourceAddress: "adxSa8aXpw4XDkFPwJZML1aXGsw1m68Utdi3J",
    nonce: "4",
    gasPrice: "1000",
    feeLimit: "10000000000",
    operations: [activeAcc.result.operation]
});

const signatureInfo = sdk.transaction.sign({
    privateKeys: [account.privateKey],
    blob: blobInfo.result.transactionBlob
});

// console.log(signatureInfo.result.signatures);
// console.log(blobInfo);

sdk.transaction
    .submit({
        blob: blobInfo.result.transactionBlob,
        signature: signatureInfo.result.signatures
    })
    .then(console.log)
    .catch(console.error);
