const Web3 = require('web3')
require('dotenv').config()

const SALE_CONTRACT = process.env.SALE_CONTRACT
const SENDER_CONTRACT = process.env.SENDER_CONTRACT
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETH_RPC = process.env.ETH_RPC
const ONG_RPC = process.env.ONG_RPC
const SLEEP_INTERVAL = process.env.SLEEP_INTERVAL || 500
const CHUNK_SIZE = process.env.CHUNK_SIZE || 3
const EVENT_ABI = [{
    "anonymous": false,
    "inputs": [
        {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        }
    ],
    "name": "TransferToChain",
    "type": "event"
}]
const FUNC_ABI = [{
    "inputs": [
        {
            "internalType": "address",
            "name": "to",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        }
    ],
    "name": "sendOneVAndEther",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}]
const OPTIONS = {
    reconnect: {
        auto: true,
        delay: 5000,
        maxAttempts: 5,
        onTimeout: false
    }
}

let pendingRequests = []

async function filterEvents (contract) {
    contract.events.TransferToChain(async (err, event) => {
        if (err) {
          console.error('Error on event', err)
          return
        }
        await addRequestToQueue(event)
      })
}

async function addRequestToQueue (event) {
    const user = event.returnValues.sender
    const amount = event.returnValues.amount
    pendingRequests.push({ user, amount })
}
  
async function processQueue (senderContract, operatorAddress) {
    let processedRequests = 0
    while (pendingRequests.length > 0 && processedRequests < CHUNK_SIZE) {
      const req = pendingRequests.shift()
      await processRequest(senderContract, operatorAddress, req.user, req.amount)
      processedRequests++
    }
}

async function processRequest (senderContract, operatorAddress, user, amount) {
    try{
        await senderContract.methods.sendOneVAndEther(user.toString(), amount.toString()).send({ from: operatorAddress, gas: '1000000', gasPrice: '10000000000'})
    } catch(e){
        console.log(`User: ${user}\nAmount: ${amount}\nError: ${e}`)
    }
}

async function getContract(web3, abi, address){
    return new web3.eth.Contract(abi, address)
}

async function init () {
    const web3 = new Web3(new Web3.providers.WebsocketProvider(ETH_RPC, OPTIONS))
    
    const saleContract = await getContract(web3, EVENT_ABI, SALE_CONTRACT)
    filterEvents(saleContract)
    
    const web3_2 = new Web3(new Web3.providers.HttpProvider(ONG_RPC,OPTIONS))
    const account = web3_2.eth.accounts.privateKeyToAccount(PRIVATE_KEY)
    const operatorAddress = web3_2.eth.accounts.wallet.add(account).address
    const senderContract = await getContract(web3_2, FUNC_ABI, SENDER_CONTRACT)

    return { senderContract, operatorAddress }
}

(async () => {
    const { senderContract, operatorAddress } = await init()
    process.on( 'SIGINT', () => {
      console.log('Calling client.disconnect()')
      process.exit( )
    })
    setInterval(async () => {
      await processQueue(senderContract, operatorAddress)
    }, SLEEP_INTERVAL)
  })()
  