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

    struct TransferRequestTrack {
        uint256 created_at;
        uint256 approved_at;
        address new_owner;
        uint256 land_id;
        bool owner_approved;
        bool govt_approved;
    }

    address owner;
    uint256[] landIds;
    mapping(uint256 => Land) public lands;
    mapping(address => bool) isAdmin;
    mapping(address => TransferRequestTrack[]) userTransferRequests;
    mapping(address => uint256[]) public userLandIds; // Keep track of land IDs owned by each use

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

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can perform this action"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addAdmin(address _admin) public onlyOwner {
        isAdmin[_admin] = true;
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
        landIds.push(landId);

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

    function updateLand(uint256 landId, string memory newIpfsHash1) public {
        require(lands[landId].land_id != 0, "Land with this ID does not exist");
        require(
            msg.sender == lands[landId].current_owner,
            "Only land owner can update land"
        );
        lands[landId].ipfsHash = newIpfsHash1;
    }

    function deleteLand(uint256 landId) public {
        require(msg.sender == owner, "Only owner can delete land");
        require(lands[landId].land_id != 0, "Land with this ID does not exist");

        delete lands[landId];

        for (uint256 i = 0; i < landIds.length; i++) {
            landIds[i] = landIds[landIds.length - 1];
        }
        landIds.pop();
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

        TransferRequestTrack[] memory userTransfers = userTransferRequests[
            msg.sender
        ];
        for (uint256 i = 0; i < userTransfers.length; i++) {
            if (userTransfers[i].land_id == landId) {
                require(
                    userTransfers[i].land_id != landId,
                    "There is already a pending transfer request for this land"
                );
            }
        }

        userTransferRequests[msg.sender].push(
            TransferRequestTrack({
                land_id: landId,
                new_owner: newOwner,
                owner_approved: true,
                govt_approved: false,
                approved_at: 0,
                created_at: block.timestamp
            })
        );
    }

    function approveTransferRequest(
        uint256 landId,
        address currentOwner
    ) public onlyAdmin returns (bool) {
        Land storage land = lands[landId];
        require(land.land_id == landId, "This land doesn't exist");
        require(
            land.is_govt_approved == true,
            "This land ownership has not been approved"
        );

        TransferRequestTrack[] memory userTransfers = userTransferRequests[
            currentOwner
        ];
        for (uint256 i = 0; i < userTransfers.length; i++) {
            if (
                userTransfers[i].land_id == landId &&
                userTransfers[i].owner_approved == true &&
                userTransfers[i].govt_approved == false
            ) {
                userTransferRequests[currentOwner][i].govt_approved = true;
                userTransferRequests[currentOwner][i].approved_at = block
                    .timestamp;
                land.previous_owners.push(land.current_owner);
                land.current_owner = userTransfers[i].new_owner;
                emit LandOwnershipTransferred(
                    landId,
                    lands[landId].previous_owners,
                    currentOwner
                );

                return true;
            }
        }

        return false;
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

    function getAllLands() public view onlyAdmin returns (Land[] memory) {
        Land[] memory result = new Land[](landIds.length);
        for (uint256 i; i < landIds.length; i++) {
            result[i] = getLand(landIds[i]);
        }

        return result;
    }

    function getTransferredLands()
        public
        view
        returns (TransferRequestTrack[] memory)
    {
        TransferRequestTrack[] memory response = userTransferRequests[
            msg.sender
        ];

        return response;
    }

    function getAddressTransferredLands(
        address req
    ) public view onlyAdmin returns (TransferRequestTrack[] memory) {
        TransferRequestTrack[] memory response = userTransferRequests[req];

        return response;
    }
}
