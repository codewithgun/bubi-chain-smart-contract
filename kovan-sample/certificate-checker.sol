/**
 *Submitted for verification at Etherscan.io on 2019-11-21
*/

/**
 *Submitted for verification at Etherscan.io on 2019-11-14
*/

pragma solidity ^0.5.11;

contract CertificateChecker {
    struct Certificate {
        string name;
        string identifier;
        string programName;
        string completionDate;
        string trainerName;
        string grade;
        bool isValid;
    }
    
    uint256 certifcateNumber;
    address owner;
    mapping (uint256 => Certificate) certificateList;
    
    event CertificateCreated(uint256 certifcateNumber, string name, string identifier, string programName, string completionDate, string trainerName, string grade);
    event CertificateUpdated(uint256 certifcateNumber, string name, string identifier, string programName, string completionDate, string trainerName, string grade);
    event CertificateValidateStatusUpdate(uint256 certifcateNumber, bool isValid);
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        _;
    }
    
    function addNewCertificate(string memory name, string memory  identifier,  string memory  programName, string memory completionDate, string memory trainerName, string memory grade) public onlyOwner returns (uint256) {
        certifcateNumber++;
        certificateList[certifcateNumber]= (Certificate(name, identifier, programName, completionDate, trainerName, grade, true));
        emit CertificateCreated(certifcateNumber, name, identifier, programName, completionDate, trainerName, grade);
        return certifcateNumber;
    }
    
    function updateCertificate(uint256 certifcateNumber, string memory name, string memory  identifier,  string memory  programName, string memory completionDate, string memory trainerName, string memory grade) public onlyOwner returns (uint256) {
        certificateList[certifcateNumber].name = name;
        certificateList[certifcateNumber].identifier = identifier;
        certificateList[certifcateNumber].programName = programName;
        certificateList[certifcateNumber].completionDate = completionDate;
        certificateList[certifcateNumber].trainerName = trainerName;
        certificateList[certifcateNumber].grade = grade;
        
        emit CertificateUpdated(certifcateNumber, name, identifier, programName, completionDate, trainerName, grade);
        return certifcateNumber;
    }
    
    function changeCertificateValidation(uint256 certifcateNumber, bool isValid) public onlyOwner returns (uint256) {
        certificateList[certifcateNumber].isValid = isValid;
        
        emit CertificateValidateStatusUpdate(certifcateNumber, isValid);
        return certifcateNumber;
    }
    
    function getCertificate(uint256 input) public view returns (string memory, string memory, string memory, string memory, string memory, string memory grade, bool isValid){
      Certificate storage t =  certificateList[input];
      return (t.name, t.identifier, t.programName, t.completionDate, t.trainerName, t.grade, t.isValid);
    }
}