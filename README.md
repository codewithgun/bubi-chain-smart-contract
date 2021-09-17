# bubi-chain-smart-contract

-   The native asset = GAS
-   Chain.store will create 2 transaction, which are base transaction (transaction initiator = client), and child transaction (transaction initiator = contrac)
-   Failed transaction is recorded in the blockchain with 1 GAS
-   Similar to Ethereum, query/call doesn't cost you any gas
-   The `contract_tx_hashes` in the transaction result was the child transaction (Eg: https://explorer.bubi.cn/tx/d24b0fbd72cec7d60222c26d106bc10a86a759a2d44afcdd44f96367f4c840de)
-   Every time when the transaction change the state of the contract, it create `contract_tx_hashes` and increment the contract `nonce`
-   ATP-10, created by the chain itself, doesn't depends on smart contract (Eg: https://tools.bubi.cn/issue)
-   All contract states can be viewed by using `getAccountMetadata` api. (Eg: https://seed1-node.bubi.cn/getAccountMetaData?address=adxSqrxdRA9DpjiyDEP1jpqwGt3qachNhYGm9)

## ATP-10 types

-   Infinite supply (when create, put 0 for total supply)
-   Finite supply (when create, put large amount for total supply, an smaller amount than total supply for initial supply)
-   Fixed supply (when create, put equal amount for total supply and initial supply)
