const ed = require("noble-ed25519");
const crypto = require("crypto");
const bip39 = require("bip39");
const encodings = require("base-x");
const customAlphabetMaps = "123456789AbCDEFGHJKLMNPQRSTuVWXYZaBcdefghijkmnopqrstUvwxyz";
const base58 = encodings(customAlphabetMaps);

function derivePrivateKey(rawPrivateKey) {
    const prvKeyPrefix = "da379f";
    const ptvVersion = "01";
    const prvFill = "00";

    const privateKey = prvKeyPrefix + ptvVersion + rawPrivateKey + prvFill;
    let prvFirstHash = crypto.createHash("sha256").update(privateKey, "hex").digest("hex");
    let prvSecondHash = crypto.createHash("sha256").update(prvFirstHash, "hex").digest("hex");

    let prvCheckSum = prvSecondHash.substring(0, 8);
    return Buffer.from(privateKey + prvCheckSum, "hex");
}

function deriveAddress(rawPubKeyHash) {
    const addressPrefix = "f8e1";
    const addressVersion = "01";
    rawPubKeyHash = rawPubKeyHash.substr(rawPubKeyHash.length - 40, 40);
    const pubKeyHashWithPrefix = addressPrefix + addressVersion + rawPubKeyHash;
    let pubFirstHash = crypto.createHash("sha256").update(pubKeyHashWithPrefix, "hex").digest("hex");
    let pubSecondHash = crypto.createHash("sha256").update(pubFirstHash, "hex").digest("hex");
    let pubKeyChecksum = pubSecondHash.substring(0, 8);
    let rawAddress = pubKeyHashWithPrefix + pubKeyChecksum;
    return base58.encode(Buffer.from(rawAddress, "hex"));
}

function derivePublicKey(rawPublicKey) {
    const publicKeyPrefix = "b0";
    const publicKeyVersion = "01";
    const rawPubKeyWithPrefix = publicKeyPrefix + publicKeyVersion + rawPublicKey;
    let pubFirstHash = crypto.createHash("sha256").update(rawPubKeyWithPrefix, "hex").digest("hex");
    let pubSecondHash = crypto.createHash("sha256").update(pubFirstHash, "hex").digest("hex");
    let pubKeyChecksum = pubSecondHash.substring(0, 8);
    let publicKey = rawPubKeyWithPrefix + pubKeyChecksum;
    return publicKey;
}

const mnemonic = "hidden cable slide payment page abuse wheel skirt settle error ahead hunt rifle gap bean radar city bright letter follow valid moon copper outer";
const rawPrivateKey = bip39.mnemonicToEntropy(mnemonic);
let privateKey = derivePrivateKey(rawPrivateKey);
let encodedPrivateKey = base58.encode(privateKey);

module.exports = {
    getInfo: async () => {
        let _rawPublicKey = await ed.getPublicKey(Buffer.from(rawPrivateKey, "hex"));
        let rawPublicKey = Buffer.from(_rawPublicKey).toString("hex");
        let rawPubKeyHash = crypto.createHash("sha256").update(rawPublicKey, "hex").digest("hex");
        let address = deriveAddress(rawPubKeyHash);
        let publicKey = derivePublicKey(rawPublicKey);
        return {
            mnemonic,
            privateKey: privateKey.toString("hex"),
            wif: encodedPrivateKey,
            address,
            publicKey
        };
    }
};
