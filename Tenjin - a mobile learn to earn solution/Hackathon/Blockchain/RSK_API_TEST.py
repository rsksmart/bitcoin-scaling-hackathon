from decouple import config
from web3 import Web3
from sha3 import keccak_256
import requests
import json

#
#Internal Functions
#

#Connects to the testnet public node and gets the fund wallet private key
def _getBasics():
    rpcURL = 'https://public-node.testnet.rsk.co'
    _connector = Web3(Web3.HTTPProvider(rpcURL))

    PRIVATE_KEY = config('PRIVATE_KEY')
    _wallet = _connector.eth.account.from_key(PRIVATE_KEY)

    return _connector, _wallet, PRIVATE_KEY


def _getContract(contractAddress=None, contractABI=None):
    _connector, _, _ =_getBasics()

    if(contractAddress==None):
        _contractAddress = "0x163e0801c892387e3e3c8bB8e9ec0467708877c1"
    else:
        _contractAddress = contractAddress

    if(contractABI==None):
        _contractABI =  '''[
            {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
            },
            {
            "inputs": [],
            "name": "insufficientBalance",
            "type": "error"
            },
            {
            "inputs": [],
            "name": "notOwner",
            "type": "error"
            },
            {
            "inputs": [],
            "name": "txFailed",
            "type": "error"
            },
            {
            "inputs": [],
            "name": "balance",
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
            "inputs": [],
            "name": "numOfPayouts",
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
                "name": "user",
                "type": "address"
                },
                {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
                }
            ],
            "name": "payout",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
            },
            {
            "inputs": [],
            "name": "totalPayouts",
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
            "stateMutability": "payable",
            "type": "receive"
            }
        ]'''
    else:
        _contractABI = contractABI
    _contract = _connector.eth.contract(_contractAddress, abi=_contractABI)

    return _contract

#Returns the expected gas cost of the transaction we want to do
def _getGas():

    headers = {
        'Content-Type': 'application/json',
    }

    json_data = {
        'jsonrpc': '2.0',
        'method': 'eth_gasPrice',
        'params': [],
        'id': 1,
    }

    response = requests.post('https://public-node.testnet.rsk.co/', headers=headers, json=json_data)
    return int(response.json()['result'], base=16)

#Gets encoded function call to be built into the transaction
def _getData(params, paramTypes, functionName):

    encoded_params = ''
    for param in params:
        
        if(type(param)==str):
            param = param
            val = param[2:].zfill(64)

        else:
            val = "{0:#0{1}x}".format(param,66)
            val = val[2:]

        encoded_params = encoded_params + val
    
    sha3_hash = keccak_256((functionName+'('+','.join(paramTypes)+')').encode('utf-8')).hexdigest()

    return('0x'+sha3_hash[0:8]+encoded_params)


#
#API Functions
#

#Gets the user RBTC balance
def getBalance(walletAddress):

    _connector, _, _ = _getBasics()
    raw_balance = _connector.eth.get_balance(walletAddress)
    return int(raw_balance)

#Get contract balance
def contractBalance( contractAddress=None):

    _contract = _getContract(contractAddress)

    tx_result = _contract.functions.balance().call()
    print(tx_result)

#Get total payouts
def totalPayouts( contractAddress=None):

    _contract = _getContract(contractAddress)

    tx_result = _contract.functions.totalPayouts().call()
    print(tx_result)

#Get number of payouts
def numOfPayouts( contractAddress=None):

    _contract = _getContract(contractAddress)

    tx_result = _contract.functions.numOfPayouts().call()
    print(tx_result)

    
#Send RBTC from the contract to the user
def sendRSKContract(receiverAddress, amount, contractAddress=None):

    _contractAddress = _getContract(contractAddress).address
    _connector, _wallet, PRIVATE_KEY=_getBasics()

    #get the nonce.  Prevents one from sending the transaction twice
    nonce = _connector.eth.get_transaction_count(_wallet.address)
    #build a transaction in a dictionary
    tx = {
        'from': _wallet.address,
        'nonce': nonce,
        'to': _contractAddress,
        'data': _getData([receiverAddress, amount],['address', 'uint256'],'payout'),
        'gas': 6800000,
        'gasPrice': _getGas()
    }
   
    # get gas cost estimate for tx
    gas_estimate = _connector.eth.estimate_gas(tx)

        #update transaction
    update_tx = {
        'from': _wallet.address,
        'nonce': nonce,
        'to':  _contractAddress,
        'data': _getData([receiverAddress, amount],['address', 'uint256'],'payout'),
        'gas': int(gas_estimate),
        'gasPrice': _getGas()
    }

    
    #sign the transaction
    signed_tx = _connector.eth.account.sign_transaction(update_tx, PRIVATE_KEY)

    #send transaction
    tx_hash = _connector.eth.send_raw_transaction(signed_tx.rawTransaction)
    tx_receipt = _connector.eth.wait_for_transaction_receipt(tx_hash)
    print(tx_receipt)

#Send RBTC from the funds wallet to the user   
def sendRSKWallet(receiverAddress, amount):
    #Import basics
    (_connector, _wallet, PRIVATE_KEY)=_getBasics()   

    #get the nonce.  Prevents one from sending the transaction twice
    nonce = _connector.eth.get_transaction_count(_wallet.address)

    #build a transaction in a dictionary
    tx = {
        'nonce': nonce,
        'to': receiverAddress,
        'value': amount,
        'gas': 6800000,
        'gasPrice': _getGas()
    }

    # get gas cost estimate for tx
    gas_estimate = _connector.eth.estimate_gas(tx)

    #update transaction
    update_tx = {
        'nonce': nonce,
        'to': receiverAddress,
        'value': amount,
        'gas': int(gas_estimate),
        'gasPrice': _getGas()
    }
    #sign the transaction
    signed_tx = _connector.eth.account.sign_transaction(update_tx, PRIVATE_KEY)

    #send transaction
    tx_hash = _connector.eth.send_raw_transaction(signed_tx.rawTransaction)


# address='0x513BaDe59DC5a84E2086e2A00C306488d8308584'
# print(getBalance(address))
# sendRSKContract(address, 1)
# print(getBalance(address))
# contractBalance()
# totalPayouts()
# numOfPayouts()

