/* global BigInt */
import { Web3 } from 'web3';
import DaoABI from "../../constants/DataFeedDAO.json";
import config from "../../constants/config.json";

const network = config.networks["base-mainnet"];
const rpcEndpoint = network.rpcEndpoint;
const contractAddress = network.contractAddress;

const web3Instance = new Web3(rpcEndpoint);
const contract = new web3Instance.eth.Contract(DaoABI.abi, contractAddress);

export const fetchTransactions = async (limit = 10) => {
  try {
    // Get current block number
    const latestBlock = await web3Instance.eth.getBlockNumber();
    console.log('Latest block:', latestBlock);
    const BLOCK_RANGE = BigInt(50000);
    
    let allEvents = [];
    
    // Convert latestBlock to BigInt and fix the calculations
    const latestBlockBigInt = BigInt(latestBlock);
    for (let fromBlock = latestBlockBigInt - BLOCK_RANGE; 
         fromBlock <= latestBlockBigInt; 
         fromBlock += BLOCK_RANGE) {
      
      const toBlock = fromBlock + BLOCK_RANGE - BigInt(1) > latestBlockBigInt 
        ? latestBlockBigInt 
        : fromBlock + BLOCK_RANGE - BigInt(1);
      
      const [submittedEvents, fundedEvents, withdrawnEvents] = await Promise.all([
        contract.getPastEvents('Submitted', { 
          fromBlock: Number(fromBlock), 
          toBlock: Number(toBlock) 
        }),
        contract.getPastEvents('Funded', { 
          fromBlock: Number(fromBlock), 
          toBlock: Number(toBlock) 
        }),
        contract.getPastEvents('Withdrawn', { 
          fromBlock: Number(fromBlock), 
          toBlock: Number(toBlock) 
        })
      ]);

      console.log('Events found:', {
        submitted: submittedEvents.length,
        funded: fundedEvents.length,
        withdrawn: withdrawnEvents.length
      });

      // Add events to our collection
      allEvents = allEvents.concat(
        submittedEvents.map(event => ({
          type: 'Submitted',
          from: event.returnValues.submitter,
          to: contractAddress,
          apiUrl: event.returnValues.apiUrl,
          data: event.returnValues.data,
          timestamp: null,
          hash: event.transactionHash,
          blockNumber: event.blockNumber
        })),
        fundedEvents.map(event => ({
          type: 'Funded',
          from: event.returnValues.depositer,
          to: contractAddress,
          apiUrl: event.returnValues.apiUrl,
          value: event.returnValues.value,
          timestamp: null,
          hash: event.transactionHash,
          blockNumber: event.blockNumber
        })),
        withdrawnEvents.map(event => ({
          type: 'Withdrawn',
          from: contractAddress,
          to: event.returnValues.withdrawer,
          apiUrl: event.returnValues.apiUrl,
          value: event.returnValues.value,
          timestamp: null,
          hash: event.transactionHash,
          blockNumber: event.blockNumber
        }))
      );
    }

    console.log('Total events collected:', allEvents.length);

    // Fetch timestamps for all transactions
    const transactions = await Promise.all(
      allEvents.map(async (event) => {
        const block = await web3Instance.eth.getBlock(event.blockNumber);
        return {
          ...event,
          timestamp: BigInt(block.timestamp) * BigInt(1000)
        };
      })
    );

    console.log('Final transactions with timestamps:', transactions.length);
    
    const sortedTransactions = transactions
      .sort((a, b) => Number(b.timestamp - a.timestamp))
      .slice(0, limit);
    
    console.log('Returned transactions:', sortedTransactions.length);
    return sortedTransactions;

  } catch (error) {
    console.error('Error fetching transactions:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return [];
  }
}; 