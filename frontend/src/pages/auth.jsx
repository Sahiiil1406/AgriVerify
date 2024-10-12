import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Phone } from 'lucide-react';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
const clientId = "BGgY-GW2jbtGpYSQYTirjT_6AcG5ihr6utEURPY0tIITv84tl7lIOTPEBnkJRgu_slOL7Ah0lnI23u-YWBNbRFM";
import { ethers } from "ethers";
import { a } from '../../public/abi';
import { useNavigate } from 'react-router-dom';
import {useContext} from 'react';
import {UserContext} from '../context/userContext';

const Caddress="0x5FbDB2315678afecb367f032d93F642f64180aa3"
function Auth() {
  const [web3auth, setWeb3auth] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const {user,loginUser,logoutUser}=useContext(UserContext);
  const navigate=useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const  chainConfig= {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0xaa36a7", // hex of 11155111, Sepolia testnet //"0x7A69" for hardhat
          rpcTarget: "https://rpc.ankr.com/eth_sepolia",// "http://localhost:8545" Default Hardhat JSON-RPC server
          displayName: "Ethereum Sepolia Testnet",
          blockExplorer: "https://sepolia.etherscan.io",//empty for hardhat
          ticker: "ETH",
          tickerName: "Ethereum",
        }
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });
        const web3auth = new Web3Auth({
          clientId,
          chainConfig:chainConfig,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider
          
        });

        setWeb3auth(web3auth);
        await web3auth.initModal();
        console.log("Web3Auth initialized");
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    init();
  }, []);

 const goTodashboard=()=>{
    navigate('/dashboard');
  }
  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    try {
      const web3authProvider = await web3auth.connect();
      setLoggedIn(true);
      console.log("Logged in with Web3Auth", web3authProvider);
      await loginUser(await web3auth.getUserInfo())
      goTodashboard()
      
    } catch (error) {
      console.error("Error logging in with Web3Auth:", error);
    }
  };
  const registerFarmer=async()=>{
    try {
      const web3authProvider = await web3auth.connect();
      setLoggedIn(true);
      console.log("Logged in with Web3Auth", web3authProvider);
      const provider=new ethers.BrowserProvider(window.ethereum);
      const signer=await provider.getSigner();
      const contract=new ethers.Contract(Caddress,a.abi,signer);
      await loginUser(await web3auth.getUserInfo());
      console.log(contract);
      await contract.registerFarmer("user?.name");
      navigate('/dashboard');
    } catch (error) {
      console.error('Error registering farmer:', error);  
    }
  }

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    try {
      await web3auth.logout();
      setLoggedIn(false);
      logoutUser();
      console.log("Logged out from Web3Auth");
    } catch (error) {
      console.error("Error logging out from Web3Auth:", error);
    }
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    // const user = await web3auth.getUserInfo();
    // console.log("User info:", user);
    console.log("User inklckfo:", user?.email);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
    {/* Header */}
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className='w-20'><b className='text-green-800 h-16'>Agri</b>Verify</div>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Pages</a></li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="text-gray-600" />
          <button className="bg-yellow-400 text-white px-4 py-2 rounded-full flex items-center">
            <Phone className="mr-2" />
            <span>01234567890</span>
          </button>
        </div>
      </div>
    </header>

    {/* Hero Section */}
    <section className="relative h-screen">
      <img src="/landing.png" alt="Agriculture landscape" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-50">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-white text-5xl font-bold mb-4">Agriculture & Eco Farming:AgriVerify</h1>
          <p className="text-white text-xl mb-8">There are many of passages of lorem ipsum, but the majori have suffered alteration in some form.</p>
          <button className="bg-yellow-400 text-black px-6 py-3 rounded-full w-max" onClick={registerFarmer}>
            Register
          </button>
        </div>
      </div>
    </section>
  </div>
  );
}

export default Auth;