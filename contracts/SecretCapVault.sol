// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract SecretCapVault is SepoliaConfig {
    using FHE for *;
    
    struct Investment {
        euint32 investmentId;
        euint32 amount;
        euint32 shares;
        euint32 valuation;
        address investor;
        uint256 timestamp;
        bool isActive;
    }
    
    struct Company {
        euint32 companyId;
        euint32 totalShares;
        euint32 currentValuation;
        euint32 totalRaised;
        euint32 investorCount;
        bool isActive;
        bool isVerified;
        string name;
        string description;
        address owner;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    struct CapTableEntry {
        euint32 entryId;
        euint32 shares;
        euint32 percentage;
        address holder;
        bool isEncrypted;
        uint256 timestamp;
    }
    
    struct ReputationScore {
        euint32 score;
        euint32 totalInvestments;
        euint32 successfulExits;
        bool isVerified;
        uint256 lastUpdated;
    }
    
    mapping(uint256 => Company) public companies;
    mapping(uint256 => Investment) public investments;
    mapping(uint256 => CapTableEntry) public capTable;
    mapping(address => ReputationScore) public investorReputation;
    mapping(address => ReputationScore) public companyReputation;
    mapping(address => euint32[]) public investorPortfolio;
    mapping(address => euint32[]) public companyInvestments;
    
    uint256 public companyCounter;
    uint256 public investmentCounter;
    uint256 public capTableCounter;
    
    address public owner;
    address public verifier;
    address public treasury;
    
    event CompanyCreated(uint256 indexed companyId, address indexed owner, string name);
    event InvestmentMade(uint256 indexed investmentId, uint256 indexed companyId, address indexed investor, uint32 amount);
    event CapTableUpdated(uint256 indexed entryId, uint256 indexed companyId, address indexed holder);
    event ReputationUpdated(address indexed user, uint32 reputation);
    event CompanyVerified(uint256 indexed companyId, bool isVerified);
    event FundsWithdrawn(uint256 indexed companyId, address indexed owner, uint32 amount);
    
    constructor(address _verifier, address _treasury) {
        owner = msg.sender;
        verifier = _verifier;
        treasury = _treasury;
    }
    
    function createCompany(
        string memory _name,
        string memory _description,
        uint256 _totalShares,
        uint256 _initialValuation
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Company name cannot be empty");
        require(_totalShares > 0, "Total shares must be positive");
        require(_initialValuation > 0, "Initial valuation must be positive");
        
        uint256 companyId = companyCounter++;
        
        companies[companyId] = Company({
            companyId: FHE.asEuint32(0), // Will be set properly later
            totalShares: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            currentValuation: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            totalRaised: FHE.asEuint32(0),
            investorCount: FHE.asEuint32(0),
            isActive: true,
            isVerified: false,
            name: _name,
            description: _description,
            owner: msg.sender,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        emit CompanyCreated(companyId, msg.sender, _name);
        return companyId;
    }
    
    function makeInvestment(
        uint256 companyId,
        externalEuint32 amount,
        externalEuint32 shares,
        bytes calldata inputProof
    ) public payable returns (uint256) {
        require(companies[companyId].owner != address(0), "Company does not exist");
        require(companies[companyId].isActive, "Company is not active");
        require(companies[companyId].isVerified, "Company must be verified");
        
        uint256 investmentId = investmentCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        euint32 internalShares = FHE.fromExternal(shares, inputProof);
        
        investments[investmentId] = Investment({
            investmentId: FHE.asEuint32(0), // Will be set properly later
            amount: internalAmount,
            shares: internalShares,
            valuation: companies[companyId].currentValuation,
            investor: msg.sender,
            timestamp: block.timestamp,
            isActive: true
        });
        
        // Update company totals
        companies[companyId].totalRaised = FHE.add(companies[companyId].totalRaised, internalAmount);
        companies[companyId].investorCount = FHE.add(companies[companyId].investorCount, FHE.asEuint32(1));
        companies[companyId].updatedAt = block.timestamp;
        
        // Add to investor portfolio
        investorPortfolio[msg.sender].push(FHE.asEuint32(companyId));
        companyInvestments[companies[companyId].owner].push(FHE.asEuint32(investmentId));
        
        // Update cap table
        _updateCapTable(companyId, msg.sender, internalShares);
        
        emit InvestmentMade(investmentId, companyId, msg.sender, 0); // Amount will be decrypted off-chain
        return investmentId;
    }
    
    function _updateCapTable(
        uint256 companyId,
        address holder,
        euint32 shares
    ) internal {
        uint256 entryId = capTableCounter++;
        
        // Calculate percentage (shares / totalShares * 100)
        euint32 percentage = FHE.div(
            FHE.mul(shares, FHE.asEuint32(100)),
            companies[companyId].totalShares
        );
        
        capTable[entryId] = CapTableEntry({
            entryId: FHE.asEuint32(0), // Will be set properly later
            shares: shares,
            percentage: percentage,
            holder: holder,
            isEncrypted: true,
            timestamp: block.timestamp
        });
        
        emit CapTableUpdated(entryId, companyId, holder);
    }
    
    function updateValuation(
        uint256 companyId,
        externalEuint32 newValuation,
        bytes calldata inputProof
    ) public {
        require(companies[companyId].owner == msg.sender, "Only company owner can update valuation");
        require(companies[companyId].isActive, "Company must be active");
        
        euint32 internalValuation = FHE.fromExternal(newValuation, inputProof);
        companies[companyId].currentValuation = internalValuation;
        companies[companyId].updatedAt = block.timestamp;
    }
    
    function verifyCompany(uint256 companyId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify companies");
        require(companies[companyId].owner != address(0), "Company does not exist");
        
        companies[companyId].isVerified = isVerified;
        emit CompanyVerified(companyId, isVerified);
    }
    
    function updateReputation(
        address user,
        euint32 score,
        euint32 totalInvestments,
        euint32 successfulExits,
        bool isInvestor
    ) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        ReputationScore memory reputation = ReputationScore({
            score: score,
            totalInvestments: totalInvestments,
            successfulExits: successfulExits,
            isVerified: true,
            lastUpdated: block.timestamp
        });
        
        if (isInvestor) {
            investorReputation[user] = reputation;
        } else {
            companyReputation[user] = reputation;
        }
        
        emit ReputationUpdated(user, 0); // FHE.decrypt(score) - will be decrypted off-chain
    }
    
    function withdrawFunds(uint256 companyId) public {
        require(companies[companyId].owner == msg.sender, "Only company owner can withdraw");
        require(companies[companyId].isVerified, "Company must be verified");
        require(companies[companyId].isActive, "Company must be active");
        
        // Transfer funds to company owner
        // Note: In a real implementation, funds would be transferred based on decrypted amount
        companies[companyId].isActive = false;
        companies[companyId].updatedAt = block.timestamp;
        
        emit FundsWithdrawn(companyId, msg.sender, 0); // Amount will be decrypted off-chain
    }
    
    function getCompanyInfo(uint256 companyId) public view returns (
        string memory name,
        string memory description,
        uint8 totalShares,
        uint8 currentValuation,
        uint8 totalRaised,
        uint8 investorCount,
        bool isActive,
        bool isVerified,
        address owner,
        uint256 createdAt,
        uint256 updatedAt
    ) {
        Company storage company = companies[companyId];
        return (
            company.name,
            company.description,
            0, // FHE.decrypt(company.totalShares) - will be decrypted off-chain
            0, // FHE.decrypt(company.currentValuation) - will be decrypted off-chain
            0, // FHE.decrypt(company.totalRaised) - will be decrypted off-chain
            0, // FHE.decrypt(company.investorCount) - will be decrypted off-chain
            company.isActive,
            company.isVerified,
            company.owner,
            company.createdAt,
            company.updatedAt
        );
    }
    
    function getInvestmentInfo(uint256 investmentId) public view returns (
        uint8 amount,
        uint8 shares,
        uint8 valuation,
        address investor,
        uint256 timestamp,
        bool isActive
    ) {
        Investment storage investment = investments[investmentId];
        return (
            0, // FHE.decrypt(investment.amount) - will be decrypted off-chain
            0, // FHE.decrypt(investment.shares) - will be decrypted off-chain
            0, // FHE.decrypt(investment.valuation) - will be decrypted off-chain
            investment.investor,
            investment.timestamp,
            investment.isActive
        );
    }
    
    function getCapTableEntry(uint256 entryId) public view returns (
        uint8 shares,
        uint8 percentage,
        address holder,
        bool isEncrypted,
        uint256 timestamp
    ) {
        CapTableEntry storage entry = capTable[entryId];
        return (
            0, // FHE.decrypt(entry.shares) - will be decrypted off-chain
            0, // FHE.decrypt(entry.percentage) - will be decrypted off-chain
            entry.holder,
            entry.isEncrypted,
            entry.timestamp
        );
    }
    
    function getInvestorReputation(address investor) public view returns (
        uint8 score,
        uint8 totalInvestments,
        uint8 successfulExits,
        bool isVerified,
        uint256 lastUpdated
    ) {
        ReputationScore storage reputation = investorReputation[investor];
        return (
            0, // FHE.decrypt(reputation.score) - will be decrypted off-chain
            0, // FHE.decrypt(reputation.totalInvestments) - will be decrypted off-chain
            0, // FHE.decrypt(reputation.successfulExits) - will be decrypted off-chain
            reputation.isVerified,
            reputation.lastUpdated
        );
    }
    
    function getCompanyReputation(address company) public view returns (
        uint8 score,
        uint8 totalInvestments,
        uint8 successfulExits,
        bool isVerified,
        uint256 lastUpdated
    ) {
        ReputationScore storage reputation = companyReputation[company];
        return (
            0, // FHE.decrypt(reputation.score) - will be decrypted off-chain
            0, // FHE.decrypt(reputation.totalInvestments) - will be decrypted off-chain
            0, // FHE.decrypt(reputation.successfulExits) - will be decrypted off-chain
            reputation.isVerified,
            reputation.lastUpdated
        );
    }
    
    function getInvestorPortfolio(address investor) public view returns (uint32[] memory) {
        euint32[] storage portfolio = investorPortfolio[investor];
        uint32[] memory decryptedPortfolio = new uint32[](portfolio.length);
        
        // In a real implementation, this would decrypt each entry
        // For now, return placeholder values
        for (uint256 i = 0; i < portfolio.length; i++) {
            decryptedPortfolio[i] = 0; // FHE.decrypt(portfolio[i])
        }
        
        return decryptedPortfolio;
    }
    
    function getCompanyInvestments(address company) public view returns (uint32[] memory) {
        euint32[] storage investments = companyInvestments[company];
        uint32[] memory decryptedInvestments = new uint32[](investments.length);
        
        // In a real implementation, this would decrypt each entry
        // For now, return placeholder values
        for (uint256 i = 0; i < investments.length; i++) {
            decryptedInvestments[i] = 0; // FHE.decrypt(investments[i])
        }
        
        return decryptedInvestments;
    }
}

