const BubiChainSDK = require("bubichain-sdk-nodejs");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const sdk = new BubiChainSDK({
    host: "seed1-node.bubi.cn"
});

const owner = {
    privateKey: "privbvScctdKqPfhqfW7uSL1dPKnJLuFapjAbJKHYePAq4ttEzMqeqBZ",
    publicKey: "b001ba34f0c4efc95d8ede451ca19518edb88cadbc9201c4d78dc8bb9882b87a86a2764fcf11",
    address: "adxSa8aXpw4XDkFPwJZML1aXGsw1m68Utdi3J"
};

(async () => {
    let balanceResult = await fetch(`https://ide.bubi.cn/api/service/getBalance?address=${owner.address}`).then((res) => res.json());
    return;
    let ownerAccountDetails = await sdk.account.getInfo(owner.address);
    let nonce = String(Number(ownerAccountDetails.result.nonce) + 1);
    let sc = fs.readFileSync(path.resolve(__dirname, "dist", "certificate-checker-min.js"), "ascii");
    let account = await sdk.account.create();
    const bu = sdk.operation.contractCreateOperation({
        destAddress: account.result.address,
        initBalance: "10000000",
        type: 0,
        payload: sc
    });
    const blobInfo = sdk.transaction.buildBlob({
        sourceAddress: owner.address,
        gasPrice: "1000",
        feeLimit: "10010000000",
        nonce,
        operations: [bu.result.operation]
    });

    const signatureInfo = sdk.transaction.sign({
        privateKeys: [owner.privateKey],
        blob: blobInfo.result.transactionBlob
    });

    let deployResponse = await sdk.transaction.submit({
        blob: blobInfo.result.transactionBlob,
        signature: signatureInfo.result.signatures
    });
    console.log(deployResponse);
    // if (deployResponse.errorCode !== 0) {
    //     let hash = deployResponse.result.hash;
    //     console.log(hash);
    // }
})();
