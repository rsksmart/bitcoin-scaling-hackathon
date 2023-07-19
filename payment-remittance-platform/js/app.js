window.addEventListener('load', async () => {
    const rskTestnetNode = 'https://rsk.getblock.io/947be6c4-61c7-4a13-9558-a971f60e8382/testnet/';
    if (window.ethereum) {
        window.web3 = new Web3(rskTestnetNode);
        //window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        console.log('Connected');
    } else if (window.web3) {
        window.web3 = new Web3(rskTestnetNode);
        await window.ethereum.enable();
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const senderAddress = accounts[0];
    const balance = await web3.eth.getBalance(senderAddress);
    console.log("Your current connected wallet is: ", senderAddress);
    console.log("Your wallet's native token balance is: ", web3.utils.fromWei(balance, "ether"));
    const metamaskButtonDiv = document.querySelector('.metamask-button-div');
    const firstFourChars = senderAddress.slice(0, 4);
    const lastFourChars = senderAddress.slice(-4);
    metamaskButtonDiv.innerHTML = 'Connected: '+firstFourChars+'....'+lastFourChars;

    const contractAddress = '0x59C79a31bd0B0bBe33285745F031F9e47A3Eb0c3';
    const contractABI = [{"inputs":[{"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"reclaimFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"bytes32","name":"passwordHash","type":"bytes32"},{"internalType":"uint256","name":"daysToExpiration","type":"uint256"}],"name":"sendRemittance","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"id","type":"bytes32"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes32","name":"password","type":"bytes32"}],"name":"withdrawRemittance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"bytes32","name":"password","type":"bytes32"}],"name":"generateId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"getReceiverRemittances","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"getSenderRemittances","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"receiverRemittances","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"remittances","outputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bytes32","name":"passwordHash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"senderRemittances","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"}];
    const remittanceContract = new web3.eth.Contract(contractABI, contractAddress);
    
    const sendRemittanceForm = document.getElementById('send-remittance-form');
    sendRemittanceForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const recipientAddress = event.target.elements['recipient-address'].value;
        const quantity = event.target.elements['quantity'].value;
        const quantityInWei = web3.utils.toWei(quantity, "ether");
        const daysToExpiration = event.target.elements['days-to-expiration'].value;
        const password = event.target.elements['password'].value;

        const passwordHash = web3.utils.keccak256(password);
        
        console.log("senderAddress: "+senderAddress);
        console.log("recipientAddress: "+recipientAddress);
        console.log("password: "+password);
        console.log("passwordHash: "+passwordHash);

        window.web3 = new Web3(window.ethereum);
        const remittanceContract1 = new web3.eth.Contract(contractABI, contractAddress);
        await remittanceContract1.methods.sendRemittance(recipientAddress, passwordHash, daysToExpiration).send({
            from: senderAddress,
            value: quantityInWei
        });

        updateTables();
    });

    const withdrawRemittanceForm = document.getElementById('withdraw-remittance-form');
    withdrawRemittanceForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const theSender = event.target.elements['sender-address'].value;
        const idToWithdraw = event.target.elements['withdrawal-id'].value;
        const password = event.target.elements['withdraw-password'].value;
        const passwordHash = web3.utils.keccak256(password);

        console.log("theSender: "+theSender);
        console.log("idToWithdraw: "+idToWithdraw);
        console.log("password: "+password);
        console.log("passwordHash: "+passwordHash);

        window.web3 = new Web3(window.ethereum);
        const remittanceContract2 = new web3.eth.Contract(contractABI, contractAddress);
        const withdrawFunds = await remittanceContract2.methods.withdrawRemittance(idToWithdraw, theSender, passwordHash).send({
            from: senderAddress
        });
        console.log("withdrawFunds: "+withdrawFunds);
        updateTables();
    });

    function updateTables() {
        updateSentRemittancesTable();
        updatePendingWithdrawalsByWalletTable();
    }

    async function updateSentRemittancesTable() {
        const sentRemittancesTableBody = document.querySelector('#sent-remittances-table');
        sentRemittancesTableBody.innerHTML = '';
        
        const provider = new Web3.providers.HttpProvider(rskTestnetNode);
        window.web3 = new Web3(provider);
        const remittanceContract3 = new web3.eth.Contract(contractABI, contractAddress);
        const remittances = await remittanceContract3.methods.getSenderRemittances(senderAddress).call();
        console.log("Remittances from sender "+senderAddress+": "+remittances);

        if (remittances === undefined) {
            console.log("No remittances sent for "+senderAddress);
        } else {
            for (const remittanceId of remittances) {
                let thisRemittances = await remittanceContract3.methods.remittances(remittanceId).call();
                console.log(remittanceId, thisRemittances.sender, thisRemittances.receiver, thisRemittances.amount, thisRemittances.deadline);
                let status;
                if (thisRemittances.deadline < Date.now() / 1000) {
                    status = 'Expired';
                } else {
                    status = 'Pending';
                }
            const date = new Date(thisRemittances.deadline * 1000);
            if(thisRemittances.amount>0){
                sentRemittancesTableBody.innerHTML += `
                    <br>
                    ID: ${remittanceId}<br>
                    Recipient Address: ${thisRemittances.receiver}<br>
                    Amount: ${web3.utils.fromWei(thisRemittances.amount)}<br>
                    Deadline: ${date}<br>${status}<br><br>
                `;
            }
            }
        }
    }
    
        async function updatePendingWithdrawalsByWalletTable() {
            const pendingWithdrawalsByWalletTableBody = document.querySelector('#pending-withdrawals-by-wallet-table');
            pendingWithdrawalsByWalletTableBody.innerHTML = '';
            
            const provider = new Web3.providers.HttpProvider(rskTestnetNode);
            window.web3 = new Web3(provider);
            const remittanceContract4 = new web3.eth.Contract(contractABI, contractAddress);
            const remittances = await remittanceContract4.methods.getReceiverRemittances(senderAddress).call();
            console.log("Remittances for receiver "+senderAddress+": "+remittances);

            if (remittances === undefined) {
                console.log("No pending withdrawals for "+senderAddress);
            } else {
                for (const remittanceId of remittances) {
                    let thisRemittances = await remittanceContract4.methods.remittances(remittanceId).call();
                    console.log(remittanceId, thisRemittances.sender, thisRemittances.receiver, thisRemittances.amount, thisRemittances.deadline);
                    let status;
                    if (thisRemittances.deadline < Date.now() / 1000) {
                        status = 'Expired';
                    } else {
                        status = 'Pending';
                    }
                    const date = new Date(thisRemittances.deadline * 1000);

                    if(thisRemittances.amount>0){
                        pendingWithdrawalsByWalletTableBody.innerHTML += `
                            <br>
                            ID: ${remittanceId}<br>
                            Sender : ${thisRemittances.sender}<br>
                            Amount: ${web3.utils.fromWei(thisRemittances.amount)}<br>
                            Deadline: ${date}<br>
                            Status: ${status}<br><br>
                        `;
                    }
                    
                }
            }
        }
    
        updateTables();
    });