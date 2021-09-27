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

function deriveEncodedPublicKey(rawPublicKey) {
    const publicKeyPrefix = "b0";
    const publicKeyVersion = "01";
    const rawPubKeyWithPrefix = publicKeyPrefix + publicKeyVersion + rawPublicKey;
    let pubFirstHash = crypto.createHash("sha256").update(rawPubKeyWithPrefix, "hex").digest("hex");
    let pubSecondHash = crypto.createHash("sha256").update(pubFirstHash, "hex").digest("hex");
    let pubKeyChecksum = pubSecondHash.substring(0, 8);
    let publicKey = rawPubKeyWithPrefix + pubKeyChecksum;
    return publicKey;
}

const mnemonic = "shaft use unhappy bitter vote sick become gift rail two fork sustain cost destroy tattoo stomach attitude relief timber negative prize noise roast capital";
// const mnemonic = bip39.generateMnemonic(256);
// const rawPrivateKey = Buffer.from([
//     17, 236, 24, 183, 207, 250, 207, 180, 108, 87, 224, 39, 189, 99, 246, 85, 138, 120, 236, 78, 228, 233, 41, 192, 124, 109, 156, 104, 235, 66, 194, 24
// ]).toString("hex");
console.log("Mnemonic    :", mnemonic);
const rawPrivateKey = bip39.mnemonicToEntropy(mnemonic);
let privateKey = derivePrivateKey(rawPrivateKey);
let encodedPrivateKey = base58.encode(privateKey);
console.log("Private key :", privateKey.toString("hex"));
console.log("WIF         :", encodedPrivateKey);

ed.getPublicKey(Buffer.from(rawPrivateKey, "hex")).then((_publicKey) => {
    let rawPublicKey = Buffer.from(_publicKey).toString("hex");
    let rawPubKeyHash = crypto.createHash("sha256").update(rawPublicKey, "hex").digest("hex");

    // let address = sjcl.codec.base58.encode(Buffer.from(publicKey, "hex"));
    console.log("Address     :", deriveAddress(rawPubKeyHash));
    console.log("Public key  :", deriveEncodedPublicKey(rawPublicKey));
});
