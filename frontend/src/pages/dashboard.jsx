import React, { useEffect, useState } from 'react';
import { User, Wheat, Plus, X } from 'lucide-react';
import {useContext} from 'react';
import {UserContext} from '../context/userContext';
import {ethers} from 'ethers';
import {useNavigate} from 'react-router-dom';
import {a} from '../../public/abi';
const contractAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3";


const FarmerDashboard = () => {
    const {user}=useContext(UserContext);
  const [crops, setCrops] = useState([]);
    const nav=useNavigate();


  const [newCrop, setNewCrop] = useState({ name: '', price:'' });
  const handleInputChange = (e) => {
    setNewCrop({ ...newCrop, [e.target.name]: e.target.value });
    };

  const createCrop = async () => {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer =await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, a.abi, signer);
        await contract.createCrop(newCrop.name, Number(newCrop.price));
        const cropList = await contract.getFarmerCrops(await signer.getAddress());
            setCrops(cropList);
            
    } catch (error) {
      console.error('Error creating crop:', error);  
    }
  }

    const getFarmerCrops = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
        const signer =await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, a.abi, signer);
            const cropList = await contract.getFarmerCrops(await signer.getAddress());
            setCrops(cropList);
            //console.log(cropList)
        }
        catch (error) {
            console.error('Error fetching crops:', error);
        }
    }
 useEffect(() => {
    getFarmerCrops()
 },[]);
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-green-800">Farmer's Dashboard</h1>
        
        {/* Farmer Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <User className="mr-2" /> Farmer Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Name:</p>
              <p>{user?.name}</p>
            </div>
            <div>
              <p className="font-semibold">Farm Name:</p>
              <p>Green Acres</p>
            </div>
            <div>
              <p className="font-semibold">Email:</p>
              <p>{user?.email}</p>
            </div>
            <div>
              <p className="font-semibold">Total Farm Area:</p>
              <p>150 acres</p>
            </div>
          </div>
        </div>

        {/* Crop List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Wheat className="mr-2" /> My Crops
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-100" >
                <th className="p-2 text-left">Crop Id</th>
                  <th className="p-2 text-left">Crop Name</th>
                  <th className="p-2 text-left">Area</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-left">Verified</th>
                </tr>
              </thead>
              <tbody>
                {crops.map(crop => (
                  <tr key={crop.id} className="border-black" onDoubleClick={()=>nav(`plant/${crop.id}`)}>
                    <td className="p-2">{String(crop?.id)}</td>
                    <td className="p-2">{crop?.name}</td>
                    <td className="p-2">40</td>
                    <td className="p-2">{String(crop?.price)}</td>
                    <td className="p-2">
                      <button  className="text-red-500 hover:text-red-700">
                        {crop?.verified ? 'Verified' : 'Not Verified'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Crop */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Plus className="mr-2" /> Add New Crop
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              value={newCrop.name}
              onChange={handleInputChange}
              placeholder="Crop Name"
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="area"
              value={newCrop.price}
              onChange={(e) => setNewCrop({ ...newCrop, price: e.target.value })}
              placeholder="Price (e.g., 20)"
              className="p-2 border rounded"
            />
            
          </div>
          <button onClick={createCrop} className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Add Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;