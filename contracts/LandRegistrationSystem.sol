// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract LandRegistrationSystem {
    struct Land {
        uint256 land_id;
        bool is_govt_approved;
        string ipfsHash;
        address current_owner;
        address[] previous_owners;
        uint256 created_at;
        uint256 approved_at;
    }

    address public owner;
    mapping(uint256 => Land) public lands;
    mapping(address => bool) public isAdmin;
    mapping(uint256 => address) public transferRequests;
    mapping(address => uint256[]) public userLandIds; // Keep track of land IDs owned by each use
    mapping(uint256 => mapping(address => bool)) public transferApprovals;

    event LandOwnershipTransferred(
        uint256 indexed landId,
        address[] previousOwners,
        address newOwner
    );
    event LandCreated(uint256 indexed landId, address newOwner);

    uint256 public totalLands;

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Only admins can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerLand(string memory ipfsHash) public {
        uint256 landId = uint256(
            keccak256(abi.encodePacked(msg.sender, block.timestamp))
        ) % 10000000000;
        require(lands[landId].land_id == 0, "Land with this ID already exists");

        lands[landId] = Land({
            land_id: landId,
            is_govt_approved: false,
            ipfsHash: ipfsHash,
            current_owner: msg.sender,
            previous_owners: new address[](0),
            created_at: block.timestamp,
            approved_at: 0
        });

        // Add the land ID to the user's list of owned land IDs
        userLandIds[msg.sender].push(landId);

        totalLands++;

        emit LandCreated(landId, msg.sender);
    }

    function getLand(uint256 landId) public view returns (Land memory) {
        require(lands[landId].land_id != 0, "Land with this ID does not exist");

        return
            Land({
                land_id: landId,
                is_govt_approved: lands[landId].is_govt_approved,
                ipfsHash: lands[landId].ipfsHash,
                current_owner: lands[landId].current_owner,
                previous_owners: lands[landId].previous_owners,
                created_at: lands[landId].created_at,
                approved_at: lands[landId].approved_at
            });

        // return data;
    }

    function updateLand(
        uint256 landId,
        bool newIsGovtApproved,
        string memory newIpfsHash1
    ) public {
        require(lands[landId].land_id != 0, "Land with this ID does not exist");
        require(
            msg.sender == lands[landId].current_owner,
            "Only land owner can update land"
        );
        lands[landId].is_govt_approved = newIsGovtApproved;
        lands[landId].ipfsHash = newIpfsHash1;
    }

    function deleteLand(uint256 landId) public {
        totalLands--;
        require(msg.sender == owner, "Only owner can delete land");
        require(lands[landId].land_id != 0, "Land with this ID does not exist");

        delete lands[landId];
    }

    function transferOwnership(uint256 landId, address newOwner) public {
        require(
            msg.sender == lands[landId].current_owner,
            "Only the current owner can transfer ownership"
        );

        lands[landId].previous_owners.push(lands[landId].current_owner);
        lands[landId].current_owner = newOwner;

        emit LandOwnershipTransferred(
            landId,
            lands[landId].previous_owners,
            newOwner
        );
    }

    function approveLand(uint256 _landId) public onlyAdmin {
        require(
            lands[_landId].is_govt_approved == false,
            "Land already approved by government"
        );

        lands[_landId].is_govt_approved = true;
        lands[_landId].approved_at = block.timestamp;
    }

    function createTransferRequest(uint256 landId, address newOwner) public {
        Land storage land = lands[landId];
        require(
            land.current_owner == msg.sender,
            "Only the current owner can transfer ownership"
        );
        require(
            transferRequests[landId] == address(0),
            "There is already a pending transfer request for this land"
        );
        transferRequests[landId] = newOwner;
        transferApprovals[landId][msg.sender] = true;
    }

    function approveTransferRequest(
        uint256 landId,
        address currentOwner
    ) public onlyAdmin {
        Land storage land = lands[landId];
        require(
            transferRequests[landId] != address(0),
            "There is no pending transfer request for this land"
        );
        require(
            transferApprovals[landId][currentOwner] == true,
            "Current owner has not approved this transfer request"
        );
        require(
            transferApprovals[landId][msg.sender] == false,
            "This transfer request has already been approved by an admin user"
        );
        land.previous_owners.push(land.current_owner);
        land.current_owner = transferRequests[landId];
        emit LandOwnershipTransferred(
            landId,
            lands[landId].previous_owners,
            land.current_owner
        );
        transferApprovals[landId][msg.sender] = true;
    }

    function getLandOwners(
        uint256 landId
    )
        public
        view
        returns (address currentOwner, address[] memory previousOwners)
    {
        currentOwner = lands[landId].current_owner;
        previousOwners = lands[landId].previous_owners;
    }

    function getOwnedLands() public view returns (Land[] memory) {
        uint256 landCount = userLandIds[msg.sender].length;
        Land[] memory ownedLands = new Land[](landCount);
        uint256 index = 0;
        for (uint256 i = 0; i < landCount; i++) {
            uint256 landId = userLandIds[msg.sender][i];
            if (lands[landId].current_owner == msg.sender) {
                ownedLands[index] = getLand(landId);
                index++;
            }
        }

        return ownedLands;
    }
}