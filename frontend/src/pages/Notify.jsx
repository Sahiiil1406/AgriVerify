import React, { useState, useEffect } from 'react';
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import { ethers } from 'ethers';

const Notify = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [signer, setSigner] = useState(null);
    const [channelAddress, setChannelAddress] = useState('');
    const [userPushSDK, setUserPushSDK] = useState(null);
    const [networkStatus, setNetworkStatus] = useState('');

    useEffect(() => {
        const initializeSigner = async () => {
            try {
                // Connect to Sepolia testnet via Infura
                const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/f6ae88bf79c04fc2959d6f1ccd2b0f7d'); // Use your Infura Project ID
                
                // Use a predefined private key (make sure it has Sepolia testnet funds)
                const privateKey = '49b4e2cf03454885060fee0a1086431e17d25fede4daaeba2d4afcff680920e7'; // Replace with your private key
                const wallet = new ethers.Wallet(privateKey, provider);
                
                setSigner(wallet);
                console.log('Signer initialized:', await wallet.getAddress());

                // Initialize PushAPI using Sepolia testnet
                const userSDK = await PushAPI.initialize(wallet, { env: CONSTANTS.ENV.TESTNET });
                setUserPushSDK(userSDK);
                console.log('PushAPI initialized on testnet');
            } catch (err) {
                console.error('Failed to initialize:', err);
                setError('Initialization failed: ' + err.message);
            }
        };
        initializeSigner();
    }, []);

    const createChannel = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await userPushSDK.channel.create({
                name: 'My Channel',
                description: 'Test channel for notifications',
                icon: 'https://example.com/icon.png',
                url: 'https://example.com'
            });
            console.log('Channel created:', response);
            setChannelAddress(response.channelAddress);
        } catch (err) {
            console.error('Error creating channel:', err);
            setError('Failed to create channel: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const send = async () => {
        if (!userPushSDK) {
            setError('PushAPI not initialized. Please wait or refresh the page.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const apiResponse = await userPushSDK.channel.send(['0xB83865d55Bd956AD5E308fBC297a90ae69F82f1c'], { 
                notification: {
                    title: 'Hello World Notification',
                    body: 'Web3 native notifications are here!',
                }
            });
            console.log('Notification sent:', apiResponse);
        } catch (err) {
            console.error('Error sending notification:', err);
            setError('Failed to send notification: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Push Protocol Notification Sender</h2>
            <p>Network Status: {networkStatus}</p>
            <p>Signer Address: {signer ? signer.address : 'Not initialized'}</p>
            <button onClick={createChannel} disabled={isLoading || !userPushSDK}>
                Create Channel
            </button>
            {channelAddress && <p>Channel Address: {channelAddress}</p>}
            <button onClick={send} disabled={isLoading || !userPushSDK}>
                {isLoading ? 'Sending...' : 'Send Notification'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Notify;
