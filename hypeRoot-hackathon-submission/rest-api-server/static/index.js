const { ethers } = require("ethers");

const contractAddress = '0xEe2755b16b2acC5A2271feCC001785178D2844d7';
const ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_signerAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_walletAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Locked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Recovered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Unlocked",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "FEE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balance",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newSignerAddress",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "_signature",
				"type": "bytes"
			}
		],
		"name": "lockTokens",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "_amount",
				"type": "int256"
			},
			{
				"internalType": "bytes",
				"name": "_signature",
				"type": "bytes"
			}
		],
		"name": "recoverTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "signerAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalLocked",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_signature",
				"type": "bytes"
			}
		],
		"name": "unlockTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "walletAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, ABI, signer);

const API_URL = 'https://hyperoot.blurrys.in';

async function soliditySign(_message) {
    const messageHash = ethers.utils.hashMessage(ethers.utils.arrayify(_message));

    try {
        const response = await fetch(`${API_URL}/soliditySign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messageHash }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data.signature;
    } catch (error) {
        console.error('Failed to sign message:', error);
    }
}

async function connect() {
    if (typeof window.ethereum !== 'undefined') {
        await ethereum.request({ method: 'eth_requestAccounts' });
    } else {
		throw new Error('Please install MetaMask');
	}
}

async function lockTokens(amount) {
    try {
		const newSignerResponse = await fetch(`${API_URL}/newSigner`);
        if (!newSignerResponse.ok) {
            throw new Error(`API response status: ${newSignerResponse.status}`);
        }

        const { newSignerAddress, signature } = await newSignerResponse.json();
        console.log(`Received new signer address: ${newSignerAddress} and signature: ${signature}`);

        const address = await signer.getAddress();
        const checkResponse = await fetch(`${API_URL}/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address }),
        });

        if (!checkResponse.ok) {
            throw new Error(`API response status: ${checkResponse.status}`);
        }
		console.log("Yeah man, you exist in the private blockchain!")
		console.log("Now, let's lock some tokens...")

		const txValueWei = ethers.utils.parseEther(amount.toString());
		const tx = await contract.lockTokens(newSignerAddress, signature, { value: txValueWei });
		await tx.wait();
		console.log("Tokens locked!")

        const lockResponse = await fetch(`${API_URL}/lock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hash: tx.hash, from: tx.from, to: tx.to, value: txValueWei.toString(), data: tx.data}),
        });

        if (!lockResponse.ok) {
            throw new Error(`API response status: ${lockResponse.status}`);
        }
		console.log("Fabric knows you locked tokens!")
		alert("tR-BTC locked!")

    } catch (error) {
        console.error('Error locking tokens:', error);
		alert('Error locking tokens');

		const restoreResponse = await fetch(`${API_URL}/restoreOldSigner`);
        if (!restoreResponse.ok) {
            console.error('Error restoring old signer:', restoreResponse.status);
        } else {
            const { restoredPrivateKey } = await restoreResponse.json();
            console.log(`Restored old signer: ${restoredPrivateKey}`);
        }
    }
}

async function unlockTokens(amount) {
    try {
        const address = await signer.getAddress();
        const checkResponse = await fetch(`${API_URL}/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address }),
        });

        if (!checkResponse.ok) {
            throw new Error(`API response status: ${checkResponse.status}`);
        }
		console.log("Yeah man, you exist in the private blockchain!")
		console.log("Now, let's dissolve your fabric tokens...")

		const value = ethers.utils.parseEther(amount).toString();
		const signature = await signer.signMessage(value);

		const unlockResponse = await fetch(`${API_URL}/unlock`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ address, value, signature }),
		});

        if (!unlockResponse.ok) {
            throw new Error(`API response status: ${unlockResponse.status}`);
        }
		console.log("Fabric tokens dissolved!")

		const amountInWei = ethers.utils.parseEther(amount);
		const message = ethers.utils.solidityKeccak256(['address', 'uint256'], [address, amountInWei]);
		const eth_signature = soliditySign(message);

		const tx = await contract.unlockTokens(amountInWei, eth_signature, { gasLimit: 100000 });
		await tx.wait();
		console.log("tR-BTC unlocked!")
		alert("tR-BTC unlocked!")

    } catch (error) {
        console.error('Error unlocking tokens:', error);
		alert('Error unlocking tR-BTC');
    }
}

async function transferTokens(to, amountReceived) {
	try {
		const amount = ethers.utils.parseEther(amountReceived).toString();

		const obj = { to, amount };
		const message = ethers.utils.arrayify(ethers.utils.id(JSON.stringify(obj)));
		const signature = await signer.signMessage(message);

		const messageHex = ethers.utils.hexlify(message);

		try {
			const response = await fetch(`${API_URL}/transfer`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ to, amount,  message: messageHex, signature }),
			});

			if (!response.ok) {
				throw new Error(`API response status: ${response.status}`);
			}
			console.log("You sent the transfer request to Fabric!")
			alert("Transferred the fabric tokens!")

		} catch (error) {
			console.error('Error transferring tokens:', error);
			alert('Error transferring tokens');
		}

	} catch (error) {
		console.error('Maybe you haven\'t connected to ur wallet:', error);
		alert('Connect to your wallet first');
	}
}

async function getTransactionData() {
    try {
        const address = await signer.getAddress();
        const response = await fetch(`${API_URL}/transactionData`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address }),
        });

        if (!response.ok) {
            throw new Error(`API response status: ${response.status}`);
        }
        const { data } = await response.json();
		const dataJSON = JSON.parse(data);
        console.log("User data:", dataJSON);
		alert("Transaction data: " + JSON.stringify(dataJSON));

    } catch (error) {
        console.error('Error checking user data:', error);
		alert('Error checking transaction data');
    }
}

async function recoverTokens() {
	try {
        const address = await signer.getAddress();

        const response = await fetch(`${API_URL}/transactionData`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address }),
        });

        if (!response.ok) {
            throw new Error(`API response status: ${response.status}`);
        }

        const { data } = await response.json();
		const transactions = JSON.parse(data).transactions;

		let balance = ethers.BigNumber.from('0');

        transactions.forEach(transaction => {
            const value = ethers.BigNumber.from(transaction.amount);

            if (transaction.type === 'issue') {
                balance = balance.add(value);
            } else if (transaction.type === 'dissolve') {
                balance = balance.sub(value);
            }
        });

        const message = ethers.utils.solidityKeccak256(['address', 'uint256'], [address, balance]);
		const eth_signature = soliditySign(message);

        const tx = await contract.recoverTokens(balance, eth_signature, { gasLimit: 100000 });
        await tx.wait();

        console.log("Tokens synchronized successfully!");
		alert("Tokens recovered successfully!");

    } catch (error) {
        console.error('Error synchronizing tokens:', error);
		alert('Error recovering tokens');
    }
}

async function joinFabric() {
	try {
		const message = ethers.utils.arrayify(ethers.utils.id(''));
		const signature = await signer.signMessage(message);

		try {
			const response = await fetch(`${API_URL}/join`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message, signature }),
			});

			if (!response.ok) {
				throw new Error(`API response status: ${response.status}`);
			}
			console.log("You joined the private blockchain!")
			alert("You joined the fabric network!")

		} catch (error) {
			console.error('Error joining:', error);
			alert('Error joining');
		}

	} catch (error) {
		console.error('Maybe you haven\'t connected ur wallet:', error);
		alert('Connect to your wallet first');
	}
}

module.exports = {
    connect,
    lockTokens,
    unlockTokens,
    getTransactionData,
    joinFabric,
    transferTokens,
    recoverTokens
}

