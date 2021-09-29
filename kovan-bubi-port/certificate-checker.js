"use strict";

function init() {
    Chain.store("owner", Chain.msg.sender);
    return;
}

/**
 * @throws throw assert exception when non-owner invoke the contract method
 */
function onlyOwner() {
    Utils.assert(Chain.msg.sender === Chain.load("owner"), "Only owner can call this function");
}

/**
 *
 * @returns {number}
 */
function getCertificateNumber() {
    return Number(Chain.load("certificateNumber"));
}

/**
 *
 * @param {number} certificateNumber
 */
function storeCertificateNumber(certificateNumber) {
    Chain.store("certificateNumber", certificateNumber.toString());
}

/**
 *
 * @param {number} certificateNumber
 * @returns {string}
 */
function makeCertificateKey(certificateNumber) {
    return `certk_${certificateNumber}`;
}

/**
 *
 * @param {string} certificateKey
 * @param {string} name
 * @param {string} identifier
 * @param {string} programName
 * @param {string} completionDate
 * @param {string} trainerName
 * @param {string} grade
 * @param {boolean} isValid
 * @returns {boolean}
 */
function saveCertificate(certificateKey, name, identifier, programName, completionDate, trainerName, grade, isValid) {
    return Chain.store(
        certificateKey,
        JSON.stringify({
            name,
            identifier,
            programName,
            completionDate,
            trainerName,
            grade,
            isValid
        })
    );
}
/**
 *
 * @param {number} certificateNumber
 * @throws throw assert exception when certificate not found
 * @returns { { name: string, identifier: string, programName: string, completionDate: string, trainerName: string, grade: string, isValid: boolean } }
 */
function getCertificate(certificateNumber = 0) {
    Utils.assert(typeof certificateNumber === "number", "invalid certificateNumber type");
    let certificate = JSON.parse(Chain.load(makeCertificateKey(certificateNumber)));
    Utils.assert(certificate !== undefined, "certificate not found");
    if (certificate) {
        certificate.isValid = certificate.isValid === "true";
    }
    return certificate;
}

/**
 *
 * @param {string} name
 * @param {string} identifier
 * @param {string} programName
 * @param {string} completionDate
 * @param {string} trainerName
 * @param {string} grade
 * @returns {number}
 */
function addNewCertificate(name = "", identifier = "", programName = "", completionDate = "", trainerName = "", grade = "") {
    let certificateNumber = getCertificateNumber();
    certificateNumber += 1;
    let certificateKey = makeCertificateKey(certificateNumber);
    saveCertificate(certificateKey, name, identifier, programName, completionDate, trainerName, grade, true);
    // Bubi only limit to maximum 5 args for log emitted
    Chain.tlog("CertificateCreated", `${certificateNumber}|${name}|${identifier}|${programName}|${completionDate}|${trainerName}|${grade}`);
    storeCertificateNumber(certificateNumber);
    return certificateNumber;
}

/**
 *
 * @param {number} certificateNumber
 * @param {string} name
 * @param {string} identifier
 * @param {string} programName
 * @param {string} completionDate
 * @param {string} trainerName
 * @param {string} grade
 * @returns {number}
 */
function updateCertificate(certificateNumber = 0, name = "", identifier = "", programName = "", completionDate = "", trainerName = "", grade = "") {
    getCertificate(certificateNumber);
    saveCertificate(makeCertificateKey(certificateNumber), name, identifier, programName, completionDate, trainerName, grade, true);
    Chain.tlog("CertificateUpdated", `${certificateNumber}|${name}|${identifier}|${programName}|${completionDate}|${trainerName}|${grade}`);
    return certificateNumber;
}

/**
 *
 * @param {string} _input
 * @returns { { method: string, params: object } }
 */
function extractIncomingInput(_input) {
    let input = JSON.parse(_input);
    const method = input.method || "";
    const params = input.params || "";
    return {
        method,
        params
    };
}

/**
 *
 * @param {number} certificateNumber
 * @param {boolean} isValid
 * @returns
 */
function changeCertificateValidation(certificateNumber = 0, isValid = false) {
    Utils.assert(typeof isValid === "boolean", "invalid isValid type");
    let { completionDate, grade, programName, name, trainerName, identifier } = getCertificate(certificateNumber);
    saveCertificate(makeCertificateKey(certificateNumber), name, identifier, programName, completionDate, trainerName, grade, isValid);
    Chain.tlog("CertificateValidateStatusUpdate", `${certificateNumber}|${isValid}`);
    return certificateNumber;
}

function main(_input) {
    onlyOwner();
    const { method, params } = extractIncomingInput(_input);
    switch (method) {
        case "addNewCertificate":
            return addNewCertificate(params.name, params.identifier, params.programName, params.completionDate, params.trainerName, params.grade);
        case "updateCertificate":
            return updateCertificate(params.certificateNumber, params.name, params.identifier, params.programName, params.completionDate, params.trainerName, params.grade);
        case "changeCertificateValidation":
            return changeCertificateValidation(params.certificateNumber, params.isValid);
        default:
            throw "Invalid entry method";
    }
}

function query(_input) {
    const { method, params } = extractIncomingInput(_input);
    switch (method) {
        case "getCertificate":
            return JSON.stringify(getCertificate(params.certificateNumber));
        default:
            throw "Invalid query method";
    }
}
