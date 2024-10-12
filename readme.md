# AgriVerify
AgriVerify, where you'll blend blockchain technology with organic farming to bring trust and transparency to every crop grown! In this task, you’ll be creating a decentralized platform that empowers farmers to easily certify their organic produce and generate QR codes that consumers can scan for instant verification.

Imagine walking through a market, scanning a QR code on an apple, and instantly seeing its certification, the farm it came from, and the people behind it—all with the power of blockchain!

Video Link:https://drive.google.com/file/d/1D2XYIosfM-AVIsHxhaOuptOFJ8M3tX2J/view?usp=sharing

## Installation
1.Go to contract directory
```
cd contracts
```
2.Install necessary dependencies-
```
npm install
```
3.Launch the local Node
```
npx hardhat node
```
4.Deploy the contract
```
npx hardhat ignition deploy ./ignition/modules/AgriVerify.js --network localhost
```

5.Go to Frontend dirctory
```
cd ..
cd frontend
```
6.Install required dependencies
```
npm install
```
7.Start the frontend
```
npm run dev
```

![Screenshot 2024-10-12 211422](https://github.com/user-attachments/assets/664ba694-c398-4a96-9b07-0ec4fe891718)


## Tech-stack:
1.Solidity for smart contract
2.Hardhat
3.React Js(Vite)

## Features:

1. ### Farmer Onboarding:
Build a welcoming system where farmers can easily sign up using wallet authentication and request certification for their crops. The process should be seamless, ensuring the user experience is as simple as organic farming itself.

2. ### Certification Process:
Dive into smart contracts! Implement a contract where farmers submit their crops for certification. For simplicity, assume the certifications are auto-approved. The goal is transparency and accessibility.

3. ### QR Code Generation:
Generate QR codes for certified crops. These codes should link to a beautifully simple page showing the certification details stored on the blockchain, enabling consumers to instantly trust their food.

4.Upload QRcode to ipfs using Pinata And Minting a Nift.
