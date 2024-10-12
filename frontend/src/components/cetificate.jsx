import React, { useState,useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useParams } from 'react-router-dom'
import { ethers } from 'ethers';
import {a} from '../../public/abi';
const contractAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3";


const Certificate = () => {
  const [crop,setCrop]=useState(null)
  const {id}=useParams()
  const getDetail=async()=>{
    const provider=await new ethers.BrowserProvider(window.ethereum)
    const contract=new ethers.Contract(contractAddress,a.abi,provider)
    const data=await contract.getCrop(id)
    setCrop(data)
    console.log(data)
  }
  
  useEffect(()=>{
    getDetail()
  },[])
  
  return (
    <div className='flex justify-center items-center p-8'>
      
    <div className="w-[1000px] h-[600px] bg-white border-8 border-indigo-900 relative overflow-hidden ">
      {/* Blue corner */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500 transform -rotate-45 -translate-x-24 -translate-y-24"></div>
      
      {/* Black diagonal */}
      <div className="absolute top-0 left-0 w-full h-24 bg-black transform -skew-y-6"></div>
      
      {/* ISO Certified logo */}
      <div className="absolute top-4 left-4 w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
          <Globe className="text-blue-600 w-12 h-12" />
          <div className="absolute text-white text-xs font-bold">
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      
      {/* Certificate content */}
      <div className="pt-32 px-12 text-center">
        <h1 className="text-5xl font-bold mb-2">CERTIFICATE</h1>
        <h2 className="text-3xl text-blue-600 font-semibold mb-8">OF TRUST</h2>
        <div className="border-b-2 border-dotted border-gray-400 mb-8"></div>
        
        <p className="text-lg mb-8">
          This is to certify that <span className="font-bold">{crop?.name}</span> is farmed orginacally<br />
          and safe to eat.It has passed all tests of <span className="font-bold">UNESCO</span>.
        </p>
        
        {/* Signature and date */}
        <div className="flex justify-between items-end mt-16">
          <div>
            <div className="border-b border-black w-48"></div>
            <p className="font-semibold">{(crop?.farmerWallet)}</p>
          </div>
          <div>
            <p className="font-semibold">04 January 2021</p>
            <p>Date</p>
          </div>
        </div>
        
        {/* Company logo */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="text-2xl font-bold text-blue-600">
            Agri<span className="text-black">Verify</span> <span className="text-blue-400">Solutions</span>
          </div>
          <div className="text-sm">Trust | Organic | Healthy</div>
        </div>
        
        {/* Certificate ID and URL */}
        <div className="absolute bottom-4 left-0 right-0 text-xs text-gray-600 flex justify-between px-12">
          <div>Certificate ID: #{id}</div>
          <div></div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Certificate;