const { PinataSDK } = require("pinata-web3");
const fs = require("fs");
const QRCode = require('qrcode');
const { createCanvas } = require('canvas');
require("dotenv").config();

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL
});

async function generateQRCode(data) {
  try {
    const canvas = createCanvas(200, 200);
    await QRCode.toCanvas(canvas, data, { width: 200 });
    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

async function uploadToIPFS(content, filename, contentType) {
  try {
    const blob = new Blob([content], { type: contentType });
    const file = new File([blob], filename, { type: contentType });
    const upload = await pinata.upload.file(file);
    console.log(`Upload successful for ${filename}:`, upload);
    return upload;
  } catch (error) {
    console.error(`Error uploading ${filename}:`, error);
    throw error;
  }
}

async function main() {
  try {
    // Generate and upload QR code
    const qrCodeBuffer = await generateQRCode("learn_agriverify");
    const qrUpload = await uploadToIPFS(qrCodeBuffer, "qr-code.png", "image/png");
    const qrCodeUrl = `${process.env.GATEWAY_URL}/ipfs/${qrUpload.IpfsHash}`;
    console.log("QR Code accessible at:", qrCodeUrl);

  } catch (error) {
    console.error("An error occurred during the process:", error);
  }
}

main();