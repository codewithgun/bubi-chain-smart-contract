"use strict";
const BubiChainSDK = require("bubichain-sdk-nodejs");
const util = require("util");

const sdk = new BubiChainSDK({
    host: "seed1-node.bubi.cn"
});

const account = {
    privateKey: "privbvScctdKqPfhqfW7uSL1dPKnJLuFapjAbJKHYePAq4ttEzMqeqBZ",
    publicKey: "b001ba34f0c4efc95d8ede451ca19518edb88cadbc9201c4d78dc8bb9882b87a86a2764fcf11",
    address: "adxSa8aXpw4XDkFPwJZML1aXGsw1m68Utdi3J"
};

const contractAddress = "adxSZzs3zjifgcKGrNSh2DmKDw8rSzLVfcCGV";
(async () => {
    // const contractInteractionSimulation = await sdk.contract.call({
    //     // sourceAddress: account.address,
    //     optType: 1,
    //     contractAddress,
    //     input: '{"method":"addNewCertificate","params":{"name":"AK","identifier":"MyEG","programName":"HelloWorld","completionDate":"2021-09-28T14:30:59.917Z","trainerName":"AK47","grade":"SSS+"}}'
    // });

    // console.log(contractInteractionSimulation);
    // return;

    // let addCertificate =
    //     '{"method":"addNewCertificate","params":{"name":"CK","identifier":"MyEG","programName":"HelloWorld","completionDate":"2021-09-28T14:30:59.917Z","trainerName":"AK47","grade":"SSS+"}}';
    // let updateCertificate =
    //     '{"method":"updateCertificate","params":{"certificateNumber":1,"name":"AK","identifier":"AgmoStudio","programName":"HelloAgmo","completionDate":"2021-09-28T14:30:59.917Z","trainerName":"AK48","grade":"A+"}}';
    // let changeCertificateValidation = '{"method":"changeCertificateValidation","params":{"certificateNumber":1, "isValid": true}}';

    // const contractCall = await sdk.contract.call({
    //     sourceAddress: account.address,
    //     contractAddress,
    //     contractBalance: "10000000000",
    //     input: '{ "method": "getCertificate", "params": { "certificateNumber": 1 } }',
    //     optType: 2
    // });
    // console.log(contractCall);
    // console.log(util.inspect(contractCall.result.query_rets, false, null, true /* enable colors */));
    // return;

    const contractInteraction = await sdk.operation.contractInvokeByBUOperation({
        contractAddress,
        input: updateCertificate
    });

    let ownerAccountDetails = await sdk.account.getInfo(account.address);
    let nonce = String(Number(ownerAccountDetails.result.nonce) + 1);

    // const bu = sdk.operation.contractCreateOperation({
    //     destAddress: c.result.address,
    //     initBalance: "10000000",
    //     type: 0
    // });

    // const bu = sdk.operation.accountActivateOperation({
    //     destAddress: "adxSqJm2XdTz7SjMGtnexDhxUWFkdUxoG54CB",
    //     initBalance: "10000000000"
    // });

    const blobInfo = sdk.transaction.buildBlob({
        sourceAddress: account.address,
        gasPrice: "1000",
        feeLimit: "100000000",
        nonce,
        operations: [contractInteraction.result.operation]
    });

    console.log(blobInfo);

    const signatureInfo = sdk.transaction.sign({
        privateKeys: [account.privateKey],
        blob: blobInfo.result.transactionBlob
    });

    console.log(signatureInfo);

    sdk.transaction
        .submit({
            blob: blobInfo.result.transactionBlob,
            signature: signatureInfo.result.signatures
        })
        .then(console.log);
})();

// let sc = `"use strict";function init(bar){return;}
// function main(input){let para=JSON.parse(input);if(para.do_foo){let x={hello:"world"};}}
// function query(input){return input;}`;

// sdk.account.create().then((c) => {
//     const bu = sdk.operation.contractCreateOperation({
//         destAddress: c.result.address,
//         initBalance: "10000000",
//         type: 0,
//         payload: sc
//     });

//     const blobInfo = sdk.transaction.buildBlob({
//         sourceAddress: account.address,
//         gasPrice: "1000",
//         feeLimit: "10010000000",
//         nonce: "6",
//         operations: [bu.result.operation]
//     });

//     const signatureInfo = sdk.transaction.sign({
//         privateKeys: [account.privateKey],
//         blob: blobInfo.result.transactionBlob
//     });

//     // sdk.transaction
//     sdk.transaction
//         .submit({
//             blob: blobInfo.result.transactionBlob,
//             signature: signatureInfo.result.signatures
//         })
//         .then(console.log);
// });

// const activeAcc = sdk.operation.accountActivateOperation({
//     sourceAddress: "adxSa8aXpw4XDkFPwJZML1aXGsw1m68Utdi3J",
//     destAddress: "adxSorN8HvjGBqr5m9CyYPMMX5Q8nf7nyR2Hi",
//     initBalance: "5000000000",
//     metadata: "Create account"
// });

// const blobInfo = sdk.transaction.buildBlob({
//     sourceAddress: "adxSa8aXpw4XDkFPwJZML1aXGsw1m68Utdi3J",
//     nonce: "4",
//     gasPrice: "1000",
//     feeLimit: "10000000000",
//     operations: [activeAcc.result.operation]
// });

// const signatureInfo = sdk.transaction.sign({
//     privateKeys: [account.privateKey],
//     blob: blobInfo.result.transactionBlob
// });

// console.log(signatureInfo.result.signatures);
// console.log(blobInfo);

// sdk.transaction
//     .submit({
//         blob: blobInfo.result.transactionBlob,
//         signature: signatureInfo.result.signatures
//     })
//     .then(console.log)
//     .catch(console.error);
