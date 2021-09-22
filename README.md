# bubi-chain-smart-contract

-   Everything stored or retrieved from the contract will be in `string` type
-   The native asset = GAS, 8 decimal place
-   Chain.store will create 2 transaction, which are base transaction (transaction initiator = client), and child transaction (transaction initiator = contrac)
-   Failed transaction is recorded in the blockchain with 1 GAS
-   Similar to Ethereum, query/call doesn't cost you any gas
-   The `contract_tx_hashes` in the transaction result was the child transaction (Eg: https://explorer.bubi.cn/tx/d24b0fbd72cec7d60222c26d106bc10a86a759a2d44afcdd44f96367f4c840de)
-   Every time when the transaction change the state of the contract, it create `contract_tx_hashes` and increment the contract `nonce`
-   ATP-10, created by the chain itself, doesn't depends on smart contract (Eg: https://tools.bubi.cn/issue)
-   All contract states can be viewed by using `getAccountMetadata` api. (Eg: https://seed1-node.bubi.cn/getAccountMetaData?address=adxSqrxdRA9DpjiyDEP1jpqwGt3qachNhYGm9)
-   Child transaction doesn't consume contract gas even though the initiator was the contract itself
-   `getContractProperty` return type and length (byte size) of the contract. If length = 0, means it is a normal account
-   Similar to tron, where an address/account is activated after receive first GAS payment
-   Transaction execution timeout is depends on both block gas limit, and time limit (1 seconds), therefore avoid too much loop
-   Base reserve of 0.1 GAS for contract (not sure for account)
-   `Chain.delegateCall` used to execute function of another contract, but the execution context still belongs to the caller (Eg: A delegateCall B, Chain.store will store at A). Use `Chain.contractCall` to execute in the context of another contract (like borrow another contract logic to use)
-   `Chain.tx.initiator` vs `Chain.tx.sender`. Initiator = User (signature binded) initiated the transaction, Sender = User/Contract (signature binded) that interacting with the contract, same applied to `Chain.msg.*` (Not confirmed yet)
-   `Chain.block.timestamp` return microseconds, therefore always `seconds * 100000`
-   Each `metadata_key` of the contract have an attribute `version`. It indicate the key has been modified how many time

## ATP-10 types

-   Infinite supply (when create, put 0 for total supply)
-   Finite supply (when create, put large amount for total supply, an smaller amount than total supply for initial supply)
-   Fixed supply (when create, put equal amount for total supply and initial supply)

## Questions

-   Block gas limit
-   Transaction execution time limit
-   Gas optimization (Answer: Batch multiple operation into single transaction, similar to Stellar Lumen "XLM")
-   Can smart contract receive ATP-10 ? (Failed transaction: https://explorer.bubi.cn/tx/1e8ad7482945ee7be5ce1309f0a42088b6d4b0a62fba1357390823e1352a7a71) (Answer: Yes, depends on how you design the contract)
-   0.1 GAS base reserve usage for contract
-   Why `Chain.tx.initiator`, `Chain.tx.sender`, `Chain.msg.sender`, `Chain.msg.initiator` return random address everytime when `query`

## To Explore

-   Proxy contract
-   Contract to contract interaction
-   Check whether vulnerable to well-knowns attack
-   Multisig account (https://docs.bubi.cn/cn/docs/api_http/#%E8%AE%BE%E7%BD%AE%E6%9D%83%E9%99%90, https://docs.bubi.cn/cn/docs/api_http/#%E6%8E%A7%E5%88%B6%E6%9D%83%E7%9A%84%E5%88%86%E9%85%8D)
-   Pedersen Commitment

## Vulnerable Test

### Arithmetic Overflow/Underflow

-   It doesn't suffer overflow/underflow problem like solidity. However, it faced the precision loss issue, when value > `Number.MAX_SAFE_INTEGER` (Eg: Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2)
