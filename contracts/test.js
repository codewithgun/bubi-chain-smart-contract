"use strict";
function init(bar) {
    /*init whatever you want*/
    return;
}

function dosAttack() {
    while (true) {
        Utils.log("x");
    }
}

function chainContractCall(params) {
    if (!params || !params.contractAddress || !params.asset || !params.amount) {
        throw "Invalid params for operation";
    }
    return Chain.contractCall(params.contractAddress, params.asset, params.amount, params.input);
}

function chainContractQuery(params) {
    if (!params || !params.contractAddress || !params.input) {
        throw "Invalid params for operation";
    }
    return Chain.contractQuery(params.contractAddress, params.input);
}

function chainDelegateQuery(params) {
    if (!params || !params.contractAddress || !params.input) {
        throw "Invalid params for operation";
    }
    return Chain.delegateQuery(params.contractAddress, params.input);
}

function chainDelegateCall(params) {
    if (!params || !params.contractAddress) {
        throw "Invalid params for operation";
    }
    return Chain.delegateCall(params.contractAddress, params.input);
}

function chainPayAsset(params) {
    if (!params || !params.address || !params.issuer || !params.code || !params.amount) {
        throw "Invalid params for operation";
    }
    return Chain.payAsset(params.address, params.issuer, params.code, params.amount, "{}");
}

function chainIssueAsset(params) {
    if (!params || !params.code || !params.amount) {
        throw "Invalid params for operation";
    }
    return Chain.issueAsset(params.code, params.amount);
}

function chainPayCoin(params) {
    if (!params || !params.address || !params.amount) {
        throw "Invalid params for operation";
    }
    return Chain.payCoin(params.address, params.amount, "{}");
}

function chainGetAccountPrivilege(params) {
    if (!params || !params.account_address) {
        throw "Invalid params for operation";
    }
    return Chain.getAccountPrivilege(params.account_address);
}

function chainGetContractProperty(params) {
    if (!params || !params.contract_address) {
        throw "Invalid params for operation";
    }
    return Chain.getContractProperty(params.contract_address);
}

function chainStore(params) {
    if (!params || !params.metadata_key || !params.metadata_value) {
        throw "Invalid params for operation";
    }
    Chain.store(params.metadata_key, params.metadata_value);
}

function chainDelete(params) {
    if (!params || !params.metadata_key) {
        throw "Invalid params for operation";
    }
    Chain.del(params.metadata_key);
}

function chainLoad(params) {
    if (!params || !params.metadata_key) {
        throw "Invalid params for operation";
    }
    return Chain.load(params.metadata_key);
}

function chainGetBlockHash(params) {
    if (!params || !params.offset_seq) {
        throw "Invalid params for operation";
    }
    return Chain.getBlockHash(params.offset_seq);
}

function chainGetAccountMetadata(params) {
    if (!params || !params.account_address || !params.metadata_key) {
        throw "Invalid params for operation";
    }
    return Chain.getAccountMetadata(params.account_address, params.metadata_key);
}

function chainGetBalance(params) {
    if (!params || !params.address) {
        throw "Invalid params for operation";
    }
    return Chain.getBalance(params.address);
}

function chainGetAccountAsset(params) {
    if (!params || !params.account_address || !params.asset_key || !params.asset_key.issuer || !params.asset_key.code) {
        throw "Invalid params for operation";
    }
    return Chain.getAccountAsset(params.account_address, params.asset_key);
}

function chainTLog(params) {
    if (!params || !params.topic || !params.args || !params.constructor || !params.constructor.name === "Array" || params.args.length > 5) {
        throw "Invalid params for operation";
    }
    return Chain.tlog(params.topic, ...params.args);
}

function multiCall() {
    chainStore({
        metadata_key: "Secret",
        metadata_value: "Some random secret"
    });
    chainTLog({
        topic: "Hello",
        args: [1, 2, 3, 4, 5]
    });
}

function main(input) {
    if (input) {
        let para = JSON.parse(input);
        if (para.method) {
            switch (para.method) {
                case "chainStore":
                    chainStore(para.params);
                    break;
                case "chainDel":
                    chainDelete(para.params);
                    break;
                case "chainTLog":
                    chainTLog(para.params);
                    break;
                case "chainPayCoin":
                    chainPayCoin(para.params);
                    break;
                case "chainIssueAsset": // Unable to test due to gas limit issue
                    chainIssueAsset(para.params);
                    break;
                case "chainPayAsset":
                    chainPayAsset(para.params);
                    break;
                case "chainDelegateCall":
                    chainDelegateCall(para.params);
                    break;
                case "chainContractCall":
                    chainContractCall(para.params);
                    break;
                case "multiCall":
                    multiCall();
                    break;
                case "dosAttack":
                    dosAttack();
                    break;
                default:
                    throw "Invalid operation type";
            }
        }
    }
    chainTLog({
        topic: "Chain.msg.initiator",
        args: [Chain.msg.initiator]
    });
    chainTLog({
        topic: "Chain.msg.sender",
        args: [Chain.msg.sender]
    });
}

function query(_input) {
    let result = {};
    let input = JSON.parse(_input);

    if (input.method) {
        switch (input.method) {
            case "chainLoad":
                result.chainLoad = chainLoad(input.params);
                break;
            case "chainGetBlockHash":
                result.chainGetBlockHash = chainGetBlockHash(input.params);
                break;
            case "chainGetAccountMetadata":
                result.chainGetAccountMetadata = chainGetAccountMetadata(input.params);
                break;
            case "chainGetBalance":
                result.chainGetBalance = chainGetBalance(input.params);
                break;
            case "chainGetAccountAsset":
                result.chainGetAccountAsset = chainGetAccountAsset(input.params);
                break;
            case "chainGetAccountPrivilege":
                result.chainGetAccountPrivilege = chainGetAccountPrivilege(input.params);
                break;
            case "chainGetContractProperty":
                result.chainGetContractProperty = chainGetContractProperty(input.params);
                break;
            case "chainDelegateQuery":
                result.chainDelegateQuery = chainDelegateQuery(input.params);
                break;
            case "chainContractQuery":
                result.chainContractQuery = chainContractQuery(input.params);
                break;
            case "dosAttack":
                dosAttack();
                break;
            default:
                throw "Invalid operation type";
        }
    }
    return JSON.stringify(result);
}
