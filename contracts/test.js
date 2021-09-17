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
    if (!params || !params.account_address || !params.asset_key) {
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
            case "multiCall":
                multiCall();
                break;
            case "dosAttack":
                dosAttack();
                break;
            default:
                throw "Invalid operation type";
        }
    } else {
        throw "Main interface require method";
    }
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
            case "dosAttack":
                dosAttack();
                break;
            default:
                throw "Invalid operation type";
        }
    }
    return JSON.stringify(result);
}
