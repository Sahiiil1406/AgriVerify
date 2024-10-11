// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgriVerify {
    uint256 public cropIdCounter = 1;

    struct Farmer {
        address wallet;
        string name;
        bool isRegistered;
    }

    struct Crop {
        uint256 id;
        string name;
        address farmerWallet;
        uint256 price;
        bool isVerified;
    }

    mapping(address => Farmer) public farmers;
    mapping(uint256 => Crop) public crops;
    mapping(address => uint256[]) private farmerCropIds;

    event FarmerRegistered(address indexed wallet, string name);
    event CropCreated(uint256 indexed id, string name, address indexed farmerWallet, uint256 price);
    event CropVerified(uint256 indexed id);


    modifier onlyRegisteredFarmer() {
        require(farmers[msg.sender].isRegistered, "Only registered farmers can perform this action");
        _;
    }

    function registerFarmer(string memory _name) external {
        require(!farmers[msg.sender].isRegistered, "Farmer already registered");
        farmers[msg.sender] = Farmer(msg.sender, _name, true);
        emit FarmerRegistered(msg.sender, _name);
    }

    function createCrop(string memory _name, uint256 _price) external onlyRegisteredFarmer {
        uint256 newCropId = cropIdCounter;
        crops[newCropId] = Crop(newCropId, _name, msg.sender, _price, false);
        farmerCropIds[msg.sender].push(newCropId);
        emit CropCreated(newCropId, _name, msg.sender, _price);
        cropIdCounter++;
    }

    function requestVerification(uint256 _cropId) external onlyRegisteredFarmer {
        Crop storage crop = crops[_cropId];
        require(crop.farmerWallet == msg.sender, "Only the crop owner can request verification");
        require(!crop.isVerified, "Crop is already verified");
        crop.isVerified = true;
        emit CropVerified(_cropId);
    }

    function getCrop(uint256 _cropId) external view returns (Crop memory) {
        require(_cropId > 0 && _cropId < cropIdCounter, "Invalid crop ID");
        return crops[_cropId];
    }

    function getFarmerCrops(address _farmerAddress) external view returns (Crop[] memory) {
        uint256[] memory cropIds = farmerCropIds[_farmerAddress];
        Crop[] memory farmerCrops = new Crop[](cropIds.length);
        for (uint256 i = 0; i < cropIds.length; i++) {
            farmerCrops[i] = crops[cropIds[i]];
        }
        return farmerCrops;
    }
}