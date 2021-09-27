const ed = require("noble-ed25519");
const crypto = require("crypto");
const base58 = require("bs58");
const bip39 = require("bip39");
const bip32 = require("bip32");
// const mnemonic = "shaft use unhappy bitter vote sick become gift rail two fork sustain cost destroy tattoo stomach attitude relief timber negative prize noise roast capital";
const mnemonic = bip39.generateMnemonic(256);
console.log(mnemonic);
const rootKey = bip32.fromSeed(Buffer.from(bip39.mnemonicToEntropy(mnemonic), "hex"));
const prvKeyPrefix = "DA379F";
const ptvVersion = "01";
const prvFill = "00";
const pubKeyPrefix = "F8E1";
const pubKeyVersion = "01";

(async () => {
    for (let i = 0; i < 10; i++) {
        const rawPrivateKey = rootKey.derivePath(`m/44/995/0/0/${i}'`).privateKey.toString("hex");

        const privateKey = prvKeyPrefix + ptvVersion + rawPrivateKey + prvFill;
        let prvFirstHash = crypto.createHash("sha256").update(privateKey, "hex").digest("hex");
        let prvSecondHash = crypto.createHash("sha256").update(prvFirstHash, "hex").digest("hex");

        let prvCheckSum = prvSecondHash.substring(0, 8);
        let encodedPrivateKey = base58.encode(Buffer.from(privateKey + prvCheckSum, "hex"));
        console.log(encodedPrivateKey);
        let _publicKey = await ed.getPublicKey(Buffer.from(rawPrivateKey, "hex"));
        let rawPublicKey = Buffer.from(_publicKey).toString("hex");
        let rawPubKeyHash = crypto.createHash("sha256").update(rawPublicKey, "hex").digest("hex");
        rawPubKeyHash = rawPubKeyHash.substr(rawPubKeyHash.length - 40, 40);
        const pubKeyHashWithPrefix = pubKeyPrefix + pubKeyVersion + rawPubKeyHash;
        let pubFirstHash = crypto.createHash("sha256").update(pubKeyHashWithPrefix, "hex").digest("hex");
        let pubSecondHash = crypto.createHash("sha256").update(pubFirstHash, "hex").digest("hex");
        let pubKeyChecksum = pubSecondHash.substring(0, 8);
        let publicKey = pubKeyHashWithPrefix + pubKeyChecksum;
        let address = base58.encode(Buffer.from(publicKey, "hex"));
        console.log(address);
    }
})();
