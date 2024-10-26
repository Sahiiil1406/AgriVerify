import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PinataSDK } from "pinata-web3";
import QRCode from 'qrcode';
import { ethers } from 'ethers';
import { a } from '../../public/abi.js';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const pinata = new PinataSDK({
  pinataJwt: "",
  pinataGateway: ""
});

const PlantDetail = () => {
  const { id } = useParams();
  const [crop, setCrop] = useState(null);

  const verifyAndgenerateQR = async () => {
    if (crop?.isVerified) {
      console.log("This Crop is already verified.");
      return;
    }
  
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(`http://localhost:5173/certificate/${id}`, {
        width: 200,
        margin: 2,
      });
      const response = await fetch(qrCodeDataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'qr_code.png', { type: 'image/png' });
      const upload = await pinata.upload.file(file);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, a.abi, signer);
      
      const tx = await contract.requestVerification(id, upload.IpfsHash);
      await tx.wait();
  
      console.log("Verification requested successfully");
      await getDetail();
  
    } catch (error) {
      console.error("Error in verifyAndgenerateQR:", error);
    }
  };

  const getDetail = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, a.abi, provider);
    const data = await contract.getCrop(id);
    setCrop(data);
    console.log(data);
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:w-48" src="/apple.png" alt="Crop" />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-green-500 font-semibold">Crop Details</div>
            <h2 className="mt-2 text-2xl leading-8 font-bold text-gray-900">{crop?.name || 'Loading...'}</h2>
            <div className="mt-4">
              <p className="text-gray-600"><span className="font-semibold">Price:</span> {String(crop?.price)}</p>
              <p className="text-gray-600"><span className="font-semibold">ID:</span> {String(crop?.id)}</p>
              <p className="text-gray-600"><span className="font-semibold">Owner:</span> {crop?.farmerWallet}</p>
              <p className="text-gray-600">
                <span className="font-semibold">Status:</span>
                {crop?.isVerified ? (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                ) : (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Not Verified
                  </span>
                )}
              </p>
            </div>
            {!crop?.isVerified && (
              <div className="mt-6">
                <button
                  onClick={verifyAndgenerateQR}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Request Verification
                </button>
              </div>
            )}
          </div>
        </div>
        {crop?.isVerified && (
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Verification QR Code</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <img src={`https://gateway.pinata.cloud/ipfs/${crop?.imageHash}`} alt="QR Code" className="max-w-xs" />
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDetail;
